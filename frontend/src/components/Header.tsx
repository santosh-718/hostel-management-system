import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Box,
  IconButton,
  Badge,
} from '@mui/material';

import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

import { useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();

  const pageName =
    location.pathname
      .replace('/', '')
      .replace('-', ' ')
      .replace(/\b\w/g, (c) =>
        c.toUpperCase(),
      ) || 'Dashboard';

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: '#ffffff',
        color: '#111827',
        borderBottom:
          '1px solid #E5E7EB',
      }}
    >
      <Toolbar
        sx={{
          justifyContent:
            'space-between',
          gap: 1,
          px: { xs: 1.5, sm: 3 },
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: '1.25rem', sm: '1.75rem' },
              fontWeight: 700,
              lineHeight: 1.2,
              overflowWrap: 'anywhere',
            }}
          >
            {pageName}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: '#6B7280',
            }}
          >
            Welcome to Hostel Hub
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 0.5, sm: 2 },
          }}
        >
          <IconButton>
            <Badge
              badgeContent={3}
              color="error"
            >
              <NotificationsNoneIcon />
            </Badge>
          </IconButton>

          <Box
            sx={{
              display: { xs: 'none', sm: 'block' },
              textAlign: 'right',
            }}
          >
            <Typography
              component="span"
              sx={{ fontWeight: 600 }}
            >
              Santosh
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: '#6B7280',
              }}
            >
              Administrator
            </Typography>
          </Box>

          <Avatar
            sx={{
              bgcolor: '#2563EB',
            }}
          >
            S
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}