/* eslint-disable no-unused-vars */
var $currentWord = document.querySelector('#word');
var $guess = document.querySelector('#input');
var $answer = document.querySelector('.answer');
var $def = document.querySelector('#def');
const $next = document.querySelector('.next');
const $table = document.querySelector('.pastTable');
var randomWord = '';
var search = '';
var translation = [];
var englishWord = [];
var wordList = '';

function getWord(word) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://palabras-aleatorias-public-api.herokuapp.com/random');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    randomWord = xhr.response.body.Word;
    $currentWord.textContent = capitalize(randomWord);
    translateWord();
  });
  xhr.send();

}

getWord();

function translateWord(word) {
  const data = null;

  if (word) {
    search = word;
  } else search = randomWord;

  const xhr = new XMLHttpRequest();
  xhr.withCredentials = false;

  xhr.addEventListener('readystatechange', function () {
    if (this.readyState === this.DONE) {
      var response = JSON.parse((xhr.response));
      var matches = [];
      for (const match of response.matches) {
        translation = match.translation.toLowerCase();
        matches.push(capitalize(translation));
      }
      englishWord.push(matches);
    }
  });

  xhr.open('GET', 'https://translated-mymemory---translation-memory.p.rapidapi.com/api/get?q=' + search + '&langpair=es%7Cen&de=a%40b.c&onlyprivate=0&mt=1');
  // eslint-disable-next-line no-undef
  xhr.setRequestHeader('x-rapidapi-key', API_KEY);
  xhr.setRequestHeader('x-rapidapi-host', 'translated-mymemory---translation-memory.p.rapidapi.com');

  xhr.send(data);
}

$guess.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    for (const match of englishWord[0]) {
      if ($guess.value.toLowerCase() === match.toLowerCase()) {
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
  wordList = '';
  for (const list of englishWord[0]) {
    wordList += `${list}, `;
  }
  wordList = wordList.slice(0, wordList.length - 2);
  $currentWord.textContent = `${capitalize(randomWord)}- ${wordList}`;
});

const viewDef = () => {
  if ($def.textContent === 'Definition') {
    for (const list of englishWord[0]) {
      wordList += `${list}, `;
    }
    wordList = wordList.slice(0, wordList.length - 2);
    $currentWord.textContent = `${wordList}`;
    $def.textContent = 'Word';
  } else {
    wordList = '';
    $currentWord.textContent = capitalize(randomWord);
    $def.textContent = 'Definition';
  }
};

$def.addEventListener('click', () => {
  viewDef();
});

const capitalize = word => {
  const result = word.charAt(0).toUpperCase() + word.slice(1);
  return result;
};

const pastWords = word => {
  const $row = document.createElement('tr');
  $row.setAttribute('pastId', word.Id);

  const $word = document.createElement('th');
  $word.textContent = word.word;

  const $definition = document.createElement('th');
  $definition.textContent = word.definition;

  $row.appendChild($word);
  $row.appendChild($definition);

  return $row;
};
