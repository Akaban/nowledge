import React from "react";
import { Button } from "react-bootstrap";
import { Container, Header, Icon, Table } from "semantic-ui-react";

// import {PricingTable, PricingSlot, PricingDetail} from 'react-pricing-table';

export default function Upgrade() {
    return (
        <Container>
            <Header as="h1" textAlign="center" content="Upgrade Your Account"/>
            Our premium plan is 100% refunded within a month, no questions asked!
            {/* <PricingTable  highlightColor='#1976D2'>
    <PricingSlot highlighted onClick={console.log(1)} buttonText='UPGRADE NOW' title='PREMIUM' priceText='$24/month'>
        <PricingDetail> <b>Unlimited</b> highlights</PricingDetail>
        <PricingDetail> <b>3GB</b>  books storage (more than enough!)</PricingDetail>
        <PricingDetail> <b>100MB</b> per book</PricingDetail>
        <PricingDetail> Access to every <b>present</b> and future <b>features</b></PricingDetail>
    </PricingSlot>
</PricingTable> */}
        </Container>
    )
}