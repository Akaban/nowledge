import * as R from "ramda";
import { reduceEachTrailingCommentRange } from "typescript";
import { incrementHighlightCount, decrementHighlightCount } from "../../backend/premium";
import { updateHighlightsInFirestore, updateHighlightsMetadataInFirestore } from "../../firestore/firestoreService";
import { store } from "../../../index"
import { listentoCurrentHighlightCount } from "../../../features/profiles/profileActions";
import { incrementHighlightCount_local, decrementHighlightCount_local } from "../../../features/profiles/profileActions"

const getNextId = () => String(Math.random()).slice(2);

export async function deleteHighlight(highlights, bookId, highlightId) {
  const new_highlights = highlights.filter((e) => e.id !== highlightId);
  await updateHighlightsInFirestore(bookId, new_highlights);
  await updateHighlightsMetadataInFirestore(bookId, new_highlights);
  store.dispatch(decrementHighlightCount_local());
  const {highlight_count} = await decrementHighlightCount();
  store.dispatch(listentoCurrentHighlightCount(highlight_count))

}

export async function addHighlight(highlights, highlight, bookId) {
  const new_highlights = [{ ...highlight, id: getNextId() }, ...highlights];
  await updateHighlightsInFirestore(bookId, new_highlights);
  await updateHighlightsMetadataInFirestore(bookId, new_highlights)
  store.dispatch(incrementHighlightCount_local());
  const {highlight_count} = await incrementHighlightCount();
  store.dispatch(listentoCurrentHighlightCount(highlight_count))
}

export async function sortHighlights(highlights, bookId) {
  function sortByPageNumberAscending(h1, h2) {
    return h2.position.pageNumber - h1.position.pageNumber;
  }
  const new_highlights = highlights.sort(sortByPageNumberAscending);

  await updateHighlightsInFirestore(bookId, new_highlights);
}

export async function updateHighlight(highlights, highlightId, bookId, {position={}, content={}, comment={}}) {
  console.log("Updating highlight", highlightId, {position, content, comment});

  if (!position && !content && !comment) return;

  const new_highlights = highlights.map((h) => {
    const { id, position: originalPosition, content: originalContent, comment: originalComment, ...rest } = h;
    return id === highlightId
      ? {
          id,
          position: { ...originalPosition, ...position },
          content: { ...originalContent, ...content },
          comment: {...originalComment, ...comment},
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
