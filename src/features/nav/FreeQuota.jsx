import React from "react";
import { useSelector } from "react-redux";
import { ProgressBar } from "react-bootstrap";
import {
  getBooksFromFirestore,
  getBooksMetadataFromFirestore,
} from "../../app/firestore/firestoreService";
import { useDispatch } from "react-redux";
import useFirestoreDoc from "../../app/hooks/useFirestoreDoc";
import { getFirestoreCollection } from "../../app/hooks/useFirestoreCollection";
import { mergeBooksMetadata } from "../../app/common/data/book";
import { listenToBooks } from "../books/bookActions";

export default function FreeQuota() {
  const books = useSelector((state) => state.books);
  const { authenticated } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useFirestoreDoc({
    query: () => getBooksFromFirestore(),
    data: (books) => {
      getFirestoreCollection({
        query: () => getBooksMetadataFromFirestore(),
        data: (metadata) => {
          const mergedBooks = mergeBooksMetadata(books.books, metadata);
          dispatch(listenToBooks({ books: mergedBooks }));
        },
      });
    },
    deps: [dispatch],
    shouldExecute: authenticated && !books,
    name: "getBooksFromFirestore_FreeQuota",
  });

  if (!books) return null;
  const books_count = books.books ? books.books.length : 0;
  const max_books = 1;

  return (
      <div style={{ float: "left", marginLeft: "10px" }}>
        <ProgressBar
          striped
          variant={books_count >= max_books ? "danger" : "warning"}
          now={Math.round((books_count / max_books) * 100)}
        />
        <strong>
          {books_count} / {max_books} books
        </strong>
      </div>
  );
}
