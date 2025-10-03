const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_BETA_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://www.flightsnapp.com/results?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://www.flightsnapp.com/results',
    });
    return {
      statusCode: 200,
      body: JSON.stringify({ sessionId: session.id }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};