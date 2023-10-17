const BASE_URL = `https://www.googleapis.com/books/v1/volumes`;

export async function fetchBooksMiddleware(searchTerm) {
  try {
    const bookResponse = await fetch(`${BASE_URL}?q=${searchTerm}&key=${process.env.API_KEY}`);
    const bookData = await bookResponse.json();
    const bookInformation = bookData.items.map(book => ({
      id: book.id ? book.id : '',
      title: book.volumeInfo.title ? book.volumeInfo.title : '',
      subtitle: book.volumeInfo.subtitle ? book.volumeInfo.subtitle : '',
      authors: book.volumeInfo.authors ? book.volumeInfo.authors : [],
      cover: book.volumeInfo.imageLinks?.large ? book.volumeInfo.imageLinks?.large : book.volumeInfo.imageLinks?.thumbnail,
      published: book.volumeInfo.published ? book.volumeInfo.published : '',
      description: book.volumeInfo.description ? book.volumeInfo.description : '',
      pages: book.volumeInfo.pageCount ? book.volumeInfo.pageCount : 0,
      categories: book.volumeInfo.categories ? book.volumeInfo.categories : [],
      url: book.volumeInfo.previewLink ? book.volumeInfo.previewLink : '',
    }));
    return bookInformation
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}

export async function getBookDetailsByIdMiddleware(volumeId) {
  try {
    // const { volumeId } = req.params

    // if (!volumeId) {
    //   return res.status(400).json({ error: 'Missing volumeId in the request parameters' });
    // }

    const response = await fetch(`${BASE_URL}/${volumeId}?key=${process.env.API_KEY}`);
    const bookData = await response.json();

    if (bookData.error) {
      return res.status(404).json({ error: 'Book not found' });
    }

      const bookDetails = {
      googleId: bookData.id ? bookData.id : '',
      title: bookData.volumeInfo.title ? bookData.volumeInfo.title : '',
      subtitle: bookData.volumeInfo.subtitle ? bookData.volumeInfo.subtitle : '',
      authors: bookData.volumeInfo.authors ? bookData.volumeInfo.authors : [],
      cover: bookData.volumeInfo.imageLinks?.large
        ? bookData.volumeInfo.imageLinks?.large
        : bookData.volumeInfo.imageLinks?.thumbnail,
      published: bookData.volumeInfo.published ? bookData.volumeInfo.published : '',
      description: bookData.volumeInfo.description ? bookData.volumeInfo.description : '',
      pages: bookData.volumeInfo.pageCount ? bookData.volumeInfo.pageCount : 0,
      categories: bookData.volumeInfo.categories ? bookData.volumeInfo.categories : [],
      url: bookData.volumeInfo.previewLink ? bookData.volumeInfo.previewLink : '',
    };

    return bookDetails; // Move to the next middleware or route handler
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch book details' });
  }
}