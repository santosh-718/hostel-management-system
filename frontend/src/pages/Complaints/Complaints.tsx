import { useState } from 'react';

import Layout from '../../components/Layout';

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';

import { DataGrid } from '@mui/x-data-grid';

export default function Complaints() {
  const [open, setOpen] = useState(false);

  const [guestName, setGuestName] =
    useState('');

  const [roomNumber, setRoomNumber] =
    useState('');

  const [category, setCategory] =
    useState('');

  const [priority, setPriority] =
    useState('MEDIUM');

  const [description, setDescription] =
    useState('');

  const [rows, setRows] = useState([
    {
      id: 1,
      complaintId: 'CMP001',
      guestName: 'Santosh',
      roomNumber: '101',
      category: 'Internet',
      priority: 'HIGH',
      status: 'OPEN',
    },
    {
      id: 2,
      complaintId: 'CMP002',
      guestName: 'Alex',
      roomNumber: '102',
      category: 'Cleaning',
      priority: 'MEDIUM',
      status: 'RESOLVED',
    },
  ]);

  const handleSaveComplaint = () => {
    if (
      !guestName ||
      !roomNumber ||
      !category ||
      !description
    ) {
      alert(
        'Please fill all required fields',
      );
      return;
    }

    const newComplaint = {
      id: rows.length + 1,
      complaintId: `CMP00${rows.length + 1}`,
      guestName,
      roomNumber,
      category,
      priority,
      description,
      status: 'OPEN',
    };

    setRows([...rows, newComplaint]);

    setGuestName('');
    setRoomNumber('');
    setCategory('');
    setPriority('MEDIUM');
    setDescription('');

    setOpen(false);
  };

  const columns = [
    {
      field: 'complaintId',
      headerName: 'Complaint ID',
      flex: 1,
    },
    {
      field: 'guestName',
      headerName: 'Guest',
      flex: 1.5,
    },
    {
      field: 'roomNumber',
      headerName: 'Room',
      flex: 1,
    },
    {
      field: 'category',
      headerName: 'Category',
      flex: 1.5,
    },
    {
      field: 'priority',
      headerName: 'Priority',
      flex: 1,
      renderCell: (params: any) => (
        <Chip
          size="small"
          label={params.value}
          color={
            params.value === 'HIGH'
              ? 'error'
              : params.value ===
                'MEDIUM'
              ? 'warning'
              : 'success'
          }
        />
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params: any) => (
        <Chip
          size="small"
          label={params.value}
          color={
            params.value === 'OPEN'
              ? 'error'
              : params.value ===
                'IN_PROGRESS'
              ? 'warning'
              : 'success'
          }
        />
      ),
    },
  ];

  return (
    <Layout>
      <Typography
        variant="h4"
        fontWeight={700}
        mb={3}
      >
        Complaints Management
      </Typography>

      {/* Summary Cards */}

      <Grid
        container
        spacing={3}
        mb={3}
      >
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography>
                Total Complaints
              </Typography>

              <Typography
                variant="h4"
                fontWeight={700}
              >
                {rows.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography>
                Open
              </Typography>

              <Typography
                variant="h4"
                color="error.main"
              >
                {
                  rows.filter(
                    (c) =>
                      c.status === 'OPEN',
                  ).length
                }
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography>
                Resolved
              </Typography>

              <Typography
                variant="h4"
                color="success.main"
              >
                {
                  rows.filter(
                    (c) =>
                      c.status ===
                      'RESOLVED',
                  ).length
                }
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Header */}

      <Box
        display="flex"
        justifyContent="space-between"
        mb={2}
      >
        <Typography
          variant="h5"
          fontWeight={600}
        >
          Complaints
        </Typography>

        <Button
          variant="contained"
          onClick={() =>
            setOpen(true)
          }
        >
          Raise Complaint
        </Button>
      </Box>

      {/* Table */}

      <Card>
        <Box sx={{ height: 500 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[
              5,
              10,
              20,
            ]}
          />
        </Box>
      </Card>

      {/* Add Complaint Dialog */}

      <Dialog
        open={open}
        onClose={() =>
          setOpen(false)
        }
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Raise Complaint
        </DialogTitle>

        <DialogContent>
          <Grid
            container
            spacing={2}
            sx={{ mt: 1 }}
          >
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Guest Name"
                value={guestName}
                onChange={(e) =>
                  setGuestName(
                    e.target.value,
                  )
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Room Number"
                value={roomNumber}
                onChange={(e) =>
                  setRoomNumber(
                    e.target.value,
                  )
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Category"
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value,
                  )
                }
              >
                <MenuItem value="Internet">
                  Internet
                </MenuItem>

                <MenuItem value="Cleaning">
                  Cleaning
                </MenuItem>

                <MenuItem value="Electrical">
                  Electrical
                </MenuItem>

                <MenuItem value="Plumbing">
                  Plumbing
                </MenuItem>

                <MenuItem value="Furniture">
                  Furniture
                </MenuItem>

                <MenuItem value="Other">
                  Other
                </MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Priority"
                value={priority}
                onChange={(e) =>
                  setPriority(
                    e.target.value,
                  )
                }
              >
                <MenuItem value="LOW">
                  Low
                </MenuItem>

                <MenuItem value="MEDIUM">
                  Medium
                </MenuItem>

                <MenuItem value="HIGH">
                  High
                </MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value,
                  )
                }
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() =>
              setOpen(false)
            }
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={
              handleSaveComplaint
            }
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}