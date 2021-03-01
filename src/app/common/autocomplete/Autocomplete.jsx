import { React, useState } from "react";
import { Button, Card, Header } from "semantic-ui-react";

export default function Autocomplete({
  suggestions,
  renderSuggestion,
  accessSuggestions,
  setFieldValue,
  setShowInput,
  setShowHelp,
  resetInput,
  isEmptyInput,
  resetBookApiReturn,
  maxSuggestions = 20,
}) {
  const [autocompleteState, setAutocompleteState] = useState({
    choice: null,
  });

  if (suggestions) suggestions = accessSuggestions(suggestions);

  function onClick(e, id) {
    setAutocompleteState({
      choice: id,
    });
    setFieldValue("bookObject", suggestions[id]);
    setShowInput(false);
  }

  function getOnClick(id) {
    return (e) => onClick(e, id);
  }

  function handleReset() {
    setAutocompleteState({
      choice: null,
    });
    resetBookApiReturn();
    resetInput();
    setShowInput(true);
    setShowHelp(true)
  }

  const { choice } = autocompleteState;

  if (choice && !suggestions) handleReset();

  if (choice == null) {
    if (suggestions !== null) {
      if (suggestions.length > 0) {
        return (
          <Card.Group>
            {suggestions.slice(0, maxSuggestions).map((suggestion, index) => {
              return (
                <Card
                  key={index}
                  image={suggestion.thumbnail_url}
                  header={suggestion.title}
                  meta={suggestion.author}
                  extra={
                    <center>
                      <Button
                        content="Select"
                        color="teal"
                        onClick={getOnClick(index)}
                      />
                    </center>
                  }
                />
              );
            })}
          </Card.Group>
        );
      } else {
        return (
          <Header content="No books were found. Try to change the title or the author." />
        );
      }
    } else {
      return <></>;
    }
  } else {
    const suggestion = suggestions[choice];
    return (
      <center>
        <Card
          className="selected-book-thumbnail"
          image={suggestion.thumbnail_url}
          header={suggestion.title}
          meta={suggestion.author}
          extra={
            <center>
              <Button content="Reset" color="red" onClick={handleReset} />
            </center>
          }
        />
        </center>

    );
  }
}
