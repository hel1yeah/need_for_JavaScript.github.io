'use string';
// получаем константы 
const score = document.querySelector('.score'),
  start = document.querySelector('.start'),
  gameArea = document.querySelector('.game_area'),
  car = document.createElement('div');
/* вешаем обработчик событий click на константу start
  при клике на див с классом .start запускаем фунцию  startGame */
start.addEventListener('click', startGame);
/* вешаем обработчик событий keydown (нажатая кнопка) на константу весь html document. При нажатии запускаеться функция startRun*/
document.addEventListener('keydown', startRun);
/* вешаем обработчик событий keyup (отпущенная кнопка  кнопка) на константу весь html document. При нажатии запускаеться функция stopRun */
document.addEventListener('keyup', stopRun);
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
  speed: 3,
  traffic: 3,
};

function getQuantityElements(heightElement) {
  return (document.documentElement.clientHeight / heightElement) + 1;
}


// функция startGame выполняеться после нажатия на блок 'start' и запускает функцию playGame
function startGame() {
  // requestAnimationFrame указывает браузеру на то, что вы хотите произвести анимацию, и просит его запланировать перерисовку на следующем кадре анимациию
  requestAnimationFrame(playGame);
  start.classList.add('hide');
  score.classList.add('active');


  gameArea.innerHTML = ' ';
  setting.start = true;
  gameArea.append(car);
  car.classList.add('car');
  car.style.left = ((gameArea.offsetWidth / 2) - car.offsetWidth / 2) + 'px';
  car.style.bottom = '15px';
  setting.x = car.offsetLeft;
  setting.y = car.offsetTop;

  for (let i = 0; i < getQuantityElements(35); i++) {
    const line = document.createElement('div');
    line.classList.add('line');
    line.style.top = `${i * 100}px`;
    gameArea.append(line);
    line.y = i * 100;
  }

  for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++) {
    const enemy = document.createElement('div');
    const randomEnemy = Math.floor(Math.random() * 7) + 1 ;
    enemy.classList.add('enemy');
    enemy.y = -100 * setting.traffic * (1 + i);
    enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    enemy.style.background = `transparent url(../image/enemy${randomEnemy}.png) center no-repeat`;
    enemy.style.backgroundSize = 'contain';
    enemy.style.top = enemy.y + 'px';
    gameArea.append(enemy);
  }
}
// функция playGame  перезапускает саму себя постоянно пока значение setting.start === true
function playGame() {
  setting.score += setting.speed;
  score.innerHTML = 'SCORE: <br>' + setting.score;
  if (setting.start) {
    moveRoad();
    moveEnemy();
    if (keys.ArrowLeft && setting.x > 5) {
      setting.x -= setting.speed;
    }
    if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - (car.offsetWidth + 5))) {
      setting.x += setting.speed;
    }
    if (keys.ArrowUp && setting.y > 5) {
      setting.y -= setting.speed;
    }
    if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - (car.offsetHeight + 5))) {
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
      start.classList.remove('hide');
      setting.start = false;
    }


    elem.y += setting.speed / 2;
    elem.style.top = elem.y + 'px';

    if (elem.y >= document.documentElement.clientHeight) {
      elem.y = -100 * setting.traffic;
      elem.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
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
