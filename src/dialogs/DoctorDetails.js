import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
} from '@material-ui/core';
import React from 'react';

const DoctorDetails = ({ open, toggleDialog, title = 'Doctor Details', doctor }) => {
  if (!doctor) return <></>;
  return (
    <Dialog open={open && Boolean(doctor)} onClose={toggleDialog}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          margin: 10,
          padding: 15,
          minWidth: 400
        }}
      >
        <TextField variant="outlined" fullWidth type="text" value={doctor.fullName} label="Name" />
        <TextField variant="outlined" fullWidth type="text" value={doctor.email} label="Email" />
        <TextField
          variant="outlined"
          fullWidth
          type="text"
          value={doctor.specialization}
          label="Specialization"
        />
        <TextField
          variant="outlined"
          fullWidth
          type="text"
          value={doctor.address}
          label="Address"
        />
        <TextField
          variant="outlined"
          fullWidth
          type="text"
          value={doctor.contact}
          label="Contact"
        />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="error" onClick={toggleDialog}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DoctorDetails;
