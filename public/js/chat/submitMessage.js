/* eslint-disable */
//import axios from 'axios';

import { showAlert } from '../alerts.js';

export const submitMessage = async (usuario, store, mensagem, sender, receiver) => {
   try {
      const res = await axios({
         method: 'POST',
         url: `http://127.0.0.1:3000/api/v1/mensagens/usuario_store`, //'/api/v1/entrar' ----> change on production
         data: {
            usuario,
            store,
            mensagem,
            sender,
            receiver
         }
      });

      if (res.data.status === 'success') {
         showAlert('success', 'mensagem enviada com sucesso');
      }
   } catch (err) {
      showAlert('error', err.response.data.message);
   }
};
