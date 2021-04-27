import cuid from "cuid";
import { Formik, Form } from "formik";
import React from "react";
import { useSelector } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { Button, Header, Segment } from "semantic-ui-react";
import MyTextInput from "../../../app/common/form/MyTextInput";
import LoadingComponent from "../../../app/layout/LoadingComponents";
import WidgetDropzone from "../../../app/common/dropzone/WidgetDropzone";
import { addUserBook } from "../../../app/firestore/firestoreService";
import { toast } from "react-toastify";
import { uploadBook } from "../../../app/backend/book";
import { getPremiumInfo } from "../../../app/backend/premium";
import { store } from "../../../index"
import { listentoPremiumInfo } from "../../profiles/profileActions";
import { checkBackendHealth } from "../../../app/backend/backend";

export async function submitBook(bookPdf) {
  try {
    await checkBackendHealth();
    console.log("submitBook");
    const bookId = cuid();
    const { thumbnail_url, book_metadata } = await uploadBook(bookId, bookPdf);
    await addUserBook({
      id: bookId,
      bookPhotoUrl: thumbnail_url,
      ...book_metadata,
    });
    toast.success("Book successfully added !");
    const premiumInfo = await getPremiumInfo();
    store.dispatch(listentoPremiumInfo(premiumInfo));
  } catch (error) {
    toast.error(error.message);
  }
}

export default function BookForm({ match, history, mixpanel }) {
  const { loading, error } = useSelector((state) => state.async);

  if (loading) return <LoadingComponent content="Loading..." />;

  if (error) return <Redirect to="/error" />;

  return (
    <Segment clearing>
      <Formik
        initialValues={{ hiddenfield: "hiddenvalue" }}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const { bookPdf } = values;

            // if (!bookObject)
            //     throw new Error("You did not provide book data.");
            if (!bookPdf) throw new Error("You did not provide a book file.");

            const bookId = cuid();
            const { thumbnail_url } = await uploadBook(
              bookId,
              bookPdf
            );
            await addUserBook({
              id: bookId,
              bookPhotoUrl: thumbnail_url,
            });
            mixpanel.track("Book Added");
            history.push("/books");
          } catch (error) {
            toast.error(error.message);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, dirty, isValid, setFieldValue }) => (
          <Form className="ui form">
            {/* <Header content='Book Data' sub color='teal'/>
                <BookSearchWidget setFieldValue={setFieldValue} /> */}
            <Header content="Book File" sub color="teal" />
            <WidgetDropzone setFieldValue={setFieldValue} name="bookPdf" />
            {/* <MySelectInput name='category' placeholder='Event category' options={categoryData}/> */}
            <MyTextInput type="hidden" name="hiddenfield" />
            <Button
              loading={isSubmitting}
              disabled={!isValid || !dirty || isSubmitting}
              type="submit"
              floated="right"
              positive
              content="Submit"
            />
            <Button
              disabled={isSubmitting}
              as={Link}
              to="/books"
              type="submit"
              floated="right"
              content="Cancel"
            />
          </Form>
        )}
      </Formik>
    </Segment>
  );
}
