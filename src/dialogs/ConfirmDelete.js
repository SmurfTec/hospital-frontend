import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core';
import React from 'react';

const ConfirmDelete = ({ open, toggleDialog, title = 'Confirm Delete', success }) => {
  return (
    <Dialog open={open} onClose={toggleDialog}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure you want to delete this item ?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button sx={{ color: '#fff' }} variant="contained" color="success" onClick={success}>
          Delete
        </Button>
        <Button variant="contained" color="error" onClick={toggleDialog}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDelete;
