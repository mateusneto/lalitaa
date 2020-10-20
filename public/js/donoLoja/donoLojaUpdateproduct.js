/* eslint-disable */
import axios from 'axios';

import { showAlert } from '../alerts';

export const storeOwnerUpdateproduct = async (
   storeId,
   produtoId,
   nome,
   tipo,
   preco,
   tamanho,
   cor,
   marca,
   genero,
   descricao
) => {
   try {
      const res = await axios({
         method: 'PATCH',
         url: `http://127.0.0.1:3000/api/v1/lojas/${storeId}/produtos/${produtoId}`, //'/api/v1/sair' ----> change on production
         data: {
            nome,
            tipo,
            preco,
            tamanho,
            cor,
            marca,
            genero,
            descricao
         }
      });

      if (res.data.status === 'success') {
         showAlert('success', 'Produto actualizado com sucesso');
         window.setTimeout(() => {
            location.assign(`/loja/${storeId}/produto/${produtoId}`);
         }, 0);
      } //.reload(true); //forces reload from the server and not from the nrowser cache
   } catch (err) {
      showAlert('error', 'Error updating product! please try again');
   }
};
