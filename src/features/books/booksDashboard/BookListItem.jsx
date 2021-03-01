import React from "react";
import { Button, Card } from "semantic-ui-react";
import { removeUserBook } from "../../../app/firestore/firestoreService";

export default function BookListItem({ book, editMode }) {
  const cardPropsLink = editMode ? {} : { href: `/books/${book.id}` };

  function handleDeleteBook(book) {
    console.log(`Deleting book with id = ${book.id}`);
    removeUserBook(book);
  }
  return (
    <Card
      {...cardPropsLink}
      image={book.bookPhotoUrl}
      extra={
        editMode && (
          <center>
          <Button
            basic
            color="red"
            content="Delete"
            onClick={() => handleDeleteBook(book)}
          /></center>
        )
      }
    />
  );
}
