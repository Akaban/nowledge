import React from "react";
import { Link } from "react-router-dom";
import { Button, Card, Image } from "semantic-ui-react";
import { removeUserBook } from "../../../app/firestore/firestoreService";

export default function BookListItem({ book, editMode }) {
  const cardPropsLink = editMode ? {} : { href: `/books/${book.id}` };

  function handleDeleteBook(book) {
    console.log(`Deleting book with id = ${book.id}`);
    removeUserBook(book);
  }
  return (
    // <Card>
    //   <Image src={book.bookPhotoUrl} as={Link} to={`/books/${book.id}`}/>
    //   { editMode &&
    //   <Card.Content extra>
    //     <Button color='red' content='Delete book' onClick={() => console.log(book)} />
    //   </Card.Content>}
    // </Card>
    <Card
      {...cardPropsLink}
      image={book.bookPhotoUrl}
      extra={
        editMode && (
          <Button
            basic
            color="red"
            content="Delete book"
            onClick={() => handleDeleteBook(book)}
          />
        )
      }
    />
  );
}
