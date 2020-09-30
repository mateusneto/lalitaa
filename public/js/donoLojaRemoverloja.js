/* eslint-disable */
import axios from 'axios';

import { showAlert } from './alerts';

export const storeOwnerRemovestore = async () => {
   const id = window.location.pathname.split('/')[2];
   console.log(id);
   try {
      const res = await axios({
         method: 'DELETE',
         url: `http://127.0.0.1:3000/api/v1/lojas/${id}` //'/api/v1/sair' ----> change on production
      });

      if ((res.data.status = 'success')) location.assign('/lojas'); //.reload(true); //forces reload from the server and not from the nrowser cache
   } catch (err) {
      console.log(err.response);
      showAlert(error, 'Error removing store! please try again');
   }
};
