/* eslint-disable */

import axios from 'axios';
import { showAlert } from '../alerts';

//'type' is either 'password' or 'dados'

export const produtoUpdateDetails = async (data, lojaId, produtoId, type) => {
   console.log(lojaId);
   console.log(produtoId);
   try {
      const url =
         type === 'password' ? '/api/v1/donosdeloja/updatePassword' : `/api/v1/lojas/${lojaId}/produto/${produtoId}`;
      const res = await axios({
         method: 'PATCH',
         url,
         data
      });

      if (res.data.status === 'success') {
         showAlert('success', `${type.toUpperCase()} actualizada com sucesso`);
         window.setTimeout(() => {
            location.assign(`/loja/${lojaId}/produto/${produtoId}`);
         }, 2000);
      }
   } catch (err) {
      showAlert('error', err.response.data.message);
   }
};
