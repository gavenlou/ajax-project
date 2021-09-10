/* eslint-disable no-unused-vars */
const $currentWord = document.querySelector('#word');
const $guess = document.querySelector('#input');
const $answer = document.querySelector('.answer');
const $def = document.querySelector('#def');
const $next = document.querySelector('.next');
const $table = document.querySelector('.pastTable');
let randomWord = '';
let search = '';
const translation = [];
let definition = '';
let spanishWord = '';
const wordList = '';
const pastCount = data.pastId - 1;

function getWord(word) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://random-word-api.herokuapp.com/word?number=1');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    const response = xhr.response;
    randomWord = xhr.response[0];
    translateWord();
    getDef(randomWord);
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
      const response = JSON.parse((xhr.response));
      spanishWord = response.responseData.translatedText;
      $currentWord.textContent = capitalize(spanishWord);
    }
  });

  xhr.open('GET', 'https://translated-mymemory---translation-memory.p.rapidapi.com/api/get?q=' + search + '&langpair=en%7Ces&de=a%40b.c&onlyprivate=0&mt=1');
  // eslint-disable-next-line no-undef
  xhr.setRequestHeader('x-rapidapi-key', API_KEY);
  xhr.setRequestHeader('x-rapidapi-host', 'translated-mymemory---translation-memory.p.rapidapi.com');

  xhr.send(data);
}

const getDef = word => {

  const xhr = new XMLHttpRequest();

  xhr.addEventListener('readystatechange', function () {
    if (this.readyState === this.DONE) {
      const response = JSON.parse(xhr.response);
      try {
        definition = response[0].meanings[0].definitions[0].definition;
      } catch (err) {
        getWord();
      }
      console.log(definition);
    }
  });

  xhr.open('GET', 'https://api.dictionaryapi.dev/api/v2/entries/en/' + word);

  xhr.send(data);
};

$guess.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    if ($guess.value.toLowerCase() === randomWord.toLowerCase()) {
      $guess.className = 'input correct';
      $guess.blur();
    } else {
      $guess.className = 'input incorrect';
      $guess.blur();
      $answer.className = 'answer';
    }
  }
});

$answer.addEventListener('click', function () {
  $currentWord.textContent = `${capitalize(spanishWord)}- ${capitalize(randomWord)}`;
});

const viewDef = () => {
  if ($def.textContent === 'Definition') {

    $currentWord.textContent = `${definition}`;
    $def.textContent = 'Word';
  } else {
    $currentWord.textContent = capitalize(spanishWord);
    $def.textContent = 'Definition';
  }
};

$def.addEventListener('click', () => {
  viewDef();
});

const capitalize = word => {
  word = word.toLowerCase();
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
    spanishWord = data.pastWords[pastCount].esWord;
    $currentWord.textContent = spanishWord;
    $guess.textContent = '';
    $guess.className = 'input';
    definition = data.pastWords[pastCount].def;
    randomWord = data.pastWords[pastCount].enWord;
  } else {
    const word = {
      enWord: randomWord,
      esWord: spanishWord,
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
  }
};

const back = () => {

};
