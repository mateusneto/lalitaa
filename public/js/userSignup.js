/* eslint-disable */
import axios from 'axios';

import { showAlert } from './alerts';

export const signup = async (nome, nomeUsuario, email, numeroTelemovel, password, passwordConfirmacao) => {
   try {
      const res = await axios({
         method: 'POST',
         url: 'http://127.0.0.1:3000/api/v1/usuarios/signup', //'/api/v1/entrar' ----> change on production
         data: {
            nome,
            nomeUsuario,
            email,
            numeroTelemovel,
            password,
            passwordConfirmacao
         }
      });

      if (res.data.status === 'success') {
         showAlert('success', 'Signed up Succesfully');
         window.setTimeout(() => {
            location.assign('/lojas');
         }, 0);
      }
   } catch (err) {
      showAlert('error', err.response.data.message);
   }
};
