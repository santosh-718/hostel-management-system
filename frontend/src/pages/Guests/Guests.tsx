
import Layout from '../../components/Layout';
import SearchBar from '../../components/SearchBar';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';



import {
getGuests,
createGuest,
updateGuest,
deleteGuest,
checkInGuest,
checkOutGuest,
approveGuest,
rejectGuest,
} from '../../services/guestService';

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
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';

import {
useEffect,
useState,
} from 'react';

import { DataGrid } from '@mui/x-data-grid';

import dayjs, { Dayjs } from 'dayjs';

import {
  LocalizationProvider,
  DatePicker,
} from '@mui/x-date-pickers';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function Guests() {
  const [open, setOpen] = useState(false);

  const [stayType, setStayType] =
    useState('DAILY');

  const [guestName, setGuestName] =
    useState('');

  const [email, setEmail] =
    useState('');

  const [phone, setPhone] =
    useState('');

  const [checkInDate, setCheckInDate] =
    useState<Dayjs | null>(dayjs());

  const [checkOutDate, setCheckOutDate] =
  useState<Dayjs | null>(null);

  const [aadhaarNumber,
    setAadhaarNumber] =
    useState('');

  const [
    emergencyContactName,
    setEmergencyContactName,
  ] = useState('');

  const [
    emergencyContactPhone,
    setEmergencyContactPhone,
  ] = useState('');

  const [address,
    setAddress] =
    useState('');

  const [organization,
    setOrganization] =
    useState('');

  const [
  selectedGuest,
  setSelectedGuest,
] = useState<any>(null);

const [
  detailsOpen,
  setDetailsOpen,
] = useState(false);

    const [
editingGuestId,
setEditingGuestId,
] = useState<string | null>(
null,
);

  const [rows, setRows] =
useState<any[]>([]);
 
useEffect(() => {
loadGuests();
}, []);
 
const loadGuests = async () => {
try {
const data =
await getGuests();
 
const formattedRows =
data.map(
(
guest: any,
index: number,
) => ({
id: index + 1,
...guest,
}),
);
 
setRows(formattedRows);
} catch (error) {
console.error(
'Error loading guests:',
error,
);
}
};

const handleEditGuest = (
  guest: any,
) => {
  setGuestName(
    guest.guestName,
  );

  setEmail(
    guest.email || '',
  );

  setPhone(
    guest.phone,
  );

  setStayType(
    guest.stayType,
  );

  setAadhaarNumber(
    guest.aadhaarNumber || '',
  );

  setEmergencyContactName(
    guest.emergencyContactName ||
      '',
  );

  setEmergencyContactPhone(
    guest.emergencyContactPhone ||
      '',
  );

  setAddress(
    guest.address || '',
  );

  setOrganization(
    guest.organization || '',
  );

  setEditingGuestId(
    guest.guestId,
  );

  setOpen(true);
};

const handleSaveGuest =
  async () => {
    if (
      !guestName ||
      !phone 
    ) {
      alert(
        'Please fill required fields'
      );
      return;
    }

    const newGuest = {
      guestId:
        `GST${Date.now()}`,
      guestName,
      email,
      phone,
      stayType,
      checkInDate:
        checkInDate?.format(
          'YYYY-MM-DD',
        ),
      checkOutDate: checkOutDate
  ? checkOutDate.format(
      'YYYY-MM-DD',
    )
  : null,
      aadhaarNumber,
      emergencyContactName,
      emergencyContactPhone,
      address,
      organization,
      status:
        'PENDING_APPROVAL',
    };

    try {
  if (
    editingGuestId
  ) {
    await updateGuest(
      editingGuestId,
      newGuest,
    );
  } else {
    await createGuest(
      newGuest,
    );
  }

  await loadGuests();

  setEditingGuestId(
    null,
  );

  setOpen(false);

  setGuestName('');
  setEmail('');
  setPhone('');
  setAadhaarNumber('');
  setEmergencyContactName('');
  setEmergencyContactPhone('');
  setAddress('');
  setOrganization('');
} catch (error) {
  console.error(
    'Error saving guest:',
    error,
  );
  }
};

const handleApproveGuest =
  async (
    guestId: string,
  ) => {
    try {
      await approveGuest(
        guestId,
      );

      await loadGuests();
    } catch (error) {
      console.error(error);
    }
  };

const handleRejectGuest =
  async (
    guestId: string,
  ) => {
    try {
      await rejectGuest(
        guestId,
      );

      await loadGuests();
    } catch (error) {
      console.error(error);
    }
  };

  const handleViewGuest = (
  guest: any,
) => {
  setSelectedGuest(
    guest,
  );

  setDetailsOpen(true);
};

  const handleDeleteGuest =
  async (
    guestId: string,
  ) => {
    const confirmed =
      window.confirm(
        'Delete this guest?',
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteGuest(
        guestId,
      );

      await loadGuests();
    } catch (error) {
      console.error(
        'Error deleting guest:',
        error,
      );
    }
  };

  const columns = [
    {
      field: 'guestId',
      headerName: 'Guest ID',
      flex: 1,
    },
    {
      field: 'guestName',
      headerName: 'Name',
      flex: 1.5,
    },
    {
      field: 'phone',
      headerName: 'Phone',
      flex: 1.3,
    },
    {
      field: 'stayType',
      headerName: 'Stay Type',
      flex: 1,
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
  params.value ===
  'PENDING_APPROVAL'
    ? 'warning'
    : params.value ===
      'APPROVED'
    ? 'success'
    : params.value ===
      'REJECTED'
    ? 'error'
    : 'default'
}
        />
      ),
    },
    {
  field: 'actions',
  headerName: 'Actions',
  flex: 1.5,
  sortable: false,
  align: 'center',
  headerAlign: 'center',

  renderCell: (
    params: any,
  ) => {
    const isPending =
      params.row.status ===
      'PENDING_APPROVAL';

    return (
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          justifyContent:
            'center',
          width: '100%',
        }}
      >
        <Tooltip title="View Details">
          <IconButton
            color="info"
            onClick={() =>
              handleViewGuest(
                params.row,
              )
            }
          >
            <VisibilityIcon />
          </IconButton>
        </Tooltip>

        {isPending ? (
          <>
            <Tooltip title="Approve Guest">
              <IconButton
                color="success"
                onClick={() =>
                  handleApproveGuest(
                    params.row.guestId,
                  )
                }
              >
                <CheckCircleIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Reject Guest">
              <IconButton
                color="error"
                onClick={() =>
                  handleRejectGuest(
                    params.row.guestId,
                  )
                }
              >
                <CancelIcon />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <>
            <Tooltip title="Edit Guest">
              <IconButton
                color="primary"
                onClick={() =>
                  handleEditGuest(
                    params.row,
                  )
                }
              >
                <EditIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete Guest">
              <IconButton
                color="error"
                onClick={() =>
                  handleDeleteGuest(
                    params.row.guestId,
                  )
                }
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Box>
    );
  },
}
  ];

  return (
    <Layout>
      <Typography
        variant="h4"
        fontWeight={700}
        mb={3}
      >
        Guest Management
      </Typography>

      <Grid
        container
        spacing={3}
        mb={3}
      >
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography>
                Total Guests
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
                Daily Guests
              </Typography>

              <Typography
                variant="h4"
                color="info.main"
              >
                {
                  rows.filter(
                    (g: any) =>
                      g.stayType ===
                      'DAILY',
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
                Monthly Guests
              </Typography>

              <Typography
                variant="h4"
                color="success.main"
              >
                {
                  rows.filter(
                    (g: any) =>
                      g.stayType ===
                      'MONTHLY',
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
          Guests
        </Typography>

        <Button
  variant="contained"
  onClick={() => {
    setEditingGuestId(
      null,
    );

    setGuestName('');
    setEmail('');
    setPhone('');
    setAadhaarNumber('');
    setEmergencyContactName('');
    setEmergencyContactPhone('');
    setAddress('');
    setOrganization('');

    setOpen(true);
  }}
>
  Add Guest
</Button>
      </Box>

      <Card>
        <Box sx={{ height: 500 }}>
          <DataGrid
            rows={rows}
            columns={columns}
          />
        </Box>
      </Card>

      <Dialog
        open={open}
        onClose={() =>
          setOpen(false)
        }
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {editingGuestId
          ? 'Edit Guest'
          : 'Add Guest'}
         </DialogTitle> 

        <DialogContent>

          <RadioGroup
            row
            value={stayType}
            onChange={(e) =>
              setStayType(
                e.target.value,
              )
            }
          >
            <FormControlLabel
              value="DAILY"
              control={<Radio />}
              label="Daily Guest"
            />

            <FormControlLabel
              value="MONTHLY"
              control={<Radio />}
              label="Monthly Guest"
            />
          </RadioGroup>

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
                label="Email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value,
                  )
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={phone}
                onChange={(e) =>
                  setPhone(
                    e.target.value,
                  )
                }
              />
            </Grid>
          </Grid>

          <LocalizationProvider
            dateAdapter={AdapterDayjs}
          >
            <Grid
              container
              spacing={2}
              sx={{ mt: 1 }}
            >
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Check-In Date"
                  value={checkInDate}
                  onChange={(value) =>
                    setCheckInDate(
                      value,
                    )
                  }
                  sx={{
                    width: '100%',
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <DatePicker
                  label={
  stayType === 'MONTHLY'
    ? 'Expected Leaving Date (Optional)'
    : 'Check-Out Date (Optional)'
}
                  value={checkOutDate}
                  onChange={(value) =>
                    setCheckOutDate(
                      value,
                    )
                  }
                  sx={{
                    width: '100%',
                  }}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>

          {stayType ===
            'MONTHLY' && (
            <Grid
              container
              spacing={2}
              sx={{ mt: 2 }}
            >
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Aadhaar Number"
                  value={
                    aadhaarNumber
                  }
                  onChange={(e) =>
                    setAadhaarNumber(
                      e.target.value,
                    )
                  }
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Company / College"
                  value={
                    organization
                  }
                  onChange={(e) =>
                    setOrganization(
                      e.target.value,
                    )
                  }
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Emergency Contact Name"
                  value={
                    emergencyContactName
                  }
                  onChange={(e) =>
                    setEmergencyContactName(
                      e.target.value,
                    )
                  }
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Emergency Contact Number"
                  value={
                    emergencyContactPhone
                  }
                  onChange={(e) =>
                    setEmergencyContactPhone(
                      e.target.value,
                    )
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Address"
                  value={address}
                  onChange={(e) =>
                    setAddress(
                      e.target.value,
                    )
                  }
                />
              </Grid>
            </Grid>
          )}
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
                  handleSaveGuest
                    }
              >
              {editingGuestId
              ? 'Update'
              : 'Save'}
           </Button>
        </DialogActions>
      </Dialog>
      <Dialog
  open={detailsOpen}
  onClose={() =>
    setDetailsOpen(false)
  }
  maxWidth="md"
  fullWidth
>
  <DialogTitle>
    Guest Details
  </DialogTitle>

  <DialogContent>
    {selectedGuest && (
      <Box sx={{ mt: 1 }}>
        <Typography>
          <strong>Guest ID:</strong>{' '}
          {selectedGuest.guestId}
        </Typography>

        <Typography>
          <strong>Name:</strong>{' '}
          {selectedGuest.guestName}
        </Typography>

        <Typography>
          <strong>Email:</strong>{' '}
          {selectedGuest.email}
        </Typography>

        <Typography>
          <strong>Phone:</strong>{' '}
          {selectedGuest.phone}
        </Typography>

        <Typography>
          <strong>Stay Type:</strong>{' '}
          {selectedGuest.stayType}
        </Typography>

        <Typography>
          <strong>Aadhaar:</strong>{' '}
          {selectedGuest.aadhaarNumber}
        </Typography>

        <Typography>
          <strong>Organization:</strong>{' '}
          {selectedGuest.organization}
        </Typography>

        <Typography>
          <strong>Emergency Contact:</strong>{' '}
          {selectedGuest.emergencyContactName}
        </Typography>

        <Typography>
          <strong>Emergency Phone:</strong>{' '}
          {selectedGuest.emergencyContactPhone}
        </Typography>

        <Typography>
          <strong>Address:</strong>{' '}
          {selectedGuest.address}
        </Typography>

        <Typography>
          <strong>Status:</strong>{' '}
          {selectedGuest.status}
        </Typography>
      </Box>
    )}
  </DialogContent>

  <DialogActions>
    <Button
      onClick={() =>
        setDetailsOpen(false)
      }
    >
      Close
    </Button>
  </DialogActions>
</Dialog>
    </Layout>
  );
}