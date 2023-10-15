const BASE_URL = `https://www.googleapis.com/books/v1/volumes?q=`


async function bookSearch(req, res){
  try {
    const bookResponse = await fetch(`${BASE_URL}${req.body.searchTerm}&key=${process.env.API_KEY}`)
    const bookData = await bookResponse.json()
    console.log(bookData.items[0])
    console.log(bookData) 
    console.log(bookData.items)
    
    const bookResponseData = [...bookData.items]
    bookResponseData.map(book => {
      
      if (book.volumeInfo.title) {
        if (book.volumeInfo.subtitle) {
          book.title = book.volumeInfo.title.concat(' (', book.volumeInfo.subtitle, ')')
        } else {
          book.title = book.volumeInfo.title
        }
      } else {
        return ''
      }
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

export {
  bookSearch
}