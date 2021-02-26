// @flow

import { React, useState } from "react";

import { Button, Icon } from "semantic-ui-react";

const updateHash = (highlight) => {
  document.location.hash = `highlight-${highlight.id}`;
};

function Sidebar({
  highlights,
  resetHighlights,
  sortHighlights,
  deleteHighlight,
  book,
}) {
  const [editMode, setEditMode] = useState(false);

  if (!book) return null;
  return (
    <div
      className="sidebar"
      style={{width: "25vw"}}
    >
      <div className="description" style={{ padding: "1rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>{book.title}</h2>

        <p>
          <small>
            Highlight any part of the document to create a new annotation.
          </small>
        </p>
      </div>
      <center>
        { highlights.length > 0 && 
        <Button
          onClick={() =>
            setEditMode(!editMode)
         }
          color="red"
          content={editMode ? "Reading mode" : "Edit highlights"}
          style={{ marginBottom: "2em" }}
        /> }
        {/* {editMode && (
          <Button.Group>
            <Button
              onClick={() => sortHighlights(book.id)}
              color="teal"
              content="Sort highlights"
            />
          </Button.Group>
        )} */}
      </center>
      <ul className="sidebar__highlights">
        {highlights.map((highlight, index) => (
          <li
            key={index}
            className="sidebar__highlight"
            onClick={
              editMode
                ? () => {}
                : () => {
                    updateHash(highlight);
                  }
            }
          >
            <div>
              <strong>{highlight.comment.text}</strong>
              {highlight.content.text ? (
                <blockquote style={{ marginTop: "0.5rem" }}>
                  {`${highlight.content.text.slice(0, 90).trim()}…`}
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
              {editMode && (
                <Icon
                  name="delete"
                  color="red"
                  link
                  onClick={() => {
                    if (highlights.length === 1) {
                      setEditMode(false)
                    }
                    deleteHighlight(highlight.id)
                  }}
                />
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
