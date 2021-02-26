import React from "react";
import { Link } from "react-router-dom";
import { Card} from "semantic-ui-react";

export default function BookListItem({ book }) {
  return (
    <Card
      image={book.bookPhotoUrl}
      as={Link}
      to={`/books/${book.id}`}
      />
  );
}
