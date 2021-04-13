import React from "react";

import FaqComponent from "react-faq-component";

export default function Faq() {
  const data = {
    title: "Frequently Asked Questions",
    rows: [
      {
        title: "What does early access mean?",
        content: `We are releasing NowLedge as a early/pilot version before it has all of its features, we built the foundation on which we can lay upon and then build much more features.
        By buying the early access feature you will be part of the adventure of NowLedge and your feedback will highly account for the future of the app!
        But you will still get every features as the end because we will release the next updates of the app for free :)
        Of course the price is discounted!
        `,
      },
      {
        title: "What is NowLedge aiming at?",
        content:
          `The goal of NowLedge is to build a set of features that will enable the user to leverage the maximum information out of a book, therefore every single one feature that we will release will be aimed at that sole and unique objective.
          There is a lot of amazing books out there but we still don't really have a product aimed at extracting the information out of them, NowLedge wants to achieve that.
          `,
      },
      {
        title: "Can I download my PDF back with the annotations included?",
        content: `This is something that we are currently working on, the answer is therefore yes it will be possible at some point!`,
      },
      {
        title: "What limit do I have with the premium plan?",
        content: `The premium plan allow unlimited amount of highlights so you will never have to care about this, you will have 500MB cloud storage
        that will allow you to upload 50 books. A book can weight up to a generous size of 50MB if you have big books especially those containing images.
        If you need more space we can always find a way around it, don't hesitate to contact bryce@nowledge.xyz.
        `,
      }
    ],
  };

  const styles = {
    bgColor: 'eaeaea',
    titleTextColor: "black",
    rowTitleColor: "black",
    // rowContentColor: 'grey',
    // arrowColor: "red",
  };

  const config = {
    // animate: true,
    // arrowIcon: "V",
    // tabFocus: true
  };

  return (
    <div>
      <FaqComponent data={data} styles={styles} config={config} />
    </div>
  );
}
