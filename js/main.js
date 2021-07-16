var $currentWord = document.querySelector('#word');
var randomWord = '';

function getWord(word) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://palabras-aleatorias-public-api.herokuapp.com/random');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    randomWord = xhr.response.body.Word;
    $currentWord.textContent = `${randomWord}`;
  });
  xhr.send();
}

getWord();
