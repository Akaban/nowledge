export function mergeBooksMetadata(books, metadata) {
  let merged = [];

  for (let i = 0; i < books.length; i++) {
    merged.push({
      ...books[i],
      app_metadata: metadata.find((itmInner) => itmInner.id === books[i].id),
    });
  }
  return merged;
}
