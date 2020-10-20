/* eslint-disable */
import axios from 'axios';

import { showAlert } from '../alerts';

export const login = async (userData, password) => {
   try {
      const res = await axios({
         method: 'POST',
         url: 'http://127.0.0.1:3000/api/v1/usuarios/login', //'/api/v1/entrar' ----> change on production
         data: {
            userData,
            password
         }
      });

      if (res.data.status === 'success') {
         showAlert('success', 'Logged in Succesfully');
         window.setTimeout(() => {
            location.assign('/lojas');
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
         url: 'http://127.0.0.1:3000/api/v1/usuarios/logout' //'/api/v1/sair' ----> change on production
      });

      if ((res.data.status = 'success')) location.assign('/lojas'); //.reload(true); //forces reload from the server and not from the nrowser cache
   } catch (err) {
      console.log(err.response);
      showAlert(error, 'Error logging out! please try again');
   }
};
