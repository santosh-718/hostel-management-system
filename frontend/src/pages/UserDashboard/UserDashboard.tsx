import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Typography,
} from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import HotelOutlinedIcon from '@mui/icons-material/HotelOutlined';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { getBookings } from '../../services/bookingService';
import { getGuests } from '../../services/guestService';

interface UserDetails {
  name?: string;
  email?: string;
  phone?: string;
}

interface GuestRecord {
  guestId?: string;
  guestName?: string;
  email?: string;
  phone?: string;
  checkInDate?: string;
  checkOutDate?: string | null;
  status?: string;
}

interface BookingRecord {
  bookingId?: string;
  guestId?: string;
  guestName?: string;
  email?: string;
  roomNumber?: string;
  checkIn?: string;
  checkInDate?: string;
  checkOut?: string | null;
  checkOutDate?: string | null;
  status?: string;
  bookingStatus?: string;
}

const normalize = (value?: string) => value?.trim().toLowerCase() || '';

function readStoredUser(): UserDetails | null {
  const storedUser = localStorage.getItem('user');
  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as UserDetails;
  } catch (error) {
    console.error('Unable to read the signed-in user details:', error);
    return null;
  }
}

function formatDate(value?: string | null) {
  if (!value) {
    return 'Not specified';
  }

  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(date);
}

