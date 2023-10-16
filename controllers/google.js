const BASE_URL = `https://www.googleapis.com/books/v1/volumes`


async function bookSearch(req, res){
  try {
    const bookResponse = await fetch(`${BASE_URL}?q=${req.body.searchTerm}&key=${process.env.API_KEY}`)
    const bookData = await bookResponse.json()
    console.log(bookData.items[0])
    console.log(bookData) 
    console.log(bookData.items)
    
    const bookResponseData = [...bookData.items]
    bookResponseData.map(book => {
      
      book.title = book.volumeInfo.title ? book.volumeInfo.title : ''
      book.subtitle = book.volumeInfo.subtitle ? book.volumeInfo.tile : ''
      book.authors = book.volumeInfo.authors ? book.volumeInfo.authors : []
      book.cover = book.volumeInfo.imageLinks.thumbnail ? book.volumeInfo.imageLinks.thumbnail : ''
      book.published = book.volumeInfo.publishedDate ? book.volumeInfo.publishedDate : ''
      book.description = book.volumeInfo.description ? book.volumeInfo.description : ''
      book.pages = book.volumeInfo.pageCount ? book.volumeInfo.pageCount : 0
      book.categories = book.volumeInfo.categories ? book.volumeInfo.categories : []
      book.url = book.volumeInfo.previewLink ? book.volumeInfo.previewLink : ''
      book.id = book.id ? book.id : ''
      delete book.etag
      delete book.saleInfo
      delete book.accessInfo
      delete book.volumeInfo
      delete book.kind
      delete book.selfLink
      delete book.searchInfo
    })
    res.status(200).send(bookResponseData)
  } catch (err) {
    console.log(err)
  }
}

async function getBookDetailsById(req, res) {
  try {
    const { volumeId } = req.params; // Use req.params to get the volumeId from the URL

    if (!volumeId) {
      res.status(400).json({ error: 'Missing volumeId in the request parameters' });
      return;
    }

    const response = await fetch(`${BASE_URL}/${volumeId}?key=${process.env.API_KEY}`);
    const bookData = await response.json();

    if (bookData.error) {
      // Check for errors in the API response
      res.status(404).json({ error: 'Book not found' });
    } else {
      const bookDetails = {
        id: bookData.id ? bookData.id : '',
        title: bookData.volumeInfo.title ? bookData.volumeInfo.title: '',
        subtitle: bookData.volumeInfo.subtitle ? bookData.volumeInfo.subtitle : '',
        authors: bookData.volumeInfo.authors ? bookData.volumeInfo.authors : [],
        cover: bookData.volumeInfo.imageLinks?.large ? bookData.volumeInfo.imageLinks?.large :  bookData.volumeInfo.imageLinks?.thumbnail,
        published: bookData.volumeInfo.published ? bookData.volumeInfo.published : '',
        description: bookData.volumeInfo.description ? bookData.volumeInfo.description : '',
        pages: bookData.volumeInfo.pageCount ? bookData.volumeInfo.pageCount : 0,
        categories: bookData.volumeInfo.categories ? bookData.volumeInfo.categories : [],
        url: bookData.volumeInfo.previewLink ? bookData.volumeInfo.previewLink : ''
        // Add other details here
      };

      res.status(200).json(bookDetails);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch book details' });
  }
}






export {
  bookSearch,
  getBookDetailsById
}