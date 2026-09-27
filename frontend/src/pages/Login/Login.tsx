import { useState } from 'react';

import {
  Box,
  Button,
  Card,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';

import { FaHotel } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [role, setRole] =
    useState('USER');

  const handleLogin = async () => {
    if (!email || !password) {
      alert(
        'Please enter Email and Password',
      );
      return;
    }

    try {
      const response =
        await login(
          email,
          password,
          role,
        );

      if (
        !response.success
      ) {
        alert(
          response.message,
        );
        return;
      }

      localStorage.setItem(
        'user',
        JSON.stringify(
          response.user,
        ),
      );

      localStorage.setItem(
        'role',
        response.user.role,
      );

      localStorage.setItem(
        'email',
        response.user.email,
      );

      if (
        response.user.role ===
        'ADMIN'
      ) {
        navigate(
          '/dashboard',
        );
      } else {
        navigate(
          '/user-dashboard',
        );
      }
    } catch (error) {
      console.error(error);

      alert(
        'Login failed',
      );
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg,#D6A88D 0%,#C69CBC 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 3,
      }}
    >
      <Card
        sx={{
          width: {
            xs: '100%',
            md: '1000px',
          },
          minHeight: '620px',
          display: 'flex',
          flexDirection: {
            xs: 'column',
            md: 'row',
          },
          overflow: 'hidden',
          borderRadius: '28px',
          boxShadow:
            '0 25px 45px rgba(0,0,0,0.25)',
        }}
      >
        {/* LEFT PANEL */}

        <Box
          sx={{
            flex: 1,
            background: '#fff',
            p: {
              xs: 4,
              md: 7,
            },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: '2rem',
                md: '3rem',
              },
              fontWeight: 700,
              color: '#1F2937',
              lineHeight: 1.2,
            }}
          >
            Welcome Back
          </Typography>

          <Typography
            sx={{
              mt: 1,
              color: '#6B7280',
              fontSize: '1rem',
            }}
          >
            Login to continue managing your
            hostel.
          </Typography>

          <TextField
            select
            label="Login As"
            margin="normal"
            fullWidth
            value={role}
            onChange={(e) =>
              setRole(
                e.target.value,
              )
            }
            sx={{
              mt: 5,
              '& .MuiOutlinedInput-root':
                {
                  borderRadius:
                    '12px',
                },
            }}
          >
            <MenuItem value="ADMIN">
              Admin
            </MenuItem>

            <MenuItem value="USER">
              User
            </MenuItem>
          </TextField>

          <TextField
            label="Email Address"
            margin="normal"
            fullWidth
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value,
              )
            }
            sx={{
              '& .MuiOutlinedInput-root':
                {
                  borderRadius:
                    '12px',
                },
            }}
          />

          <TextField
            label="Password"
            type="password"
            margin="normal"
            fullWidth
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value,
              )
            }
            sx={{
              '& .MuiOutlinedInput-root':
                {
                  borderRadius:
                    '12px',
                },
            }}
          />

          <Typography
            sx={{
              textAlign: 'right',
              mt: 1,
              color: '#7C3AED',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            Forgot Password?
          </Typography>

          <Button
            variant="contained"
            onClick={handleLogin}
            fullWidth
            sx={{
              mt: 4,
              height: '52px',
              borderRadius: '12px',
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              background:
                'linear-gradient(90deg,#A86B85,#8E5A72)',
            }}
          >
            Sign In
          </Button>

          <Button
fullWidth
sx={{ mt: 2 }}
onClick={() =>
navigate('/register')
}
>
Create Account
</Button>

          <Typography
            align="center"
            sx={{
              mt: 3,
              color: '#6B7280',
              fontSize: '0.85rem',
            }}
          >
            Demo Admin Login
          </Typography>

          <Typography
            align="center"
            sx={{
              color: '#6B7280',
              fontSize: '0.8rem',
            }}
          >
            admin@hostel.com / admin123
          </Typography>

          <Typography
            align="center"
            sx={{
              mt: 4,
              color: '#9CA3AF',
            }}
          >
            Hostel Management Platform
          </Typography>
        </Box>

        {/* RIGHT PANEL */}

        <Box
          sx={{
            flex: 1,
            position: 'relative',
            overflow: 'hidden',
            background:
              'linear-gradient(180deg,#F7C995 0%,#8262D8 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            p: 5,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 40,
              left: 50,
              width: 90,
              height: 90,
              borderRadius: '50%',
              bgcolor:
                'rgba(255,255,255,0.25)',
            }}
          />

          <FaHotel
            size={70}
            color="white"
          />

          <Typography
            sx={{
              fontSize: {
                xs: '2rem',
                md: '3.3rem',
              },
              fontWeight: 700,
              mt: 2,
            }}
          >
            Hostel Hub
          </Typography>

          <Typography
            sx={{
              mt: 2,
              maxWidth: '420px',
              textAlign: 'center',
              fontSize: '1.1rem',
              lineHeight: 1.7,
            }}
          >
            Manage rooms, bookings,
            guests, complaints and
            hostel operations from one
            modern platform.
          </Typography>

          <Box
            sx={{
              mt: 5,
              width: '100%',
              maxWidth: '420px',
              bgcolor:
                'rgba(255,255,255,0.15)',
              backdropFilter:
                'blur(15px)',
              borderRadius: '20px',
              padding: 3,
            }}
          >
            <Typography mb={1}>
              🏠 Real-Time Room Management
            </Typography>

            <Typography mb={1}>
              📅 Smart Booking System
            </Typography>

            <Typography mb={1}>
              👥 Guest Tracking
            </Typography>

            <Typography mb={1}>
              ⚙ Complaint Resolution
            </Typography>

            <Typography>
              🧹 Housekeeping Dashboard
            </Typography>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}