/* eslint-disable */
import axios from 'axios';

import { showAlert } from '../alerts';

export const storeOwnerCreateproduct = async (storeId, nome, tipo, preco, tamanho, cor, marca, genero, descricao) => {
   try {
      const res = await axios({
         method: 'POST',
         url: `http://127.0.0.1:3000/api/v1/lojas/${storeId}/produtos`, //'/api/v1/sair' ----> change on production
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
         console.log('sucesso');
         showAlert('success', 'Loja criada com sucesso');
         window.setTimeout(() => {
            location.assign(`/loja/${storeId}/produtos`);
         }, 0);
      } //.reload(true); //forces reload from the server and not from the nrowser cache
   } catch (err) {
      console.log(err.response);
      showAlert('error', 'Error creating product! please try again');
   }
};
