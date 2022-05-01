import { useContext, useState, useEffect } from 'react';
// material
import {
  Container,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  TextField,
  Box,
  Avatar
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
// components
import Page from '../components/Page';
import { AuthContext } from 'contexts/AuthContext';
import { API_BASE_URL, handleCatch, makeReq } from 'utils/constants';
import { toast } from 'react-toastify';
// ----------------------------------------------------------------------
const useStyles = makeStyles({
  root: {
    minWidth: 275,
    maxWidth: 500,
    margin: 'auto'
  },
  Input: {
    marginBottom: '2rem'
  },
  CardContentBox: {
    maxWidth: 400,
    textAlign: 'center',
    margin: 'auto'
  }
});

export default function Settings() {
  const { user, setUser } = useContext(AuthContext);
  const initialState = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordCurrent: '',
    passwordConfirm: '',
    specialization: '',
    address: '',
    contact: ''
  };
  const [state, setState] = useState(initialState);
  const classes = useStyles();

  useEffect(() => {
    if (!!user === false) return;

    setState((st) => ({
      ...st,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      specialization: user.specialization,
      address: user.address,
      contact: user.contact
    }));
  }, [user]);

  const handleTxtChange = (e) => {
    setState((st) => ({ ...st, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      console.log(`st`, state);
      const resData = await makeReq(
        '/users/me',
        {
          body: {
            firstName: state.firstName,
            lastName: state.lastName,
            email: state.email,
            specialization: state.specialization,
            address: state.address,
            contact: state.contact
          }
        },
        'PATCH'
      );
      console.log(`resData`, resData);
      setUser(resData.user);
      toast.success('Profile Updated');
    } catch (err) {
      handleCatch(err);
    }
  };
  const handleUpdatePass = async () => {
    try {
      console.log(`st`, state);
      const resData = await makeReq(
        '/auth//update-password',
        {
          body: {
            passwordCurrent: state.passwordCurrent,
            password: state.password,
            passwordConfirm: state.passwordConfirm
          }
        },
        'PATCH'
      );
    } catch (err) {
      handleCatch(err);
    }
  };

  const handlePhoto = async (e) => {
    console.clear();
    console.log('e.target.files', e.target.files);
    let formData = new FormData();

    // * Object foreach -Copied from mozilla docs
    formData.append('photo', e.target.files[0]);

    fetch(`${API_BASE_URL}/users/me`, {
      body: formData,
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`
      }
    }).then(async (res) => {
      if (res.ok) {
        toast.success(`Photo Updated`);
        let data = await res.json();
        console.log('data', data);
        setUser(data.user);
      } else {
        handleCatch(res);
      }
    });
  };

  return (
    <Page title="Dashboard: Products | Task Manager App">
      <Container>
        <Card className={classes.root}>
          <CardContent>
            <Box className={classes.CardContentBox}>
              <Typography variant="h4" textAlign="center" color="textprimary" gutterBottom>
                Settings
              </Typography>
              {user.role !== 'admin' && (
                <>
                  {user.photo && (
                    <Avatar
                      src={user.photo}
                      style={{
                        margin: 'auto',
                        width: '100px',
                        height: '100px'
                      }}
                    />
                  )}
                  <input
                    onChange={handlePhoto}
                    type="file"
                    style={{ display: 'none' }}
                    id="photo"
                  ></input>

                  <label htmlFor="photo" style={{ cursor: 'pointer' }}>
                    <CameraAltIcon />
                  </label>
                </>
              )}
              <TextField
                fullWidth
                className={classes.Input}
                variant="outlined"
                value={state.firstName}
                name="firstName"
                label="First name"
                onChange={handleTxtChange}
                type="text"
              />
              <TextField
                fullWidth
                className={classes.Input}
                variant="outlined"
                value={state.lastName}
                name="lastName"
                label="Last Name"
                onChange={handleTxtChange}
                type="text"
              />
              {user.role === 'doctor' && (
                <>
                  <TextField
                    fullWidth
                    className={classes.Input}
                    variant="outlined"
                    value={state.specialization}
                    name="specialization"
                    label="Specialization"
                    onChange={handleTxtChange}
                    type="text"
                  />
                  <TextField
                    fullWidth
                    className={classes.Input}
                    variant="outlined"
                    value={state.address}
                    name="address"
                    label="Address"
                    onChange={handleTxtChange}
                    type="text"
                  />
                  <TextField
                    fullWidth
                    className={classes.Input}
                    variant="outlined"
                    value={state.contact}
                    name="contact"
                    label="Contact"
                    onChange={handleTxtChange}
                    type="number"
                  />
                </>
              )}
              <TextField
                fullWidth
                className={classes.Input}
                variant="outlined"
                value={state.email}
                name="email"
                label="Email"
                onChange={handleTxtChange}
                type="text"
              />
              <TextField
                fullWidth
                className={classes.Input}
                variant="outlined"
                value={state.passwordCurrent}
                name="passwordCurrent"
                label="Current Password"
                onChange={handleTxtChange}
                type="password"
              />
              <TextField
                fullWidth
                className={classes.Input}
                variant="outlined"
                value={state.password}
                name="password"
                label="New Password"
                onChange={handleTxtChange}
                type="password"
              />
              <TextField
                fullWidth
                className={classes.Input}
                variant="outlined"
                value={state.passwordConfirm}
                name="passwordConfirm"
                label="Password Confirm"
                onChange={handleTxtChange}
                type="password"
              />
            </Box>
          </CardContent>
          <CardActions
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              paddingBottom: 30,
              paddingRight: 20
            }}
          >
            <Button size="medium" variant="contained" onClick={handleSubmit}>
              Save Changes
            </Button>
            <Button size="medium" variant="contained" color="secondary" onClick={handleUpdatePass}>
              Update Password
            </Button>
          </CardActions>
        </Card>
      </Container>
    </Page>
  );
}
