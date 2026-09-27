import { useEffect, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ContactPhoneOutlinedIcon from '@mui/icons-material/ContactPhoneOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { createGuestRegistration, getGuests } from '../../services/guestService';

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2.5,
    backgroundColor: '#fff',
  },
};

interface FormSectionProps {
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
}

interface GuestRegistrationRecord {
  email?: string;
  status?: string;
}

function FormSection({
  icon,
  title,
  description,
  children,
}: FormSectionProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        borderColor: '#e7eaf0',
        boxShadow: '0 8px 24px rgba(23, 37, 84, 0.035)',
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            mb: 3,
          }}
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              display: 'grid',
              placeItems: 'center',
              borderRadius: 2.5,
              color: '#4256a6',
              backgroundColor: '#eef1ff',
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#172554' }}>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </Box>
        </Box>
        {children}
      </CardContent>
    </Card>
  );
}

export default function GuestRegistration() {
  const navigate = useNavigate();
  const [userEmail] = useState(() => localStorage.getItem('email') || '');
  const [existingRegistration, setExistingRegistration] =
    useState<GuestRegistrationRecord | null>(null);
  const [checkingRegistration, setCheckingRegistration] = useState(true);
  const [registrationCheckError, setRegistrationCheckError] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [organization, setOrganization] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    const checkRegistration = async () => {
      if (!userEmail.trim()) {
        setRegistrationCheckError(true);
        setCheckingRegistration(false);
        return;
      }

      try {
        const guests = await getGuests();
        const registration = guests.find(
          (guest: GuestRegistrationRecord) =>
            guest.email?.trim().toLowerCase() === userEmail.trim().toLowerCase(),
        );
        if (active) {
          setExistingRegistration(registration || null);
          setRegistrationCheckError(false);
        }
      } catch (error) {
        console.error('Unable to check for an existing guest registration:', error);
        if (active) {
          setRegistrationCheckError(true);
        }
      } finally {
        if (active) {
          setCheckingRegistration(false);
        }
      }
    };

    void checkRegistration();
    return () => {
      active = false;
    };
  }, [userEmail]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (existingRegistration || checkingRegistration || registrationCheckError) {
      return;
    }

    if (!guestName.trim() || !phone.trim() || !checkInDate) {
      alert('Please fill required fields');
      return;
    }

    setSubmitting(true);
    try {
      const result = await createGuestRegistration({
        guestId: `GST${Date.now()}`,
        guestName: guestName.trim(),
        email: userEmail || email,
        phone: phone.trim(),
        checkInDate,
        checkOutDate: checkOutDate || null,
        aadhaarNumber,
        organization,
        emergencyContactName,
        emergencyContactPhone,
        address,
        stayType: 'MONTHLY',
        status: 'PENDING_APPROVAL',
      });

      if (result.success === false) {
        setExistingRegistration(result.data || { status: 'PENDING_APPROVAL' });
        return;
      }

      alert('Registration submitted successfully. It is now pending admin approval.');
      navigate('/my-registration');
    } catch (error) {
      console.error('Unable to submit guest registration:', error);
      alert('Unable to submit registration');
    } finally {
      setSubmitting(false);
    }
  };

  if (checkingRegistration || registrationCheckError || existingRegistration) {
    return (
      <Layout>
        <Box sx={{ maxWidth: 800, mx: 'auto', py: { xs: 2, sm: 4 } }}>
          <Card sx={{ borderRadius: 3, border: '1px solid #e7eaf0', boxShadow: '0 8px 24px rgba(23, 37, 84, 0.05)' }}>
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              {checkingRegistration ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CircularProgress size={24} />
                  <Typography color="text.secondary">Checking your registration status…</Typography>
                </Box>
              ) : registrationCheckError ? (
                <Alert
                  severity="error"
                  action={
                    <Button color="inherit" onClick={() => window.location.reload()}>
                      Retry
                    </Button>
                  }
                >
                  We couldn’t verify your registration. Please retry before submitting.
                </Alert>
              ) : (
                <>
                  <Alert severity="info" sx={{ mb: 3 }}>
                    You have already submitted a guest registration. A second registration cannot be submitted from this account.
                  </Alert>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#263247' }}>
                    Registration already submitted
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    {existingRegistration?.status === 'REJECTED'
                      ? 'Your registration was rejected. Please contact the hostel administrator for assistance.'
                      : 'You can check the current approval status on your My Registration page.'}
                  </Typography>
                  {existingRegistration?.status && (
                    <Chip
                      label={existingRegistration.status}
                      color={
                        existingRegistration.status === 'APPROVED'
                          ? 'success'
                          : existingRegistration.status === 'REJECTED'
                            ? 'error'
                            : 'warning'
                      }
                      sx={{ mt: 2 }}
                    />
                  )}
                  <Box sx={{ display: 'flex', gap: 1.5, mt: 3, flexWrap: 'wrap' }}>
                    <Button variant="contained" onClick={() => navigate('/my-registration')}>
                      View my registration
                    </Button>
                    <Button variant="outlined" onClick={() => navigate('/user-dashboard')}>
                      Back to dashboard
                    </Button>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box
        sx={{
          maxWidth: 1080,
          mx: 'auto',
          pb: 4,
        }}
      >
        <Button
          startIcon={<ArrowBackRoundedIcon />}
          onClick={() => navigate('/user-dashboard')}
          sx={{
            mb: 2.5,
            px: 0,
            color: '#48546a',
            fontWeight: 600,
            '&:hover': { backgroundColor: 'transparent', color: '#3346a0' },
          }}
        >
          Back to dashboard
        </Button>

        <Box
          sx={{
            mb: 3,
            p: { xs: 3, sm: 4.5 },
            borderRadius: 3,
            backgroundColor: '#fff',
            border: '1px solid #e7eaf0',
            boxShadow: '0 8px 24px rgba(23, 37, 84, 0.035)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="overline"
                sx={{ letterSpacing: 1.8, color: '#8a6b55', fontWeight: 700 }}
              >
                YOUR STAY STARTS HERE
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  mt: 0.5,
                  fontWeight: 800,
                  color: '#263247',
                  fontSize: { xs: '1.8rem', sm: '2.25rem' },
                }}
              >
                Guest Registration
              </Typography>
              <Typography sx={{ mt: 1, maxWidth: 610, color: '#687386' }}>
                Share a few details so our team can review your stay request and prepare for your arrival.
              </Typography>
            </Box>
            <Chip
              icon={<AssignmentTurnedInOutlinedIcon />}
              label="Admin approval required"
              sx={{
                color: '#765739',
                backgroundColor: '#f8f3ec',
                border: '1px solid #eadfce',
                '& .MuiChip-icon': { color: '#9a7144' },
                fontWeight: 600,
              }}
            />
          </Box>
        </Box>

        <Alert
          severity="info"
          icon={<AssignmentTurnedInOutlinedIcon />}
          sx={{
            mb: 3,
            borderRadius: 2.5,
            border: '1px solid #dbe5ff',
            backgroundColor: '#f3f6ff',
            color: '#293c77',
            '& .MuiAlert-icon': { color: '#4256a6' },
          }}
        >
          Your request will remain <strong>Pending</strong> until an administrator reviews it.
          You can track its status from My Registration.
        </Alert>

        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <FormSection
              icon={<PersonOutlineRoundedIcon />}
              title="Personal details"
              description="Tell us who will be staying at the hostel."
            >
              <Grid container spacing={2.25}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    required
                    fullWidth
                    label="Guest name"
                    placeholder="Enter your full name"
                    value={guestName}
                    onChange={(event) => setGuestName(event.target.value)}
                    sx={fieldSx}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type="email"
                    label="Email address"
                    value={userEmail || email}
                    disabled={Boolean(userEmail)}
                    onChange={(event) => setEmail(event.target.value)}
                    helperText={userEmail ? 'Linked to your account' : undefined}
                    sx={fieldSx}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    required
                    fullWidth
                    type="tel"
                    label="Phone number"
                    placeholder="Enter your contact number"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    sx={fieldSx}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Aadhaar number"
                    placeholder="Enter your Aadhaar number"
                    value={aadhaarNumber}
                    onChange={(event) => setAadhaarNumber(event.target.value)}
                    sx={fieldSx}
                  />
                </Grid>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="Company or college"
                    placeholder="Where do you work or study?"
                    value={organization}
                    onChange={(event) => setOrganization(event.target.value)}
                    sx={fieldSx}
                  />
                </Grid>
              </Grid>
            </FormSection>

            <FormSection
              icon={<CalendarMonthOutlinedIcon />}
              title="Stay details"
              description="Choose the dates for your planned stay."
            >
              <Grid container spacing={2.25}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    required
                    fullWidth
                    type="date"
                    label="Check-in date"
                    slotProps={{ inputLabel: { shrink: true } }}
                    value={checkInDate}
                    onChange={(event) => setCheckInDate(event.target.value)}
                    sx={fieldSx}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Check-out date (optional)"
                    slotProps={{ inputLabel: { shrink: true } }}
                    value={checkOutDate}
                    onChange={(event) => setCheckOutDate(event.target.value)}
                    sx={fieldSx}
                  />
                </Grid>
              </Grid>
            </FormSection>

            <FormSection
              icon={<ContactPhoneOutlinedIcon />}
              title="Emergency contact"
              description="Add someone we can reach in case of an emergency."
            >
              <Grid container spacing={2.25}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Contact person"
                    placeholder="Emergency contact's name"
                    value={emergencyContactName}
                    onChange={(event) => setEmergencyContactName(event.target.value)}
                    sx={fieldSx}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type="tel"
                    label="Contact number"
                    placeholder="Emergency contact's phone"
                    value={emergencyContactPhone}
                    onChange={(event) => setEmergencyContactPhone(event.target.value)}
                    sx={fieldSx}
                  />
                </Grid>
              </Grid>
            </FormSection>

            <FormSection
              icon={<HomeOutlinedIcon />}
              title="Address"
              description="Provide your current residential address."
            >
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Residential address"
                placeholder="House or street, area, city, state and postal code"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                sx={fieldSx}
              />
            </FormSection>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column-reverse', sm: 'row' },
              justifyContent: 'space-between',
              gap: 1.5,
              mt: 3,
              p: { xs: 2, sm: 2.5 },
              borderRadius: 3,
              backgroundColor: '#fff',
              border: '1px solid #e7eaf0',
            }}
          >
            <Button
              type="button"
              variant="outlined"
              startIcon={<ArrowBackRoundedIcon />}
              onClick={() => navigate('/user-dashboard')}
              sx={{ minHeight: 48, borderRadius: 2.5, px: 2.5, fontWeight: 700 }}
            >
              Back to dashboard
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              sx={{
                minHeight: 48,
                borderRadius: 2.5,
                px: 3.5,
                fontWeight: 700,
                textTransform: 'none',
                background: 'linear-gradient(100deg, #354e9b, #586ed0)',
                boxShadow: '0 8px 18px rgba(53, 78, 155, 0.2)',
                '&:hover': {
                  background: 'linear-gradient(100deg, #293f87, #485fc0)',
                  boxShadow: '0 10px 22px rgba(53, 78, 155, 0.26)',
                },
              }}
            >
              {submitting ? 'Submitting…' : 'Submit registration'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}
