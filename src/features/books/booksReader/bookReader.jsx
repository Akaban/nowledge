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
import { getHighlightsFunctionsFromState } from "../../../app/common/highlights/highlights";
import { getOpenConfirm } from "../../../app/common/confirm/confirm";
import { Confirm } from "semantic-ui-react";

setPdfWorker(PdfWorkerCdn);

export default function BookReader({ match }) {
  const { books } = useSelector((state) => state.books);
  const { loading, error } = useSelector((state) => state.async);
  const dispatch = useDispatch();

  const [bookUrlState, setBookUrlState] = useState(null);
  const [bookHighlightState, setBookHighlightState] = useState([]);
  const [bookMiscState, setBookMiscState] = useState({})

  const [confirm, setConfirm] = useState({})

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

  const book = books.find((b) => b.id === match.params.id);

  if (loading || !bookHighlightState || !book ) return <LoadingComponent content="Loading..." />;
  if (error) return <Redirect to="/error" />;

  const openConfirm = getOpenConfirm(confirm, setConfirm)

  const resetHash = () => {
    document.location.hash = "";
  };

  const HighlightPopup = ({ comment }) =>
    comment.text ? (
      <div className="Highlight__popup">
        {comment.emoji} {comment.text}
      </div>
    ) : null;

  const resetHighlights = () => {
    setBookHighlightState([]);
  };

  const {
    sortHighlights,
    updateHighlight,
    addHighlight,
    deleteHighlight
  } = getHighlightsFunctionsFromState(bookHighlightState)

  const url = bookUrlState;
  const highlights = bookHighlightState;

  const {
    initPageNumber
  } = bookMiscState

  return (
    <div className="bookReader" style={{ display: "flex", height: "100vh" }}>
      <Sidebar
        highlights={highlights}
        resetHighlights={resetHighlights}
        sortHighlights={sortHighlights}
        deleteHighlight={(highlightId) => deleteHighlight(book.id, highlightId)}
        book={book}
        openConfirm={openConfirm}
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
      <Confirm
        content={confirm.content}
        open={confirm.open}
        onCancel={confirm.onCancel}
        onConfirm={confirm.onConfirm}
      />
    </div>
  );
}
