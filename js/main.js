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
  ArrowUp : false,
  ArrowDown : false,
  ArrowRight : false,
  ArrowLeft : false,
};
const setting = {
  start: false,
  score: 0,
  speed: 3,
};
// функция startGame выполняеться после нажатия на блок 'start' и запускает функцию playGame
function startGame() {
  // requestAnimationFrame указывает браузеру на то, что вы хотите произвести анимацию, и просит его запланировать перерисовку на следующем кадре анимациию
  requestAnimationFrame(playGame);
  setting.start = true;
  gameArea.appendChild(car);
  car.classList.add('car');
  setting.x = car.offsetLeft;
  setting.y = car.offsetBottom;
}
// функция playGame  перезапускает саму себя постоянно пока значение setting.start === true
function playGame() {
  console.log('play bGame');
  if (setting.start) {
    if (keys.ArrowLeft) {
      setting.x -= setting.speed;
    }
    if (keys.ArrowRight) {
      setting.x += setting.speed;
    }
    if (keys.ArrowUp) {
      setting.y -= setting.speed;
    }
    if (keys.ArrowDown) {
      setting.y += setting.speed;
    }
    car.style.left = setting.x + 'px';
    car.style.bottom = setting.y + 'px';
    requestAnimationFrame(playGame);
  }
  
}
function startRun(event) {
  event.preventDefault();
  keys[event.key] = true;
}
function stopRun(event) {
  console.log('stop');
  keys[event.key] = false;
}

