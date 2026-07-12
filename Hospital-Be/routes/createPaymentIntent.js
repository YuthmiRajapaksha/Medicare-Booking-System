
// const express = require("express");
// const router = express.Router();


// router.post('/api/create-payment-intent', async (req, res) => {
//   try {
//     const { amount } = req.body;
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount,
//       currency: 'usd',
//     });
//     res.json({ clientSecret: paymentIntent.client_secret });
//   } catch (error) {
//     console.error('Stripe create payment intent error:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;


