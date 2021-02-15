import React from 'react';
import BookListItem from './BookListItem';

export default function BookList({books}) {
    console.log('in booklist')
    console.log(books)
    return (
        <>
        {books.map(book => (
            <BookListItem book={book} key={book.id}/>
        ))}
        </>
    )
}