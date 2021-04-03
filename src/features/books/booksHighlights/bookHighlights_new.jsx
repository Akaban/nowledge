import React, { useEffect, useRef, useState } from "react";
import { Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  getBooksFromFirestore,
  getBooksMetadataFromFirestore,
  getHighlightsFromFirestore,
} from "../../../app/firestore/firestoreService";
import useFirestoreDoc from "../../../app/hooks/useFirestoreDoc";
import { listenToBooks } from "../bookActions";
import LoadingComponent from "../../../app/layout/LoadingComponents";
import { Confirm, Icon } from "semantic-ui-react";
import { getHighlightsFunctionsFromState } from "../../../app/common/highlights/highlights";
import { getOpenConfirm } from "../../../app/common/confirm/confirm";
import styled from "@emotion/styled/macro";
import "../booksReader/style/App.css";
import "./hover.scss"
import { getFirestoreCollection } from "../../../app/hooks/useFirestoreCollection";
import { mergeBooksMetadata } from "../../../app/common/data/book";
import Masonry from "react-masonry-component";
import { faPercentage } from "@fortawesome/free-solid-svg-icons";
import { openModal } from "../../../app/common/modals/modalReducer";

function Note({ highlight, openConfirm, deleteHighlight, updateHighlight, book }) {
  const gridHighlightItemRef = useRef(null)

  const [isHover, setIsHover] = useState(false)

  const dispatch = useDispatch();

  useEffect(() => {
    if (gridHighlightItemRef && gridHighlightItemRef.current) {
      gridHighlightItemRef.current.addEventListener("mouseenter", () => setIsHover(true))
      gridHighlightItemRef.current.addEventListener("mouseleave", () => setIsHover(false))


      const current = gridHighlightItemRef.current

      return () => {
      current.removeEventListener("mouseenter", () => setIsHover(true))
      current.removeEventListener("mouseleave", () => setIsHover(false))
      }
    }
  }, [gridHighlightItemRef])

  const hasNotes = (Boolean(highlight.comment.text) ||
              (Boolean(highlight.comment.notes) && highlight.comment.notes.length > 0))

  return (
          <div
            className="grid-highlight-item"
            ref={gridHighlightItemRef}
          >
            <div className="grid-highlight-item-actions">
              <>
                <Icon
                  className={isHover ? "visible": "invisible"}
                  name="delete"
                  color="red"
                  link
                  onClick={() => {
                    openConfirm({
                      content:
                        "Are you sure that you want to delete this highlight?",
                      onConfirm: () => {
                        deleteHighlight(highlight.id);
                      },
                    });
                  }}
                />
              </>
            </div>
            <div
            onClick={() => {
              dispatch(
                openModal({
                  modalType: "BookTipModal",
                  modalProps: {
                    highlight,
                    onConfirm: (comment) =>
                      updateHighlight(highlight.id, book.id, {
                        comment,
                      }),
                  },
                })
              );
            }}
            >
            {hasNotes &&
              (highlight.comment.text ? (
                <ul className="sidebar__notes_single">
                  <li>
                    <strong>{highlight.comment.text}</strong>
                  </li>
                </ul>
              ) : highlight.comment.notes ? (
                highlight.comment.notes.length > 1 ? (
                  <ul className="sidebar__notes">
                    {highlight.comment.notes.map((n, k) => (
                      <li key={k}>
                        <strong>{n.name}</strong>
                      </li>
                    ))}
                  </ul>
                ) : highlight.comment.notes.length === 1 ? (
                  <ul className="sidebar__notes_single">
                    <li>
                      <strong>{highlight.comment.notes[0].name}</strong>
                    </li>
                  </ul>
                ) : null
              ) : null)}
            { hasNotes && <hr />}
            {highlight.content.text ? (
              <blockquote className="tip-quote">
                {highlight.content.text.slice(0, 360)}
              </blockquote>
            ) : null}
            </div>
            <div className="grid-highlight-item-location">
              Page {highlight.position.pageNumber}
            </div>
              <a
                style={{display: "table-cell"}}
                href={`/books/${book.id}#highlight-${highlight.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Go to highlight in book
              </a>
          </div>
  )
}

export default function BookHighlights({ match }) {
  const { books } = useSelector((state) => state.books);
  const { loading, error } = useSelector((state) => state.async);
  const dispatch = useDispatch();

  const [bookHighlightState, setBookHighlightState] = useState([]);

  useFirestoreDoc({
    query: () => getBooksFromFirestore(),
    data: (books) => {
      getFirestoreCollection({
        query: () => getBooksMetadataFromFirestore(),
        data: (metadata) => {
          const mergedBooks = mergeBooksMetadata(books.books, metadata);
          dispatch(listenToBooks({ books: mergedBooks }));
        },
      });
    },
    deps: [dispatch],
    name: "getBooksFromFirestore_BookDashboard",
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
  const [confirm, setConfirm] = useState({
    open: false,
    onConfirm: null,
    onCancel: null,
    content: "",
  });
  const openConfirm = getOpenConfirm(confirm, setConfirm);

  if (loading || !books) return <LoadingComponent content="Loading..." />;
  if (error) return <Redirect to="/error" />;
  const book = books.filter((b) => b.id === match.params.id)[0];
  if (bookHighlightState.length === 0) return <Redirect to={`/books/${book.id}`}/>


  const { updateHighlight, deleteHighlight } = getHighlightsFunctionsFromState(
    bookHighlightState
  );

  const highlights = bookHighlightState;

  const highlightsSorted = highlights.sort(function (a, b) {
    const keyA = a.position.pageNumber;
    const keyB = b.position.pageNumber;
    // Compare the 2 dates
    if (keyA === keyB) return 0;
    return keyA > keyB ? 1 : -1;
  });

  return (
    <>
      {/* <NoteContainer> */}
      <Masonry
        className="grid-highlights" // default ''
        options={{
          isFitWidth: true,
          columnWidth: ".grid-sizer",
          itemSelector: ".grid-highlight-item",
          gutter: ".gutter-sizer",
          percentagePosition: true,
        }}
        // options={{gutter: 10}}
        // options={masonryOptions}
      >
        <div className="grid-sizer"></div>
        <div className="gutter-sizer"></div>
        {highlightsSorted.map((highlight, index) => (
          <Note key={index} openConfirm={openConfirm} highlight={highlight} deleteHighlight={deleteHighlight} updateHighlight={updateHighlight} book={book}/>
        ))}
      </Masonry>
      <Confirm
        content={confirm.content}
        open={confirm.open}
        onCancel={confirm.onCancel}
        onConfirm={confirm.onConfirm}
      />
    </>
  );
}
