import React from "react";
import BookList from "./BookList";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import {
  getBooksFromFirestore,
  getBooksMetadataFromFirestore,
} from "../../../app/firestore/firestoreService";
import { listenToBooks } from "../bookActions";
import useFirestoreDoc from "../../../app/hooks/useFirestoreDoc";
import { mergeBooksMetadata } from "../../../app/common/data/book";
import LoadingComponent from "../../../app/layout/LoadingComponents";
import { Container, Header, Icon } from "semantic-ui-react";
import { getFirestoreCollection } from "../../../app/hooks/useFirestoreCollection";
import { UploadBookButton } from "../../nav/NavBar";
import { isMobile } from "react-device-detect";

export default function BooksDashboard() {
  const { books } = useSelector((state) => state.books);
  const { error } = useSelector((state) => state.async);
  const { authenticated } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  // const tawkToPropertyId = "60820f225eb20e09cf35b923";
  // const tawkToKey = "1f3u0m8k4";

  // window.currentUser = firebase.auth().currentUser;

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
    shouldExecute: authenticated,
    name: "getBooksFromFirestore_BookDashboard",
  });
  if (!authenticated) return <Redirect to="/" />;
  if (!books) return <LoadingComponent content="Loading..." />;
  if (error) return <Redirect to="/error" />;

  if (books.length === 0) {
    if (isMobile) {
      return (
        <>
        <div style={{marginBottom: "50px"}}>
          <Icon size="massive" name="book" color="blue" />
          <Icon size="massive" name="question" color="grey" />
          <br />
        </div>
        <div>
          <Header size="large" content="Looks like you don't have any book :)" />
          <center>
            <p style={{fontSize: "17px"}}><b>Come back on a desktop to add a book and highlights.</b></p>
            <p style={{fontSize: "17px"}}><b>On mobile you can only read highlights, not add them.</b></p>
          </center>
        </div></>
      );
    }
    else {

    return (
      <div className="nobook">
        <div>
          <Icon size="massive" name="book" color="blue" />
          <Icon size="massive" name="question" color="grey" />
          <br />
        </div>
        <div>
          <Header size="huge" content="Looks like you don't have any book." />
          <center>
            <p>Try to add one with this button.</p>
          </center>
          <UploadBookButton color="blue" className="upload-button-empty" />
        </div>
      </div>
    );
    }
  }

  return (
    <Container className="main">
      <BookList books={books} />
    </Container>
  );
}
