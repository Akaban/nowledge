const model =  {
  formId: 'bookForm',
  formField: {
    bookTitle: {
      name: 'bookTitle',
      label: 'Title',
    },
    bookAuthor: {
      name: 'bookAuthor',
      label: 'Author',
    },
  },
  formSteps: ["Upload book", "Add metadata"]
};

export default model;