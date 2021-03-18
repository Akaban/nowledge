import React from "react"
import { useLocation } from "react-router-dom"
import FeedBack from "react-feedback-popup";
import { useSelector } from "react-redux";
import { sendFeedback } from "../../backend/feedback";

export default function Feedback(){
  const { authenticated } = useSelector((state) => state.auth);
  const { pathname, search, hash } = useLocation();
  if (!authenticated) return null;
  const extraData = {location: {pathname, search, hash}}
    return (
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
              handleSubmit={({message}) => sendFeedback(message, extraData) }
              handleButtonClick={() => console.log("handleButtonClick")}
            />
    )
}