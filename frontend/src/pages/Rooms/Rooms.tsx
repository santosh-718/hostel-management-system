import { useEffect, useState } from 'react';

import Layout from '../../components/Layout';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';

import {
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} from '../../services/roomService';

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
  TextField,
  Typography,
  IconButton,
} from '@mui/material';

import { DataGrid } from '@mui/x-data-grid';

export default function Rooms() {
  const [open, setOpen] =
    useState(false);

  const [
    editingRoomNumber,
    setEditingRoomNumber,
  ] = useState<string | null>(
    null,
  );

  const [
  deleteRoomNumber,
  setDeleteRoomNumber,
] = useState<string | null>(
  null,
);

const [
  deleting,
  setDeleting,
] = useState(false);

  const [roomNumber, setRoomNumber] =
    useState('');

  const [roomType, setRoomType] =
    useState('');

  const [capacity, setCapacity] =
    useState('');

  const [price, setPrice] =
    useState('');

  const [rows, setRows] =
    useState<any[]>([]);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const data =
        await getRooms();

      const formattedRows =
        data.map(
          (
            room: any,
            index: number,
          ) => ({
            id: index + 1,
            roomNumber:
              room.roomNumber,
            roomType:
              room.roomType,
            capacity:
  room.capacity,

occupied:
  room.occupied ?? 0,

available:
  room.available ??
  room.capacity,

price:
  room.price ??
  room.pricePerNight,
            status:
              room.status,
          }),
        );

      setRows(formattedRows);
    } catch (error) {
      console.error(
        'Error loading rooms:',
        error,
      );
    }
  };

  const handleEditRoom = (
    room: any,
  ) => {
    setRoomNumber(
      room.roomNumber,
    );

    setRoomType(
      room.roomType,
    );

    setCapacity(
      room.capacity.toString(),
    );

    setPrice(
      room.price.toString(),
    );

    setEditingRoomNumber(
      room.roomNumber,
    );

    setOpen(true);
  };

  const handleDeleteRoom = (
  roomNumber: string,
) => {
  setDeleteRoomNumber(
    roomNumber,
  );
};

