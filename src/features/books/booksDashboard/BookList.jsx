import React from "react";
import { Card } from "semantic-ui-react";
import BookListItem from "./BookListItem";
import { MixpanelConsumer } from "react-mixpanel";

export default function BookList({ books, editMode }) {
  return (
    <MixpanelConsumer>
      {(mixpanel) => (
        <Card.Group itemsPerRow={5}>
          {books.map((book) => (
            <BookListItem book={book} key={book.id} editMode={editMode} mixpanel={mixpanel} />
          ))}
        </Card.Group>
      )}
    </MixpanelConsumer>
  );
}
