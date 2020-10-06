/* eslint-disable */
import axios from 'axios';

import { showAlert } from './alerts';

export const avaliarLoja = async (store, usuario, rating, review) => {
   try {
      const res = await axios({
         method: 'POST',
         url: 'http://127.0.0.1:3000/api/v1/storereviews', //'/api/v1/entrar' ----> change on production
         data: {
            store,
            usuario,
            rating,
            review
         }
      });

      if (res.data.status === 'success') {
         showAlert('success', 'Loja avaliada com sucesso');
         window.setTimeout(() => {
            location.assign(`/loja/${store}/avaliacoes`);
         }, 0);
      }
   } catch (err) {
      showAlert('error', err.response.data.message);
   }
};
