import { React, useState, useEffect } from "react";
import Autocomplete from "../../../app/common/autocomplete/Autocomplete";
import { searchBookApi } from "../../../app/common/openlibrary/api";

export default function BookSearchWidget({setFieldValue}) {
  const initial_values = {
    author: "",
    title: ""
  };

  const [values, setValues] = useState(initial_values);
  const [bookApiReturn, setBookApiReturn] = useState(null)
  const [typingTimeout, setTypingTimeout] = useState(null)
  const [showInput, setShowInput] = useState(true)

  function resetBookApiReturn(){
      setBookApiReturn(null)
  }
    
  async function handleBookApiOnChange(title, author) {
        if (!title & !author) {
            return;
        }
        const res = await searchBookApi({title, author})
        console.log(res)
        setBookApiReturn(res)
    }

   function resetInput(){
       setValues(initial_values)
   }

  function handleChange(event) {
    setValues({ ...values, [event.target.name]: event.target.value });
  }

    useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const {title, author} = values
      console.log({title, author})
      handleBookApiOnChange(title, author)
    }, 1500)

    return () => clearTimeout(delayDebounceFn)
  }, [values])

  return (
      <>
      {showInput &&
    <>
      <label>
        Author :
        <input
          type="text"
          name="author"
          value={values.author || ''}
          onChange={handleChange}
        />
      </label>
      <label>
        Title :
        <input
          type="text"
          name="title"
          value={values.title || ''}
          onChange={handleChange}
        />
      </label>

      <br/></>}

      <Autocomplete
        suggestions={bookApiReturn}
        renderSuggestion={(s) => s.title}
        accessSuggestions={(r) => r.docs}
        setFieldValue={setFieldValue}
        setShowInput={setShowInput}
        resetInput={resetInput}
        resetBookApiReturn={resetBookApiReturn}
        isEmptyInput={() => values === initial_values}
        />
      </>
  );
}
