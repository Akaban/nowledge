import React from "react";
import { Route, useLocation, Switch } from "react-router-dom";
import { Container } from "semantic-ui-react";
import BooksDashboard from "../../features/books/booksDashboard/BooksDashboard";
import HomePage from "../../features/home/HomePage";
import NavBar from "../../features/nav/NavBar";
import ModalManager from "../common/modals/ModalManager";
import { ToastContainer } from "react-toastify";
import ErrorComponent from "../common/errors/ErrorComponent";
import AccountPage from "../../features/auth/AccountPage";
import { useSelector } from "react-redux";
import LoadingComponent from "./LoadingComponents";
import ProfilePage from "../../features/profiles/ProfilePage/ProfilePage";
import BookReader from "../../features/books/booksReader/bookReader";
import BookForm from "../../features/books/booksForm/BookForm";
import BookSearchWidget from "../../features/books/booksForm/BookSearchWidget";
import Sandbox from "../../features/sandbox/Sandbox";
import PrivateRoute from "./PrivateRoute";

function App() {
  const { key } = useLocation();
  const { initialized } = useSelector((state) => state.async);

  if (!initialized) return <LoadingComponent content="Loading app..." />;

  return (
    <>
      <ModalManager />
      <ToastContainer position="bottom-right" hideProgressBar />
      <Route exact path="/" component={HomePage} />
      <Route
        path={"/(.+)"}
        render={() => (
          <>
            <NavBar />
            <Container className="main">
              <Switch>
                <Route exact path="/books" component={BooksDashboard} />
                <PrivateRoute exact path="/books/:id" component={BookReader} />
                <PrivateRoute
                  exact
                  path="/addBook"
                  component={BookForm}
                  key={key}
                />
                <Route
                  exact
                  path="/sandbox/searchBook"
                  component={BookSearchWidget}
                />
                <Route exact path="/sandbox" component={Sandbox} />
                <Route exact path="/error" component={ErrorComponent} />
                <Route component={ErrorComponent} />
              </Switch>
            </Container>
          </>
        )}
      />{" "}
    </>
  );
}

export default App;
