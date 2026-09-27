import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Typography,
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import MeetingRoomOutlinedIcon from '@mui/icons-material/MeetingRoomOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { getBookings } from '../../services/bookingService';
import { getGuests } from '../../services/guestService';

interface Booking {
  bookingId?: string;
  guestId?: string;
  email?: string;
  guestName?: string;
  roomNumber?: string;
  checkIn?: string;
  checkInDate?: string;
  checkOut?: string | null;
  checkOutDate?: string | null;
  dueAmount?: number;
  status?: string;
  bookingStatus?: string;
}

interface Guest {
  guestId?: string;
  email?: string;
  guestName?: string;
}

const normalize = (value?: string) => value?.trim().toLowerCase() || '';

function formatDate(value?: string | null) {
  if (!value) {
    return 'Not specified';
  }

  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(date);
}

function DetailTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
        p: 2.25,
        minWidth: 0,
        borderRadius: 2.5,
        border: '1px solid #eceef2',
        backgroundColor: '#fff',
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          flexShrink: 0,
          display: 'grid',
          placeItems: 'center',
          borderRadius: 2,
          color: '#8a6b55',
          backgroundColor: '#f8f3ec',
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography sx={{ mt: 0.5, fontWeight: 700, color: '#263247', overflowWrap: 'anywhere' }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

export default function MyBooking() {
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;

    const loadBooking = async () => {
      try {
        const email = localStorage.getItem('email')?.trim().toLowerCase();
        if (!email) {
          setLoadError(true);
          return;
        }

        const [bookings, guests]: [Booking[], Guest[]] = await Promise.all([
          getBookings(),
          getGuests(),
        ]);
        const userGuests = guests.filter(
          (item) => normalize(item.email) === email,
        );
        const linkedBookings = bookings.filter((item) => {
          if (normalize(item.email) === email) {
            return true;
          }

          if (item.guestId) {
            return userGuests.some((guest) => guest.guestId === item.guestId);
          }

          return userGuests.some(
            (guest) =>
              normalize(item.guestName) === normalize(guest.guestName),
          );
        });

        if (active) {
          setBooking(linkedBookings.at(-1) || null);
        }
      } catch (error) {
        console.error('Unable to load the user booking:', error);
        if (active) {
          setLoadError(true);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadBooking();
    return () => {
      active = false;
    };
  }, []);

  const status = booking?.status || booking?.bookingStatus || 'CONFIRMED';
  const checkedOut = status === 'CHECKED_OUT';

  return (
    <Layout>
      <Box sx={{ maxWidth: 1080, mx: 'auto', p: { xs: 1, sm: 2 }, pb: 4 }}>
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

        <Box sx={{ mb: 3 }}>
          <Typography
            variant="overline"
            sx={{ color: '#8a6b55', letterSpacing: 1.5, fontWeight: 700 }}
          >
            YOUR STAY
          </Typography>
          <Typography
            variant="h4"
            sx={{ mt: 0.25, fontWeight: 800, color: '#263247' }}
          >
            My Booking
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.75 }}>
            View your room allocation and stay information.
          </Typography>
        </Box>

        <Card
          sx={{
            overflow: 'hidden',
            borderRadius: 3,
            border: '1px solid #e8e9ed',
            boxShadow: '0 12px 30px rgba(38, 50, 71, 0.06)',
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 3 }}>
                <CircularProgress size={22} />
                <Typography color="text.secondary">
                  Loading your booking…
                </Typography>
              </Box>
            ) : loadError ? (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                We couldn’t load your booking right now. Please refresh and try
                again.
              </Alert>
            ) : !booking ? (
              <Box sx={{ py: { xs: 2, sm: 4 }, textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    mx: 'auto',
                    mb: 2,
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: '50%',
                    color: '#8a6b55',
                    backgroundColor: '#f8f3ec',
                  }}
                >
                  <MeetingRoomOutlinedIcon fontSize="large" />
                </Box>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: '#263247' }}
                >
                  No booking yet
                </Typography>
                <Typography
                  color="text.secondary"
                  sx={{ mt: 1, maxWidth: 480, mx: 'auto' }}
                >
                  Your room allocation and stay details will appear here once
                  the administrator creates your booking.
                </Typography>
              </Box>
            ) : (
              <>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 2,
                    p: { xs: 2, sm: 2.5 },
                    mb: 3,
                    borderRadius: 2.5,
                    backgroundColor: '#faf8f5',
                    border: '1px solid #f0ebe4',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75 }}>
                    <Box
                      sx={{
                        width: 52,
                        height: 52,
                        display: 'grid',
                        placeItems: 'center',
                        borderRadius: 2,
                        color: '#8a6b55',
                        backgroundColor: '#f1e9de',
                      }}
                    >
                      <MeetingRoomOutlinedIcon />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Allocated room
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 800, color: '#263247' }}
                      >
                        Room {booking.roomNumber || '—'}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={status.replaceAll('_', ' ')}
                    color={
                      checkedOut
                        ? 'default'
                        : status === 'CONFIRMED'
                          ? 'success'
                          : 'warning'
                    }
                    sx={{
                      fontWeight: 700,
                      ...(checkedOut && {
                        backgroundColor: '#eceff3',
                        color: '#596579',
                      }),
                    }}
                  />
                </Box>

                <Typography
                  variant="h6"
                  sx={{ mb: 1.75, fontWeight: 700, color: '#263247' }}
                >
                  Stay dates
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, minmax(0, 1fr))',
                    },
                    gap: 2,
                    mb: 3,
                  }}
                >
                  <DetailTile
                    icon={<CalendarMonthOutlinedIcon />}
                    label="Check-in"
                    value={formatDate(booking.checkIn || booking.checkInDate)}
                  />
                  <DetailTile
                    icon={<CalendarMonthOutlinedIcon />}
                    label="Check-out"
                    value={formatDate(booking.checkOut || booking.checkOutDate)}
                  />
                </Box>

                <Divider sx={{ mb: 2.5 }} />
                <Typography
                  variant="h6"
                  sx={{ mb: 1.75, fontWeight: 700, color: '#263247' }}
                >
                  Booking summary
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, minmax(0, 1fr))',
                    },
                    gap: 2,
                  }}
                >
                  <DetailTile
                    icon={<ConfirmationNumberOutlinedIcon />}
                    label="Booking reference"
                    value={booking.bookingId || '—'}
                  />
                  <DetailTile
                    icon={<PaymentsOutlinedIcon />}
                    label="Due amount"
                    value={`₹${(booking.dueAmount ?? 0).toLocaleString('en-IN')}`}
                  />
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
}
