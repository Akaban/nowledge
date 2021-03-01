import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  PdfLoader,
  PdfHighlighter,
  Tip,
  Highlight,
  Popup,
  AreaHighlight,
  setPdfWorker,
} from "react-pdf-highlighter";

import Spinner from "./bookSpinner";
import Sidebar from "./bookSidebar";

import "./style/App.css";
import { PdfWorkerCdn } from "../../../app/config/react-pdf-highlighter";
import {
  getBooksFromFirestore,
  updateHighlightsInFirestore,
  getHighlightsFromFirestore,
  updateInitPageNumberInFirestore,
} from "../../../app/firestore/firestoreService";
import useFirestoreDoc from "../../../app/hooks/useFirestoreDoc";
import { listenToBooks } from "../bookActions";
import LoadingComponent from "../../../app/layout/LoadingComponents";

setPdfWorker(PdfWorkerCdn);

export default function BookReader({ match }) {
  const { books } = useSelector((state) => state.books);
  const { loading, error } = useSelector((state) => state.async);
  const dispatch = useDispatch();

  const [bookUrlState, setBookUrlState] = useState(null);
  const [bookHighlightState, setBookHighlightState] = useState([]);
  const [bookMiscState, setBookMiscState] = useState({})

  const [scrollToFunRef, setScrollToFunRef] = useState({
    fn: (x) => x,
    initialized: false,
  });

  useFirestoreDoc({
    query: () => getBooksFromFirestore(),
    data: (books) => {
      dispatch(listenToBooks(books));
      const book = books.books.filter((b) => b.id === match.params.id)[0];
      setBookUrlState(book.bookPdfUrl);
    },
    deps: [match.params.id],
    name: "getBooksFromFirestore",
  });

  useFirestoreDoc({
    query: () => getHighlightsFromFirestore(match.params.id),
    data: (data) => {
      const {highlights, ...rest} = data
      setBookHighlightState(highlights);
      setBookMiscState(rest)
    },
    deps: [match.params.id],
    name: "getHighlightsFromFirestore",
  });

  const parseIdFromHash = () =>
    document.location.hash.slice("#highlight-".length);

  function getHighlightById(id) {
    return bookHighlightState.find((highlight) => highlight.id === id);
  }

  const scrollToHighlightFromHash = () => {
    const highlight = getHighlightById(parseIdFromHash());

    if (highlight) {
      if (!scrollToFunRef.initialized) return;
      scrollToFunRef.fn()(highlight);
    }
  };

  useEffect(() =>
    window.addEventListener("hashchange", scrollToHighlightFromHash, false)
  );

  if (loading) return <LoadingComponent content="Loading..." />;
  if (error) return <Redirect to="/error" />;

  const book = books.filter((b) => b.id === match.params.id)[0];

  const getNextId = () => String(Math.random()).slice(2);

  const resetHash = () => {
    document.location.hash = "";
  };

  const HighlightPopup = ({ comment }) =>
    comment.text ? (
      <div className="Highlight__popup">
        {comment.emoji} {comment.text}
      </div>
    ) : null;

  // const searchParams = new URLSearchParams(document.location.search);

  const resetHighlights = () => {
    setBookHighlightState([]);
  };

  async function deleteHighlight(bookId, highlightId){
    const highlights = bookHighlightState.filter(e => e.id !== highlightId)
    await updateHighlightsInFirestore(bookId, highlights);
    setBookHighlightState(highlights)
  }

  async function addHighlight(highlight, bookId) {
    // console.log(`booksHighlightStateId = ${bookHighlightStateDebug.id}`)
    const highlights = bookHighlightState;

    // console.log("Saving highlight", highlight);
    // console.log("old highlights = ")
    // console.log(highlights)

    const new_highlights = [{ ...highlight, id: getNextId() }, ...highlights];
    // console.log("new highlights = ")
    // console.log(new_highlights)

    setBookHighlightState(new_highlights);
    await updateHighlightsInFirestore(bookId, new_highlights);
  }

  async function sortHighlights(bookId) {
    function sortByPageNumberAscending(h1, h2) {
      return h2.position.pageNumber - h1.position.pageNumber;
    }
    const highlights = bookHighlightState;

    console.log("Sorting highlights by page number");

    const new_highlights = highlights.sort(sortByPageNumberAscending);

    console.log(new_highlights.map(e => e.position.pageNumber))

    setBookHighlightState(new_highlights);
    await updateHighlightsInFirestore(bookId, new_highlights)
  }

  async function updateHighlight(highlightId, position, content, bookId) {
    console.log("Updating highlight", highlightId, position, content);

    const highlights = 
      bookHighlightState.map((h) => {
        const { id, originalPosition, originalContent, ...rest } = h;
        return id === highlightId
          ? {
              id,
              position: { ...originalPosition, ...position },
              content: { ...originalContent, ...content },
              ...rest,
            }
          : h;
      });

    console.log(highlights)

    await updateHighlightsInFirestore(bookId, highlights);
    setBookHighlightState(highlights);
  }

  const url = bookUrlState;
  const highlights = bookHighlightState;

  const {
    initPageNumber
  } = bookMiscState

  // console.log("book=")
  // console.log(book)

  return (
    <div className="bookReader" style={{ display: "flex", height: "100vh" }}>
      <Sidebar
        highlights={highlights}
        resetHighlights={resetHighlights}
        sortHighlights={sortHighlights}
        deleteHighlight={(highlightId) => deleteHighlight(book.id, highlightId)}
        book={book}
      />
      <div
        style={{
          height: "100vh",
          width: "75vw",
          position: "relative",
        }}
      >
        <PdfLoader url={url} beforeLoad={<Spinner />}>
          {(pdfDocument) => (
            <PdfHighlighter
              pdfDocument={pdfDocument}
              enableAreaSelection={(event) => null}
              onScrollChange={resetHash}
              initPageNumber={initPageNumber}
              updateInitPositionOnScrollChange={
                (pageNumber) => {
                  updateInitPageNumberInFirestore(book.id, pageNumber - 1)
                }
              }
              // pdfScaleValue="page-width"
              scrollRef={(scrollTo) => {
                setScrollToFunRef({ fn: () => scrollTo, initialized: true });
                scrollToHighlightFromHash();
              }}
              onSelectionFinished={(
                position,
                content,
                hideTipAndSelection,
                transformSelection
              ) => (
                <Tip
                  onOpen={transformSelection}
                  onConfirm={(comment) => {
                    addHighlight({ content, position, comment }, book.id);

                    hideTipAndSelection();
                  }}
                />
              )}
              highlightTransform={(
                highlight,
                index,
                setTip,
                hideTip,
                viewportToScaled,
                screenshot,
                isScrolledTo
              ) => {
                const isTextHighlight = !Boolean(
                  highlight.content && highlight.content.image
                );

                const component = isTextHighlight ? (
                  <Highlight
                    isScrolledTo={isScrolledTo}
                    position={highlight.position}
                    comment={highlight.comment}
                  />
                ) : (
                  <AreaHighlight
                    highlight={highlight}
                    onChange={(boundingRect) => {
                      updateHighlight(
                        highlight.id,
                        { boundingRect: viewportToScaled(boundingRect) },
                        { image: screenshot(boundingRect) },
                        book.id
                      );
                    }}
                  />
                );

                return (
                  <Popup
                    popupContent={<HighlightPopup {...highlight} />}
                    onMouseOver={(popupContent) =>
                      setTip(highlight, (highlight) => popupContent)
                    }
                    onMouseOut={hideTip}
                    key={index}
                    children={component}
                  />
                );
              }}
              highlights={highlights}
            />
          )}
        </PdfLoader>
      </div>
    </div>
  );
}
