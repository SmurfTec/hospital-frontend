import React, { useState, useEffect } from 'react';
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
import { toast } from 'react-toastify';
import { makeStyles } from '@material-ui/styles';
import { Divider } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/AddCircleOutline';

const useStyles = makeStyles((theme) => ({
  Dialog: {
    '& .MuiDialog-paper': {
      minHeight: 450
    }
  },
  addBtn: {},
  cancelBtn: {}
}));

const AddorEditModal = (props) => {
  const { isOpen, closeDialog, createNew, role, isEdit, editUser, updateUser } = props;
  const [deadLine, setDeadLine] = useState(new Date());
  const classes = useStyles();

  const initialStageState = {
    name: '',
    description: '',
    id: uuid()
  };

  const [stages, setStages] = useState([initialStageState]);

  const initialState = {
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    description: ''
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

      if (editUser.stages) setStages(editUser.stages);
      if (editUser.deadLine) setDeadLine(new Date(editUser.deadLine));
    } else {
      setState(initialState);
    }
  }, [editUser, isEdit]);

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleStageChange = (e, stage) => {
    let current = stages.find((el) => el.id === stage.id);
    if (!current) return;

    current = {
      ...current,
      [e.target.name]: e.target.value
    };

    setStages((st) => st.map((el) => (el.id === stage.id ? current : el)));
  };

  const addNewStage = () => {
    const newStage = initialStageState;
    setStages((st) => [...st, newStage]);
  };

  const deleteStage = (id) => {
    setStages((st) => st.filter((el) => el.id !== id));
  };

  const handleSubmit = (e) => {
    if (role === 'Task') {
      if (isEdit)
        updateUser(editUser._id, {
          name: state.name,
          description: state.description,
          stages,
          deadLine
        });
      else createNew({ name: state.name, description: state.description, stages, deadLine });
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

          {role === 'Task' && (
            <>
              <TextField
                margin="dense"
                id="description"
                name="description"
                label="Description"
                type="description"
                fullWidth
                value={state.description}
                onChange={handleChange}
              />
              <Box
                display="flex"
                justifyContent="space-around"
                alignItems="flex-start"
                minHeight={60}
                flexDirection="column"
                marginBottom="10px"
                marginTop="10px"
              >
                <Typography
                  variant="p"
                  component="p"
                  style={{
                    marginBottom: '10px !important'
                  }}
                >
                  Deadline
                </Typography>
                <DateTimePicker value={deadLine} onChange={setDeadLine} disableClock />
              </Box>
              <Divider style={{ marginBlock: 20 }} />
              <Typography
                variant="h6"
                component="p"
                style={{
                  marginBottom: '10px !important',
                  textAlign: 'center'
                }}
              >
                Stages
              </Typography>
              <Button startIcon={<AddIcon />} onClick={addNewStage}>
                Add Stage
              </Button>
              <Box>
                {stages.map((stage, idx) => (
                  <Box
                    key={stage.id}
                    style={{
                      border: '1px solid #ccc',
                      padding: '15px 20px'
                    }}
                  >
                    <h4
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      Stage {idx + 1}
                      {idx > 0 && (
                        <CloseIcon
                          onClick={() => deleteStage(stage.id)}
                          style={{ cursor: 'pointer' }}
                        />
                      )}
                    </h4>
                    <TextField
                      margin="dense"
                      id="name"
                      name="name"
                      label="Name"
                      type="name"
                      fullWidth
                      value={stage.name}
                      onChange={(e) => handleStageChange(e, stage)}
                    />
                    <TextField
                      margin="dense"
                      id="description"
                      name="description"
                      label="Description"
                      type="description"
                      fullWidth
                      value={stage.description}
                      onChange={(e) => handleStageChange(e, stage)}
                    />
                  </Box>
                ))}
              </Box>
            </>
          )}

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
          <Button onClick={handleClose} variant="contained" color="error">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddorEditModal;
