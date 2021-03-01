import { React, useState, useEffect } from "react";
import { Button, Card, Grid } from "semantic-ui-react";
import Autocomplete from "../../../app/common/autocomplete/Autocomplete";
import { searchBookApi } from "../../../app/common/openlibrary/api";
import LoadingComponent from "../../../app/layout/LoadingComponents";

export default function BookSearchWidget({ setFieldValue }) {
  const initial_values = {
    author: "",
    title: "",
  };

  const [values, setValues] = useState(initial_values);
  const [bookApiReturn, setBookApiReturn] = useState(null);
  const [showInput, setShowInput] = useState(true);
  const [showHelp, setShowHelp] = useState(true);
  const [apiLoading, setApiLoading] = useState(null);

  function resetBookApiReturn() {
    setBookApiReturn(null);
  }

  async function handleBookApi(title, author) {
    setApiLoading(true);
    const res = await searchBookApi({ title, author });
    setBookApiReturn(res);
    setApiLoading(false);
  }

  function handleSearchReset() {
    const { title, author } = values;
    resetBookApiReturn();
  }

  function handleSearch() {
    const { title, author } = values;
    handleBookApi(title, author);
  }

  function resetInput() {
    setValues(initial_values);
  }

  function handleChange(event) {
    setValues({ ...values, [event.target.name]: event.target.value });
    setShowHelp(false);
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearchReset();
    }, 100);

    return () => clearTimeout(delayDebounceFn);
  }, [values]);

  return (
    <>
      {showInput && (
        <>
          <Grid>
            <Grid.Column width={6}>
          <label>
            Author :
            <input
              size="10"
              type="text"
              name="author"
              value={values.author || ""}
              onChange={handleChange}
              style={{ width: "10em", height: "1em", marginLeft: ".5em" }}
            />
          </label>
          <br/>
          <label>
            Title :
            <input
              size="10"
              type="text"
              name="title"
              value={values.title || ""}
              onChange={handleChange}
              style={{ width: "10em", height: "1em", marginLeft: "1.5em" }}
            />
          </label>
          
          </Grid.Column>

          <Grid.Column>
          <Button
            type="button"
            content="Search"
            color="blue"
            onClick={handleSearch}
          />
          </Grid.Column>

          </Grid>


          {showHelp && (
            <p>
              <i>Search for your book here by typing a title or an author.</i>
            </p>
          )}
        </>
      )}

      {apiLoading ? (
        <LoadingComponent content="Searching for your book..." />
      ) : (
        <Autocomplete
          suggestions={bookApiReturn}
          accessSuggestions={(r) => r.docs}
          setFieldValue={setFieldValue}
          setShowInput={setShowInput}
          setShowHelp={setShowHelp}
          resetInput={resetInput}
          resetBookApiReturn={resetBookApiReturn}
          isEmptyInput={() => values === initial_values}
        />
      )}
    </>
  );
}
