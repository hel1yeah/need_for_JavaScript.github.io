'use string';
// получаем константы 
const SCORE = document.querySelector('.score'),
  START = document.querySelector('.start'),
  GAME_AREA = document.querySelector('.game_area'),
  car = document.createElement('div'),
  game = document.querySelector('.game');
/* вешаем обработчик событий click на константу START
  при клике на див с классом .start запускаем фунцию  startGame */
START.addEventListener('click', startGame);
/* вешаем обработчик событий keydown (нажатая кнопка) на константу весь html document. При нажатии запускаеться функция startRun*/
document.addEventListener('keydown', startRun);
/* вешаем обработчик событий keyup (отпущенная кнопка  кнопка) на константу весь html document. При нажатии запускаеться функция stopRun */
document.addEventListener('keyup', stopRun);

// делаем звук
// музыка
const audioMuzlo = document.createElement('audio');
audioMuzlo.src = '../audio/soundTrack.mp3';
audioMuzlo.volume = 0.05;
// звук мотора
const audioEngine = document.createElement('audio');
audioEngine.src = '../audio/engine1.mp3';
audioEngine.volume = 0.05;
audioEngine.loop = true;

// отбьект для кнопок
const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false,
};
const setting = {
  start: false,
  score: 0,
  speed: 7,
  traffic: 4,
};

function getQuantityElements(heightElement) {
  return (document.documentElement.clientHeight / heightElement) + 1;
}


// функция startGame выполняеться после нажатия на блок 'start' и запускает функцию playGame
function startGame() {
  game.append(audioMuzlo);
  game.append(audioEngine);
  
  audioMuzlo.play();
  audioEngine.play();

  // requestAnimationFrame указывает браузеру на то, что вы хотите произвести анимацию, и просит его запланировать перерисовку на следующем кадре анимациию
  requestAnimationFrame(playGame);
  START.classList.add('hide');
  SCORE.classList.add('active');


  GAME_AREA.innerHTML = ' ';
  setting.start = true;
  GAME_AREA.append(car);
  car.classList.add('car');
  car.style.left = ((GAME_AREA.offsetWidth / 2) - car.offsetWidth / 2) + 'px';
  car.style.bottom = '15px';
  setting.x = car.offsetLeft;
  setting.y = car.offsetTop;

  for (let i = 0; i < getQuantityElements(35); i++) {
    const line = document.createElement('div');
    line.classList.add('line');
    line.style.top = `${i * 100}px`;
    GAME_AREA.append(line);
    line.y = i * 100;
  }

  for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++) {
    const enemy = document.createElement('div');
    const randomEnemy = Math.floor(Math.random() * 7) + 1 ;
    enemy.classList.add('enemy');
    enemy.y = -100 * setting.traffic * (1 + i);
    enemy.style.left = Math.floor(Math.random() * (GAME_AREA.offsetWidth - 50)) + 'px';
    enemy.style.background = `transparent url(../image/enemy${randomEnemy}.png) center no-repeat`;
    enemy.style.backgroundSize = 'contain';
    enemy.style.top = enemy.y + 'px';
    GAME_AREA.append(enemy);
  }
}
// функция playGame  перезапускает саму себя постоянно пока значение setting.start === true
function playGame() {
    if (setting.start) {
    setting.score += setting.speed;
    SCORE.innerHTML = 'SCORE: <br>' + setting.score;
    moveRoad();
    moveEnemy();
    if (keys.ArrowLeft && setting.x > 5) {
      setting.x -= setting.speed;
    }
      if (keys.ArrowRight && setting.x < (GAME_AREA.offsetWidth - (car.offsetWidth + 5))) {
      setting.x += setting.speed;
    }
    if (keys.ArrowUp && setting.y > 5) {
      setting.y -= setting.speed;
    }
      if (keys.ArrowDown && setting.y < (GAME_AREA.offsetHeight - (car.offsetHeight + 5))) {
      setting.y += setting.speed;
    }
    car.style.left = setting.x + 'px';
    car.style.top = setting.y + 'px';
    requestAnimationFrame(playGame);
  }
}


function moveRoad() {
  let linesPage = document.querySelectorAll('.line');
  linesPage.forEach(function (elem) {
    elem.y += setting.speed;
    elem.style.top = elem.y + 'px';
    if (elem.y >= document.documentElement.clientHeight) {
      elem.y = -100;
    }
  });
}


function moveEnemy() {
  let enemyPage = document.querySelectorAll('.enemy');

  enemyPage.forEach(function (elem) {
    let carRect = car.getBoundingClientRect();
    let enemyRect = elem.getBoundingClientRect();

    if (carRect.top <= enemyRect.bottom &&
      carRect.right >= enemyRect.left &&
      carRect.left <= enemyRect.right &&
      carRect.bottom >= enemyRect.top) {
      START.classList.remove('hide');
      setting.start = false;
      audioMuzlo.pause();
      audioEngine.pause();
    }


    elem.y += setting.speed / 2;
    elem.style.top = elem.y + 'px';

    if (elem.y >= document.documentElement.clientHeight) {
      elem.y = -100 * setting.traffic;
      elem.style.left = Math.floor(Math.random() * (GAME_AREA.offsetWidth - 50)) + 'px';
    }

  });
}

/* ================================================================================================ 
  Решение проблемы с сбросом preventDefault (стандарнтного поведения браузера при нажатых клавишах)
*/

function startRun(event) {
  if (event.key !== 'F5' && event.key !== 'F12') {
    event.preventDefault();
    if (keys.hasOwnProperty(event.key)) {
      keys[event.key] = true;
    }
  }
}

function stopRun(event) {

    if (keys.hasOwnProperty(event.key)) {
      event.preventDefault();
      keys[event.key] = false;
      
    }
}
/* ================================================================================================
  давляем музыку
*/

