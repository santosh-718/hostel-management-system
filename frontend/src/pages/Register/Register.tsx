import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import { FaHotel } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { register } from '../../services/authService';

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2.5,
    backgroundColor: '#fff',
  },
};

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      const response = await register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
      });

      if (!response.success) {
        alert(response.message);
        return;
      }

      alert('Registration successful. You can now sign in.');
      navigate('/');
    } catch (error) {
      console.error('Unable to create account:', error);
      alert('Unable to create your account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        px: { xs: 2, sm: 3 },
        py: { xs: 3, sm: 5 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5e7df 0%, #eee6f1 100%)',
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 1160,
          minHeight: { md: 700 },
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          overflow: 'hidden',
          borderRadius: { xs: 3, sm: 4 },
          boxShadow: '0 24px 65px rgba(54, 43, 61, 0.18)',
        }}
      >
        <Box
          component="form"
          onSubmit={handleRegister}
          sx={{
            flex: { md: 1.45 },
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#fff',
          }}
        >
          <CardContent
            sx={{
              width: '100%',
              p: { xs: 3, sm: 5, md: 7 },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: '#8e5a72',
                mb: 4,
              }}
            >
              <FaHotel size={21} />
              <Typography sx={{ fontWeight: 750, letterSpacing: 0.2 }}>
                Hostel Hub
              </Typography>
            </Box>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: '#252938',
                letterSpacing: '-0.03em',
              }}
            >
              Create your account
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1, mb: 3.5 }}>
              Get started with your personal hostel portal.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.25 }}>
              <TextField
                required
                fullWidth
                autoComplete="name"
                label="Full name"
                placeholder="Enter your full name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                sx={fieldSx}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlineRoundedIcon sx={{ color: '#9aa1ae' }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                required
                fullWidth
                type="email"
                autoComplete="email"
                label="Email address"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                sx={fieldSx}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlinedIcon sx={{ color: '#9aa1ae' }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                required
                fullWidth
                type="tel"
                autoComplete="tel"
                label="Phone number"
                placeholder="Enter your contact number"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                sx={fieldSx}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneOutlinedIcon sx={{ color: '#9aa1ae' }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                required
                fullWidth
                type="password"
                autoComplete="new-password"
                label="Password"
                placeholder="Create a password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                sx={fieldSx}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon sx={{ color: '#9aa1ae' }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                required
                fullWidth
                type="password"
                autoComplete="new-password"
                label="Confirm password"
                placeholder="Enter your password again"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                error={Boolean(confirmPassword) && password !== confirmPassword}
                helperText={
                  confirmPassword && password !== confirmPassword
                    ? 'Passwords do not match'
                    : ' '
                }
                sx={fieldSx}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon sx={{ color: '#9aa1ae' }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={submitting}
              sx={{
                mt: 1,
                height: 52,
                borderRadius: 2.5,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 700,
                background: 'linear-gradient(90deg, #a86b85, #8e5a72)',
                boxShadow: '0 8px 18px rgba(142, 90, 114, 0.22)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #995e78, #7d4d64)',
                },
              }}
            >
              {submitting ? 'Creating account…' : 'Create account'}
            </Button>

            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ mt: 2.5 }}
            >
              Already have an account?{' '}
              <Box
                component="button"
                type="button"
                onClick={() => navigate('/')}
                sx={{
                  p: 0,
                  border: 0,
                  background: 'none',
                  color: '#8e5a72',
                  font: 'inherit',
                  fontWeight: 700,
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Sign in
              </Box>
            </Typography>
          </CardContent>
        </Box>

        <Box
          sx={{
            flex: { md: 0.75 },
            minHeight: { xs: 190, md: 'auto' },
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            p: { xs: 3, sm: 4.5 },
            color: '#fff',
            background: 'linear-gradient(155deg, #8262d8 0%, #8e5a72 52%, #d6a88d 100%)',
            '&::before': {
              content: '""',
              position: 'absolute',
              width: 340,
              height: 340,
              right: -115,
              top: -135,
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50%',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              width: 230,
              height: 230,
              right: -58,
              top: -80,
              border: '1px solid rgba(255,255,255,0.16)',
              borderRadius: '50%',
            },
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: { xs: 25, sm: 45 },
              left: { xs: 25, sm: 45 },
              width: 58,
              height: 58,
              display: 'grid',
              placeItems: 'center',
              borderRadius: 3,
              border: '1px solid rgba(255,255,255,0.32)',
              backgroundColor: 'rgba(255,255,255,0.14)',
            }}
          >
            <FaHotel size={25} />
          </Box>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography
              variant="overline"
              sx={{ color: 'rgba(255,255,255,0.78)', letterSpacing: 2, fontWeight: 700 }}
            >
              WELCOME TO HOSTEL HUB
            </Typography>
            <Typography
              variant="h4"
              sx={{
                mt: 1,
                maxWidth: 380,
                fontWeight: 800,
                lineHeight: 1.2,
              }}
            >
              A comfortable stay starts here.
            </Typography>
            <Typography
              sx={{
                mt: 1.5,
                maxWidth: 390,
                color: 'rgba(255,255,255,0.82)',
                lineHeight: 1.7,
              }}
            >
              Create an account to submit your stay details and keep track of
              your registration and room allocation.
            </Typography>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
