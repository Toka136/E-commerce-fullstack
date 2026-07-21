const stripe = require("stripe")('sk_test_BQokikJOvBiI2HlWgH4olfQ2');



  export const createPaymentIntent = async (amaount: number) =>{
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amaount,
    currency: "usd",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return {
          clientSecret: paymentIntent.client_secret,

  }
  
}



