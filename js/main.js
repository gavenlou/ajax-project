var $currentWord = document.querySelector('#word');
var $guess = document.querySelector('#input');
var $answer = document.querySelector('.answer');
var randomWord = '';
var upperRandom = '';
var transWord = '';
var englishWord = [];
var wordList = '';

function getWord(word) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://palabras-aleatorias-public-api.herokuapp.com/random');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    randomWord = xhr.response.body.Word;
    upperRandom = randomWord.charAt(0).toUpperCase() + randomWord.slice(1);
    $currentWord.textContent = upperRandom;
    translateWord();
  });
  xhr.send();

}

getWord();

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
      for (const match of response.matches) {
        var translation = match.translation.toLowerCase();
        var uppercase = translation.charAt(0).toUpperCase() + translation.slice(1);
        matches.push(uppercase);
      }
      englishWord.push(matches);
    }
  });

  xhr.open('GET', 'https://translated-mymemory---translation-memory.p.rapidapi.com/api/get?q=' + transWord + '&langpair=es%7Cen&de=a%40b.c&onlyprivate=0&mt=1');
  // eslint-disable-next-line no-undef
  xhr.setRequestHeader('x-rapidapi-key', API_KEY);
  xhr.setRequestHeader('x-rapidapi-host', 'translated-mymemory---translation-memory.p.rapidapi.com');

  xhr.send(data);
}

$guess.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    for (const match of englishWord[0]) {
      if ($guess.value === match) {
        $guess.className = 'input correct';
        $guess.blur();
        break;
      } else {
        $guess.className = 'input incorrect';
        $guess.blur();
        $answer.className = 'answer';
      }
    }
  }
});

$answer.addEventListener('click', function () {
  for (var list of englishWord[0]) {
    wordList += `${list}, `;
  }
  wordList = wordList.slice(0, wordList.length - 2);
  $currentWord.textContent = `${upperRandom}- ${wordList}`;
});
