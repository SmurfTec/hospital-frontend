import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { makeReq } from 'utils/constants';
import { useNavigate } from 'react-router-dom';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  let tokenLocal;

  const navigate = useNavigate();

  try {
    tokenLocal = window.localStorage.getItem('jwt');
  } catch (err) {
    tokenLocal = null;
  }

  const [token, setToken] = useState(tokenLocal);
  const [user, setUser] = useState(null);

  useEffect(() => {
    getMe();
  }, []);

  const getMe = async () => {
    try {
      const res = await makeReq(`/users/me`, {}, 'GET');
      console.log(`res`, res);
      localStorage.setItem('user', JSON.stringify(res.user));

      setUser(res.user);
    } catch (err) {
      setToken(null);
      localStorage.removeItem('jwt');
      localStorage.removeItem('user');
    }
  };

  const signInUser = (tk, us) => {
    console.log(`tk`, tk);
    console.log(`us`, us);

    window.localStorage.setItem('jwt', tk);
    window.localStorage.setItem('user', us);

    setTimeout(() => {
      setToken(tk);
      setUser(us);

      navigate('/dashboard', { replace: true });
    }, 1000);
  };

  const logoutUser = () => {
    setToken(null);
    setUser(null);

    localStorage.removeItem('user');
    localStorage.removeItem('jwt');

    // setTimeout(() => {
    //   window.location.href = '/';
    // }, 1000);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        logoutUser,
        user,
        setUser,
        signInUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
