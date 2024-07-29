import axios from 'axios';

export interface Params {
    authorName?: string,
    limit?: number
}

export class BookSearchApiClient {
    constructor(
        private baseUrl: string,
        private format: string
    ) {}

    public buildBooksQueryURL(params: Params){
        let url = this.baseUrl + params.authorName + ("&limit="+ params.limit?.toString() || '') + "&format="+this.format;
        return url
    }

    private formatResponseResultsInJSON(response: { data: string }){
        var json = JSON.parse(response.data);

        const result = json.map(function (item: { book: { title: string; author: string; isbn: string; }; stock: { quantity: number; price: number } }) {
            return {
                title: item.book.title,
                author: item.book.author,
                isbn: item.book.isbn,
                quantity: item.stock.quantity,
                price: item.stock.price,
            };
        });

        return result
    }

    private formatResponseResultsInXML(response: { responseXML: any }) {
        var xml = response.responseXML;
        
        const result = xml.documentElement.childNodes.map(function (item: { childNodes: { childNodes: { nodeValue: any; }[] }[] }) {
            return {
            title: item.childNodes[0].childNodes[0].nodeValue,
            author: item.childNodes[0].childNodes[1].nodeValue,
            isbn: item.childNodes[0].childNodes[2].nodeValue,
            quantity: item.childNodes[1].childNodes[0].nodeValue,
            price: item.childNodes[1].childNodes[1].nodeValue,
            };
        });   

        return result
    }

    public handleResponse(response: any){
        if(response.status == 200) {
            if (this.format === "json") {
                return this.formatResponseResultsInJSON(response)
            } else if (this.format == "xml") {
                return this.formatResponseResultsInXML(response)
            } else {
                return []
            }
        } else {
            return "Request failed.  Returned status of " + response.status;
        }
    }

    public async getBooksByAuthor(queryParams: Params){    
        try {
            const url = this.buildBooksQueryURL(queryParams)
            const response = await axios.get(url);
            return this.handleResponse(response)
        } catch(error) {
            throw new Error(`getBooksByAuthor: ${error}`)
        }
    }
   
}

export default BookSearchApiClient;