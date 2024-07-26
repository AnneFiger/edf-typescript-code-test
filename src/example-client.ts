import BookSearchApiClient from '../src/BookSearchApiClient';

const client = new BookSearchApiClient("json",'http://api.book-seller-example.com/by-author?q=');
const booksByShakespeare = client.getBooksByAuthor({authorName: "Shakespeare", limit: 10});