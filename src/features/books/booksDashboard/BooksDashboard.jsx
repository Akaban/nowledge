import React, { useState } from "react";
import BookList from "./BookList";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import BookListItemPlaceholder from "./BookListItemPlaceholder";
import { getBooksFromFirestore } from "../../../app/firestore/firestoreService";
import { listenToBooks } from "../bookActions";
import useFirestoreDoc from "../../../app/hooks/useFirestoreDoc";
import LoadingComponent from "../../../app/layout/LoadingComponents";
import { Button } from "semantic-ui-react";

export default function BooksDashboard() {
  const { books } = useSelector((state) => state.books);
  const { loading, error } = useSelector((state) => state.async);
  const { authenticated } = useSelector((state) => state.auth);

  const [editMode, setEditMode] = useState(false);

  const dispatch = useDispatch();

  useFirestoreDoc({
    query: () => getBooksFromFirestore(),
    data: (books) => dispatch(listenToBooks(books)),
    deps: [dispatch],
    shouldExecute: authenticated,
  });
  if (!authenticated) return <Redirect to="/" />;
  if (loading) return <LoadingComponent content="Loading..." />;
  if (error) return <Redirect to="/error" />;

  if (books.length === 0)
    return <h1>No books could be found. Add one with upload book form.</h1>;

  return (
    <>
      {loading && (
        <>
          <BookListItemPlaceholder />
          <BookListItemPlaceholder />
        </>
      )}
      {!loading && (
        <>
          <Button
            content={editMode ? "Disable edit mode" : "Edit mode"}
            color={editMode ? "green" : "red"}
            onClick={() => setEditMode(!editMode)}
          />

          <BookList books={books} editMode={editMode} />
        </>
      )}
    </>
  );
}
