import React from "react";
import { Card } from "semantic-ui-react";
import BookListItem from "./BookListItem";
import { MixpanelConsumer } from "react-mixpanel";

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
  return (
    <MixpanelConsumer>
      {(mixpanel) => (
        <Card.Group itemsPerRow={5}>
          {booksSorted.map((book) => (
            <BookListItem
              book={book}
              key={book.id}
              mixpanel={mixpanel}
            />
          ))}
        </Card.Group>
      )}
    </MixpanelConsumer>
  );
}
