import React from "react";
import { Button } from "react-bootstrap";
import { Container, Header, Icon, Table } from "semantic-ui-react";

import {PricingTable, PricingSlot, PricingDetail} from 'react-pricing-table';
import getStripe from "../../app/common/stripe/getStripe";
import { createCheckoutSession } from "../../app/backend/stripe";
import FaqComponent from "./Faq";

const EARLY_PREMIUM_PRICE_ID = "price_1IfMqsEzo05dH8EvJqx8CPXm"

function createCheckout(priceId) {
    // You'll have to define PRICE_ID as a price ID before this code 
    const stripe = getStripe()
    createCheckoutSession(priceId).then(function(data) {
      // Call Stripe.js method to redirect to the new Checkout page
      stripe
        .redirectToCheckout({
          sessionId: data.sessionId
        })
        .then(console.log);
    });
  }
export default function Upgrade() {

    return (
        <Container>
            <Header as="h1" textAlign="center" content="Upgrade Your Account"/>
            <PricingTable  highlightColor='#1976D2'>
    <PricingSlot highlighted onClick={evt => createCheckout(EARLY_PREMIUM_PRICE_ID)} buttonText='UPGRADE NOW' title='PREMIUM EARLY ACCESS' priceText='$29.95 ONCE'>
        <PricingDetail> <b>Unlimited</b> highlights</PricingDetail>
        <PricingDetail> <b>500MB</b> cloud books storage (~ 50 books)</PricingDetail>
        <PricingDetail> Access to every <b>present</b> and future <b>features</b></PricingDetail>
        <PricingDetail> <b>Single-time</b> payment</PricingDetail>
        <PricingDetail> <b>100% refunded</b> within a month, no questions asked!</PricingDetail>
    </PricingSlot>
</PricingTable>
<FaqComponent/>
        </Container>
    )
}