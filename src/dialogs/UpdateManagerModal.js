import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import { toast } from 'react-toastify';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  addBtn: {},
  cancelBtn: {}
}));

const UpdateManager = (props) => {
  const { isOpen, closeDialog, createNew, role, isEdit, editUser, updateUser } = props;
  const initialState = {
    name: '',
    email: '',
    password: '',
    passwordConfirm: ''
  };

  const [state, setState] = useState(initialState);

  useEffect(() => {
    // TODO
    if (isEdit === true && editUser) {
      setState({
        name: editUser.name,
        email: editUser.email
      });
    } else {
      setState(initialState);
    }
  }, [editUser, isEdit]);

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    if (isEdit) updateUser(editUser._id, { name: state.name, email: state.email });
    else createNew(state);
    e.preventDefault();
  };

  return (
    <div>
      <Dialog open={isOpen} onClose={closeDialog} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          {isEdit ? `Edit ${editUser && editUser.role}` : `Add New ${role}`}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            value={state.name}
            name="name"
            onChange={handleChange}
          />

          {role === 'Manager' ||
            (role === 'Employee' && (
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
            ))}

          {(!isEdit && role === 'manager') ||
            (role === 'Employee' && (
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
            ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {isEdit === true ? 'Update' : 'Create'}
          </Button>
          <Button onClick={closeDialog} variant="contained" color="error">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UpdateManager;
