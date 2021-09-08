/* eslint-disable no-unused-vars */
const $currentWord = document.querySelector('#word');
const $guess = document.querySelector('#input');
const $answer = document.querySelector('.answer');
const $def = document.querySelector('#def');
const $next = document.querySelector('.next');
const $table = document.querySelector('.pastTable');
let randomWord = '';
let search = '';
let translation = [];
let definition = '';
let englishWord = [];
let wordList = '';
const pastCount = data.pastId - 1;

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
      englishWord = [];
      for (const match of response.matches) {
        translation = match.translation.toLowerCase();
        matches.push(capitalize(translation));
      }
      englishWord.push(matches);
      getDef(englishWord[0][0]);
    }
  });

  xhr.open('GET', 'https://translated-mymemory---translation-memory.p.rapidapi.com/api/get?q=' + search + '&langpair=es%7Cen&de=a%40b.c&onlyprivate=0&mt=1');
  // eslint-disable-next-line no-undef
  xhr.setRequestHeader('x-rapidapi-key', API_KEY);
  xhr.setRequestHeader('x-rapidapi-host', 'translated-mymemory---translation-memory.p.rapidapi.com');

  xhr.send(data);
}

const getDef = word => {
  const data = null;

  const xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener('readystatechange', function () {
    if (this.readyState === this.DONE) {
      const response = JSON.parse(xhr.response);
      console.log(response);
      definition = response.definitions;
      console.log(definition);
    }
  });

  xhr.open('GET', 'https://wordsapiv1.p.rapidapi.com/words/' + word + '/definitions');
  xhr.setRequestHeader('x-rapidapi-host', 'wordsapiv1.p.rapidapi.com');
  // eslint-disable-next-line no-undef
  xhr.setRequestHeader('x-rapidapi-key', API_KEY);

  xhr.send(data);
};

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
    wordList = '';
    wordList += `${definition[0].definition}`;
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

const next = () => {
  if (pastCount !== data.pastId) {
    $currentWord.textContent = data.pastWords[pastCount].esWord;
    definition = data.pastWords[pastCount].def;
  }
  const word = {
    enWord: englishWord[0],
    esWord: randomWord,
    def: definition[0].definition,
    Id: data.pastId
  };
  if (data.pastId < 30) {
    data.pastWords.push(word);
    data.pastId++;
    getWord();
  } else {
    data.pastWords.shift();
    for (let i = 0; i < data.pastWords.length; i++) {
      data.pastWords[i].Id--;
    }
    data.pastWords.push(word);
    getWord();
  }
};

const back = () => {

};
