/* eslint-disable */

import '@babel/polyfill';
//import { displayMap } from './mapbox';
import { login, logOut } from './userLogin';
import { signup } from './userSignup';
import { updateSettings } from './updateSettings';

import { storeOwnerLogin, storeOwnerLogOut } from './donoLojaLogin';
import { storeOwnerSignup } from './donoLojaSignup';
import { storeOwnerUpdateSettings } from './donoLojaUpdateSettings';
//import { comprarServico } from './stripe';
import { showAlert } from './alerts';

//DOM Elements
//const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const userDataForm = document.querySelector('.form--userdetails');
const userPasswordForm = document.querySelector('.form--userPassword');
const userSignupForm = document.querySelector('.signup__form');
const logOutBtn = document.getElementById('userLogout');
//const bookBtn = document.getElementById('comprar-servico');

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

/* ----------------------------Store Owners---------------------- */

//DOM Elements
//const mapBox = document.getElementById('map');
const storeOwnerLoginForm = document.querySelector('.form--storeOwnerLogin');
const storeOwnerLogOutBtn = document.getElementById('storeOwnerLogout');
const storeOwnerDataForm = document.querySelector('.form--donoLojadetails');
const storeOwnerPasswordForm = document.querySelector('.form--donoLojaPassword');
const storeOwnerSignupForm = document.querySelector('.donoLojaSignup__form');
//const bookBtn = document.getElementById('comprar-servico');

//Delegation
/*if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}
*/
if (storeOwnerLoginForm)
   storeOwnerLoginForm.addEventListener('submit', e => {
      e.preventDefault(); //This prevents the form from loading any other page

      const userData = document.getElementById('storeOwnerData').value;
      const password = document.getElementById('storeOwnerPassword').value;

      storeOwnerLogin(userData, password);
   });

if (storeOwnerLogOutBtn) storeOwnerLogOutBtn.addEventListener('click', storeOwnerLogOut);

if (storeOwnerDataForm)
   storeOwnerDataForm.addEventListener('submit', e => {
      e.preventDefault();

      const form = new FormData();
      form.append('nome', document.getElementById('storeOwnerNome').value);
      form.append('nomeUsuario', document.getElementById('storeOwnerNomeUsuario').value);
      form.append('email', document.getElementById('storeOwnerEmail').value);
      form.append('numeroTelemovel', document.getElementById('storeOwnerNumeroTelemovel').value);
      //form.append('fotografia', document.getElementById('photo').files[0]);

      storeOwnerUpdateSettings(form, 'dados');
   });

if (storeOwnerSignupForm)
   storeOwnerSignupForm.addEventListener('submit', e => {
      e.preventDefault();

      const nome = document.getElementById('storeOwnerNome').value;
      const nomeUsuario = document.getElementById('storeOwnerNomeUsuario').value;
      const email = document.getElementById('storeOwnerEmail').value;
      const numeroTelemovel = document.getElementById('storeOwnerNumeroTelemovel').value;
      const password = document.getElementById('storeOwnerPassword').value;
      const passwordConfirmacao = document.getElementById('storeOwnerPassword-confirm').value;

      storeOwnerSignup(nome, nomeUsuario, email, numeroTelemovel, password, passwordConfirmacao);
   });

if (storeOwnerPasswordForm)
   storeOwnerPasswordForm.addEventListener('submit', async e => {
      e.preventDefault();
      document.querySelector('.storeOwnerSave-password__btn').textContent = 'Actualizando...';

      const passwordCurrent = document.getElementById('storeOwnerPassword-current').value;
      const password = document.getElementById('storeOwnerPassword').value;
      const passwordConfirmacao = document.getElementById('storeOwnerPassword-confirm').value;

      await storeOwnerUpdateSettings({ passwordCurrent, password, passwordConfirmacao }, 'password');

      document.querySelector('.storeOwnerSave-password__btn').textContent = 'Actualizar Palavra-passe';

      document.getElementById('storeOwnerPassword-current').value = '';
      document.getElementById('storeOwnerPassword').value = '';
      document.getElementById('storeOwnerPassword-confirm').value = '';
   });

/* ---------------------------Alerts handler---------------------- */

const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('Success', alertMessage, 20);
