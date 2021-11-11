import {loadStripe} from "@stripe/stripe-js";
import placeOrder from "./orderService";
import {CardWidget} from "./Cardwidget";

export async function initStripe() {
    let stripe = await loadStripe('pk_test_51JIYGzSCiUqxo4A1B0lEJyJteprFTxWolIxhvplNpLxZDMrpPhk05gANngBAso7n1shNwrnUiAWAUxYRXanTBsaw00bMeCLYox');
    let card = null;

    const paymentType = document.querySelector('#paymentType');
    if(!paymentType) {
        return;
    }
    paymentType.addEventListener('change' , (e)=> {

        if(e.target.value === 'card') {
            // Display Widget
            card = new CardWidget(stripe)
            card.mount()
        } else {
            card.destroy()
        }

    })


    //Ajax Call
    const paymentForm = document.querySelector('#paymentForm')
    if (paymentForm) {
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault()
            let formData = new FormData(paymentForm)
            let formObject = {}
            for (let [key, value] of formData.entries()) {
                formObject[key] = value
            }

            if (!card) {
                // Ajax
                placeOrder(formObject);
                return;
            }

            const token = await card.createToken()
            formObject.stripeToken = token.id;
            placeOrder(formObject);

        })
    }
}

export default initStripe
