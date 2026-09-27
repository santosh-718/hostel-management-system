import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
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
import ContactPhoneOutlinedIcon from '@mui/icons-material/ContactPhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { getGuests } from '../../services/guestService';

interface GuestRegistration {
  guestId?: string;
  guestName?: string;
  email?: string;
  phone?: string;
  checkInDate?: string;
  checkOutDate?: string | null;
  organization?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  address?: string;
  status?: string;
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

function DetailItem({
  icon,
  label,
  value,
}: {
  icon?: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
        minWidth: 0,
        p: 2,
        borderRadius: 2.5,
        border: '1px solid #eceef2',
        backgroundColor: '#fff',
      }}
    >
      {icon && (
        <Box
          sx={{
            width: 38,
            height: 38,
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
      )}
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography
          sx={{
            mt: 0.5,
            fontWeight: 650,
            color: '#263247',
            overflowWrap: 'anywhere',
          }}
        >
          {value || 'Not provided'}
        </Typography>
      </Box>
    </Box>
  );
}

export default function MyRegistration() {
  const navigate = useNavigate();
  const [guest, setGuest] = useState<GuestRegistration | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      try {
        const email = normalize(localStorage.getItem('email') || '');
        if (!email) {
          setLoadError(true);
          return;
        }

        const guests: GuestRegistration[] = await getGuests();
        const registration =
          guests.find((item) => normalize(item.email) === email) || null;
        if (active) {
          setGuest(registration);
        }
      } catch (error) {
        console.error('Unable to load the guest registration:', error);
        if (active) {
          setLoadError(true);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadData();
    return () => {
      active = false;
    };
  }, []);

  const status = guest?.status || 'PENDING_APPROVAL';
  const statusColor =
    status === 'APPROVED' ? 'success' : status === 'REJECTED' ? 'error' : 'warning';
  const statusMessage =
    status === 'APPROVED'
      ? 'Your registration is approved. Please contact the hostel team if you need help preparing for your stay.'
      : status === 'REJECTED'
        ? 'Your registration was not approved. Please contact the hostel administrator for next steps.'
        : 'Your registration has been received and is waiting for administrator review.';

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
            YOUR REQUEST
          </Typography>
          <Typography
            variant="h4"
            sx={{ mt: 0.25, fontWeight: 800, color: '#263247' }}
          >
            My Registration
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.75 }}>
            Review the details and approval status of your stay request.
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
                  Loading your registration…
                </Typography>
              </Box>
            ) : loadError ? (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                We couldn’t load your registration right now. Please refresh and
                try again.
              </Alert>
            ) : !guest ? (
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
                  <PersonOutlineRoundedIcon fontSize="large" />
                </Box>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: '#263247' }}
                >
                  No registration found
                </Typography>
                <Typography
                  color="text.secondary"
                  sx={{ mt: 1, maxWidth: 480, mx: 'auto' }}
                >
                  Submit your guest registration to send a stay request to the
                  hostel administrator.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/guest-registration')}
                  sx={{
                    mt: 2.5,
                    borderRadius: 2,
                    px: 2.5,
                    textTransform: 'none',
                    fontWeight: 700,
                    backgroundColor: '#8a6b55',
                    '&:hover': { backgroundColor: '#73563f' },
                  }}
                >
                  Start guest registration
                </Button>
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
                        width: 50,
                        height: 50,
                        display: 'grid',
                        placeItems: 'center',
                        borderRadius: 2,
                        color: '#8a6b55',
                        backgroundColor: '#f1e9de',
                      }}
                    >
                      <PersonOutlineRoundedIcon />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Guest
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 800, color: '#263247' }}
                      >
                        {guest.guestName || 'Guest registration'}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={status.replaceAll('_', ' ')}
                    color={statusColor}
                    sx={{ fontWeight: 700 }}
                  />
                </Box>

                <Alert
                  severity={
                    status === 'APPROVED'
                      ? 'success'
                      : status === 'REJECTED'
                        ? 'error'
                        : 'info'
                  }
                  sx={{ mb: 3, borderRadius: 2.5 }}
                >
                  {statusMessage}
                </Alert>

                <Typography
                  variant="h6"
                  sx={{ mb: 1.75, fontWeight: 700, color: '#263247' }}
                >
                  Contact details
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, minmax(0, 1fr))',
                    },
                    gap: 1.5,
                    mb: 3,
                  }}
                >
                  <DetailItem
                    icon={<EmailOutlinedIcon />}
                    label="Email address"
                    value={guest.email || ''}
                  />
                  <DetailItem
                    icon={<ContactPhoneOutlinedIcon />}
                    label="Phone number"
                    value={guest.phone || ''}
                  />
                  <DetailItem
                    label="Company or college"
                    value={guest.organization || ''}
                  />
                  <DetailItem
                    label="Emergency contact"
                    value={
                      guest.emergencyContactName
                        ? `${guest.emergencyContactName}${guest.emergencyContactPhone ? ` · ${guest.emergencyContactPhone}` : ''}`
                        : guest.emergencyContactPhone || ''
                    }
                  />
                </Box>

                <Divider sx={{ mb: 2.5 }} />
                <Typography
                  variant="h6"
                  sx={{ mb: 1.75, fontWeight: 700, color: '#263247' }}
                >
                  Requested stay
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, minmax(0, 1fr))',
                    },
                    gap: 1.5,
                  }}
                >
                  <DetailItem
                    icon={<CalendarMonthOutlinedIcon />}
                    label="Check-in date"
                    value={formatDate(guest.checkInDate)}
                  />
                  <DetailItem
                    icon={<CalendarMonthOutlinedIcon />}
                    label="Check-out date"
                    value={formatDate(guest.checkOutDate)}
                  />
                  <Box sx={{ gridColumn: { sm: '1 / -1' } }}>
                    <DetailItem label="Address" value={guest.address || ''} />
                  </Box>
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
}
