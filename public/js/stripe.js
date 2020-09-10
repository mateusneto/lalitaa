/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51HKQRvHtKL3WF8qh5oeIaZleN68QmNKAGQR92y03RHzskazD0AyxfsOCMN8FaOEmN3gPoEWsGwcRZ6ffWD67u4RH003EWJcAfz'
);

export const comprarServico = async (servicoId) => {
  try {
    //get checkout session from API
    console.log('entered');
    const session = await axios(
      //Should work now
      `/api/v1/bookings/checkout-session/${servicoId}`
    );
    // console.log(session);

    //Create checkout form  + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
