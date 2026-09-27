import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { getBookings } from '../../services/bookingService';
import { getGuests } from '../../services/guestService';

interface PaymentRecord {
  paymentId?: string;
  amount?: number;
  paidAt?: string;
  method?: string;
  reference?: string;
}

interface BookingRecord {
  bookingId?: string;
  guestId?: string;
  guestName?: string;
  email?: string;
  roomNumber?: string;
  totalAmount?: number;
  paidAmount?: number;
  dueAmount?: number;
  dueDate?: string;
  payments?: PaymentRecord[];
}

interface GuestRecord {
  guestId?: string;
  guestName?: string;
  email?: string;
}

const normalize = (value?: string) => value?.trim().toLowerCase() || '';
const formatCurrency = (amount: number) =>
  `₹${amount.toLocaleString('en-IN')}`;

function SummaryCard({
  label,
  amount,
  tone,
}: {
  label: string;
  amount: number;
  tone: string;
}) {
  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 3,
        border: '1px solid #eceef2',
        boxShadow: '0 8px 24px rgba(38, 50, 71, 0.045)',
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="h5" sx={{ mt: 1, fontWeight: 800, color: tone }}>
          {formatCurrency(amount)}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function MyPayments() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;

    const loadPayments = async () => {
      try {
        const email = normalize(localStorage.getItem('email') || '');
        if (!email) {
          setLoadError(true);
          return;
        }

        const [allBookings, guests]: [BookingRecord[], GuestRecord[]] =
          await Promise.all([getBookings(), getGuests()]);
        const userGuests = guests.filter(
          (guest) => normalize(guest.email) === email,
        );
        const userBookings = allBookings.filter((booking) => {
          if (normalize(booking.email) === email) {
            return true;
          }
          if (booking.guestId) {
            return userGuests.some((guest) => guest.guestId === booking.guestId);
          }
          return userGuests.some(
            (guest) => normalize(guest.guestName) === normalize(booking.guestName),
          );
        });

        if (active) {
          setBookings(userBookings);
        }
      } catch (error) {
        console.error('Unable to load user payment history:', error);
        if (active) {
          setLoadError(true);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadPayments();
    return () => {
      active = false;
    };
  }, []);

  const totalPaid = bookings.reduce(
    (sum, booking) =>
      sum +
      Number(
        booking.paidAmount ??
          (booking.payments || []).reduce(
            (paymentSum, payment) => paymentSum + Number(payment.amount || 0),
            0,
          ),
      ),
    0,
  );
  const totalBalance = bookings.reduce(
    (sum, booking) =>
      sum +
      Math.max(
        0,
        Number(booking.totalAmount ?? booking.dueAmount ?? 0) -
          Number(
            booking.paidAmount ??
              (booking.payments || []).reduce(
                (paymentSum, payment) => paymentSum + Number(payment.amount || 0),
                0,
              ),
          ),
      ),
    0,
  );
  const totalCharge = totalPaid + totalBalance;
  const transactions = bookings.flatMap((booking) =>
    (booking.payments || []).map((payment, index) => ({
      id: payment.paymentId || `${booking.bookingId}-${index}`,
      bookingId: booking.bookingId || '—',
      roomNumber: booking.roomNumber || '—',
      amount: Number(payment.amount || 0),
      paidAt: payment.paidAt || '—',
      method: payment.method?.replaceAll('_', ' ') || '—',
      reference: payment.reference || '—',
    })),
  );

  return (
    <Layout>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 1, sm: 2 }, pb: 4 }}>
        <Button
          startIcon={<ArrowBackRoundedIcon />}
          onClick={() => navigate('/user-dashboard')}
          sx={{
            mb: 2,
            px: 0,
            color: '#596579',
            fontWeight: 600,
            '&:hover': { backgroundColor: 'transparent', color: '#344054' },
          }}
        >
          Back to dashboard
        </Button>

        <Typography
          variant="overline"
          sx={{ color: '#8a6b55', letterSpacing: 1.5, fontWeight: 700 }}
        >
          ACCOUNT SUMMARY
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#263247' }}>
          My Payments
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.75, mb: 3 }}>
          View your room charges, upcoming due dates, and recorded payments.
        </Typography>

        {loadError && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2.5 }}>
            We couldn’t load your payment history. Please refresh and try again.
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 4 }}>
            <CircularProgress size={22} />
            <Typography color="text.secondary">Loading your payments…</Typography>
          </Box>
        ) : (
          <>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(3, minmax(0, 1fr))',
                },
                gap: 2,
                mb: 3,
              }}
            >
              <SummaryCard label="Total charges" amount={totalCharge} tone="#263247" />
              <SummaryCard label="Total paid" amount={totalPaid} tone="#47745a" />
              <SummaryCard label="Remaining balance" amount={totalBalance} tone="#9a7144" />
            </Box>

            <Card
              sx={{
                mb: 3,
                borderRadius: 3,
                border: '1px solid #eceef2',
                boxShadow: '0 8px 24px rgba(38, 50, 71, 0.045)',
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 700, color: '#263247' }}>
                  Booking dues
                </Typography>
                {bookings.length === 0 ? (
                  <Typography color="text.secondary" sx={{ py: 2 }}>
                    No booking payment information is available yet.
                  </Typography>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Booking</TableCell>
                          <TableCell>Room</TableCell>
                          <TableCell>Due date</TableCell>
                          <TableCell align="right">Total</TableCell>
                          <TableCell align="right">Paid</TableCell>
                          <TableCell align="right">Balance</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {bookings.map((booking) => {
                          const paid =
                            booking.paidAmount ??
                            (booking.payments || []).reduce(
                              (sum, payment) => sum + Number(payment.amount || 0),
                              0,
                            );
                          const balance = Math.max(
                            0,
                            Number(booking.totalAmount ?? booking.dueAmount ?? 0) - paid,
                          );
                          return (
                            <TableRow key={booking.bookingId}>
                              <TableCell>{booking.bookingId || '—'}</TableCell>
                              <TableCell>{booking.roomNumber || '—'}</TableCell>
                              <TableCell>{booking.dueDate || 'Not set'}</TableCell>
                              <TableCell align="right">
                                {formatCurrency(Number(booking.totalAmount ?? booking.dueAmount ?? 0))}
                              </TableCell>
                              <TableCell align="right">{formatCurrency(Number(paid))}</TableCell>
                              <TableCell align="right" sx={{ fontWeight: 700 }}>
                                {formatCurrency(balance)}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </CardContent>
            </Card>

            <Card
              sx={{
                borderRadius: 3,
                border: '1px solid #eceef2',
                boxShadow: '0 8px 24px rgba(38, 50, 71, 0.045)',
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1 }}>
                  <PaymentsOutlinedIcon sx={{ color: '#8a6b55' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#263247' }}>
                    Payment history
                  </Typography>
                </Box>
                <Divider sx={{ mb: 1 }} />
                {transactions.length === 0 ? (
                  <Typography color="text.secondary" sx={{ py: 2 }}>
                    No payments have been recorded for your bookings yet.
                  </Typography>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>Booking</TableCell>
                          <TableCell>Room</TableCell>
                          <TableCell>Method</TableCell>
                          <TableCell>Reference</TableCell>
                          <TableCell align="right">Amount</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {transactions
                          .sort((first, second) => second.paidAt.localeCompare(first.paidAt))
                          .map((transaction) => (
                            <TableRow key={transaction.id}>
                              <TableCell>{transaction.paidAt}</TableCell>
                              <TableCell>{transaction.bookingId}</TableCell>
                              <TableCell>{transaction.roomNumber}</TableCell>
                              <TableCell>{transaction.method}</TableCell>
                              <TableCell>{transaction.reference}</TableCell>
                              <TableCell align="right" sx={{ fontWeight: 700 }}>
                                {formatCurrency(transaction.amount)}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </Box>
    </Layout>
  );
}
