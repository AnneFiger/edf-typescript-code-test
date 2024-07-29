import axios from 'axios';
import BookSearchApiClient from '../src/BookSearchApiClient';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const bookSearchApiClient: BookSearchApiClient = new BookSearchApiClient('http://api.book-seller-example.com/by-author?q=', "json");


describe('BookSearchApiClient', () => {
  it('it builds a get books by author query', () => {
    const authorName = 'Shakespeare'
    const limit = 10
    
    const expectedQuery = "http://api.book-seller-example.com/by-author?q=Shakespeare&limit=10&format=json"
    
    expect(bookSearchApiClient.buildBooksQueryURL({authorName, limit})).toEqual(expectedQuery);
  });
  it('it format response results in json', () => {
    const dummyXhrBooksResponse = 
    {
        "status" : 200,
        "data": "[{\"book\":{\"title\":\"Macbeth\",\"author\":\"Shakespeare\",\"isbn\":\"ISBN0-061-96436-0\"},\"stock\":{\"quantity\":10,\"price\":5}},{\"book\":{\"title\":\"Othello\",\"author\":\"Shakespeare\",\"isbn\":\"ISBN0-061-96436-2\"},\"stock\":{\"quantity\":5,\"price\":10}}]"
    }
    const expectedResult = [
        {
        title: "Macbeth",
        author: "Shakespeare",
        isbn: "ISBN0-061-96436-0",
        quantity: 10,
        price: 5
        },
        {
        title: "Othello",
        author: "Shakespeare",
        isbn: "ISBN0-061-96436-2",
        quantity: 5,
        price: 10
        }
    ];
    
    expect(bookSearchApiClient.handleResponse(dummyXhrBooksResponse)).toEqual(expectedResult);
  });  

  it('should fetch books', async() => {
    const resp = { "status" : 200, "data": "[{\"book\":{\"title\":\"Macbeth\",\"author\":\"Shakespeare\",\"isbn\":\"ISBN0-061-96436-0\"},\"stock\":{\"quantity\":10,\"price\":5}},{\"book\":{\"title\":\"Othello\",\"author\":\"Shakespeare\",\"isbn\":\"ISBN0-061-96436-2\"},\"stock\":{\"quantity\":5,\"price\":10}}]"}
    const expected = [
      {
      title: "Macbeth",
      author: "Shakespeare",
      isbn: "ISBN0-061-96436-0",
      quantity: 10,
      price: 5
      },
      {
      title: "Othello",
      author: "Shakespeare",
      isbn: "ISBN0-061-96436-2",
      quantity: 5,
      price: 10
      }
  ];

    mockedAxios.get.mockResolvedValue(resp);

    const result = await bookSearchApiClient.getBooksByAuthor({authorName:'Shakespeare', limit:10})
    expect(mockedAxios.get).toHaveBeenCalledTimes(1)
    expect(mockedAxios.get).toHaveBeenCalledWith('http://api.book-seller-example.com/by-author?q=Shakespeare&limit=10&format=json')
    expect(result).toEqual(expected)
  });

  it('it handles unsuccessfull responses', () => {
    const dummyXhrResponse = 
    {
        "status" : 500
    }

    expect(bookSearchApiClient.handleResponse(dummyXhrResponse)).toEqual("Request failed.  Returned status of " + 500);
  }); 

  it('sends an error when it cannot connect to the api', () => {
    //needs implementing
  })

})