import React from "react";
import { Button } from "semantic-ui-react";
import { createCheckoutSession } from "../../app/backend/stripe";

export default function Stripe() {
  const stripe = window.Stripe("pk_test_51ISqELEzo05dH8Evxhtsqr0m9Fnkt9VoaKRZqowVjiVpeTII3qAFl2yDvVpI7NnbOSep7NbgMOQL89U7CVgmdPy900RIhNXb2T");
  const priceId = "price_1IdX14Ezo05dH8EvL3LDUz3H";
  return (
    <Button
      content="Pay"
      color="teal"
      onClick={(evt) => {
        createCheckoutSession(priceId).then((data) => {
          stripe
            .redirectToCheckout({ sessionId: data.sessionId })
            .then(console.log);
        });
      }}
    />
  );
}
