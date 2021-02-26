import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Card, Header, Icon, Item, Label, List, Segment } from "semantic-ui-react";

export default function BookListItem({ book }) {
  return (
    <Card
      image={book.bookPhotoUrl}
      as={Link}
      to={`/books/${book.id}`}
      />
  );
}
