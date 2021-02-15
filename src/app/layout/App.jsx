import { Route, useLocation } from "react-router-dom";
import { Container } from "semantic-ui-react";
import BooksDashboard from "../../features/books/booksDashboard/BooksDashboard";
import HomePage from "../../features/home/HomePage";
import NavBar from "../../features/nav/NavBar";
import ModalManager from "../common/modals/ModalManager";
import {ToastContainer} from 'react-toastify'
import ErrorComponent from "../common/errors/ErrorComponent";
import AccountPage from "../../features/auth/AccountPage";
import { useSelector } from "react-redux";
import LoadingComponent from "./LoadingComponents";
import ProfilePage from "../../features/profiles/ProfilePage/ProfilePage";
import PdfApp from "../../third/pdfhighlighter/App"
import BookReader from "../../features/books/booksReader/bookReader";
import BookForm from "../../features/books/booksForm/BookForm";


function App() {

  const {key} = useLocation();
  const {initialized} = useSelector(state => state.async)

  if (!initialized) return <LoadingComponent content='Loading app...' />

  return (
    <>
      <ModalManager />
      <ToastContainer position='bottom-right' hideProgressBar />
      <Route exact path='/' component={HomePage} />
      <Route
        path={'/(.+)'}
        render={() => (
          <>
      <NavBar/>
      <Container className='main'>
        <Route exact path='/books' component={BooksDashboard} />
        <Route exact path='/books/:id' component={BookReader} />
        <Route exact path='/addBook' component={BookForm} key={key} />
        {/* <Route exact path='/sandbox' component={Sandbox} />
        <Route exact path='/sandbox/pdf' component={PdfApp} /> */}
        {/* <Route path='/events/:id' component={EventDetailedPage} />
        <Route path='/account' component={AccountPage}   />
        <Route path='/profile/:id' component={ProfilePage}   />
        <Route path='/error' component={ErrorComponent}   /> */}
      </Container>
    </>
  )} /> </>
  );
}

export default App;
