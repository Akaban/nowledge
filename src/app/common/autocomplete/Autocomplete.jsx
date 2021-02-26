import { React, useState } from "react";
import { Button, ButtonContent, Card, Image } from "semantic-ui-react";

export default function Autocomplete({
  suggestions,
  renderSuggestion,
  accessSuggestions,
  setFieldValue,
  setShowInput,
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
    console.log('setting bookObject in form = ')
    console.log(suggestions[id])
    setFieldValue("bookObject", suggestions[id])
    setShowInput(false)
  }

  function getOnClick(id) {
    return (e) => onClick(e, id);
  }

  function handleReset() {
    setAutocompleteState({
      choice: null,
    });
    resetBookApiReturn()
    resetInput()
    setShowInput(true)
  }

  const { choice } = autocompleteState;

  if (choice && !suggestions) handleReset();

  if (choice == null) {
    if (suggestions !== null) {
        if (suggestions.length > 0)
        {
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
                  <Button
                    content="Select"
                    color="teal"
                    onClick={getOnClick(index)}
                  />
                }
              />
            );
          })}
        </Card.Group>
      );}
      else {
      return <em>No book were found. Try to change the title or the author.</em>;

      }
    } else {
            return <></>
    }
  } else {
    return (
      <div>
        Selected: {renderSuggestion(suggestions[choice])}
        <br />
        <Button content="Reset" onClick={handleReset} color="teal" />
      </div>
    );
  }
}
