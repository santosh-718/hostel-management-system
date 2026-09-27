import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import AddCardOutlinedIcon from '@mui/icons-material/AddCardOutlined';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import Layout from '../../components/Layout';
import { getBookings, recordBookingPayment } from '../../services/bookingService';

interface PaymentRecord {
  paymentId?: string;
  amount?: number;
  paidAt?: string;
  method?: string;
  reference?: string;
}

interface BookingRecord {
  bookingId: string;
  guestName?: string;
  roomNumber?: string;
  email?: string;
  totalAmount?: number;
  paidAmount?: number;
  dueAmount?: number;
  dueDate?: string;
  payments?: PaymentRecord[];
}

const formatCurrency = (amount: number) =>
  `₹${amount.toLocaleString('en-IN')}`;

const getPaidAmount = (booking: BookingRecord) =>
  Number(
    booking.paidAmount ??
      (booking.payments || []).reduce(
        (sum, payment) => sum + Number(payment.amount || 0),
        0,
      ),
  );

export default function Payments() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [paidAt, setPaidAt] = useState(new Date().toISOString().slice(0, 10));
  const [method, setMethod] = useState('CASH');
  const [reference, setReference] = useState('');
  const [saving, setSaving] = useState(false);

  const loadBookings = async (showLoading = false) => {
    if (showLoading) {
      setLoading(true);
    }
    try {
      const response: BookingRecord[] = await getBookings();
      setBookings(response);
      setLoadError(false);
    } catch (error) {
      console.error('Unable to load payment bookings:', error);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    getBookings()
      .then((response: BookingRecord[]) => {
        if (active) {
          setBookings(response);
          setLoadError(false);
        }
      })
      .catch((error: unknown) => {
        console.error('Unable to load payment bookings:', error);
        if (active) {
          setLoadError(true);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const openPaymentDialog = (booking: BookingRecord) => {
    setSelectedBooking(booking);
    setAmount('');
    setPaidAt(new Date().toISOString().slice(0, 10));
    setMethod('CASH');
    setReference('');
    setDialogOpen(true);
  };

  const savePayment = async () => {
    if (!selectedBooking || !amount || !paidAt) {
      alert('Enter the payment amount and payment date.');
      return;
    }

    setSaving(true);
    try {
      const result = await recordBookingPayment(selectedBooking.bookingId, {
        amount: Number(amount),
        paidAt,
        method,
        reference,
      });
      if (result.success === false) {
        alert(result.message);
        return;
      }

      setDialogOpen(false);
      setSelectedBooking(null);
      await loadBookings();
    } catch (error) {
      console.error('Unable to record payment:', error);
      alert('Unable to record payment. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const rows = bookings.map((booking, index) => {
    const paidAmount = getPaidAmount(booking);
    const totalAmount = Number(booking.totalAmount ?? booking.dueAmount ?? 0);
    const balance = Math.max(0, totalAmount - paidAmount);

    return {
      id: booking.bookingId || index,
      ...booking,
      paidAmount,
      totalAmount,
      balance,
    };
  });

  const paymentRows = bookings.flatMap((booking) =>
    (booking.payments || []).map((payment, index) => ({
      id: payment.paymentId || `${booking.bookingId}-${index}`,
      bookingId: booking.bookingId,
      guestName: booking.guestName || '—',
      roomNumber: booking.roomNumber || '—',
      amount: Number(payment.amount || 0),
      paidAt: payment.paidAt || '—',
      method: payment.method || '—',
      reference: payment.reference || '—',
    })),
  );

  const columns: GridColDef[] = [
    { field: 'guestName', headerName: 'Guest', flex: 1.2, minWidth: 140 },
    { field: 'roomNumber', headerName: 'Room', flex: 0.55, minWidth: 90 },
    {
      field: 'totalAmount',
      headerName: 'Total',
      flex: 0.8,
      minWidth: 110,
      renderCell: (params) => formatCurrency(Number(params.value || 0)),
    },
    {
      field: 'paidAmount',
      headerName: 'Paid',
      flex: 0.8,
      minWidth: 110,
      renderCell: (params) => formatCurrency(Number(params.value || 0)),
    },
    {
      field: 'balance',
      headerName: 'Balance',
      flex: 0.8,
      minWidth: 110,
      renderCell: (params) => formatCurrency(Number(params.value || 0)),
    },
    { field: 'dueDate', headerName: 'Due date', flex: 0.9, minWidth: 120 },
    {
      field: 'paymentAction',
      headerName: 'Action',
      flex: 0.9,
      minWidth: 130,
      sortable: false,
      renderCell: (params) => (
        <Button
          size="small"
          startIcon={<AddCardOutlinedIcon />}
          disabled={params.row.balance <= 0}
          onClick={() => openPaymentDialog(params.row)}
        >
          Record
        </Button>
      ),
    },
  ];

  const historyColumns: GridColDef[] = [
    { field: 'paidAt', headerName: 'Date', flex: 0.8, minWidth: 120 },
    { field: 'guestName', headerName: 'Guest', flex: 1, minWidth: 130 },
    { field: 'roomNumber', headerName: 'Room', flex: 0.55, minWidth: 90 },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 0.8,
      minWidth: 110,
      renderCell: (params) => formatCurrency(Number(params.value || 0)),
    },
    { field: 'method', headerName: 'Method', flex: 0.7, minWidth: 100 },
    { field: 'reference', headerName: 'Reference', flex: 1, minWidth: 120 },
  ];

  return (
    <Layout>
      <Box sx={{ maxWidth: 1300, mx: 'auto', pb: 4 }}>
        <Typography
          variant="overline"
          sx={{ color: '#8a6b55', letterSpacing: 1.5, fontWeight: 700 }}
        >
          FINANCE
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#263247', mb: 0.5 }}>
          Payments
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Review booking balances and record payments received from guests.
        </Typography>

        {loadError && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            action={<Button color="inherit" onClick={() => void loadBookings(true)}>Retry</Button>}
          >
            Unable to load payment information.
          </Alert>
        )}

        <Card sx={{ mb: 3, borderRadius: 3, border: '1px solid #eceef2', boxShadow: '0 8px 24px rgba(38,50,71,.045)' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Booking balances
            </Typography>
            <Box sx={{ height: 430, width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                loading={loading}
                pageSizeOptions={[5, 10, 20]}
                disableRowSelectionOnClick
                sx={{
                  border: 0,
                  '& .MuiDataGrid-columnHeaders': { backgroundColor: '#faf8f5' },
                  '& .MuiDataGrid-cell': { borderBottom: '1px solid #f1f2f4' },
                }}
              />
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3, border: '1px solid #eceef2', boxShadow: '0 8px 24px rgba(38,50,71,.045)' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Payment history
            </Typography>
            {paymentRows.length === 0 ? (
              <Typography color="text.secondary" sx={{ py: 2 }}>
                No payments have been recorded yet.
              </Typography>
            ) : (
              <Box sx={{ height: 360, width: '100%' }}>
                <DataGrid
                  rows={paymentRows}
                  columns={historyColumns}
                  pageSizeOptions={[5, 10]}
                  disableRowSelectionOnClick
                  sx={{ border: 0, '& .MuiDataGrid-columnHeaders': { backgroundColor: '#faf8f5' } }}
                />
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      <Dialog open={dialogOpen} onClose={() => !saving && setDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Record payment</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {selectedBooking.guestName} · Room {selectedBooking.roomNumber} · Balance{' '}
              {formatCurrency(
                Math.max(
                  0,
                  Number(selectedBooking.totalAmount ?? selectedBooking.dueAmount ?? 0) -
                    getPaidAmount(selectedBooking),
                ),
              )}
            </Typography>
          )}
          <TextField
            autoFocus
            required
            fullWidth
            margin="normal"
            type="number"
            label="Amount received"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            slotProps={{ htmlInput: { min: 0.01, step: 0.01 } }}
          />
          <TextField
            required
            fullWidth
            margin="normal"
            type="date"
            label="Payment date"
            value={paidAt}
            onChange={(event) => setPaidAt(event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            select
            fullWidth
            margin="normal"
            label="Payment method"
            value={method}
            onChange={(event) => setMethod(event.target.value)}
          >
            <MenuItem value="CASH">Cash</MenuItem>
            <MenuItem value="UPI">UPI</MenuItem>
            <MenuItem value="BANK_TRANSFER">Bank transfer</MenuItem>
            <MenuItem value="CARD">Card</MenuItem>
            <MenuItem value="OTHER">Other</MenuItem>
          </TextField>
          <TextField
            fullWidth
            margin="normal"
            label="Reference (optional)"
            value={reference}
            onChange={(event) => setReference(event.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button disabled={saving} onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button disabled={saving} variant="contained" onClick={() => void savePayment()}>
            {saving ? 'Saving…' : 'Save payment'}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}
