export function transformToFirestoreFormat(obj){
    return {
        bookPhotoUrl: obj.thumbnail_url,
        author: obj.author_name,
        title: obj.title,
        isbn: obj.isbn
    }
}