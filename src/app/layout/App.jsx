import React from "react";
import { Route, useLocation, Switch, Redirect } from "react-router-dom";
import { Container } from "semantic-ui-react";
import BooksDashboard from "../../features/books/booksDashboard/BooksDashboard";
import HomePage from "../../features/home/HomePage";
import LandingPage from "../../features/home/LandingPage";
import NavBar from "../../features/nav/NavBar";
import ModalManager from "../common/modals/ModalManager";
import { ToastContainer } from "react-toastify";
import ErrorComponent from "../common/errors/ErrorComponent";
import { useSelector } from "react-redux";
import LoadingComponent from "./LoadingComponents";
import BookReader from "../../features/books/booksReader/bookReader";
import BookForm from "../../features/books/booksForm/BookForm";
import BookSearchWidget from "../../features/books/booksForm/BookSearchWidget";
import Sandbox from "../../features/sandbox/Sandbox";
import PrivateRoute from "./PrivateRoute";
import BookHighlights from "../../features/books/booksHighlights/bookHighlights";
import ProfilePage from "../../features/profiles/ProfilePage/ProfilePage";
import Feedback from "../common/feedback/Feedback";

function App({ mixpanel }) {
  const { key } = useLocation();
  const { initialized } = useSelector((state) => state.async);

  if (!initialized) return <LoadingComponent content="Loading app..." />;

  return (
    <>
      <ModalManager />
      <ToastContainer position="bottom-right" hideProgressBar />
      <Route
        exact
        path="/"
        render={(props) => <HomePage {...props} mixpanel={mixpanel} />}
      />
      <Route
        path={"/(.+)"}
        render={() => (
          <>
            <NavBar mixpanel={mixpanel} />
            <Container className="main">
              <Switch>
                <Route exact path="/books" component={BooksDashboard} />
                <PrivateRoute
                  exact
                  path="/books/:id"
                  component={BookReader}
                  componentProps={{ mixpanel }}
                />
                <PrivateRoute
                  exact
                  path="/books/highlights/:id"
                  component={BookHighlights}
                  componentProps={{ mixpanel }}
                />
                <PrivateRoute
                  exact
                  path="/add-book"
                  component={BookForm}
                  componentProps={{ mixpanel }}
                  key={key}
                />
                <PrivateRoute
                  exact
                  path="/profile"
                  component={ProfilePage}
                  componentProps={{ mixpanel }}
                />
                <Route
                  exact
                  path="/sandbox/search-book"
                  component={BookSearchWidget}
                />
                <Route
                  exact
                  path="/sandbox/landingpage"
                  component={LandingPage}
                />
                <Route exact path="/sandbox" component={Sandbox} />
                <Route
                  exact
                  path="/error"
                  render={(props) => (
                    <ErrorComponent {...props} mixpanel={mixpanel} />
                  )}
                />
                <Route render={(props) => <Redirect to="/error" />} />
              </Switch>
            </Container>
            <Feedback />
          </>
        )}
      />
    </>
  );
}

export default App;
