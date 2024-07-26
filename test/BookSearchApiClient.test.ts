import axios from 'axios';
import BookSearchApiClient from '../src/BookSearchApiClient';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

let booksClient: BookSearchApiClient;
beforeAll(() => {
  booksClient = new BookSearchApiClient('',"json");
});

test('should fetch users', async() => {
  const books = [{ title: 'myBook',
    author: 'myAuthor',
    isbn: 'mockIsbn',
    quantity: 10,
    price: 20 }];
  const resp = { data: books };

  mockedAxios.get.mockResolvedValue(resp);

  const result = await booksClient.getBooksByAuthor({authorName:'Shakespeare', limit:10})
  expect(mockedAxios.get).toHaveBeenCalledTimes(1)
  expect(result).toEqual(resp)
});