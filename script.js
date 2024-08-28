'use strict'

const cards = [
    {
        frontEn: 'apple',
        backRus: 'яблоко',
        example: 'Спелое и вкусное яблоко!',
    },
    {
        frontEn: 'hello',
        backRus: 'привет',
        example: 'Привет, мой дорогой друг!',
    },
    {
        frontEn: 'hour',
        backRus: 'час',
        example: 'Который сейчас час?',
    },
    {
        frontEn: 'end',
        backRus: 'конец',
        example: 'Конец сказки!',
    },
    {
        frontEn: 'light',
        backRus: 'свет',
        example: 'В доме включен свет!',
    },
]

const cardFront = document.querySelector('#card-front');
const cardBack = document.querySelector('#card-back');
const flipCard = document.querySelector('.flip-card');
const sliderControls = document.querySelector('.slider-controls')
const currentWord = document.querySelector('#current-word');

const examCards = document.querySelector('#exam-cards');
const studyCards = document.querySelector('.study-cards')
const next = document.querySelector('#next');
const back = document.querySelector('#back');
const exam = document.querySelector('#exam');

const shuffleWords = document.querySelector('#shuffle-words');
const progressTrain = document.querySelector('#words-progress');
const progressExam = document.querySelector('#exam-progress');
const correctPercent = document.querySelector('#correct-percent');
const studyMode = document.querySelector('#study-mode');
const examMode = document.querySelector('#exam-mode');
const time = document.querySelector('#time');
const timeTest = document.querySelector('#timer');

const resultsModal = document.querySelector('.results-modal');
const resultsContent = document.querySelector('.results-content');
const wordStatsTemplate = document.querySelector('#word-stats');

const dictionary = {
    apple: 'яблоко',
    яблоко: 'apple',
    hello: 'привет',
    привет: 'hello',
    hour: 'час',
    час: 'hour',
    end: 'конец',
    конец: 'end',
    light: 'свет',
    свет: 'light'
}

const progValue = 100 / cards.length;
let myProgress = 0;
let timerId = null;
const newArr = [];

let indexCard = 0;
renderCard(cards[indexCard]);

function renderCard(card) {
    cardFront.querySelector('h1').textContent = card['frontEn'];
    if (myProgress === 0) {
        makeMyProgress(progValue);
    }

    cardFront.addEventListener('click', function () {
        cardBack.querySelector('h1').textContent = card['backRus'];
        cardBack.querySelector('span').textContent = card['example'];
        flipCard.classList.add('active');
    });

    cardBack.addEventListener('click', function () {
        cardFront.querySelector('h1').textContent = card['frontEn'];
        flipCard.classList.remove('active');
    });
}

sliderControls.addEventListener('click', function (event) {
    const element = event.target;

    if (element === next) {
        indexCard++;
        renderCard(cards[indexCard]);
        currentWord.textContent = indexCard + 1;
        makeMyProgress(progValue);
    }

    if (element === back) {
        indexCard--;
        currentWord.textContent = indexCard + 1;
        renderCard(cards[indexCard]);
        myProgress -= progValue;
        progressTrain.value = myProgress;
    }

    if (element === exam) {
        studyCards.innerHTML = '';
        renderExamCards(cards);
        timerId = setInterval(runTimer, 1000);
    }

    if (indexCard > 0 && indexCard < cards.indexOf(cards[cards.length - 1])) {
        next.disabled = false;
        back.disabled = false;
    };

    if (indexCard === 0) {
        next.disabled = false;
        back.disabled = true;
    };

    if (indexCard === cards.indexOf(cards[cards.length - 1])) {
        back.disabled = false;
        next.disabled = true;
    }
});

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

shuffleWords.addEventListener('click', function () {
    shuffle(cards);
    renderCard(cards[indexCard]);
});

//сложно и повторяется 1ое слово, если перемешать слова
// shuffleWords.addEventListener('click', function () {
//     const randomNumber = generateRandomValue(1, 4);

//     switch (randomNumber) {
//         case 1:
//             const sortCards1 = cards.sort((a, b) => customSort(b.backRus, a.backRus));
//             renderCard(sortCards1[indexCard]);
//             break;
//         case 2:
//             const sortCards2 = cards.sort((a, b) => customSort(b.frontEn, a.frontEn));
//             renderCard(sortCards2[indexCard]);
//             break;
//         case 3:
//             const sortCards3 = cards.sort((a, b) => customSort(a.frontEn, b.frontEn));
//             renderCard(sortCards3[indexCard]);
//             break;
//     }
//     console.log(cards);
// });

