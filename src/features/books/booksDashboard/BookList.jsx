import React from "react";
import { Card, Header } from "semantic-ui-react";
import BookListItem from "./BookListItem";
import { MixpanelConsumer } from "react-mixpanel";
import { isMobile } from "react-device-detect";

const _ = require("lodash")

export default function BookList({ books }) {
  const booksSorted = books.sort(function (a, b) {
    if (!a.app_metadata) return 1;
    if (!b.app_metadata) return -1;
    const keyA = a.app_metadata.last_highlight_date;
    const keyB = b.app_metadata.last_highlight_date;
    // Compare the 2 dates
    if (keyA === keyB) return 0;
    if (!keyA) return 1;
    if (!keyB) return -1;
    return keyA < keyB ? 1 : -1;
  });

  const [reading, rest] = _.partition(books, b => Boolean(b.app_metadata.last_highlight_date))

  return (
    <MixpanelConsumer>
      {(mixpanel) => (
        <>
        {reading.length > 0 &&
        <div style={{"marginBottom": "85px"}}>
        <Header content="Reading" size="huge"/>
        <Card.Group itemsPerRow={isMobile ? 2 : 5}>
          {reading.map((book) => (
            <BookListItem
              book={book}
              key={book.id}
              mixpanel={mixpanel}
            />

          ))}
        </Card.Group></div>}
        <Card.Group itemsPerRow={isMobile ? 2 : 5}>
          {rest.map((book) => (
            <BookListItem
              book={book}
              key={book.id}
              mixpanel={mixpanel}
              noHighlights
            />

          ))}
        </Card.Group>
        </>
      )}
    </MixpanelConsumer>
  );
}
