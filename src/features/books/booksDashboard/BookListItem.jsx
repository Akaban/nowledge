import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Header, Icon, Item, Label, List, Segment } from "semantic-ui-react";

export default function BookListItem({ book }) {
  return (
    <Segment>
      <Header>{book.author}</Header>
      <Header>{book.title}</Header>
    <Item.Image
      as={Link}
      to={`/books/${book.id}`}
      size="medium"
      src={book.bookPhotoUrl}
    /></Segment>
  );
}
