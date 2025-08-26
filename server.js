if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
console.log("Stripe Secret Key from .env:", process.env.STRIPE_SECRET_KEY);
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post("/create-payment-intent", async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    res.status(400).send({
      error: err.message,
    });
  }
});
app.get("/", (req, res) => {
  res.send("Backend is working!");
});
app.listen(3000, () => console.log("Server running on port 3000"));