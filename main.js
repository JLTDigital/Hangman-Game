
const word = document.getElementById('word');
const wrongLettersEl = document.getElementById('wrong-letters');
const playAgain = document.getElementById('play-button');
const popup = document.getElementById('popup-container');
const notification = document.getElementById('notification-container');
const endingMessage = document.getElementById('ending-message');
const figureParts = document.querySelectorAll('.figure-part');

const apiKey = 'bnnj0t11ffqiifage01d8owx94ugnsnp5tf24tb1oca8i8faj';

let hangmanWord = '';

const correctLetters = [];
const wrongLetters = [];

// Get random word from API
async function randomWords(){
  await fetch(`https://api.wordnik.com/v4/words.json/randomWord?hasDictionaryDef=true&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&limit=10&api_key=${apiKey}`)
  .then(res => res.json())
  .then(data => {
    // console.log(data);

    let words = [data.word].toString();
    hangmanWord = words;
    displayWord();
  })
}

// Show the hidden word and check to see if you have won
function displayWord(){
  word.innerHTML = `
    ${hangmanWord
    .split('')
    .map(
      letter => `
       <span class="letter">
         ${correctLetters.includes(letter) ? letter : ''}
       </span>
      `
    )
    .join('')}
  `;

  const innerWord = word.innerText.replace(/\n/g, '');

  if(innerWord === hangmanWord){
    endingMessage.innerHTML = 'Congratulations! You saved him!';
    popup.style.display = 'flex';
  }
}

// Update wrong letter array
function updateWrongLettersEl(){
  // Displays the incorrect letters
  wrongLettersEl.innerHTML = `
    ${wrongLetters.length > 0 ? '<p>Wrong Letters</p>' : ''}
    ${wrongLetters.map(letter => `<span>${letter}</span>`)}
  `;

  // Displays figure part for each incorrect answer
  figureParts.forEach((part, index) => {
    const errors = wrongLetters.length;

    if(index < errors){
      part.style.display ='block';
    } else {
      part.style.display = 'none';
    }
  });

  // Check to see whether you have lost
  if(wrongLetters.length === figureParts.length){
    endingMessage.innerText = `Sorry He Died...
    The Word Was: 
    
    ${hangmanWord}`;
    popup.style.display = 'flex';
  }
}

// Shows the notification
function showNotification(){
  notification.classList.add('show');

  setTimeout(() => {
    notification.classList.remove('show');
  }, 2000);
}

// Event Listener for keyboard letters
window.addEventListener('keydown', e => {
  if(e.keyCode >= 65 && e.keyCode <= 90){
    const letter = e.key;

    if(hangmanWord.includes(letter)){
      if(!correctLetters.includes(letter)){
        correctLetters.push(letter);

        displayWord();
      } else {
        showNotification();
      }
    } else {
      if(!wrongLetters.includes(letter)){
        wrongLetters.push(letter);

        updateWrongLettersEl();
      } else {
        showNotification();
      }
    }
  }
});

// Play again
playAgain.addEventListener('click', () => {
  correctLetters.splice(0);
  wrongLetters.splice(0);

  randomWords();

  updateWrongLettersEl();

  popup.style.display = 'none';
});

randomWords();