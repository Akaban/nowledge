import React from "react";

import FaqComponent from "react-faq-component";

export default function Faq() {
  const data = {
    title: "Frequently Asked Questions",
    rows: [
      {
        title: "What does early access mean?",
        content: `We are releasing NowLedge as a early version before it has all of its features, we built the foundation on which we can lay upon and then build much more features.
        By becoming a customer now you will be part of the adventure of NowLedge and your feedback will highly account for the future of the app!
        But you will still get every features as the end because we will release the next updates as soon as it's available.
        `,
      },
      {
        title: "Can I export my highlights?",
        content: `This is something that we are currently working on, the answer is therefore yes it will be possible at some point!`,
      },
      {
        title: "I would really love to have X feature on NowLedge, is that possible?",
        content: `Yes! NowLedge is still in early stages and a lot more features are coming, if you think that a given feature would be nice to have with NowLedge feel free to give us a feedback with the feedback box on the bottom left part of the window and we will be happy to do our best to answer it!`,
      },
      {
        title: "What limit do I have with the premium plan?",
        content: `The premium plan allow unlimited amount of highlights so you will never have to care about this, you will also have unlimited number of books. A book can weight up to 50MB. The maximum storage space is 3GB for now but if you need more space feel free to contact us.`,
      },
      {
        title: "Can I use NowLedge with documents that are not books?",
        content: `Yes, but as of now NowLedge is mostly focused on books. You can still upload your non-book PDF and use it with NowLedge but the application is not optimized for that right now.
        We're planning to integrate all of the non-books documents differently and in a more optimized fashion. Stay updated!
        `,
      },
      {
        title: "Which document format can I use with NowLedge?",
        content: `As of now, only PDF format is supported. We're thinking about adding an option for the epub format as well. If you have other formats you'd like to use with NowLedge let us know we would be happy to think about it as well!`,
      },
      {
        title: "What about my Kindle/Kobo/(insert reader brand here)? Can I use NowLedge with them?",
        content: `Not really because this is 2 different things, NowLedge is likely a Kindle replacement for those that don't have a reader and prefer to read and take highlights on desktop. You need the PDF file of a book in order to use it on NowLedge, hence you would need to extract the book from the kindle first before using it. (Not easy)`,
      },
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
    <div style={{"maxWidth": "45vw", "margin": "0 auto"}}>
      <FaqComponent data={data} styles={styles} config={config} />
    </div>
  );
}
