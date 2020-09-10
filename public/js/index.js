/* eslint-disable */

import '@babel/polyfill';
//import { displayMap } from './mapbox';
import { login, logOut } from './login';
import { updateSettings } from './updateSettings';
//import { comprarServico } from './stripe';
import { showAlert } from './alerts';

//DOM Elements
//const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
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
      form.append('nome', document.getElementById('name').value);
      form.append('nomeUsuario', document.getElementById('username').value);
      form.append('email', document.getElementById('email').value);
      form.append('numeroTelemovel', document.getElementById('numeroTelemovel').value);
      form.append('fotografia', document.getElementById('photo').files[0]);

      updateSettings(form, 'dados');
   });

if (userPasswordForm)
   userPasswordForm.addEventListener('submit', async e => {
      e.preventDefault();
      document.querySelector('.btn--save-password').textContent = 'Actualizando...';

      const passwordCurrent = document.getElementById('password-current').value;
      const password = document.getElementById('password').value;
      const passwordConfirmacao = document.getElementById('password-confirmacao').value;

      await updateSettings({ passwordCurrent, password, passwordConfirmacao }, 'password');

      document.querySelector('.btn--save-password').textContent = 'Save Password';

      document.getElementById('password-current').value = '';
      document.getElementById('password').value = '';
      document.getElementById('password-confirmacao').value = '';
   });

/*if (bookBtn)
   bookBtn.addEventListener('click', e => {
      e.target.textContent = 'Processing...';
      const { servicoId } = e.target.dataset;
      comprarServico(servicoId);
   });*/

const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('Success', alertMessage, 20);
