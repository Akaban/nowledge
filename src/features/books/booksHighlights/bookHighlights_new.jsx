import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { Icon } from "semantic-ui-react";
import { getHighlightsFunctionsFromState } from "../../../app/common/highlights/highlights";
import { openConfirm } from "../../../app/common/confirm/confirmReducer";
import "../booksReader/style/App.css";
import "./hover.scss";
import { getFirestoreCollection } from "../../../app/hooks/useFirestoreCollection";
import { mergeBooksMetadata } from "../../../app/common/data/book";
import Masonry from "react-masonry-component";
import { openModal } from "../../../app/common/modals/modalReducer";
import { isMobile } from "react-device-detect";
import PrintProvider, { Print, NoPrint } from "react-easy-print";

function Note({
  highlight,
  deleteHighlight,
  updateHighlight,
  book,
  className,
  gridSizer,
}) {
  const gridHighlightItemRef = useRef(null);

  const [isHover, setIsHover] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (gridHighlightItemRef && gridHighlightItemRef.current) {
      gridHighlightItemRef.current.addEventListener("mouseenter", () =>
        setIsHover(true)
      );
      gridHighlightItemRef.current.addEventListener("mouseleave", () =>
        setIsHover(false)
      );

      const current = gridHighlightItemRef.current;

      return () => {
        current.removeEventListener("mouseenter", () => setIsHover(true));
        current.removeEventListener("mouseleave", () => setIsHover(false));
      };
    }
  }, [gridHighlightItemRef]);

  const hasNotes =
    Boolean(highlight.comment.text) ||
    (Boolean(highlight.comment.notes) && highlight.comment.notes.length > 0);

  return (
    <div
      className={className}
      style={{ width: gridSizer }}
      ref={gridHighlightItemRef}
    >
      <div className="grid-highlight-item-actions">
        <NoPrint>
          <Icon
            className={isHover ? "visible" : "invisible"}
            name="delete"
            color="red"
            link
            onClick={() => {
              dispatch(
                openConfirm({
                  content:
                    "Are you sure that you want to delete this highlight?",
                  onConfirm: () => deleteHighlight(book.id, highlight.id),
                })
              );
            }}
          />
        </NoPrint>
      </div>
      <div
        onClick={
          isMobile
            ? () => {}
            : () => {
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
              }
        }
      >
        {hasNotes &&
          (highlight.comment.text ? (
            <ul className="sidebar__notes_single">
              <li style={{ fontSize: "1.1em" }}>
                <strong>{highlight.comment.text}</strong>
              </li>
            </ul>
          ) : highlight.comment.notes ? (
            highlight.comment.notes.length > 1 ? (
              <ul className="sidebar__notes">
                {highlight.comment.notes.map((n, k) => (
                  <li key={k} style={{ fontSize: "1.1em" }}>
                    <strong>{n.name}</strong>
                  </li>
                ))}
              </ul>
            ) : highlight.comment.notes.length === 1 ? (
              <ul className="sidebar__notes_single">
                <li style={{ fontSize: "1.1em" }}>
                  <strong>{highlight.comment.notes[0].name}</strong>
                </li>
              </ul>
            ) : null
          ) : null)}
        {hasNotes && <hr />}
        {highlight.content.text ? (
          <blockquote className="tip-quote">
            {highlight.content.text.slice(0, 360) +
              (highlight.content.text.length > 360 ? "..." : "")}
          </blockquote>
        ) : null}
      </div>
      <div className="grid-highlight-item-location">
        Page {highlight.position.pageNumber}
      </div>
      <NoPrint>
        {!isMobile && (
          <a
            style={{ display: "table-cell" }}
            href={`/books/${book.id}#highlight-${highlight.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Go to highlight in book
          </a>
        )}
      </NoPrint>
    </div>
  );
}

function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });
  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}

export default function BookHighlights({ match }) {
  const { books } = useSelector((state) => state.books);
  const { error } = useSelector((state) => state.async);
  const dispatch = useDispatch();

  const [bookHighlightState, setBookHighlightState] = useState(null);

  const [masonryRef, setMasonryRef] = useState(null);

  const onRefChange = useCallback((node) => {
    // ref value changed to node
    if (node === null) {
      // node is null, if DOM node of ref had been unmounted before
    } else {
      setMasonryRef(node.masonry); // e.g. change ref state to trigger re-render
      window.masonry = node.masonry
      //
    }
  }, []);

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

  // useEffect(() => {
  //   if (masonryRef) {
  //     window.masonry = masonryRef
  //     console.log("useEffect: masonry.layout")
  //     setTimeout(() => masonryRef.layout(), 500);
  //   }
  // }, [masonryRef])

  const windowSize = useWindowSize();

  useEffect(() => {
    if (masonryRef) {
      const delayDebounceResize = setTimeout(() => {
        masonryRef.layout();
      }, 500);
      return () => {
        clearTimeout(delayDebounceResize);
      };
    }
  }, [windowSize, masonryRef]);

  // useEffect(() => {
  //   if (masonryRef) {
  //     const handleDomLoaded = function (event) {
  //       console.log("Running layout after DOMContentLoaded");
  //       masonryRef.layout();
  //     };
  //     console.log("registered handleDomLoaded")
  //     document.addEventListener("DOMContentLoaded", handleDomLoaded);
  //     return () =>
  //       document.removeEventListener("DOMContentLoaded", handleDomLoaded);
  //   }
  //   else {
  //     console.log("masonryRef.current not available")
  //   }
  // }, []);

  if ((!books || !bookHighlightState) && !error)
    return <LoadingComponent content="Loading..." />;
  if (error) return <Redirect to="/error" />;
  const book = books.filter((b) => b.id === match.params.id)[0];
  if (bookHighlightState.length === 0)
    return (
      <Redirect
        to={{ pathname: `/books/${book.id}`, state: { redirected: true } }}
      />
    );

  const { updateHighlight, deleteHighlight } = getHighlightsFunctionsFromState(
    bookHighlightState
  );

  const highlights = bookHighlightState;

  const gridSizer = "23%";
  const gutterSizer = "2%";

  const highlightsSorted = highlights.sort(function (a, b) {
    const keyA = a.position.pageNumber;
    const keyB = b.position.pageNumber;
    // Compare the 2 dates
    if (keyA === keyB) return 0;
    return keyA > keyB ? 1 : -1;
  });

  return (
    <PrintProvider>
      {/* <NoteContainer> */}
      {highlights.length > 3 && !isMobile ? (
        <Masonry
          className="grid-highlights" // default ''
          ref={onRefChange}
          options={{
            columnWidth: ".grid-sizer",
            itemSelector: ".grid-highlight-item",
            gutter: 5,
            percentagePosition: true,
          }}
          // options={{gutter: 10}}
          // options={masonryOptions}
        >
          <div className="grid-sizer" style={{ width: gridSizer }}></div>
          <div className="grid-gutter" style={{ width: gutterSizer }}></div>
          {highlightsSorted.map((highlight, index) => (
            <Note
              key={index}
              openConfirm={openConfirm}
              highlight={highlight}
              deleteHighlight={deleteHighlight}
              updateHighlight={updateHighlight}
              book={book}
              gridSizer={gridSizer}
              className="grid-highlight-item"
            />
          ))}
        </Masonry>
      ) : (
        <div className="grid-highlights-less5">
          {highlightsSorted.map((highlight, index) => (
            <Note
              key={index}
              openConfirm={openConfirm}
              highlight={highlight}
              deleteHighlight={deleteHighlight}
              updateHighlight={updateHighlight}
              book={book}
              className="grid-highlight-item-less5"
            />
          ))}
        </div>
      )}
    </PrintProvider>
  );
}
