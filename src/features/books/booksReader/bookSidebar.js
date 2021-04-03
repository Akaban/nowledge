// @flow

import { React, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, Icon } from "semantic-ui-react";
import { openModal } from "../../../app/common/modals/modalReducer";

const updateHash = (highlight) => {
  document.location.hash = `highlight-${highlight.id}`;
};

function Sidebar({
  highlights,
  resetHighlights,
  sortHighlights,
  deleteHighlight,
  updateHighlight,
  book,
  openConfirm,
  mixpanel,
  scrollToPageNumber,
}) {
  const history = useHistory();
  const dispatch = useDispatch();

  console.log(book)
  if (!book) return null;
  return (
    <div className="sidebar" style={{ width: "25vw" }}>
      <div className="description" style={{ padding: "1rem" }}>
        {/* <h2 style={{ marginBottom: "1rem" }}>{book.title}</h2> */}

        <p>
          <small>
            Highlight any part of the document to create a new annotation.
          </small>
        </p>
      </div>
      <center>
          <>
            <Button
              onClick={() => {
                mixpanel.track("Book Reader: Click Manage Highlights");
                history.push(`/books/highlights/${book.id}`);
              }}
              color="red"
              content="Manage my highlights"
            />
            <Button
              onClick={() => {
                mixpanel.track("Book Reader: Top of the book");
                scrollToPageNumber(1)
              }}
              color="grey"
              content="Scroll to top"
            />
          {/* <Button
              onClick={() => {
                if (fullScreenMode) {
                window.PdfViewer.viewer._setScale(1.25)
                setFullScreenMode(false)
                }
                else {
                window.PdfViewer.viewer._setScale("page-width")
                setFullScreenMode(true)
                }
              }}
              color="teal"
              content={fullScreenMode ? "Exit fullscreen": "fullscreen"}
            /> */}
          </>
        
      </center>
      <ul className="sidebar__highlights">
        {highlights.map((highlight, index) => (
          <li
            key={index}
            className="sidebar__highlight"
          >
            <div
            onClick={
                () => {
                    updateHash(highlight);
                  }
                } 
            >
              {(Boolean(highlight.comment.text) ||
                Boolean(highlight.comment.notes)) &&
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
              {highlight.content.text ? (
                <blockquote style={{ marginTop: "0.5rem" }}>
                  {`${highlight.content.text
                    .slice(
                      0,
                      highlight.comment.text ||
                        (highlight.comment.notes &&
                          highlight.comment.notes.length >= 1)
                        ? 120
                        : 210
                    )
                    .trim()}…`}
                </blockquote>
              ) : null}
              {highlight.content.image ? (
                <div
                  className="highlight__image"
                  style={{ marginTop: "0.5rem" }}
                >
                  <img src={highlight.content.image} alt={"Screenshot"} />
                </div>
              ) : null}
            </div>
            <div className="highlight__location">
              Page {highlight.position.pageNumber}
              <br />
                <>
                  <Icon
                    name="edit"
                    color="green"
                    link
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
                  <Icon
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
          </li>
        ))}
      </ul>
    </div>
  );}

export default Sidebar;
