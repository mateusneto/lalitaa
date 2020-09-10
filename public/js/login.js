/* eslint-disable */
import axios from 'axios';

import { showAlert } from './alerts';

export const login = async (userData, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/usuarios/login',
      data: {
        userData,
        password,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in Succesfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 0);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logOut = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/usuarios/logout',
    });

    if ((res.data.status = 'success')) location.reload(true); //forces reload from the server and not from the nrowser cache
  } catch (err) {
    console.log(err.response);
    showAlert(error, 'Error logging out! please try again');
  }
};