function SummaryCard({
  icon,
  label,
  value,
  detail,
  accent,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  detail: string;
  accent: string;
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              flexShrink: 0,
              display: 'grid',
              placeItems: 'center',
              color: accent,
              backgroundColor: `${accent}14`,
              borderRadius: 2.5,
            }}
          >
            {icon}
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" color="text.secondary">
              {label}
            </Typography>
            <Typography
              sx={{
                mt: 0.25,
                fontWeight: 800,
                color: '#263247',
                overflowWrap: 'anywhere',
              }}
            >
              {value}
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1.75 }}>
          {detail}
        </Typography>
      </CardContent>
    </Card>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 2,
        py: 1.5,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{ fontWeight: 600, color: '#344054', textAlign: 'right', overflowWrap: 'anywhere' }}
      >
        {value}
      </Typography>
    </Box>
  );
}

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user] = useState<UserDetails | null>(readStoredUser);
  const [registration, setRegistration] = useState<GuestRecord | null>(null);
  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      const email = normalize(localStorage.getItem('email') || user?.email);
      if (!email) {
        setLoadError(true);
        setLoading(false);
        return;
      }

      try {
        const [guests, bookings]: [GuestRecord[], BookingRecord[]] =
          await Promise.all([getGuests(), getBookings()]);
        const userGuests = guests.filter(
          (guest) => normalize(guest.email) === email,
        );
        const currentRegistration = userGuests.at(-1) || null;
        const userBookings = bookings.filter((item) => {
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
          setRegistration(currentRegistration);
          setBooking(userBookings.at(-1) || null);
        }
      } catch (error) {
        console.error('Unable to load user dashboard data:', error);
        if (active) {
          setLoadError(true);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadDashboard();
    return () => {
      active = false;
    };
  }, [user?.email]);

  const status = registration?.status || 'PENDING_APPROVAL';
  const statusColor =
    status === 'APPROVED' ? 'success' : status === 'REJECTED' ? 'error' : 'warning';
  const statusDescription =
    status === 'APPROVED'
      ? 'Your registration has been approved.'
      : status === 'REJECTED'
        ? 'Please contact the hostel administrator for help.'
        : 'Your request is waiting for administrator review.';
  const displayName = user?.name?.trim() || registration?.guestName || 'there';

  return (
    <Layout>
      <Box sx={{ maxWidth: 1200, mx: 'auto', pb: 4 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            gap: 2,
            mb: 3,
            p: { xs: 2.5, sm: 3.5 },
            borderRadius: 3,
            border: '1px solid #eee7de',
            background: 'linear-gradient(120deg, #fff 0%, #fbf8f3 100%)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 58,
                height: 58,
                color: '#765739',
                backgroundColor: '#f1e9de',
              }}
            >
              <PersonOutlineRoundedIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography
                variant="overline"
                sx={{ color: '#8a6b55', letterSpacing: 1.4, fontWeight: 700 }}
              >
                HOSTEL HUB · USER PORTAL
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  mt: -0.25,
                  fontWeight: 800,
                  color: '#263247',
                  fontSize: { xs: '1.65rem', sm: '2rem' },
                }}
              >
                Welcome, {displayName}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                Your personal stay and registration at a glance.
              </Typography>
            </Box>
          </Box>
          {!registration && !loading && (
            <Button
              variant="contained"
              endIcon={<ArrowForwardRoundedIcon />}
              onClick={() => navigate('/guest-registration')}
              sx={{
                minHeight: 46,
                borderRadius: 2.5,
                px: 2.5,
                fontWeight: 700,
                textTransform: 'none',
                backgroundColor: '#8a6b55',
                '&:hover': { backgroundColor: '#73563f' },
              }}
            >
              Start guest registration
            </Button>
          )}
        </Box>

        {loadError && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2.5 }}>
            We couldn’t load all dashboard information. Please refresh to try again.
          </Alert>
        )}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              lg: 'repeat(3, minmax(0, 1fr))',
            },
            gap: 2,
            mb: 3,
          }}
        >
          <SummaryCard
            icon={<AssignmentOutlinedIcon />}
            label="Registration"
            value={
              loading ? 'Loading…' : registration ? status.replaceAll('_', ' ') : 'Not submitted'
            }
            detail={
              loading
                ? 'Checking your latest request'
                : registration
                  ? statusDescription
                  : 'Submit your stay details to get started.'
            }
            accent="#8a6b55"
          />
          <SummaryCard
            icon={<HotelOutlinedIcon />}
            label="Room allocation"
            value={loading ? 'Loading…' : booking?.roomNumber ? `Room ${booking.roomNumber}` : 'Not allocated'}
            detail={
              booking
                ? `Booking reference ${booking.bookingId || 'available'}`
                : 'Room details appear here after allocation.'
            }
            accent="#60736a"
          />
          <SummaryCard
            icon={<CalendarMonthOutlinedIcon />}
            label="Check-in date"
            value={
              loading
                ? 'Loading…'
                : formatDate(booking?.checkIn || booking?.checkInDate || registration?.checkInDate)
            }
            detail={
              booking
                ? `Check-out: ${formatDate(booking.checkOut || booking.checkOutDate)}`
                : 'Your requested arrival date.'
            }
            accent="#8b7555"
          />
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.2fr) minmax(300px, 0.8fr)' },
            gap: 2,
            alignItems: 'stretch',
          }}
        >
          <Card
            sx={{
              borderRadius: 3,
              border: '1px solid #eceef2',
              boxShadow: '0 8px 24px rgba(38, 50, 71, 0.045)',
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 2,
                  mb: 1,
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 750, color: '#263247' }}>
                    Registration status
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Track the latest request submitted to the hostel.
                  </Typography>
                </Box>
                {registration && (
                  <Chip
                    size="small"
                    label={status.replaceAll('_', ' ')}
                    color={statusColor}
                    sx={{ fontWeight: 700 }}
                  />
                )}
              </Box>
              <Divider sx={{ my: 2 }} />

              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}>
                  <CircularProgress size={20} />
                  <Typography color="text.secondary">Loading your details…</Typography>
                </Box>
              ) : registration ? (
                <Box>
                  <ProfileRow label="Guest name" value={registration.guestName || '—'} />
                  <Divider />
                  <ProfileRow
                    label="Requested check-in"
                    value={formatDate(registration.checkInDate)}
                  />
                  <Divider />
                  <ProfileRow
                    label="Requested check-out"
                    value={formatDate(registration.checkOutDate)}
                  />
                  {booking && (
                    <>
                      <Divider />
                      <ProfileRow label="Booking ID" value={booking.bookingId || '—'} />
                    </>
                  )}
                </Box>
              ) : (
                <Box sx={{ py: 1 }}>
                  <Typography sx={{ fontWeight: 650, color: '#344054' }}>
                    No registration has been submitted yet.
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Start a registration to send your stay request to the administrator.
                  </Typography>
                </Box>
              )}

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25, mt: 2.5 }}>
                {registration && (
                  <Button
                    variant="outlined"
                    endIcon={<ArrowForwardRoundedIcon />}
                    onClick={() => navigate('/my-registration')}
                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 650 }}
                  >
                    View registration
                  </Button>
                )}
                {booking && (
                  <>
                    <Button
                      variant="outlined"
                      endIcon={<ArrowForwardRoundedIcon />}
                      onClick={() => navigate('/my-booking')}
                      sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 650 }}
                    >
                      View booking
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<PaymentsOutlinedIcon />}
                      onClick={() => navigate('/my-payments')}
                      sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 650 }}
                    >
                      My payments
                    </Button>
                  </>
                )}
              </Box>
            </CardContent>
          </Card>

          <Card
            sx={{
              borderRadius: 3,
              border: '1px solid #eceef2',
              boxShadow: '0 8px 24px rgba(38, 50, 71, 0.045)',
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
              <Typography variant="h6" sx={{ fontWeight: 750, color: '#263247' }}>
                My profile
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Account details used for your registration.
              </Typography>
              <Divider sx={{ my: 2 }} />
              <ProfileRow label="Full name" value={user?.name || registration?.guestName || '—'} />
              <Divider />
              <ProfileRow
                label="Email"
                value={user?.email || localStorage.getItem('email') || '—'}
              />
              <Divider />
              <ProfileRow
                label="Phone"
                value={user?.phone || registration?.phone || '—'}
              />
              {registration?.status === 'APPROVED' && (
                <Alert
                  icon={<CheckCircleOutlineRoundedIcon />}
                  severity="success"
                  sx={{ mt: 2, borderRadius: 2 }}
                >
                  Your registration is approved.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Layout>
  );
}
