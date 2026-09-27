import { useEffect, useState } from 'react';

import Layout from '../../components/Layout';
import SearchBar from '../../components/SearchBar';
import Tooltip from '@mui/material/Tooltip';
import { getGuests } from '../../services/guestService';
import { getRooms } from '../../services/roomService';
import LogoutIcon from '@mui/icons-material/Logout';


import {
  getBookings,
  createBooking,
  updateBooking,
  deleteBooking,
  checkoutBooking,
} from '../../services/bookingService';

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';

import { DataGrid } from '@mui/x-data-grid';

function calculateBookingCharge(
  roomPrice: number,
  stayType: string | undefined,
  checkIn: string,
  checkOut: string,
) {
  if (!roomPrice || !checkIn) {
    return 0;
  }

  const start = new Date(`${checkIn}T00:00:00`);
  const end = checkOut ? new Date(`${checkOut}T00:00:00`) : null;
  if (end && end <= start) {
    return 0;
  }

  const durationDays = end
    ? Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86400000))
    : null;
  return stayType === 'MONTHLY'
    ? Math.round(roomPrice * ((durationDays ?? 30) / 30))
    : roomPrice * (durationDays ?? 1);
}

export default function Bookings() {
  const [open, setOpen] = useState(false);

  const [editingBookingId, setEditingBookingId] =
    useState<string | null>(null);

  const [
deleteBookingId,
setDeleteBookingId,
] = useState<string | null>(
null,
);
 

  const [guestName, setGuestName] =
    useState('');

  const [roomNumber, setRoomNumber] =
    useState('');

  const [checkIn, setCheckIn] =
    useState('');

  const [checkOut, setCheckOut] =
    useState('');

  const [paymentDueDate, setPaymentDueDate] =
    useState('');

  const [search, setSearch] =
    useState('');

  const [statusFilter,
    setStatusFilter] =
    useState('ALL');

  const [rows, setRows] =
    useState<any[]>([]);

  const [approvedGuests, setApprovedGuests] =
useState<any[]>([]);

  const [availableRooms, setAvailableRooms] =
useState<any[]>([]);

  const [
  checkoutDialogOpen,
  setCheckoutDialogOpen,
] = useState(false);

const [
  selectedBooking,
  setSelectedBooking,
] = useState<any>(null);

const [
  checkoutDate,
  setCheckoutDate,
] = useState('');

const [
  dueAmount,
  setDueAmount,
] = useState('');

  useEffect(() => {
    loadBookings();
    loadApprovedGuests();
    loadAvailableRooms();
  }, []);

  const loadApprovedGuests =
  async () => {
    try {
      const guests =
        await getGuests();

      setApprovedGuests(
        guests.filter(
          (guest: any) =>
            guest.status ===
            'APPROVED',
        ),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const loadAvailableRooms =
  async () => {
    try {
      const rooms =
        await getRooms();

      setAvailableRooms(
        rooms,
      );
    } catch (error) {
      console.error(error);
    }
  };

  const loadBookings = async () => {
    try {
      const data =
        await getBookings();

      const formattedRows =
        data.map(
          (
            booking: any,
            index: number,
          ) => ({
            id: index + 1,
            ...booking,
          }),
        );

      setRows(formattedRows);
    } catch (error) {
      console.error(
        'Error loading bookings:',
        error,
      );
    }
  };

  const handleEditBooking = (
    booking: any,
  ) => {
    setGuestName(
      booking.guestName,
    );

    setRoomNumber(
      booking.roomNumber,
    );

    setCheckIn(
      booking.checkIn,
    );

    setCheckOut(
      booking.checkOut,
    );

    setPaymentDueDate(booking.dueDate || '');

    setEditingBookingId(
      booking.bookingId,
    );

    setOpen(true);
  };

  const confirmCheckout =
  async () => {
    if (!selectedBooking) {
      return;
    }

    try {

      await checkoutBooking(
  selectedBooking.bookingId,
  {
    checkOut:
      checkoutDate,
    dueAmount:
      Number(dueAmount),
  },
);

      await loadBookings();

      setCheckoutDialogOpen(
        false,
      );

      setSelectedBooking(
        null,
      );

      setCheckoutDate('');

      setDueAmount('');
    } catch (error) {
      console.error(
        'Checkout failed:',
        error,
      );
    }
  };


  const handleSaveBooking =
    async () => {
      if (
        !guestName ||
        !roomNumber ||
        !checkIn ||
        !paymentDueDate
      ) {
        alert(
          'Please select a guest, room, check-in date, and payment due date',
        );
        return;
      }

      const selectedGuest = approvedGuests.find(
        (guest: any) => guest.guestName === guestName,
      );
      const selectedRoom = availableRooms.find(
        (room: any) => room.roomNumber === roomNumber,
      );
      const roomPrice = Number(selectedRoom?.price ?? selectedRoom?.pricePerNight ?? 0);

      if (!selectedGuest || roomPrice <= 0) {
        alert('Unable to calculate the booking price. Check the selected guest and room price.');
        return;
      }

      const totalAmount = calculateBookingCharge(
        roomPrice,
        selectedGuest.stayType,
        checkIn,
        checkOut,
      );
      if (checkOut && totalAmount <= 0) {
        alert('Check-out date must be after check-in date');
        return;
      }

      const existingBooking = editingBookingId
        ? rows.find((booking: any) => booking.bookingId === editingBookingId)
        : null;
      const payments = existingBooking?.payments || [];
      const paidAmount = Number(
        existingBooking?.paidAmount ??
          payments.reduce(
            (sum: number, payment: any) => sum + Number(payment.amount || 0),
            0,
          ),
      );

      const bookingData = {
        guestName,
        roomNumber,
        checkIn,
        checkOut:
         checkOut || null, 
        dueDate: paymentDueDate,
        totalAmount,
        paidAmount,
        dueAmount: Math.max(0, totalAmount - paidAmount),
        payments,
        status:
          'CONFIRMED',
      };

      try {
if (editingBookingId) {
await updateBooking(
editingBookingId,
bookingData,
);
} else {
const response =
await createBooking({
bookingId:
`BK${Date.now()}`,
guestId:
selectedGuest.guestId,
email:
selectedGuest.email,
...bookingData,
});
if (
response.success ===
false
) {
alert(
response.message,
);
return;
}
}
 
await loadBookings();
await loadAvailableRooms();
 
setGuestName('');
setRoomNumber('');
setCheckIn('');
setCheckOut('');
setPaymentDueDate('');
 
setEditingBookingId(
null,
);
 
setOpen(false);
} catch (error) {
console.error(error);
}
};
  const filteredRows =
    rows.filter(
      (booking: any) =>
        (
          statusFilter ===
            'ALL' ||
          booking.status ===
            statusFilter
        ) &&
        (
          booking.bookingId
            ?.toLowerCase()
            .includes(
              search.toLowerCase(),
            ) ||
          booking.guestName
            ?.toLowerCase()
            .includes(
              search.toLowerCase(),
            ) ||
          booking.roomNumber
            ?.toLowerCase()
            .includes(
              search.toLowerCase(),
            )
        ),
    );

    const handleCheckout = (
  booking: any,
) => {
  setSelectedBooking(
    booking,
  );

  setCheckoutDate('');

  setDueAmount('0');

  setCheckoutDialogOpen(
    true,
  );
};

  const columns = [
    {
      field: 'bookingId',
      headerName:
        'Booking ID',
      flex: 1,
    },
    {
      field: 'guestName',
      headerName:
        'Guest Name',
      flex: 1.5,
    },
    {
      field: 'roomNumber',
      headerName:
        'Room',
      flex: 1,
    },
    {
      field: 'checkIn',
      headerName:
        'Check In',
      flex: 1.2,
    },
    {
      field: 'dueDate',
      headerName: 'Payment Due',
      flex: 1.2,
      renderCell: (params: any) => params.value || 'Not Set',
    },
    {
  field: 'checkOut',
  headerName:
    'Check Out',
  flex: 1.2,

  renderCell: (
    params: any,
  ) =>
    params.value ||
    'Not Specified',
},
    {
  field: 'status',
  headerName: 'Status',
  flex: 1,

  renderCell: (
    params: any,
  ) => (
    <Chip
      size="small"
      label={
        params.value
      }
      color={
        params.value ===
        'CONFIRMED'
          ? 'success'
          : params.value ===
            'CHECKED_OUT'
          ? 'default'
          : params.value ===
            'CANCELLED'
          ? 'error'
          : 'primary'
      }
      sx={
        params.value ===
        'CHECKED_OUT'
          ? {
              bgcolor:
                '#E5E7EB',
              color:
                '#4B5563',
            }
          : {}
      }
    />
  ),
},
    {
  field: 'actions',
  headerName: 'Actions',
  flex: 1.2,
  sortable: false,
  align: 'center',
  headerAlign: 'center',

  renderCell: (
    params: any,
  ) => (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Tooltip title="Edit Booking">
        <IconButton
          size="small"
          onClick={() =>
            handleEditBooking(
              params.row,
            )
          }
          sx={{
            width: 34,
            height: 34,
            bgcolor: '#DBEAFE',
            color: '#2563EB',
            transition:
              'all .2s ease',

            '&:hover': {
              bgcolor: '#BFDBFE',
              transform:
                'scale(1.08)',
            },
          }}
        >
          <EditIcon
            fontSize="small"
          />
        </IconButton>
      </Tooltip>

      <Tooltip title="Check Out">
  <IconButton
    color="warning"
    onClick={() =>
      handleCheckout(
        params.row,
      )
    }
  >
    <LogoutIcon />
  </IconButton>
</Tooltip>
    </Box>
  ),
},
  ];

  return (
    <Layout>
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, mb: 3 }}
      >
        Booking Management
      </Typography>

      <Grid
        container
        spacing={3}
        sx={{ mb: 3 }}
      >
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography>
                Total Bookings
              </Typography>

              <Typography
                variant="h4"
                fontWeight={700}
              >
                {rows.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography>
                Confirmed
              </Typography>

              <Typography
                variant="h4"
                fontWeight={700}
                color="success.main"
              >
                {
                  rows.filter(
                    (
                      booking,
                    ) =>
                      booking.status ===
                      'CONFIRMED',
                  ).length
                }
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography>
                Active Stays
              </Typography>

              <Typography
                variant="h4"
                fontWeight={700}
                color="primary.main"
              >
                {rows.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Box
          display="flex"
          gap={2}
        >
          <SearchBar
            value={search}
            onChange={setSearch}
          />

          <TextField
            select
            size="small"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value,
              )
            }
            sx={{
              width: 180,
            }}
          >
            <MenuItem value="ALL">
              All Status
            </MenuItem>

            <MenuItem value="CONFIRMED">
              Confirmed
            </MenuItem>

            <MenuItem value="CANCELLED">
              Cancelled
            </MenuItem>
          </TextField>
        </Box>

        <Button
          variant="contained"
          onClick={() => {
            setEditingBookingId(
              null,
            );

            setGuestName('');
            setRoomNumber('');
            setCheckIn('');
            setCheckOut('');
            setPaymentDueDate('');

            setOpen(true);
          }}
        >
          New Booking
        </Button>
      </Box>

      <Card>
        <Box
          sx={{
            height: 500,
          }}
        >
          <DataGrid
            rows={filteredRows}
            columns={columns}
            pageSizeOptions={[
              5,
              10,
              20,
            ]}
            disableRowSelectionOnClick
            sx={{
              border: 0,

              '& .MuiDataGrid-columnHeaders':
                {
                  backgroundColor:
                    '#f8fafc',
                },

              '& .MuiDataGrid-cell':
                {
                  borderBottom:
                    '1px solid #f1f5f9',
                },
            }}
          />
        </Box>
      </Card>

      <Dialog
        open={open}
        onClose={() =>
          setOpen(false)
        }
        fullWidth
      >
        <DialogTitle>
          {editingBookingId
            ? 'Edit Booking'
            : 'Create Booking'}
        </DialogTitle>

        <DialogContent>
          <TextField
  select
  fullWidth
  margin="normal"
  label="Guest"
  value={guestName}
  onChange={(e) =>
    setGuestName(
      e.target.value,
    )
  }
>
  {approvedGuests.map(
    (guest: any) => (
      <MenuItem
        key={
          guest.guestId
        }
        value={
          guest.guestName
        }
      >
        {guest.guestName}
      </MenuItem>
    ),
  )}
</TextField>

          <TextField
  select
  fullWidth
  margin="normal"
  label="Room"
  value={roomNumber}
  onChange={(e) =>
    setRoomNumber(
      e.target.value,
    )
  }
>
  {availableRooms
    .filter(
      (room: any) =>
        room.available > 0 ||
        (editingBookingId && room.roomNumber === roomNumber),
    )
    .map(
    (room: any) => (
      <MenuItem
        key={
          room.roomNumber
        }
        value={
          room.roomNumber
        }
      >
        {room.roomNumber}
        {' - '}
        {room.roomType}
        {' ('}
        {room.available}
        {' Beds Available)'}
      </MenuItem>
    ),
  )}
</TextField>

          {roomNumber && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Room price is charged{' '}
                {approvedGuests.find((guest: any) => guest.guestName === guestName)?.stayType === 'MONTHLY'
                  ? 'monthly and prorated by stay days'
                  : 'per night'}.
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 700 }}>
                Estimated total: ₹
                {calculateBookingCharge(
                  Number(
                    availableRooms.find((room: any) => room.roomNumber === roomNumber)?.price ??
                      availableRooms.find((room: any) => room.roomNumber === roomNumber)?.pricePerNight ??
                      0,
                  ),
                  approvedGuests.find((guest: any) => guest.guestName === guestName)?.stayType,
                  checkIn,
                  checkOut,
                ).toLocaleString('en-IN')}
              </Typography>
            </Box>
          )}

          <TextField
            fullWidth
            margin="normal"
            type="date"
            label="Check In"
            InputLabelProps={{
              shrink: true,
            }}
            value={checkIn}
            onChange={(e) =>
              setCheckIn(
                e.target.value,
              )
            }
          />

          <TextField
            fullWidth
            required
            margin="normal"
            type="date"
            label="Payment Due Date"
            slotProps={{ inputLabel: { shrink: true } }}
            value={paymentDueDate}
            onChange={(e) => setPaymentDueDate(e.target.value)}
            helperText="Set the date by which the user should pay."
          />

          <TextField
            fullWidth
            margin="normal"
            type="date"
            label="Check Out (Optional)"
            InputLabelProps={{
              shrink: true,
            }}
            value={checkOut}
            onChange={(e) =>
              setCheckOut(
                e.target.value,
              )
            }
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() =>
              setOpen(false)
            }
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={
              handleSaveBooking
            }
          >
            {editingBookingId
              ? 'Update'
              : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
  open={checkoutDialogOpen}
  onClose={() =>
    setCheckoutDialogOpen(
      false,
    )
  }
>
  <DialogTitle>
    Guest Check Out
  </DialogTitle>

  <DialogContent>
    <TextField
      fullWidth
      margin="normal"
      type="date"
      label="Check Out Date"
      InputLabelProps={{
        shrink: true,
      }}
      value={checkoutDate}
      onChange={(e) =>
        setCheckoutDate(
          e.target.value,
        )
      }
    />

    <TextField
      fullWidth
      margin="normal"
      type="number"
      label="Due Amount"
      value={dueAmount}
      onChange={(e) =>
        setDueAmount(
          e.target.value,
        )
      }
    />
  </DialogContent>

  <DialogActions>
    <Button
      onClick={() =>
        setCheckoutDialogOpen(
          false,
        )
      }
    >
      Cancel
    </Button>

    <Button
      variant="contained"
      color="warning"
      onClick={
        confirmCheckout
      }
    >
      Check Out
    </Button>
  </DialogActions>
</Dialog>
    </Layout>
  );
}