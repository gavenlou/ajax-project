var $currentWord = document.querySelector('#word');
// eslint-disable-next-line no-unused-vars
var $guess = document.querySelector('#input');
var randomWord = '';
var transWord = '';
var englishWord = [];

function getWord(word) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://palabras-aleatorias-public-api.herokuapp.com/random');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    randomWord = xhr.response.body.Word;
    $currentWord.textContent = `${randomWord}`;
    translateWord();
  });
  xhr.send();

}

getWord();

// eslint-disable-next-line no-unused-vars
function translateWord(word) {
  const data = null;

  if (word) {
    transWord = word;
  } else transWord = randomWord;

  const xhr = new XMLHttpRequest();
  xhr.withCredentials = false;

  xhr.addEventListener('readystatechange', function () {
    if (this.readyState === this.DONE) {
      var response = JSON.parse((xhr.response));
      var matches = [];
      for (var match of response.matches) {
        matches.push(match.translation);
      }
      englishWord.push(matches);
    }
  });

  xhr.open('GET', 'https://translated-mymemory---translation-memory.p.rapidapi.com/api/get?q=' + transWord + '&langpair=es%7Cen&de=a%40b.c&onlyprivate=0&mt=1');
  xhr.setRequestHeader('x-rapidapi-key', '981a3979c5msh9f4609ea4912885p1769d3jsnb9b71d996d55');
  xhr.setRequestHeader('x-rapidapi-host', 'translated-mymemory---translation-memory.p.rapidapi.com');

  xhr.send(data);
}
