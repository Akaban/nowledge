import React, {useState} from "react";
import {useHistory} from "react-router-dom"
import { Button, Card } from "semantic-ui-react";
import { removeUserBook } from "../../../app/firestore/firestoreService";

export default function BookListItem({ book, editMode, mixpanel }) {
  const history = useHistory();

  const [hidden , setHidden] = useState(false)

  function handleDeleteBook(book) {
    console.log(`Deleting book with id = ${book.id}`);
    setHidden(true)
    removeUserBook(book);
  }
  if (hidden) return null;
  return (
    <Card
      onClick={() => {if (editMode) return null ; mixpanel.track("BookDashboard: Book Click"); history.push(`/books/${book.id}`)} }
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
