import React from 'react';
import { Card } from 'semantic-ui-react';
import BookListItem from './BookListItem';

export default function BookList({books}) {
    console.log('in booklist')
    console.log(books)
    return (
        <Card.Group itemsPerRow={5}>
        {books.map(book => (
            <BookListItem book={book} key={book.id}/>
        ))}
        </Card.Group>
    )
}