import React from "react";
import { useLocation } from "react-router-dom";
import FeedBack from "react-feedback-popup";
import { useSelector } from "react-redux";
import { sendFeedback } from "../../backend/feedback";
import { toast } from "react-toastify";
import { isMobile } from "react-device-detect";
import PrintProvider, { Print, NoPrint } from "react-easy-print";

export default function Feedback() {
  const { authenticated } = useSelector((state) => state.auth);
  const { pathname, search, hash } = useLocation();
  if (!authenticated) return null;
  const extraData = { location: { pathname, search, hash } };
  if (pathname.match("/books/((?!highlights)[A-Za-z0-9]+)") || isMobile)
    // Ne pas afficher feedback dans le reader
    return null;
  return (
    <PrintProvider>
      <NoPrint>
        <FeedBack
          style={{ zIndex: "2", marginLeft: "20px", position: "fixed" }}
          position="left"
          numberOfStars={5}
          showEmailInput={false}
          showRatingInput={false}
          showNameInput={false}
          headerText="Hello dear user!"
          bodyText="Greetings from the NowLedge team, we love to receive feedbacks from our users. If you encountered a bug or feel like something could be improved let us now and we will do our best to answer :)"
          buttonText="Have a feedback? Let us now!"
          handleClose={() => console.log("handleclose")}
          handleSubmit={({ message }) => {
            sendFeedback(message, extraData);
            toast.success("Feedback sent!");
          }}
          handleButtonClick={() => console.log("handleButtonClick")}
        />
      </NoPrint>
    </PrintProvider>
  );
}
