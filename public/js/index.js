/* eslint-disable */

import '@babel/polyfill';
//import { displayMap } from './mapbox';
import { login, logOut } from './userLogin';
import { signup } from './userSignup';
import { updateSettings } from './updateSettings';
//import { comprarServico } from './stripe';
import { showAlert } from './alerts';

//DOM Elements
//const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.side-nav__logoutbtn');
const userDataForm = document.querySelector('.form--userdetails');
const userPasswordForm = document.querySelector('.form--userPassword');
const userSignupForm = document.querySelector('.signup__form');
const bookBtn = document.getElementById('comprar-servico');

//Delegation
/*if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}
*/
if (loginForm)
   loginForm.addEventListener('submit', e => {
      e.preventDefault(); //This prevents the form from loading any other page

      const userData = document.getElementById('userData').value;
      const password = document.getElementById('password').value;

      login(userData, password);
   });

if (logOutBtn) logOutBtn.addEventListener('click', logOut);

if (userDataForm)
   userDataForm.addEventListener('submit', e => {
      e.preventDefault();

      const form = new FormData();
      form.append('nome', document.getElementById('nome').value);
      form.append('nomeUsuario', document.getElementById('nomeUsuario').value);
      form.append('email', document.getElementById('email').value);
      form.append('numeroTelemovel', document.getElementById('numeroTelemovel').value);
      //form.append('fotografia', document.getElementById('photo').files[0]);

      updateSettings(form, 'dados');
   });

if (userSignupForm)
   userSignupForm.addEventListener('submit', e => {
      e.preventDefault();

      const nome = document.getElementById('nome').value;
      const nomeUsuario = document.getElementById('nomeUsuario').value;
      const email = document.getElementById('email').value;
      const numeroTelemovel = document.getElementById('numeroTelemovel').value;
      const password = document.getElementById('password').value;
      const passwordConfirmacao = document.getElementById('password-confirm').value;

      signup(nome, nomeUsuario, email, numeroTelemovel, password, passwordConfirmacao);
   });

if (userPasswordForm)
   userPasswordForm.addEventListener('submit', async e => {
      e.preventDefault();
      document.querySelector('.save-password__btn').textContent = 'Actualizando...';

      const passwordCurrent = document.getElementById('password-current').value;
      const password = document.getElementById('password').value;
      const passwordConfirmacao = document.getElementById('password-confirm').value;

      await updateSettings({ passwordCurrent, password, passwordConfirmacao }, 'password');

      document.querySelector('.save-password__btn').textContent = 'Actualizar Palavra-passe';

      document.getElementById('password-current').value = '';
      document.getElementById('password').value = '';
      document.getElementById('password-confirm').value = '';
   });

/*if (bookBtn)
   bookBtn.addEventListener('click', e => {
      e.target.textContent = 'Processing...';
      const { servicoId } = e.target.dataset;
      comprarServico(servicoId);
   });*/

const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('Success', alertMessage, 20);
