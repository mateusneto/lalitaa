/* eslint-disable */
import axios from 'axios';

import { showAlert } from '../alerts';

export const storeOwnerRemoveproduct = async () => {
   const lojaId = window.location.pathname.split('/')[2];
   const produtoId = window.location.pathname.split('/')[4];
   console.log(lojaId);
   console.log(produtoId);
   try {
      const res = await axios({
         method: 'DELETE',
         url: `http://127.0.0.1:3000/api/v1/lojas/${lojaId}/produtos/${produtoId}` //'/api/v1/sair' ----> change on production
      });

      if ((res.data.status = 'success')) location.assign('/lojas'); //.reload(true); //forces reload from the server and not from the nrowser cache
   } catch (err) {
      console.log(err.response);
      showAlert(error, 'Error removing product! please try again');
   }
};
