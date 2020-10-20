/* eslint-disable */
import axios from 'axios';

import { showAlert } from '../alerts';

export const storeOwnerUpdatestore = async (lojaId, nome, nomeLoja, numeroTelemovel) => {
   try {
      const res = await axios({
         method: 'PATCH',
         url: `http://127.0.0.1:3000/api/v1/lojas/${lojaId}`, //'/api/v1/entrar' ----> change on production
         data: {
            nome,
            nomeLoja,
            numeroTelemovel
         }
      });

      if (res.data.status === 'success') {
         showAlert('success', 'Loja actualizada com sucesso');
         window.setTimeout(() => {
            location.assign(`/loja/${lojaId}/produtos`);
         }, 0);
      }
   } catch (err) {
      showAlert('error', err.response.data.message);
   }
};
