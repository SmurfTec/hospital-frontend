import React, { useState, useEffect, useContext } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import DateTimePicker from 'react-datetime-picker';
import { v4 as uuid } from 'uuid';
import { makeStyles } from '@material-ui/styles';
import { Divider } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import { toast } from 'react-toastify';
import { AuthContext } from 'contexts/AuthContext';

const useStyles = makeStyles((props) => ({
  Dialog: {
    '& .MuiDialog-paper': {
      minHeight: props.role === 'Task' && 450
    }
  },
  addBtn: {},
  cancelBtn: {}
}));

const AddorEditModal = (props) => {
  const { user } = useContext(AuthContext);

  const { isOpen, closeDialog, createNew, role, isEdit, editUser, updateUser, viewOnly } = props;
  const classes = useStyles(props);

  const initialState = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirm: '',
    symptoms: ''
  };

  const [state, setState] = useState(initialState);

  useEffect(() => {
    // TODO
    if (isEdit === true && editUser) {
      setState({
        name: editUser.name,
        email: editUser.email,
        description: editUser.description
      });
    } else {
      setState(initialState);
    }
  }, [editUser, isEdit]);

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    if (role === 'Appointment') {
      if (!state.symptoms || !state.symptoms.length > 0) {
        toast.error('Plz fill in all fields before creating Appointment');
        return;
      }

      if (isEdit)
        updateUser(editUser._id, {
          symptoms: state.symptoms
        });
      else
        createNew({
          symptoms: state.symptoms
        });
    } else if (isEdit) {
      updateUser(editUser._id, { name: state.name, email: state.email });
    } else {
      createNew(state);
    }
    e.preventDefault();
  };

  const handleClose = () => {
    setState(initialState);
    closeDialog();
  };

  return (
    <div>
      <Dialog
        className={classes.Dialog}
        open={isOpen}
        onClose={closeDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {isEdit ? `Edit ${editUser && role}` : `Add New ${role}`}
        </DialogTitle>
        <DialogContent>
          {role === 'Appointment' ? (
            <TextField
              autoFocus
              margin="dense"
              id="symptoms"
              label="Symptoms"
              type="text"
              fullWidth
              value={state.symptoms}
              name="symptoms"
              onChange={handleChange}
              disabled={viewOnly}
              multiline
            />
          ) : (
            <>
              {' '}
              <TextField
                autoFocus
                margin="dense"
                id="firstName"
                label="First Name"
                type="text"
                fullWidth
                value={state.firstName}
                name="firstName"
                onChange={handleChange}
                disabled={viewOnly}
              />
              <TextField
                autoFocus
                margin="dense"
                id="lastName"
                label="Last Name"
                type="text"
                fullWidth
                value={state.lastName}
                name="lastName"
                onChange={handleChange}
                disabled={viewOnly}
              />
            </>
          )}

          {(role === 'Doctor' || role === 'Employee') && (
            <TextField
              margin="dense"
              id="email"
              name="email"
              label="Email"
              type="email"
              fullWidth
              value={state.email}
              onChange={handleChange}
            />
          )}

          {((!isEdit && role === 'Doctor') || role === 'Employee') && (
            <>
              {!isEdit && (
                <>
                  {' '}
                  <TextField
                    margin="dense"
                    id="password"
                    name="password"
                    label="Password"
                    type="password"
                    fullWidth
                    value={state.password}
                    onChange={handleChange}
                  />
                  <TextField
                    margin="dense"
                    id="passwordConfirm"
                    name="passwordConfirm"
                    label="Password Confirm"
                    type="password"
                    fullWidth
                    value={state.passwordConfirm}
                    onChange={handleChange}
                  />
                </>
              )}
            </>
          )}
          {role === 'Manager' && (
            <>
              <TextField
                margin="dense"
                id="email"
                name="email"
                label="Email"
                type="email"
                fullWidth
                value={state.email}
                onChange={handleChange}
              />
              {!isEdit && (
                <>
                  <TextField
                    margin="dense"
                    id="password"
                    name="password"
                    label="Password"
                    type="password"
                    fullWidth
                    value={state.password}
                    onChange={handleChange}
                  />
                  <TextField
                    margin="dense"
                    id="passwordConfirm"
                    name="passwordConfirm"
                    label="Password Confirm"
                    type="password"
                    fullWidth
                    value={state.passwordConfirm}
                    onChange={handleChange}
                  />
                </>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {isEdit === true ? 'Update' : 'Create'}
          </Button>
          <Button onClick={handleClose} variant="contained" color="error">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddorEditModal;