let selectedCard = null;
function renderExamCards(arr) {
    myProgress = 0;
    studyMode.classList.add('hidden');
    examMode.classList.remove('hidden');

    arr.forEach(function (card) {
        const myCardEn = makeCard();
        myCardEn.textContent = card['frontEn'];
        const myCardRus = makeCard();
        myCardRus.textContent = card['backRus'];
        examCards.append(myCardEn, myCardRus);
    });

    examCards.addEventListener('click', clickCard)
}

function makeCard() {
    const myCard = document.createElement('div');
    myCard.classList.add('card');

    return myCard;
}

function clickCard(event) {
    const element = event.target;

    if (element.classList.contains('fade-out')) {
        return false;
    }

    if (!selectedCard) {
        selectedCard = element.textContent;
        element.classList.add('correct');
    } else {
        checkCards(selectedCard, element);
        selectedCard = null;
        makeSuccess(element);
    }
}

function checkCards(card, el) {
    const keysValues = Object.entries(dictionary);
    const findCard = keysValues.find(item => item.includes(card) && item.includes(el.textContent));
    if (findCard) {
        el.classList.add('correct');
        myProgress += progValue;
        progressExam.value = myProgress;
        correctPercent.textContent = myProgress + '%';
        localStorage.setItem('myProgress', myProgress);
        removeСards();
    } else {
        el.classList.add('wrong');

        const elCorrect = document.querySelectorAll('.correct');
        setTimeout(() => {
            elCorrect.forEach(elem => {
                elem.classList.remove('correct');
            })
            el.classList.remove('wrong');
        }, 500)
    }
}

function removeСards() {
    const elCorrect = document.querySelectorAll('.correct');

    elCorrect.forEach(elem => {
        elem.classList.add('fade-out');
    })

}

function generateRandomValue(min, max) {
    return min + Math.floor(Math.random() * (max - min))
}

function customSort(a, b) {
    if (a > b) {
        return 1;
    }

    if (a === b) {
        return 0;
    }

    if (a < b) {
        return -1;
    }
}

function makeMyProgress(value) {
    myProgress += value;
    progressTrain.value = myProgress;
    return myProgress;
}

function makeWordStatistics(item) {
    let count = 0;
    newArr.push(item);

    return function () {
        count++;
        return count;
    }
}

function makeSuccess(el) {
    const arr = Array.from(examCards.children);
    const filterFadeOut = arr.filter(item =>
        item.classList.contains('fade-out')
    )

    const keysValues = Object.entries(dictionary);
    const findCard = keysValues.find(item => item.includes(el.textContent));
    const word = findCard[0];

    const stat = makeWordStatistics(word);
    stat()

    if (filterFadeOut.length === 10) {
        setTimeout(() => {
            alert('Проверка знаний прошла успешно!');
            timeTest.textContent = time.textContent;
            clearInterval(timerId);
            resultsModal.classList.remove('hidden');
            const objDublicates = searchForDuplicates(newArr);
            localStorage.setItem('objDublicates', JSON.stringify(objDublicates));
            Object.entries(objDublicates).forEach(item => {
                const wordStats = templateByResult(item[0], item[1]);
                resultsContent.before(wordStats);
            })
        }, 500)
    }
}

// function runTimer() {
//     const timeExam = time.textContent.split(':');
//     let minutes = +timeExam[0];
//     let seconds = +timeExam[1];
//     if (seconds <= 59) {
//         seconds++;
//     } else {
//         minutes++;
//         seconds = 0;
//     }
//     if (minutes >= 0 && seconds >= 0) {
//         time.textContent = `${format(minutes)}:${format(seconds)}`
//     }
// }

function format(value) {
    if (value < 10) {
        return `0${value}`;
    }
    return value;
}

function templateByResult(elem0, elem1) {
    const result = wordStatsTemplate.content.cloneNode('true');

    result.querySelector('.word span').textContent = elem0;
    result.querySelector('.attempts span').textContent = elem1;

    return result;
}

function searchForDuplicates(arr) {
    var array = {};

    for (var i = 0; i < arr.length; i++) {
        if (array[arr[i]]) {
            array[arr[i]] += 1;
        } else {
            array[arr[i]] = 1;
        }
    }
    return array;
}