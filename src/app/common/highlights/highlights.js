import * as R from "ramda";
import { updateHighlightsInFirestore } from "../../firestore/firestoreService";

const getNextId = () => String(Math.random()).slice(2);

export async function deleteHighlight(highlights, bookId, highlightId) {
  const new_highlights = highlights.filter((e) => e.id !== highlightId);
  await updateHighlightsInFirestore(bookId, new_highlights);
}

export async function addHighlight(highlights, highlight, bookId) {
  const new_highlights = [{ ...highlight, id: getNextId() }, ...highlights];
  await updateHighlightsInFirestore(bookId, new_highlights);
}

export async function sortHighlights(highlights, bookId) {
  function sortByPageNumberAscending(h1, h2) {
    return h2.position.pageNumber - h1.position.pageNumber;
  }
  const new_highlights = highlights.sort(sortByPageNumberAscending);

  await updateHighlightsInFirestore(bookId, new_highlights);
}

export async function updateHighlight(highlights, highlightId, position, content, bookId) {
  console.log("Updating highlight", highlightId, position, content);

  const new_highlights = highlights.map((h) => {
    const { id, originalPosition, originalContent, ...rest } = h;
    return id === highlightId
      ? {
          id,
          position: { ...originalPosition, ...position },
          content: { ...originalContent, ...content },
          ...rest,
        }
      : h;
  });

  await updateHighlightsInFirestore(bookId, new_highlights);
}

export function getHighlightsFunctionsFromState(state) {
  return {
    updateHighlight: R.partial(updateHighlight, [state]),
    sortHighlights: R.partial(sortHighlights, [state]),
    deleteHighlight: R.partial(deleteHighlight, [state]),
    addHighlight: R.partial(addHighlight, [state])
  }
}
