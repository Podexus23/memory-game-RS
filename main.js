const NAMES = ['baby', 'cat', 'colonel', 'drake', 'lilkeanu', 'robert', 'spider', 'sponge'];


let creatCardHolder = (function(){
  const main = document.querySelector('.main-container');
  main.append(createMainHolder());

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
    return card
  }
})()

let gameControl = (function(){
  const mainHolder = document.querySelector('.cardholder');
  let sources = NAMES.map(name => [`./assets/${name}1.jpg`, `./assets/${name}2.jpg`]).flat();
  let gameMap = shuffleArray(sources);

  let getSrc = function(node){
    let [cardX, cardY] = node.dataset.id.split(':');
    return `url(${gameMap[cardX][cardY]})`;
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
    mainHolder.style.pointerEvents = 'inherit';
  }

  function turnCard(e){
    if(!e.target.classList.contains('card')) return;
    e.target.classList.toggle('open');
    e.target.style.backgroundImage = getSrc(e.target);
    let played = mainHolder.querySelectorAll('.open');
    if(played.length == 2) {
      mainHolder.style.pointerEvents = 'none';
      setTimeout(setClasses, 800);}
    
  }
  mainHolder.addEventListener('click', turnCard);
})()