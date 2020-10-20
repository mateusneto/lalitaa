/* eslint-disable */
import axios from 'axios';

import { showAlert } from '../alerts';

export const avaliarProduto = async (storeId, produto, usuario, rating, review) => {
   try {
      const res = await axios({
         method: 'POST',
         url: 'http://127.0.0.1:3000/api/v1/produtoreviews', //'/api/v1/entrar' ----> change on production
         data: {
            produto,
            usuario,
            rating,
            review
         }
      });

      if (res.data.status === 'success') {
         showAlert('success', 'Produto avaliado com sucesso');
         window.setTimeout(() => {
            location.assign(`/loja/${storeId}/produto/${produto}/avaliacoes`);
         }, 0);
      }
   } catch (err) {
      showAlert('error', err.response.data.message);
   }
};
