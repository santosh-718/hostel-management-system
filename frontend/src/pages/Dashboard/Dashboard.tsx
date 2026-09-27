import Layout from '../../components/Layout';

import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
} from '@mui/material';

import HotelIcon from '@mui/icons-material/Hotel';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import PeopleIcon from '@mui/icons-material/People';
import ReportIcon from '@mui/icons-material/Report';

export default function Dashboard() {
  const cards = [
    {
      title: 'Total Rooms',
      value: '120',
      color: '#2563eb',
      icon: <HotelIcon />,
    },
    {
      title: 'Active Bookings',
      value: '58',
      color: '#10b981',
      icon: <BookOnlineIcon />,
    },
    {
      title: 'Guests Checked-In',
      value: '42',
      color: '#f59e0b',
      icon: <PeopleIcon />,
    },
    {
      title: 'Open Complaints',
      value: '5',
      color: '#ef4444',
      icon: <ReportIcon />,
    },
  ];

  return (
    <Layout>
      {/* Main Statistics */}

      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid
            item
            xs={12}
            sm={6}
            lg={3}
            key={card.title}
          >
            <Card
              sx={{
                borderRadius: 4,
                boxShadow:
                  '0 10px 30px rgba(0,0,0,0.08)',
                transition:
                  'all .2s ease',

                '&:hover': {
                  transform:
                    'translateY(-4px)',
                },
              }}
            >
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography
                    color="text.secondary"
                  >
                    {card.title}
                  </Typography>

                  <Box
                    sx={{
                      color: card.color,
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>

                <Typography
                  variant="h3"
                  fontWeight={700}
                  sx={{
                    mt: 2,
                    color: card.color,
                  }}
                >
                  {card.value}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Updated Today
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Statistics */}

      <Grid
        container
        spacing={3}
        sx={{
          mt: 1,
          mb: 2,
        }}
      >
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography
                color="text.secondary"
              >
                Available Rooms
              </Typography>

              <Typography
                variant="h5"
                fontWeight={700}
              >
                75
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography
                color="text.secondary"
              >
                Maintenance Rooms
              </Typography>

              <Typography
                variant="h5"
                fontWeight={700}
              >
                5
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography
                color="text.secondary"
              >
                Today's Check-Ins
              </Typography>

              <Typography
                variant="h5"
                fontWeight={700}
              >
                12
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography
                color="text.secondary"
              >
                Today's Check-Outs
              </Typography>

              <Typography
                variant="h5"
                fontWeight={700}
              >
                8
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Occupancy + Activity */}

      <Grid
        container
        spacing={3}
      >
        <Grid
          item
          xs={12}
          lg={8}
        >
          <Card
            sx={{
              borderRadius: 4,
              height: 350,
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                mb={3}
              >
                Occupancy Overview
              </Typography>

              <Box
                sx={{
                  height: 250,
                  borderRadius: 3,
                  background:
                    'linear-gradient(135deg,#2563eb,#4f46e5)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                }}
              >
                <Typography
                  variant="h3"
                  fontWeight={700}
                >
                  82%
                </Typography>

                <Typography>
                  Room Occupancy Rate
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid
          item
          xs={12}
          lg={4}
        >
          <Card
            sx={{
              borderRadius: 4,
              height: 350,
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                mb={3}
              >
                Recent Activities
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection:
                    'column',
                  gap: 2,
                }}
              >
                <ActivityItem
                  title="Room 101 booked"
                  time="2 mins ago"
                />

                <ActivityItem
                  title="Guest checked-in"
                  time="15 mins ago"
                />

                <ActivityItem
                  title="Complaint raised"
                  time="30 mins ago"
                />

                <ActivityItem
                  title="Housekeeping completed"
                  time="1 hour ago"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

function ActivityItem({
  title,
  time,
}: {
  title: string;
  time: string;
}) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        background: '#f3f4f6',
      }}
    >
      <Typography
        fontWeight={600}
      >
        {title}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
      >
        {time}
      </Typography>
    </Box>
  );
}