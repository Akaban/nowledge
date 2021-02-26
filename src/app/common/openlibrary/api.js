import axios from "axios";

const API_ENDPOINT = "http://openlibrary.org";

export function getBookApi(isbns) {
  const url_get = `${API_ENDPOINT}/api/books?bibkeys=${isbns
    .map((isbn) => `ISBN:${isbn}`)
    .join(",")}&format=json`;
  return axios.get(url_get).then((response) => response.data);
}

export async function searchBookApi({ title = null, author = null }) {
  console.log(`title=${title} & author=${author}`);
  if (!title & !author) return;
  let url_get = `${API_ENDPOINT}/search.json?`;
  if (title) url_get = url_get + `title=${title}`;
  if (author) {
    if (title) url_get = url_get + "&";
    url_get = url_get + `author=${author}`;
  }
  return axios.get(url_get).then(async (response) => {
    let data = response.data;
    let docs = data.docs;

    const isbns = docs.map((b) => {
      if (b.isbn) return b.isbn[0];
      else return null;
    });
    let null_isbns_index = isbns
      .map((el, index) => {
        if (el === null) return index;
        else return null;
      })
      .filter((e) => e !== null);
    const res_isbn = await getBookApi(isbns.filter((e) => e !== null));

    while (null_isbns_index.length) {
      docs.splice(null_isbns_index.pop(), 1);
    }

    for (const [index, element] of docs.entries()) {
      const isbn_el = res_isbn[`ISBN:${element.isbn[0]}`];
      console.log(isbn_el);
      if (!isbn_el["thumbnail_url"]) {
        docs[index] = null;
      } else {
        const split_url = isbn_el["thumbnail_url"].split("/");
        split_url[split_url.length - 1] = split_url[
          split_url.length - 1
        ].replace("-S.jpg", "-L.jpg");
        const thumbnail_url = split_url.join("/");
        docs[index] = {
          ...element,
          thumbnail_url: thumbnail_url,
        };
      }
    }

    data.docs = docs.filter((e) => e !== null);

    return data;
  });
}
