
function get_current_page_number() {
  if (/page=(\d+)/.test(window.location.search)) //https://stackoverflow.com/questions/14017134/what-is-d-d-in-regex
    //https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Regular_Expressions
    return parseInt(/page=(\d+)/.exec(window.location.search)[1]);
  else
    return 1;
}

function search() {
  let url = '';
  var current_page = get_current_page_number();
  url = 'https://api.themoviedb.org/3/movie/popular?api_key=02dd4e4bf4792803c07f78fb41cab31b&language=en-US&page=' + current_page;
  searchApi(url, current_page);
}

function searchButton() {
  var searchValue = $('#txtSearch').val();
  var current_page = get_current_page_number();
  let url = '';

  if (searchValue === '') {
    // https://stackoverflow.com/questions/13183630/how-to-open-a-bootstrap-modal-window-using-jquery?rq=1
    //https://www.codegrepper.com/code-examples/javascript/how+to+change+the+background+color+in+jquery
    $('#staticBackdrop').modal('show');
  } else {
    url = 'https://api.themoviedb.org/3/search/movie?api_key=02dd4e4bf4792803c07f78fb41cab31b&query=' + searchValue
    searchApi(url, current_page);
  }
}

function searchApi(url, currentPage) {
  $.ajax({
    url: url,
    type: "get",
    async: true,
    success: function (data, status, response) {
      var jsonResponse = JSON.parse(response.responseText);
      if (jsonResponse["results"].length > 0)
        setPage(response, currentPage);
      else
        setEmptyResult(jsonResponse["results"].length);
    }
  });
}

function addImage(thumb_url, title, releaseDate, voteAverage) {
  var parent_div = $("<div class='col-lg-3 col-md-4 col-sm-6 photo-margin'></div>");
  var card_div = $("<div class='card'></div>");
  parent_div.append(card_div);

  //image
  var image = $("<img class='card-img-top' src='" + thumb_url + "'>");
  card_div.append(image);

  //card-body div
  var card_body = $("<div class='card-body'></div>");
  card_div.append(card_body);

  //descript 
  var voteAverageRatio = voteAverage * 10;
  var percentageAvarege = voteAverageRatio + '%';
  var username_elem = $("<h4 class='card-title text-left'>" + title + "</h4>");
  var username_elem2 = $("<h5 class='card-title text-left'>" + releaseDate + "</h5>");
  var username_elem3 = $("<h5 class='btn btn-success float-right'>" + percentageAvarege + "</h5>");
  card_body.append(username_elem);
  card_body.append(username_elem2);
  card_body.append(username_elem3);

  $('#content_container').append(parent_div);
}


// Resposta para quando não encontrar o filme

function setEmptyResult(result) {
  // Eliminar conteudo atual
  $('#mybody').css( "background-color", "White" );
  $('#pagination').empty();
  $('#content_container').empty();
  // Colocar resultado vazio
  var parent_div = $("<div class='col-lg-3 col-md-4 col-sm-6 photo-margin'>Nothing to show here :/ 0 results</div>");

  $('#content_container').append(parent_div);
}
//$("p").css("background-color", "yellow");


function setPage(response, current_page) {
  // Eliminar conteudo atual
  $('#content_container').empty();
  // Colocar novos resultados
  var jsonResponse = JSON.parse(response.responseText);

  console.log('json', jsonResponse);
  var i = 0;
  var length = jsonResponse["results"].length;
  for (i = 0; i < length; i++) {
    var thumb_url = 'http://image.tmdb.org/t/p/w185' + jsonResponse["results"][i]["poster_path"];
    var title = jsonResponse["results"][i]["title"];
    var releaseDate = jsonResponse["results"][i]["release_date"];
    var voteAverage = jsonResponse["results"][i]["vote_average"];
    addImage(thumb_url, title, releaseDate, voteAverage);
  }

  // Atualizar pagination
  var last_page = (jsonResponse["total_pages"] == jsonResponse["page"])
  setPagination(current_page, last_page);
}

function loadPage(page_number) {

  // Redirect to page
  var current_page = window.location.href;
  if (current_page.includes("page="))
    window.location.href = (current_page.replace(/page=\d+/, "page=" + page_number));
  else
    window.location.href = (current_page + "?page=" + page_number);
}

function loadPreviousPage(event) {
  event.preventDefault();
  var previous_page_number = get_current_page_number() - 1;
  loadPage(previous_page_number);
}

function loadNextPage(event) {
  event.preventDefault();
  var next_page_number = get_current_page_number() + 1;
  loadPage(next_page_number);
}


//https://www.themoviedb.org/talk/587bea71c3a36846c300ff73
function setPagination(current_page, last_page) {
  $('#pagination').show();
  if (current_page == 1) {
    $('#previous').addClass('not-allowed');
    $('#previous').off("click");
  }
  else {
    $('#previous').removeClass('not-allowed');
    $('#previous').on("click", loadPreviousPage);
  }
  if (last_page) {
    $('#next').addClass('not-allowed');
    $('#next').off("click");
  }
  else {
    $('#next').removeClass('not-allowed');
    $('#next').on("click", loadNextPage);
  }
}

function getBaseUrl() {
  var full_url = window.location.href;
  var index_question_mark = full_url.indexOf('?');
  return index_question_mark != -1 ? full_url.substring(0, index_question_mark) : full_url;
}

function setPageOnLoad() {
  $(window).on("load", search);
}

function setHomeButton() {
  $('#home').on("click", function () {
    window.location.href = getBaseUrl();
  });
}

function initialize() {
  setHomeButton();
  setPageOnLoad();
}

initialize();