'use string';
// получаем константы 
const SCORE = document.querySelector('.score'),
  START = document.querySelector('.start'),
  GAME_AREA = document.querySelector('.game_area'),
  CAR = document.createElement('div'),
  RESET = document.querySelector('.reset'),
  GAME = document.querySelector('.game'),
  HEIGHT_ELEM = 100;
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
// audioMuzlo.src = '../audio/soundTrack.mp3';
audioMuzlo.volume = 0.05;
// звук мотора
const audioEngine = document.createElement('audio');
// audioEngine.src = '../audio/engine1.mp3';
audioEngine.volume = 0.05;
audioEngine.loop = true;

// настройки высоты GAME_AREA
const COUNT_SECTION = Math.floor(document.documentElement.clientHeight / HEIGHT_ELEM)

GAME_AREA.style.height = COUNT_SECTION * HEIGHT_ELEM;

// отбьект для кнопок
const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false,
};
// обьект настроек start отвечает за включение игры, score очки, speed скорость игры, traffic плотность enemy
const setting = {
  start: false,
  score: 0,
  speed: 5,
  traffic: 2,
};

function getQuantityElements(heightElement) {
  return (GAME_AREA.offsetHeight / heightElement) + 1;
}


// функция startGame выполняеться после нажатия на блок 'start' и запускает функцию playGame
function startGame() {
  GAME.append(audioMuzlo);
  GAME.append(audioEngine);

  audioMuzlo.play();
  audioEngine.play();

  // requestAnimationFrame указывает браузеру на то, что вы хотите произвести анимацию, и просит его запланировать перерисовку на следующем кадре анимациию
  requestAnimationFrame(playGame);

  RESET.style.zIndex = 3;

  SCORE.classList.add('active');

  GAME_AREA.innerHTML = ' ';
  setting.start = true;
  GAME_AREA.append(CAR);
  CAR.classList.add('car');
  CAR.style.left = ((GAME_AREA.offsetWidth / 2) - CAR.offsetWidth / 2) + 'px';
  CAR.style.bottom = '15px';
  setting.x = CAR.offsetLeft;
  setting.y = CAR.offsetTop;

  for (let i = 0; i < getQuantityElements(HEIGHT_ELEM); i++) {
    const line = document.createElement('div');
    line.classList.add('line');
    line.style.top = `${i * HEIGHT_ELEM}px`;
    GAME_AREA.append(line);
    line.y = i * HEIGHT_ELEM;
  }

  for (let i = 0; i < getQuantityElements(HEIGHT_ELEM * setting.traffic); i++) {
    const enemy = document.createElement('div');
    const randomEnemy = Math.floor(Math.random() * 11) + 1 ;
    enemy.classList.add('enemy');
    enemy.y = -HEIGHT_ELEM * setting.traffic * (1 + i);
    enemy.style.left = Math.floor(Math.random() * (GAME_AREA.offsetWidth - HEIGHT_ELEM/2)) + 'px';
    enemy.style.background = `transparent url(../image/enemy${randomEnemy}.png) center no-repeat`;
    enemy.style.backgroundSize = 'cover';
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
      if (keys.ArrowRight && setting.x < (GAME_AREA.offsetWidth - (CAR.offsetWidth + 5))) {
      setting.x += setting.speed;
    }
    if (keys.ArrowUp && setting.y > 5) {
      setting.y -= setting.speed;
    }
      if (keys.ArrowDown && setting.y < (GAME_AREA.offsetHeight - (CAR.offsetHeight + 5))) {
      setting.y += setting.speed;
    }
      CAR.style.left = setting.x + 'px';
      CAR.style.top = setting.y + 'px';
    requestAnimationFrame(playGame);
  }
}


function moveRoad() {
  let linesPage = document.querySelectorAll('.line');
  linesPage.forEach(function (elem) {
    elem.y += setting.speed;
    elem.style.top = elem.y + 'px';
    if (elem.y >= GAME_AREA.offsetHeight) {
      elem.y = -HEIGHT_ELEM;
    }
  });
}


function moveEnemy() {
  let enemyPage = document.querySelectorAll('.enemy');

  enemyPage.forEach(function (elem) {
    let carRect = CAR.getBoundingClientRect();
    let enemyRect = elem.getBoundingClientRect();
    if (carRect.top <= enemyRect.bottom &&
      carRect.right >= enemyRect.left &&
      carRect.left <= enemyRect.right &&
      carRect.bottom >= enemyRect.top) {
      setting.start = false;
      RESET.style.zIndex = 1;
      
      audioMuzlo.pause();
      audioEngine.pause();
    }

    elem.y += setting.speed / 2;
    elem.style.top = elem.y + 'px';

    if (elem.y >= GAME_AREA.offsetHeight) {
      elem.y = -HEIGHT_ELEM * setting.traffic;
      elem.style.left = Math.floor(Math.random() * (GAME_AREA.offsetWidth - elem.offsetWidth)) + 'px';
    }

  });
}
// начать игру с начала
RESET.addEventListener('click',  () =>{
  setting.start = false;
  RESET.style.zIndex = 1;
});
/* ================================================================================================ 
  Решение проблемы с способом preventDefault (стандарнтного поведения браузера при нажатых клавишах)
*/
/* если нажатые кнопки не  'F5' или 'F12', скидываем стандарное поведение кнопки и начинаем выполнять условие
  если кнопка нажата то в обьект keys в свойство обьекта записываем true;
*/
function startRun(event) {
  if (event.key !== 'F5' && event.key !== 'F12') {
    event.preventDefault();
    if (event.key) {
      keys[event.key] = true;
    }
  }
}
/* можно было сделать условие такое как выше с операторами !==, но есть вариант лучше.
  если отпущенная кнопка есть в ствойствах обьекта keys то скидываем стандартное поведение клавиш которых отпускаем и присваеваем этому свойству = false
*/
function stopRun(event) {
    if (keys.hasOwnProperty(event.key)) {
      event.preventDefault();
      keys[event.key] = false;
      
    }
}
/* ================================================================================================
  давляем музыку
*/

