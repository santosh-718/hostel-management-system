import { useEffect, useState } from 'react';
import {
  Dashboard,
  Hotel,
  BookOnline,
  People,
  Report,
  CleaningServices,
  Payments,
} from '@mui/icons-material';

import {
  Box,
  Typography,
} from '@mui/material';

import {
  Link,
  useLocation,
} from 'react-router-dom';
import { getGuests } from '../services/guestService';

export default function Sidebar() {
  const [hasSubmittedRegistration, setHasSubmittedRegistration] = useState(false);
  const location =
    useLocation();

  const role =
    localStorage.getItem(
      'role',
    );

  const user =
    JSON.parse(
      localStorage.getItem(
        'user',
      ) || '{}',
    );

  useEffect(() => {
    const email = localStorage.getItem('email')?.trim().toLowerCase();
    if (role !== 'USER' || !email) {
      return;
    }

    let active = true;
    const checkRegistration = async () => {
      try {
        const guests = await getGuests();
        const hasRegistration = guests.some(
          (guest: { email?: string }) =>
            guest.email?.trim().toLowerCase() === email,
        );
        if (active) {
          setHasSubmittedRegistration(hasRegistration);
        }
      } catch (error) {
        console.error('Unable to check guest registration for sidebar:', error);
      }
    };

    void checkRegistration();
    return () => {
      active = false;
    };
  }, [role]);

  const menuItems =
    role === 'ADMIN'
      ? [
          {
            title: 'Dashboard',
            path: '/dashboard',
            icon: <Dashboard />,
          },
          {
            title: 'Rooms',
            path: '/rooms',
            icon: <Hotel />,
          },
          {
            title: 'Bookings',
            path: '/bookings',
            icon: <BookOnline />,
          },
          {
            title: 'Payments',
            path: '/payments',
            icon: <Payments />,
          },
          {
            title: 'Guests',
            path: '/guests',
            icon: <People />,
          },
          {
            title: 'Complaints',
            path: '/complaints',
            icon: <Report />,
          },
          {
            title: 'Housekeeping',
            path: '/housekeeping',
            icon: <CleaningServices />,
          },
        ]
      : [
          {
            title: 'Dashboard',
            path: '/user-dashboard',
            icon: <Dashboard />,
          },
          {
            title:
              'Guest Registration',
            path:
              '/guest-registration',
            icon: <People />,
          },
          {
            title:
              'My Registration',
            path:
              '/my-registration',
            icon: <People />,
          },
          {
            title: 'My Booking',
            path: '/my-booking',
            icon: <BookOnline />,
          },
          {
            title: 'My Payments',
            path: '/my-payments',
            icon: <Payments />,
          },
        ];

  return (
    <Box
      sx={{
        width: { xs: 64, md: 280 },
        minWidth: { xs: 64, md: 280 },
        flexShrink: 0,
        boxSizing: 'border-box',
        height: '100dvh',
        position: 'sticky',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        background:
          'linear-gradient(180deg,#111827,#1F2937)',
        color: '#fff',
        p: { xs: 1, md: 3 },
      }}
    >
      <Box
        sx={{
          mb: { xs: 2, md: 5 },
          textAlign: { xs: 'center', md: 'left' },
        }}
      >
        <Typography
          component="span"
          aria-hidden="true"
          sx={{ display: { xs: 'block', md: 'none' }, fontSize: 24 }}
        >
          🏨
        </Typography>
        <Typography
          component="h2"
          variant="h5"
          sx={{ display: { xs: 'none', md: 'block' }, fontWeight: 700 }}
        >
          🏨 Hostel Hub
        </Typography>

        <Typography
          variant="body2"
          sx={{
            display: { xs: 'none', md: 'block' },
            color: '#9CA3AF',
            mt: 0.5,
          }}
        >
          Management Portal
        </Typography>
      </Box>

      <Typography
        sx={{
          display: { xs: 'none', md: 'block' },
          fontSize: 12,
          color: '#9CA3AF',
          textTransform:
            'uppercase',
          letterSpacing: 1,
          mb: 2,
        }}
      >
        Main Menu
      </Typography>

      {menuItems
        .filter(
          (item) =>
            item.path !== '/guest-registration' ||
            !hasSubmittedRegistration,
        )
        .map(
        (item) => {
          const isActive =
            location.pathname ===
            item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              aria-label={item.title}
              title={item.title}
              style={{
                textDecoration:
                  'none',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  gap: 2,
                  p: { xs: 1.5, md: 1.5 },
                  mb: 1,
                  borderRadius: 2,
                  color: '#fff',

                  background:
                    isActive
                      ? '#2563EB'
                      : 'transparent',

                  boxShadow:
                    isActive
                      ? '0 4px 14px rgba(37,99,235,.35)'
                      : 'none',

                  transition:
                    'all .2s ease',

                  '&:hover': {
                    background:
                      isActive
                        ? '#2563EB'
                        : '#374151',
                  },
                }}
              >
                {item.icon}

                <Typography
                  component="span"
                  sx={{
                    display: { xs: 'none', md: 'inline' },
                    fontWeight:
                      isActive ? 600 : 400,
                  }}
                >
                  {item.title}
                </Typography>
              </Box>
            </Link>
          );
        },
      )}

      <Box
        sx={{
          mt: 'auto',
          display: { xs: 'none', md: 'block' },
          pt: 3,
          borderTop:
            '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Typography
          component="div"
          sx={{ fontWeight: 600 }}
        >
          {user.name ||
            user.email ||
            'User'}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: '#9CA3AF',
          }}
        >
          {role}
        </Typography>
      </Box>
    </Box>
  );
}