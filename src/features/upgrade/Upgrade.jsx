import React, { useState } from "react";
import { Checkbox, Container, Header } from "semantic-ui-react";
import { useSelector } from "react-redux"
import { Redirect } from "react-router-dom"
import { PricingTable, PricingSlot, PricingDetail } from "react-pricing-table";
import getStripe from "../../app/common/stripe/getStripe";
import { createCheckoutSession } from "../../app/backend/stripe";
import FaqComponent from "./Faq";
import { isReactDevMode } from "../../app/common/util/util";
import { toast } from "react-toastify";

const STRIPE_PRICE_ID = isReactDevMode() ? "price_1Ile00Ezo05dH8Ev4uaFXfzF" : "price_1IldrwEzo05dH8EvkTdeB1pl"

export default function Upgrade({ mixpanel }) {
  function createCheckout() {
    try {
    const priceId = STRIPE_PRICE_ID
    // You'll have to define PRICE_ID as a price ID before this code
    const stripe = getStripe();
    createCheckoutSession(priceId).then(function (data) {
      // Call Stripe.js method to redirect to the new Checkout page
      stripe
        .redirectToCheckout({
          sessionId: data.sessionId,
        })
        .then((result) => mixpanel.track("Upgrade: Conversion"));
    });
  }
  catch (error) {
    toast.error("Sorry but an unexpected error happened, we're investigating the problem and will fix it ASAP!")
    throw error;
  }
  }

  const { userPlan } = useSelector((state) => state.profile);
  const [stripeLoading, setStripeLoading] = useState(false)
  if (userPlan && userPlan.plan === 'basic') return <Redirect to="/books"/> 
  return (
    <Container>
      <Header as="h1" textAlign="center" content="Upgrade Your Account" />
      <PricingTable highlightColor="#1976D2">
        <PricingSlot
          highlighted
          onClick={(evt) =>{
            try {
            setStripeLoading(true)
            mixpanel.track("Upgrade: Click Upgrade")
            createCheckout() }
            catch (error) {
              setStripeLoading(false)
            }
          }}
          buttonText={stripeLoading ? "Loading checkout..." : "UPGRADE NOW"}
          title="PREMIUM PLAN EARLY ACCESS"
          priceText={
              "$1.95/Month (billed annualy)"
          }
        >
          <PricingDetail>
            {" "}
            <b>Unlimited</b> highlights
          </PricingDetail>
          <PricingDetail>
            {" "}
            <b>Unlimited</b> books
          </PricingDetail>
          <PricingDetail>
            {" "}
            Access to every <b>present</b> and future <b>features</b>
          </PricingDetail>
          <PricingDetail>
            {" "}
            <b>100% refunded</b> within a month, no questions asked!
          </PricingDetail>
        </PricingSlot>
      </PricingTable>
      <FaqComponent />
    </Container>
  );
}
