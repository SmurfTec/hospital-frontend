import { createContext, useContext, useEffect, useState } from 'react';

import socketIo from 'socket.io-client';
import { AuthContext } from './AuthContext';

export const SocketContext = createContext();

export const SocketProvider = (props) => {
  const [socket, setSocket] = useState();
  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    // socket = socketIo.connect('https://mern-chat-project.herokuapp.com', {
    const newSocket = socketIo.connect('localhost:8001', {
      transports: ['websocket']
    });

    setSocket(newSocket);
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('connect', () => {
      console.log(`Hurrah Socket ${socket.id} Connected`);
      // console.clear();
    });
  }, [socket]);
  useEffect(() => {
    if (!socket) return;
    if (!user || user === null) return;

    socket.on('newNotification', (data) => {
      console.log(`data`, data);

      console.log(`user`, user);

      console.log(`user._id`, user._id);
      console.log(`condition`, JSON.stringify(data.user._id) !== JSON.stringify(user._id));

      if (JSON.stringify(data.user._id) !== JSON.stringify(user._id)) return;

      console.log('updating user');
      const newUser = {
        ...user,
        notifications: data.user.notifications
          ? [...user.notifications, data.newNotification]
          : [data.newNotification]
      };

      console.log(`newUser`, newUser);

      setUser(newUser);
    });
  }, [socket, user]);

  // useEffect(() => {
  //   setCurrentUser(user);
  //   console.log(`user`, user);
  // }, [user]);

  return <SocketContext.Provider value={{ socket }}>{props.children}</SocketContext.Provider>;
};
