import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { openModal } from "../../app/common/modals/modalReducer";
import { Button, Container, Image, Segment, Header } from "semantic-ui-react";
import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import * as qs from "query-string";

export default function LandingPage() {
  return (
    <>
      <header class="hero">
        <div className="container">
          <h1 className="main-text">
            Get the most out of your books with <b>NowLedge</b>
          </h1>
          <p>
            Do you have a hard time remembering important data you get from your books? We do, and for that we built <b>NowLedge</b>
            a book-focused note taking app that will help you to achieve maximum information retention.
          </p>

          <Button
            onClick={() => console.log("coucou")}
            size="massive"
            color="blue"
          >
              Get started for free.
              </Button>
              <p>We offer a 1 month period trial.</p>
        </div>
      </header>

      <main>
        <section className="feature">
          <h2 class="section-title">Upload your local books into the cloud.</h2>
          Insert picture here
          <p> Not everyone wants to have a Kindle, with NowLedge you upload your book into the cloud and can access it anytime. </p>
        </section>
        <section className="feature">
          <h2 class="section-title">Take highlights of your favorites and most informational pieces.</h2>
          Insert picture here
          <p> The best way to get the most out of the books is to take notes as your read the book, you could do it by hand on a notebook or
              with a pdf reader but this is laborious. NowLedge allow you to take highlights easily, attach information to it and store it on the cloud. Forever.
               </p>
        </section>
        <section className="feature">
          <h2 class="section-title">Access your highlights after taking them, easily.</h2>
          Insert picture here
          <p>
              After taking highlights NowLedge make it easy to access them, go back to the highlight on the book and have the context.
              As you read the book multiple times and take more and more highlights you will be able to maximize the information you get out of the book.
              Reading the strong pieces again will make you remember the essential information of the book, thus alllowing you to download the book into your brain.
          </p>
        </section>
        <section className="feature">
          <h2 class="section-title">Pay once and get access to all present and future core features.</h2>
          Insert picture here
          <p>
              We believe in a product that could allow everyone to maximize the information out of a book and retain its learning forever.
              Therefore we will be adding more and more features in order to achieve this goal, as a NowLedge customer you will have access
              to all of these future features and still only pay once.
          </p>
        </section>

        <section className="pricing">
            <h2>Insert princing here.</h2>
        </section>
      </main>
    </>
  );
}
