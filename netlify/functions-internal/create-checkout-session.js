const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  try {
    let body = {};
    if (event.body) {
      body = JSON.parse(event.body);
    }
    const persona = body.persona || 'User';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Unlock Beta Access for ${persona}`,
              description: 'Early access to Flightsnapp Beta in Q1 2026',
            },
            unit_amount: 1000, // $10 USD (in cents)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      ui_mode: 'embedded', // Required for embedded Checkout
      return_url: `${process.env.BASE_URL}/results?session_id={CHECKOUT_SESSION_ID}`, // Replaces success_url
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ sessionId: session.id }),
    };
  } catch (error) {
    console.error('Error creating session:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};