import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Card } from "semantic-ui-react";
import { removeUserBook } from "../../../app/firestore/firestoreService";
import styled from "@emotion/styled/macro";
import { ProgressBar } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { openConfirm } from "../../../app/common/confirm/confirmReducer";
import { checkBackendHealth } from "../../../app/backend/backend";
import { toast } from "react-toastify";
import { isMobile } from "react-device-detect";

import firebase from "../../../app/config/firebase";

function BookCard({ book, deleteBook, mixpanel }) {
  const DisplayOver = styled.div({
    height: "100%",
    left: "0",
    position: "absolute",
    top: "0",
    width: "100%",
    zIndex: 2,
    transition: "background-color 350ms ease",
    padding: "20px 20px 0 20px",
    boxSizing: "border-box",
  });
  const Progress = styled.div({});
  const Hover = styled.div({
    opacity: 0,
    transition: "opacity 350ms ease",
  });

  const Buttons = styled.div({
    paddingTop: "40px",
    paddingBottom: "10px",
  });
  const Background = styled.div({
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    color: "#FFF",
    marginRight: "10px",
    marginBottom: "15px",
    position: "relative",
    width: "206px",
    height: "312px",
    cursor: "pointer",
    backgroundImage: `url(${book.bookPhotoUrl})`,
    transition: "all .3s linear",
    // [`:hover`]: {
    //   top: "-5px",
    // },
    [`:hover ${DisplayOver}`]: {
      backgroundColor: "rgba(0,0,0,0.8)",
    },
    [`:hover ${Progress}`]: {
      display: "none",
    },
    [`:hover ${Hover}`]: {
      opacity: 1,
    },
  });

  const buttonStyle = { width: "100%", marginBottom: "15px" };

  const history = useHistory();
  const progress = book.app_metadata
    ? Math.trunc(
        (book.app_metadata.last_highlight_page_number / book.num_pages) * 100
      )
    : 0;

  const dispatch = useDispatch();

  const user_id = firebase.auth().currentUser.uid

  return (
    <Background>
      <DisplayOver>
        <Hover>
          <Buttons>
            <Button
              content="Read"
              color="blue"
              size="medium"
              style={buttonStyle}
              onClick={() => {
                mixpanel.track("bookDashboard: Click Read Book");
                window.location = `https://backend.nowledge.xyz/api/v1/display_book/${user_id}/${book.id}}`
              }}
            />
            <Button
              content="Highlights"
              color="facebook"
              size="medium"
              style={buttonStyle}
              onClick={() => {
                mixpanel.track("bookDashboard: Click Highlights");
                history.push(`/books/highlights/${book.id}`);
              }}
            />
            <Button
              content="Delete"
              color="orange"
              size="medium"
              style={buttonStyle}
              onClick={() => {
                dispatch(
                  openConfirm({
                    content:
                      "Are you sure that you want to delete this book? Every highlights associated will be deleted as well.",
                    onConfirm: () => {
                      mixpanel.track("bookDashboard: Click Delete Book");
                      deleteBook();
                    },
                  })
                );
              }}
            />
          </Buttons>
        </Hover>
        {progress > 0 && (
          <Progress>
            <ProgressBar variant="success" now={progress} />
          </Progress>
        )}
      </DisplayOver>
    </Background>
  );
}

export default function BookListItem({
  book,
  mixpanel,
  openConfirm,
  noHighlights = false,
}) {
  const [hidden, setHidden] = useState(false);

  const history = useHistory();

  async function handleDeleteBook() {
    try {
      await checkBackendHealth();
      console.log(`Deleting book with id = ${book.id}`);
      setHidden(true);
      removeUserBook(book);
    } catch (error) {
      toast.error(error.message);
    }
  }
  if (hidden) return null;
  if (isMobile) {
    return (
      <Card
        onClick={
          !noHighlights
            ? () => history.push(`/books/highlights/${book.id}`)
            : () => toast.info("This book has no highlights yet, add highlights from a desktop to read it from mobile!")
        }
        image={book.bookPhotoUrl}
      />
    );
  }
  return (
    <BookCard
      book={book}
      deleteBook={handleDeleteBook}
      openConfirm={openConfirm}
      mixpanel={mixpanel}
    />
  );
}
