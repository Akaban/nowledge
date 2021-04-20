import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { Checkbox, Container, Header, Icon, Table } from "semantic-ui-react";

import {PricingTable, PricingSlot, PricingDetail} from 'react-pricing-table';
import getStripe from "../../app/common/stripe/getStripe";
import { createCheckoutSession } from "../../app/backend/stripe";
import FaqComponent from "./Faq";

const ANNUAL_PRICE_ID = "price_1IiHYYEzo05dH8EvPwo7iPSA"
const MONTHLY_PRICE_ID = "price_1IiHYYEzo05dH8EvZURLvGs8"

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
  const [billAnnualy, setAnnualyBilling] = useState(true)
    return (
        <Container>
            <Header as="h1" textAlign="center" content="Upgrade Your Account"/>
            <PricingTable  highlightColor='#1976D2'>
    <PricingSlot highlighted onClick={evt => createCheckout((billAnnualy ? ANNUAL_PRICE_ID : MONTHLY_PRICE_ID))} buttonText='UPGRADE NOW' title='PREMIUM PLAN EARLY ACCESS' priceText={billAnnualy ? '$1.95/month (billed annualy)' : '$2.95/Month (billed monthly)'}>
      <PricingDetail>Monthly <Checkbox toggle checked={billAnnualy} onChange={(evt, data) => setAnnualyBilling(data.checked)} /> Annualy</PricingDetail>
        <PricingDetail> <b>Unlimited</b> highlights</PricingDetail>
        <PricingDetail> <b>Unlimited</b> books</PricingDetail>
        <PricingDetail> Access to every <b>present</b> and future <b>features</b></PricingDetail>
        <PricingDetail> <b>100% refunded</b> within a month, no questions asked!</PricingDetail>
    </PricingSlot>
</PricingTable>
<FaqComponent/>
        </Container>
    )
}