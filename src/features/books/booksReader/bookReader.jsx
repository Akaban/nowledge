import React, { Component, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';

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

setPdfWorker(PdfWorkerCdn)

export default function BookReader({ match }) {

  const book = useSelector(state => state.books.books).find(e => e.id === match.params.id)

  const initial_values = {
    url: book.bookPdfUrl,
    highlights: [],
  };

  const [bookState, setBookState] = useState(initial_values);
  const getNextId = () => String(Math.random()).slice(2);

  const parseIdFromHash = () =>
    document.location.hash.slice("#highlight-".length);

  const resetHash = () => {
    document.location.hash = "";
  };

  const HighlightPopup = ({ comment }) =>
    comment.text ? (
      <div className="Highlight__popup">
        {comment.emoji} {comment.text}
      </div>
    ) : null;

  const searchParams = new URLSearchParams(document.location.search);

  const resetHighlights = () => {
      setBookState({...bookState, highlights: []})
  }

  const toggleDocument = () => {

    setBookState({
        url: book.bookPdfURL,
        highlights: []
    })

  };

  let scrollViewerTo = (highlight) => {};

  const scrollToHighlightFromHash = () => {
    const highlight = getHighlightById(parseIdFromHash());

    if (highlight) {
      scrollViewerTo(highlight);
    }
  };

  function componentDidMount() {
    window.addEventListener(
      "hashchange",
      this.scrollToHighlightFromHash,
      false
    );
  }

  function getHighlightById(id) {
    const { highlights } = this.state;

    return highlights.find(highlight => highlight.id === id);
  }

  function addHighlight(highlight) {
    const { highlights } = bookState;

    console.log("Saving highlight", highlight);

    setBookState({
        ...bookState,
      highlights: [{ ...highlight, id: getNextId() }, ...highlights]
    });
  }

  function updateHighlight(highlightId, position, content) {
    console.log("Updating highlight", highlightId, position, content);

    setBookState({
        highlights: bookState.highlight.map(h => {
            const {
                id,
                originalPosition,
                originalContent,
                ...rest
            } = h;
        return id === highlightId
        ? {
            id,
            position: { ...originalPosition, ...position},
            content: { ...originalContent, ...content},
            ...rest
        }
        : h;
        })
    })

      }

    const {url, highlights} = bookState

    return (
      <div className="bookReader" style={{ display: "flex", height: "100vh" }}>
        <Sidebar
          highlights={highlights}
          resetHighlights={resetHighlights}
          toggleDocument={toggleDocument}
        />
        <div
          style={{
            height: "100vh",
            width: "75vw",
            position: "relative"
          }}
        >
          <PdfLoader url={url} beforeLoad={<Spinner />}>
            {pdfDocument => (
              <PdfHighlighter
                pdfDocument={pdfDocument}
                enableAreaSelection={event => event.altKey}
                onScrollChange={resetHash}
                // pdfScaleValue="page-width"
                scrollRef={scrollTo => {
                  scrollViewerTo = scrollTo;

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
                    onConfirm={comment => {
                      addHighlight({ content, position, comment });

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
                      onChange={boundingRect => {
                        updateHighlight(
                          highlight.id,
                          { boundingRect: viewportToScaled(boundingRect) },
                          { image: screenshot(boundingRect) }
                        );
                      }}
                    />
                  );

                  return (
                    <Popup
                      popupContent={<HighlightPopup {...highlight} />}
                      onMouseOver={popupContent =>
                        setTip(highlight, highlight => popupContent)
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