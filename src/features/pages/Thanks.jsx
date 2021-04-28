import React from "react";
import { Button, Container, Header } from "semantic-ui-react";

export default function Thanks({history}){
    return (
        <Container>
        <Header content="Thanks for buying the premium version of NowLedge!"/>
        <div style={{"fontSize": "1.4em", "maxWidth": "800px"}}>
        Dear Customer,<br/>
        <p>
        Thank you so much for buying the premium version of NowLedge, the app that will let you remember your books forever!
        </p>

        <p>We are still releasing new features every week for NowLedge, if you find that something is missing or would like to improve the app don't hesitate to reach out to us using the feedback widget which is located bottom-left or by email at <a href="mailto:tichit.bryce+nowledge@gmail.com">tichit.bryce@gmail.com</a>.</p>

        <p>As of now NowLedge is still in early version and we have a lot more coming. We prefer to ship it early and have feedbacks directly from our customers so we can shape our product better. We believe that thanks to your feedbacks we will be able to design an amazing highlighting app!</p>

        <p>One thing you should now is that as of now this app is desktop oriented, it's possible to use it on mobile as well but just for reading not highlights, not taking them! We're thinking about the best mobile UX, if you have any suggestions how you would use NowLedge on mobile you can reach out to us.</p>
        
        <p>Happy reading !</p>

        <p>Bryce Tichit, founder of NowLedge.</p>
        </div>

        <Button content="Go back to my books" onClick={() => history.push("/books")}/>
        </Container>
    )
}