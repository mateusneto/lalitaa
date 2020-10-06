/* eslint-disable */
import axios from 'axios';

import { showAlert } from './alerts';

export const storeOwnerCreatestore = async (nome, nomeLoja, numeroTelemovel) => {
   try {
      const res = await axios({
         method: 'POST',
         url: 'http://127.0.0.1:3000/api/v1/lojas', //'/api/v1/entrar' ----> change on production
         data: {
            nome,
            nomeLoja,
            numeroTelemovel
         }
      });

      if (res.data.status === 'success') {
         console.log('sucesso');
         showAlert('success', 'Loja criada com sucesso');
         window.setTimeout(() => {
            location.assign('/minhaslojas');
         }, 0);
      }
   } catch (err) {
      showAlert('error', err.response.data.message);
   }
};
