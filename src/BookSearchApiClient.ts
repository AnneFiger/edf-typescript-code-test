import axios from 'axios';
import { json2xml } from 'xml-js';

export class BookSearchApiClient {
    constructor(
        private baseUrl: string,
        private format: string
    ) {}

    public async getBooksByAuthor(queryParams:{authorName: string, limit: number}){
        let result = [];
        try {
            const url = this.baseUrl;
            const params = {...queryParams, format: this.format}
            const response = await axios.get(url, {params});
            if (response.status == 200) {
                if (this.format == "json") {
                    const json = JSON.parse(response.data);
                    result = json.map(function (item: { book: { title: any; author: any; isbn: any; }; stock: { quantity: any; price: any; }; }) {
                        return {
                          title: item.book.title,
                          author: item.book.author,
                          isbn: item.book.isbn,
                          quantity: item.stock.quantity,
                          price: item.stock.price,
                        };
                    });
                } else if (this.format == "xml") {
                    const xml = json2xml(response.data, { compact: false, spaces: 4 });
                    const xmlDoc = new DOMParser().parseFromString(xml, 'text/xml');
                    Array.from(xmlDoc.documentElement.childNodes).map(function (item) {
                        return {
                          title: item.childNodes[0].childNodes[0].nodeValue,
                          author: item.childNodes[0].childNodes[1].nodeValue,
                          isbn: item.childNodes[0].childNodes[2].nodeValue,
                          quantity: item.childNodes[1].childNodes[0].nodeValue,
                          price: item.childNodes[1].childNodes[1].nodeValue,
                        };
                      });

                }
                return result;
            } else {
                console.log("Request failed.  Returned status of " + response.status);
            }
            return response
        } catch(error) {
            throw new Error(`getBooksByAuthor: ${error}`)
        }
    }
   
}

export default BookSearchApiClient;