const confirmDeleteRoom =
  async () => {
    if (!deleteRoomNumber)
      return;

    try {
      setDeleting(true);

      await deleteRoom(
        deleteRoomNumber,
      );

      await loadRooms();

      setDeleteRoomNumber(
        null,
      );
    } catch (error) {
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  const handleSaveRoom =
    async () => {
      if (
        !roomNumber ||
        !roomType ||
        !capacity ||
        !price
      ) {
        alert(
          'Please fill all fields',
        );

        return;
      }

      const roomData = {
  roomNumber,
  roomType,
  capacity:
    Number(capacity),

  occupied: 0,

  available:
    Number(capacity),

  price:
    Number(price),

  status:
    'AVAILABLE',
};

      try {
        if (
          editingRoomNumber
        ) {
          await updateRoom(
            editingRoomNumber,
            roomData,
          );
        } else {
          await createRoom(
            roomData,
          );
        }

        await loadRooms();

        setRoomNumber('');
        setRoomType('');
        setCapacity('');
        setPrice('');

        setEditingRoomNumber(
          null,
        );

        setOpen(false);
      } catch (error) {
        console.error(
          'Error saving room:',
          error,
        );
      }
    };

  const columns = [
    {
      field: 'roomNumber',
      headerName:
        'Room Number',
      flex: 1,
    },
    {
      field: 'roomType',
      headerName:
        'Room Type',
      flex: 1,
    },
    {
      field: 'capacity',
      headerName:
        'Capacity',
      flex: 1,
    },
    {
  field: 'occupied',
  headerName:
    'Occupied',
  flex: 1,
},
{
  field: 'available',
  headerName:
    'Available',
  flex: 1,
},
    {
      field: 'price',
      headerName: 'Price',
      flex: 1,
      renderCell: (
        params: any,
      ) => `₹${params.value}`,
    },
    {
      field: 'status',
      headerName:
        'Status',
      flex: 1,
      renderCell: (
        params: any,
      ) => (
        <Chip
          size="small"
          label={
            params.value
          }
          color={
            params.value ===
            'AVAILABLE'
              ? 'success'
              : params.value ===
                'OCCUPIED'
              ? 'warning'
              : 'error'
          }
        />
      ),
    },
    {
field: 'actions',
headerName: 'Actions',
flex: 1.2,
sortable: false,
 
renderCell: (
params: any,
) => (
<Box
sx={{
display: 'flex',
gap: 1,
alignItems: 'center',
}}
>
<IconButton
size="small"
onClick={() =>
handleEditRoom(
params.row,
)
}
sx={{
backgroundColor:
'#DBEAFE',
color: '#2563EB',
 
'&:hover': {
backgroundColor:
'#BFDBFE',
},
}}
>
<EditIcon
fontSize="small"
/>
</IconButton>
 
<IconButton
size="small"
onClick={() =>
handleDeleteRoom(
params.row
.roomNumber,
)
}
sx={{
backgroundColor:
'#FEE2E2',
color: '#DC2626',
 
'&:hover': {
backgroundColor:
'#FECACA',
},
}}
>
<DeleteIcon
fontSize="small"
/>
</IconButton>
</Box>
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
        Room Management
      </Typography>

      <Grid
        container
        spacing={3}
        mb={3}
      >
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography>
                Total Rooms
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

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography>
                Available
              </Typography>

              <Typography
                variant="h4"
                color="success.main"
              >
                {
                  rows.filter(
                    (room) =>
                      room.status ===
                      'AVAILABLE',
                  ).length
                }
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography>
                Occupied
              </Typography>

              <Typography
                variant="h4"
                color="warning.main"
              >
                {
                  rows.filter(
                    (room) =>
                      room.status ===
                      'OCCUPIED',
                  ).length
                }
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography>
                Maintenance
              </Typography>

              <Typography
                variant="h4"
                color="error.main"
              >
                {
                  rows.filter(
                    (room) =>
                      room.status ===
                      'MAINTENANCE',
                  ).length
                }
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box
        display="flex"
        justifyContent="space-between"
        mb={2}
      >
        <Typography
          variant="h5"
          fontWeight={600}
        >
          Rooms
        </Typography>

        <Button
          variant="contained"
          onClick={() => {
            setEditingRoomNumber(
              null,
            );

            setRoomNumber('');

            setRoomType('');

            setCapacity('');

            setPrice('');

            setOpen(true);
          }}
        >
          Add Room
        </Button>
      </Box>

      <Card>
        <Box
          sx={{
            height: 500,
          }}
        >
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

      <Dialog
        open={open}
        onClose={() =>
          setOpen(false)
        }
        fullWidth
      >
        <DialogTitle>
          {editingRoomNumber
            ? 'Edit Room'
            : 'Add New Room'}
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Room Number"
            value={roomNumber}
            onChange={(e) =>
              setRoomNumber(
                e.target.value,
              )
            }
          />

          <TextField
            fullWidth
            margin="normal"
            label="Room Type"
            value={roomType}
            onChange={(e) =>
              setRoomType(
                e.target.value,
              )
            }
          />

          <TextField
            fullWidth
            margin="normal"
            type="number"
            label="Capacity"
            value={capacity}
            onChange={(e) =>
              setCapacity(
                e.target.value,
              )
            }
          />

          <TextField
            fullWidth
            margin="normal"
            type="number"
            label="Price"
            value={price}
            onChange={(e) =>
              setPrice(
                e.target.value,
              )
            }
          />
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
              handleSaveRoom
            }
          >
            {editingRoomNumber
              ? 'Update'
              : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
  open={
    deleteRoomNumber !== null
  }
  onClose={() =>
    setDeleteRoomNumber(
      null,
    )
  }
>
  <DialogTitle>
    Delete Room
  </DialogTitle>

  <DialogContent>
    <Typography>
      Are you sure you want
      to delete room{' '}
      <strong>
        {deleteRoomNumber}
      </strong>
      ?
    </Typography>
  </DialogContent>

  <DialogActions>
    <Button
      disabled={deleting}
      onClick={() =>
        setDeleteRoomNumber(
          null,
        )
      }
    >
      Cancel
    </Button>

    <Button
      color="error"
      variant="contained"
      disabled={deleting}
      onClick={
        confirmDeleteRoom
      }
      startIcon={
        deleting ? (
          <CircularProgress
            size={16}
            color="inherit"
          />
        ) : null
      }
    >
      {deleting
        ? 'Deleting...'
        : 'Delete'}
    </Button>
  </DialogActions>
</Dialog>
    </Layout>
  );
}