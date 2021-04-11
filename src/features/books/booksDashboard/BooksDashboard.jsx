import React, { useState } from "react";
import BookList from "./BookList";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import BookListItemPlaceholder from "./BookListItemPlaceholder";
import {
  getBooksFromFirestore,
  getBooksMetadataFromFirestore,
} from "../../../app/firestore/firestoreService";
import { listenToBooks } from "../bookActions";
import useFirestoreDoc from "../../../app/hooks/useFirestoreDoc";
import { mergeBooksMetadata } from "../../../app/common/data/book";
import LoadingComponent from "../../../app/layout/LoadingComponents";
import { Button, Container, Header, Icon, Segment } from "semantic-ui-react";
import { getFirestoreCollection } from "../../../app/hooks/useFirestoreCollection";
import { Confirm } from "semantic-ui-react";
import { getOpenConfirm } from "../../../app/common/confirm/confirm";
import { UploadBookButton } from "../../nav/NavBar";

export default function BooksDashboard() {
  const { books } = useSelector((state) => state.books);
  const { loading, error } = useSelector((state) => state.async);
  const { authenticated } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useFirestoreDoc({
    query: () => getBooksFromFirestore(),
    data: (books) => {
      getFirestoreCollection({
        query: () => getBooksMetadataFromFirestore(),
        data: (metadata) => {
          const mergedBooks = mergeBooksMetadata(books.books, metadata)
          dispatch(listenToBooks({books:mergedBooks}))
        }}
      )
    },
    deps: [dispatch],
    shouldExecute: authenticated,
    name: "getBooksFromFirestore_BookDashboard"
  });
  if (!authenticated) return <Redirect to="/" />;
  if (!books) return <LoadingComponent content="Loading..." />;
  if (error) return <Redirect to="/error" />;

  if (books.length === 0)
    return (
      <div className="nobook">
        <div>
        <Icon size="massive" name="book" color="blue" />
        <Icon size="massive" name="question" color="grey" /><br/>
</div>
<div>
        <Header size="huge" content="Looks like you don't have a book."/>
        <center><p>Try to add one with this button.</p></center>
        <UploadBookButton color="blue" className="upload-button-empty"/>
        </div>
      </div>
    );

  return (
    <Container className="main">
      <BookList books={books} />
    </Container>
  );
}
