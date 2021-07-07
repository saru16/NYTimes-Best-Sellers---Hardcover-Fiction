fetch('https://api.nytimes.com/svc/books/v3/lists.json?list-name=hardcover-fiction&api-key=WffG2mQlrrVyRGY31z38BI9eAybajpTL', {
    method: 'get',
  })
  .then(response => { return response.json(); })
  .then(json => { updateBestSellers(json); })
  .catch(error => {
    console.log('NYT API Error: Defaulting to nytimes archival data.', error);
    updateBestSellers(nytimesArchive);
  });

function updateBestSellers(nytimesBestSellers) {
  nytimesBestSellers.results.forEach(function(book) {
    var isbn = book.isbns[0].isbn10;
    var bookInfo = book.book_details[0];
    var lastWeekRank = book.rank_last_week || 'n/a';
    var weeksOnList = book.weeks_on_list || 'New this week!';
    var listing =
        '<div  >' + 
        '<p>' + 
        '<img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/387928/book%20placeholder.png" class="book-cover" id="cover-' + book.rank + '">' + 
        '</p>' + 
        '<h2><a>#<a href="' + book.amazon_product_url + '" target="_blank" id="' + book.rank + '" class="entry">  ' + bookInfo.title + '</a></a></h2>' +
        '<h4>' + bookInfo.author + '</h4>' +
        '<p>' + bookInfo.description + '</p>' + 
        '<a href="' + book.amazon_product_url + '" target="_blank"><button class="button">Read Full Review </button></a>' +
        '<div class="stats">' +
        '<hr>' + 
        '</div>' +
        '</div>'

    $('#best-seller-titles').append(listing);
    $('#' + book.rank).attr('nyt-rank', book.rank);

    updateCover(book.rank, isbn);
  });
}

function updateCover(id, isbn) {
  fetch('https://www.googleapis.com/books/v1/volumes?q=isbn:' + isbn + "&key=AIzaSyB4HUacMtGKDWO2rH0R-b31r0fWc_xcyRE", {
    method: 'get'
  })
  .then(response => { return response.json(); })
  .then(data => {
    var img = data.items[0].volumeInfo.imageLinks.thumbnail;
    img = img.replace(/^http:\/\//i, 'https://');
    $('#cover-' + id).attr('src', img);
  })
  .catch(error => {
    console.log(error);
  });
}

