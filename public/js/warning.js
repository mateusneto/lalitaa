/* eslint-disable */

export const hideWarning = () => {
   const el = document.querySelector('.warning');
   const warningText = document.querySelector('.warning__text');
   if (el) el.style.display = 'none';
   if (warningText) warningText.style.display = 'none';
};

//type is either 'sim' or 'nao'
export const showWarning = (msg, time = 30) => {
   document.querySelector('.warning').style.display = 'block';

   setTimeout(() => {
      document.querySelector('.warning').style.display = 'none';
   }, time * 1000);
};

/*const markUp = `
<div class="warning">
    <div class="warning__text">${msg}</div>
    <button class="warning--no">
        <span>Cancelar</span>
    </button>
    <button class="warning--yes">
        <span>Apagar</span>
    </button>
</div>`;

 document.querySelector('.header').insertAdjacentHTML('afterend', markUp);
   window.setTimeout(hideWarning, time * 1000);
*/
