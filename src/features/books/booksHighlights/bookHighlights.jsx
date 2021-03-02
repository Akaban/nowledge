import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  getBooksFromFirestore,
  updateHighlightsInFirestore,
  getHighlightsFromFirestore,
  updateInitPageNumberInFirestore,
} from "../../../app/firestore/firestoreService";
import useFirestoreDoc from "../../../app/hooks/useFirestoreDoc";
import { listenToBooks } from "../bookActions";
import LoadingComponent from "../../../app/layout/LoadingComponents";
import { Confirm, Icon } from "semantic-ui-react";
import { getHighlightsFunctionsFromState } from "../../../app/common/highlights/highlights";
import { getOpenConfirm } from "../../../app/common/confirm/confirm";

export default function BookHighlights({ match }) {
  const { books } = useSelector((state) => state.books);
  const { loading, error } = useSelector((state) => state.async);
  const dispatch = useDispatch();

  const [bookHighlightState, setBookHighlightState] = useState([]);
  const [confirm, setConfirm] = useState({
    open: false,
    onConfirm: null,
    onCancel: null,
    content: "",
  });

  useFirestoreDoc({
    query: () => getBooksFromFirestore(),
    data: (books) => {
      dispatch(listenToBooks(books));
    },
    deps: [match.params.id],
    name: "getBooksFromFirestore",
  });

  useFirestoreDoc({
    query: () => getHighlightsFromFirestore(match.params.id),
    data: (data) => {
      const { highlights } = data;
      setBookHighlightState(highlights);
    },
    deps: [match.params.id],
    name: "getHighlightsFromFirestore",
  });

  const book = books.filter((b) => b.id === match.params.id)[0];
  if (loading || !book) return <LoadingComponent content="Loading..." />;
  if (error) return <Redirect to="/error" />;

  const openConfirm = getOpenConfirm(confirm, setConfirm)

  const {
    sortHighlights,
    updateHighlight,
    addHighlight,
    deleteHighlight,
  } = getHighlightsFunctionsFromState(bookHighlightState);

  const highlights = bookHighlightState;

  return (
    <div>
      <h1>Highlights</h1>
      <h2>{book.title}</h2>

      <ul className="bookHighlights__highlights">
        {highlights.map((highlight, index) => (
          <li key={index} className="bookHighlights__highlight">
            <div>
              <strong>{highlight.comment.text}</strong>
              {highlight.content.text ? (
                <blockquote style={{ marginTop: "0.5rem" }}>
                  {`${highlight.content.text}…`}
                </blockquote>
              ) : null}
              {highlight.content.image ? (
                <div
                  className="bookHighlights__image"
                  style={{ marginTop: "0.5rem" }}
                >
                  <img src={highlight.content.image} alt={"Screenshot"} />
                </div>
              ) : null}
            </div>
            <div className="bookHighlights__location">
              Page {highlight.position.pageNumber}
              <br />
            </div>
            <div className="bookHighlights__buttons">
              <Icon
                name="delete"
                color="red"
                link
                onClick={() => {
                  openConfirm({
                    onConfirm: () => deleteHighlight(book.id, highlight.id),
                    content:
                      "Are you sure that you want to delete this highlight?",
                  });
                }}
              />
              <a
                style={{display: "table-cell"}}
                href={`/books/${book.id}#highlight-${highlight.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Go to highlight in book
              </a>
            </div>
          </li>
        ))}
      </ul>
      <Confirm
        content={confirm.content}
        open={confirm.open}
        onCancel={confirm.onCancel}
        onConfirm={confirm.onConfirm}
      />
    </div>
  );
}
