import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  PdfLoader,
  PdfHighlighter,
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
  getBooksMetadataFromFirestore,
  getHighlightsFromFirestore,
} from "../../../app/firestore/firestoreService";
import useFirestoreDoc from "../../../app/hooks/useFirestoreDoc";
import { listenToBooks } from "../bookActions";
import LoadingComponent from "../../../app/layout/LoadingComponents";
import { getHighlightsFunctionsFromState } from "../../../app/common/highlights/highlights";
import { getOpenConfirm } from "../../../app/common/confirm/confirm";
import { Confirm } from "semantic-ui-react";
import { getBookDownloadURL } from "../../../app/backend/book";
import useAsyncEffect from "../../../app/hooks/useAsyncEffect";
import BookTip from "./BookTip";
import { openModal } from "../../../app/common/modals/modalReducer";
import { getFirestoreCollection } from "../../../app/hooks/useFirestoreCollection";
import { mergeBooksMetadata } from "../../../app/common/data/book";
import MobileNotImplemented from "../../home/MobileNotImplemented";
import { isMobile } from "react-device-detect";
import { toast } from "react-toastify";

setPdfWorker(PdfWorkerCdn);

export default function BookReader({ match, mixpanel, location }) {
  const { books } = useSelector((state) => state.books);
  const { error, loading } = useSelector((state) => state.async);
  const { authenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [bookUrlState, setBookUrlState] = useState(null);
  const [bookHighlightState, setBookHighlightState] = useState([]);
  // const [bookMiscState, setBookMiscState] = useState({});

  const [confirm, setConfirm] = useState({});

  const [scrollToFunRef, setScrollToFunRef] = useState({
    fn: (x) => x,
    initialized: false,
  });

  const [pdfHighlighterInternalFun, setPdfHighlighterInternalFun] = useState({
    funs: {},
    initialized: false,
  });

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
    shouldExecute: authenticated,
    name: "getBooksFromFirestore_BookDashboard",
  });

  useFirestoreDoc({
    query: () => getHighlightsFromFirestore(match.params.id),
    data: (data) => {
      const { highlights } = data;
      setBookHighlightState(highlights);
      // setBookMiscState(rest);
    },
    deps: [match.params.id],
    shouldExecute: authenticated,
    name: "getHighlightsFromFirestore",
  });

  useAsyncEffect({
    fetch: () => getBookDownloadURL(match.params.id),
    after: setBookUrlState,
    deps: [match.params.id],
    name: "getBookDownloadURL",
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

  useEffect(() => {
    if (location.state && location.state.redirected)
      toast.info(
        "Redirecting onto reader because you don't have highlights for this book yet."
      );
  }, [location.state]);

  const book = books ? books.find((b) => b.id === match.params.id) : null;
  if (isMobile) return <MobileNotImplemented />;
  if (loading && (!bookHighlightState || !book || !bookUrlState) && !error)
    return <LoadingComponent content="Loading..." />;
  if (error) return <Redirect to="/error" />;

  const openConfirm = getOpenConfirm(confirm, setConfirm);

  const resetHash = () => {
    document.location.hash = "";
  };

  const HighlightPopup = ({ comment }) =>
    comment.text || (comment.notes && comment.notes.length > 0) ? (
      <div className="Highlight__popup">
        {comment.text ? (
          comment.text
        ) : comment.notes.length === 1 ? (
          <strong>{comment.notes[0].name}</strong>
        ) : (
          <ul className="sidebar__notes">
            {comment.notes.map((n, k) => (
              <li key={k}>
                <strong>{n.name}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>
    ) : null;

  const resetHighlights = () => {
    setBookHighlightState([]);
  };

  const {
    sortHighlights,
    updateHighlight,
    addHighlight,
    deleteHighlight,
  } = getHighlightsFunctionsFromState(bookHighlightState);

  const { scrollToPageNumber } = pdfHighlighterInternalFun.funs;

  const url = bookUrlState;
  const highlights = bookHighlightState;

  const initPageNumber = highlights.length
    ? Math.max(...highlights.map((h) => h.position.pageNumber)) - 1
    : null;

  window.location = url;
  return <h1>Hello!</h1>;
  return (
    <div
      className="bookReader"
      style={{ display: "flex", height: "100vh", width: "100vw" }}
    >
      <Sidebar
        highlights={highlights}
        resetHighlights={resetHighlights}
        sortHighlights={sortHighlights}
        deleteHighlight={(highlightId) => deleteHighlight(book.id, highlightId)}
        updateHighlight={updateHighlight}
        book={book}
        openConfirm={openConfirm}
        mixpanel={mixpanel}
        scrollToPageNumber={scrollToPageNumber}
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
              initHighlightId={parseIdFromHash()}
              onScrollChange={resetHash}
              initPageNumber={initPageNumber}
              tracker={(eventName) => mixpanel.track(eventName)}
              // updateInitPositionOnScrollChange={
              //   (pageNumber) => {
              //     if (!initPageNumber || (pageNumber - 1 > initPageNumber))
              //       updateInitPageNumberInFirestore(book.id, pageNumber - 1);
              //   }
              // }
              pdfScaleValue={"page-width"}
              scrollRef={(scrollTo) => {
                setScrollToFunRef({ fn: () => scrollTo, initialized: true });
                scrollToHighlightFromHash();
              }}
              internalFunsRef={(funs) => {
                setPdfHighlighterInternalFun({
                  funs,
                  initialized: true,
                });
              }}
              onSelectionFinished={(
                position,
                content,
                hideTipAndSelection,
                transformSelection
              ) => (
                <BookTip
                  onOpen={() => {
                    transformSelection();

                    dispatch(
                      openModal({
                        modalType: "BookTipModal",
                        modalProps: {
                          position,
                          content,
                          onConfirm: (comment) => {
                            addHighlight(
                              {
                                content,
                                position,
                                comment,
                                createdAt: new Date(),
                              },
                              book.id
                            );
                            mixpanel.track("Book Reader: Add Book Highlight");
                            hideTipAndSelection();
                          },
                        },
                      })
                    );
                  }}
                  content={content}
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
                    onMouseOver={(popupContent) => {
                      setTip(highlight, (highlight) => popupContent);
                    }}
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
      <Confirm {...confirm} />
    </div>
  );
}
