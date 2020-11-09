/* eslint-disable */

import axios from 'axios';
import { showAlert } from '../alerts';

//'type' is either 'password' or 'dados'

export const lojaUpdateSettings = async (data, lojaId, type) => {
   console.log(lojaId);
   try {
      const url =
         type === 'password' ? '/api/v1/donosdeloja/updatePassword' : `http://127.0.0.1:3000/api/v1/lojas/${lojaId}`;
      const res = await axios({
         method: 'PATCH',
         url,
         data
      });

      if (res.data.status === 'success') {
         showAlert('success', `${type.toUpperCase()} actualizada com sucesso`);
         window.setTimeout(() => {
            location.assign(`/loja/${lojaId}/produtos`);
         }, 2000);
      }
   } catch (err) {
      showAlert('error', err.response.data.message);
   }
};
