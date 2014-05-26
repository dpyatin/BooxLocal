var bookTitles = [];

var renderView = function (view) {
  $('section').hide();
  $('section#' + view).show();
}

$(document).ready(function () {
  $('#btn-facebook').click(function () {
    renderView('main');
  });

  $('.btn-view').click(function () {
    renderView($(this).attr('data-view'));
  });

  $('#btn-buy-back').click(function () {
    location.reload();
  });

  $.get('/books', function (data) {
    bookTitles = _.pluck(data.books, 'title') ;
    $('.input-book-title').typeahead({
      source: bookTitles
    });
  });

  $('.btn-search').click(function () {
    var bookTitle = $(this).parent().find('.input-book-title').val();

    if (bookTitles.indexOf(bookTitle) > -1) {
      locate(
        $(this).parent().find('.input-postal-code').val(),
        bookTitle,
        $(this).attr('data-from')
      );
    } else {
      alert('This book does not appear to be on sale.');
    }
  });

  $('#chat-search').click(function () {
    locate(
      $(this).parent().find('.input-postal-code').val(),
      $(this).parent().find('.input-book-title').val(),
      'chat'
    );
  });

  $('#btn-publish').click(function () {
    $.post('/message', {
      userId: (localStorage.getItem('ID') === null ? 0 : localStorage.getItem('ID')),
      bookId: bookId,
      text: $('#form-message').val(),
      location: locat
    }, function (data) {
      $('#well-board-posts').append('<div class="well well-darker"><div style="margin-right: 16px; vertical-align: top; display: inline-block"><img src="http://www.gravatar.com/avatar/' + (localStorage.getItem('ID') === null ? 0 : localStorage.getItem('ID')) + '?r=PG&s=64&default=identicon" /></div>' + $('#form-message').val() + '</div>');
    });

    $('#modal-post').modal('hide');
  });

  $('#btn-sell').click(function () {
    locate(
      $(this).parent().find('.input-postal-code').val(),
      $(this).parent().find('.input-book-title').val(),
      'sell',
      function () {
        $.post('/ad', {
          title: $('#sell .input-book-title').val(),
          email: $('#sell .input-email').val(),
          location: locat,
          lat: "" + localX,
          lng: "" + localY,
          status: 'sell',
          price: $('#sell .input-price').val(),
          description: $('#sell .input-description').val()
        }, function (data) {
          if (typeof data === 'object') {
            alert('Your book is now on sale! Expect moolah soon');
          }
        });
      }
    );
  });

  if (localStorage.getItem('ID') === null) {
    localStorage.setItem('ID', Math.floor(Math.random() * 200000));
  }
  renderView('main');
});
