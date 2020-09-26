/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

//'type' is either 'password' or 'dados'

export const updateSettings = async (data, type) => {
   try {
      const url = type === 'password' ? '/api/v1/usuarios/updatePassword' : '/api/v1/usuarios/updateMe';

      // console.log(data);

      const res = await axios({
         method: 'PATCH',
         url,
         data
      });

      if (res.data.status === 'success') {
         showAlert('success', `${type.toUpperCase()} actualizada com sucesso`);
      }
   } catch (err) {
      showAlert('error', err.response.data.message);
   }
};
