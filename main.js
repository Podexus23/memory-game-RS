const NAMES = ['baby', 'cat', 'colonel', 'drake', 'lilkeanu', 'robert', 'spider', 'sponge'];


let createCardHolder = (function(){
  

  function createMainHolder(){
    const mainCardHolder = document.createElement('div');
    mainCardHolder.classList.add('cardholder');
    let counter = 4;
    while(counter > 0){
      let row = createHolder();
      let cards = row.querySelectorAll('.card');
      cards.forEach(card => {
        card.dataset.id = `${4-counter}:${card.dataset.id}`
      })
      mainCardHolder.append(row);
      counter--
    }
    return mainCardHolder
  }

  function createHolder(){
    const holder = document.createElement('div');
    holder.classList.add('holder-row');
    let counter = 4;
    while(counter > 0){
      let card = createCard();
      card.dataset.id = `${4-counter}`;
      holder.append(card);
      counter--
    }
    return holder
  }

  function createCard(){
    const card = document.createElement('div');
    card.classList.add('card')
    card.style.backgroundImage = `url(./assets/jdun.jpg)`;
    return card
  }
  return{
    createMainHolder,
  }
})()

let cardControl = (function(){
  const mainHolder = document.querySelector('.cardholder');
  let sources = NAMES.map(name => [`./assets/${name}1.jpg`, `./assets/${name}2.jpg`]).flat();
  let gameMap = shuffleArray(sources);

  let getSrc = function(node){
    let [cardX, cardY] = node.dataset.id.split(':');
    return `url(${gameMap[cardX][cardY]})`;
  }

  function makeDate(){
    let date = new Date();
    return `${date.toLocaleString()}`
  }

  function shuffleArray(array) {
    let chunked = []
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    for(let i = 0; i < array.length; i+=4){
      chunked.push(array.slice(i, i+4))
    }
    return chunked
  }

  function checkForPlayed(){
    let played = mainHolder.querySelectorAll('.open');
    if(played.length == 2){
      counterControl.counterCount()
      let first = getSrc(played[0]).slice(13, 16);
      let second = getSrc(played[1]).slice(13, 16);
      return first == second
    }
  }

  function setClasses(){
    let played = mainHolder.querySelectorAll('.open');
    if(checkForPlayed() && played.length == 2){
      played.forEach(node => {
        node.classList.add('played');
        node.classList.remove('open');
        played.length = 0;
      })
    } else if(played.length == 2){
        played.forEach(node => {
        node.classList.remove('open');
        node.style.backgroundImage = `url(./assets/jdun.jpg)`;
      })
    }
    if(mainHolder.querySelectorAll('.played').length == 16) {
      controlModalWindow.getResultData().push([makeDate(), counterControl.getCounter()])
      runTheGame.endGame();
    }
    mainHolder.style.pointerEvents = 'inherit';
  }

  function turnCard(e){
    if(!e.target.classList.contains('card')) return;
    e.target.classList.toggle('open');
    e.target.style.backgroundImage = getSrc(e.target);
    let played = mainHolder.querySelectorAll('.open');
    if(played.length == 2) {
      mainHolder.style.pointerEvents = 'none';
      setTimeout(setClasses, 800);
    }
  }
  mainHolder.addEventListener('click', turnCard);
})

let controlModalWindow = (function(){
  const modal = document.querySelector('.modal-win');
  const main = document.querySelector('.main-container');
  let resultsData = [];
  document.addEventListener('DOMContentLoaded', () => {
    if(localStorage.results.length != 0 ) resultsData = JSON.parse(localStorage.results);
    if(typeof resultsData == 'string') resultsData = [];
  })
  console.log(resultsData)
  //

  function createResultBlock(date, counter){
    const div = document.createElement('div');
    div.classList.add('result-block');
    div.innerHTML=`
        <div class="results-date">${date}</div>
        <div class="results-score">${counter}</div>
      `;
    return div;
  }
  
  function createModal(){
    modal.innerHTML = `
      <div class="modal-wrapper">
        <button class="close-modal">x</button>
        <div class="win-score">Счёт: <span class="final-score">${counterControl.getCounter() || 0}</span></div>
        <div class="results">
          <div class="results-title">
            <div class="date-title">Дата:</div>
            <div class="date-score">Счёт:</div>
          </div>
        </div>
        <button class="replay-button">Ещё разок?</button>
      </div>
    `;
    const results = modal.querySelector('.results');
    if(getResultData() == 0) return;
    resultsData.forEach(data => results.append(createResultBlock(data[0], data[1]))) 
  }
  function showModal(){
    main.style.filter = 'blur(5px)';
    modal.style.display = 'flex';
  }
  function hideModal(){
    main.style.filter = 'none';
    modal.style.display = 'none';
  }
  function getResultData(){
    if(resultsData.length > 9) resultsData.shift();
    return resultsData
  }
  return {
    createModal,
    showModal,
    hideModal,
    getResultData,
  }
})()

let counterControl = (function(){
  let counter = 0;
  let headerCounter = document.querySelector('.counter span')
  function counterCount(){
    counter++
    headerCounter.textContent = counter;
  }

  function getCounter(){
    return counter
  }

  function resetCounter(){
    counter = 0;
    headerCounter.textContent = counter;
  }

  return {
    getCounter,
    counterCount,
    resetCounter
  }
})()

let runTheGame = (function(){
  const main = document.querySelector('.main-container');
  const resultsButton = document.querySelector('.score');
  
  resultsButton.addEventListener('click', endGame)
  
  let startGame = (function(){
    main.append(createCardHolder.createMainHolder());
    takeDataFromLocalStorage();
    controlModalWindow.createModal();
    cardControl();
  });
  startGame();

  function takeDataFromLocalStorage(){

  }

  function endGame(){
    controlModalWindow.createModal();
    const closeModalButton = document.querySelector('.close-modal');
    const resetButton = document.querySelector('.replay-button');
    closeModalButton.addEventListener('click', controlModalWindow.hideModal);
    resetButton.addEventListener('click', resetGame)
    controlModalWindow.showModal();
  }

  function resetGame(){
    document.querySelector('.cardholder').remove();
    controlModalWindow.hideModal();
    counterControl.resetCounter();
    startGame();
  };

  

  return {
    endGame,
    resetGame,
  }
})()

window.addEventListener('unload', () => {
  localStorage.results = JSON.stringify(controlModalWindow.getResultData())
})

