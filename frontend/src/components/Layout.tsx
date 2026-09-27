import { useState } from 'react';
import type { ReactNode } from 'react';

import Sidebar from './Sidebar';
import Header from './Header';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';

import LogoutIcon from '@mui/icons-material/Logout';


interface LayoutProps {
  children: ReactNode;
}

export default function Layout({
  children,
}: LayoutProps) {
  const [
    logoutOpen,
    setLogoutOpen,
  ] = useState(false);

  const user =
    JSON.parse(
      localStorage.getItem(
        'user',
      ) || '{}',
    );

  const openLogoutDialog =
    () => {
      setLogoutOpen(true);
    };

  const closeLogoutDialog =
    () => {
      setLogoutOpen(false);
    };

  const handleLogout = () => {
    localStorage.clear();
    window.location.replace('/');
  };

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        minHeight: '100dvh',
        overflowX: 'hidden',
        background: '#F9FAFB',
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Header />

        <Box
          sx={{
            display: 'flex',
            justifyContent:
              'space-between',
            alignItems:
              'center',
            background: '#fff',
            px: 3,
            py: 1.5,
            borderBottom:
              '1px solid #e5e7eb',
          }}
        >
          <Typography
            component="span"
            sx={{ fontWeight: 600 }}
          >
            Welcome,{' '}
            {user.name ||
              user.email ||
              'User'}
          </Typography>

          <Button
            variant="outlined"
            color="error"
            startIcon={
              <LogoutIcon />
            }
            onClick={
              openLogoutDialog
            }
          >
            Logout
          </Button>
        </Box>

        <div
          style={{
            flex: 1,
            minWidth: 0,
            padding: 'clamp(12px, 2.2vw, 24px)',
            overflowY: 'auto',
            overflowX: 'auto',
          }}
        >
          {children}
        </div>

        <footer
          style={{
            padding: '12px 24px',
            background: '#fff',
            borderTop:
              '1px solid #e5e7eb',
            color: '#6b7280',
            fontSize: '14px',
          }}
        >
          © 2026 Hostel Hub
        </footer>
      </div>

      <Dialog
        open={logoutOpen}
        onClose={
          closeLogoutDialog
        }
      >
        <DialogTitle>
          Confirm Logout
        </DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you want to
            log out?
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={
              closeLogoutDialog
            }
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={
              handleLogout
            }
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}