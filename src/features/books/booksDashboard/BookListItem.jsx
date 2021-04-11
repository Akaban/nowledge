import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Card } from "semantic-ui-react";
import { removeUserBook } from "../../../app/firestore/firestoreService";
import styled from "@emotion/styled/macro";
import { ProgressBar } from "react-bootstrap";
import {useDispatch} from "react-redux"
import {openConfirm} from "../../../app/common/confirm/confirmReducer"

function BookCard({ book, deleteBook, mixpanel }) {
  const DisplayOver = styled.div({
    height: "100%",
    left: "0",
    position: "absolute",
    top: "0",
    width: "100%",
    zIndex: 2,
    transition: "background-color 350ms ease",
    backgroundColor: "transparent",
    padding: "20px 20px 0 20px",
    boxSizing: "border-box",
  });
  const Progress = styled.div({
  })
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

  const buttonStyle={width: "100%", marginBottom: "15px"}

  const history = useHistory();
  const progress = book.app_metadata ? Math.trunc((book.app_metadata.last_highlight_page_number / book.num_pages)*100) : 0

  const dispatch = useDispatch();
  return (
    <Background>
      <DisplayOver>
        <Hover>
          <Buttons>
            <Button
              content="Read"
              positive
              size="medium"
              style={buttonStyle}
              onClick={
                () => {mixpanel.track("bookDashboard: Click Read Book") ; history.push(`/books/${book.id}`)}
              }
            />
            <Button
              content="Highlights"
              color="teal"
              size="medium"
              style={buttonStyle}
              onClick={
                () => {mixpanel.track("bookDashboard: Click Highlights") ; history.push(`/books/highlights/${book.id}`)}
              }
            />
            <Button
              content="Delete"
              color="red"
              size="medium"
              style={buttonStyle}
            onClick = {
              () => {
                dispatch(openConfirm({
                  content: "Are you sure that you want to delete this book?",
                  onConfirm: () => {
                      mixpanel.track("bookDashboard: Click Delete Book");
                    deleteBook();
                  }
                }))
              }
            }
            />
          </Buttons>
        </Hover>
        {progress > 0 &&
        <Progress>
        <ProgressBar variant="success" now={progress} />
</Progress>}
      </DisplayOver>
    </Background>
  );
}

export default function BookListItem({ book, mixpanel, openConfirm }) {

  const [hidden, setHidden] = useState(false);

  function handleDeleteBook() {
    console.log(`Deleting book with id = ${book.id}`);
    setHidden(true);
    removeUserBook(book);
  }
  if (hidden) return null;
  return <BookCard book={book} deleteBook={handleDeleteBook} openConfirm={openConfirm} mixpanel={mixpanel} />;
}
