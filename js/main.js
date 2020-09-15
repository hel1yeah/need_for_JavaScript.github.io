'use strict';
// получаем константы 
const SCORE = document.querySelector('.score'),
  START = document.querySelector('.start'),
  GAME_AREA = document.querySelector('.game_area'),
  CAR = document.createElement('div'), // createElement создаёт на странице елемент div
  RESET = document.querySelector('.reset'),
  GAME = document.querySelector('.game'),
  HEIGHT_ELEM = 100; // присваеваем константе HEIGHT_ELEM значение 100. Это значение (100) часто повторяется по этому так и делаем.

/* вешаем обработчик событий click на константу START
  при клике на див с классом .start запускаем фунцию  startGame */
START.addEventListener('click', startGame);

/* вешаем обработчик событий keydown (нажатая кнопка) на константу весь html document. При нажатии запускаеться функция startRun*/
document.addEventListener('keydown', startRun);

/* вешаем обработчик событий keyup (отпущенная кнопка  кнопка) на константу весь html document. При нажатии запускаеться функция stopRun */
document.addEventListener('keyup', stopRun);

// делаем звук
// музыка
// создаём на странице елемент "audio" и присваеваем его константе audioMuzlo
const audioMuzlo = document.createElement('audio');
// указываем атрибут src и относительный путь к файлу которій должен запускаться для audioMuzlo
audioMuzlo.src = '../audio/soundTrack.mp3';
// для audioMuzlo задаём звук от 0 до 1
audioMuzlo.volume = 0.3;

// звук мотора
// создаём на странице елемент "audio" и присваеваем его константе audioEngine
const audioEngine = document.createElement('audio');
// указываем атрибут src и относительный путь к файлу которій должен запускаться для audioEngine
audioEngine.src = '../audio/engine1.mp3';
// для audioEngine задаём звук от 0 до 1 с помощью атрибута volume
audioEngine.volume = 0.2;
// для audioEngine используем булевый метод loop и присваеваем ему true, что значит сразу как аудио проиграеться до конца оно тутже запуститься с начала. аналогия  автоплей
audioEngine.loop = true;
// ++++++++++++++
// настройки высоты GAME_AREA
// константе  COUNT_SECTION присваеваем высоту экрана делённую на нашу высоту елемента (HEIGHT_ELEM) и округлить до меньшего числа. 
const COUNT_SECTION = Math.floor(document.documentElement.clientHeight / HEIGHT_ELEM);

// присваеваем значению height константы GAME_AREA значение COUNT_SECTION умноженное на HEIGHT_ELEM
// это делаеться для того что бы определить высоту кратную длинне наших дорожных линий и что бы линии не накладывались друг на друга.
GAME_AREA.style.height = COUNT_SECTION * HEIGHT_ELEM;
// ++++++++++++++
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
// getQuantityElements функция которая возвращает количевство елементов на странице 
function getQuantityElements(HEIGHT_ELEM) {
  return (GAME_AREA.offsetHeight / HEIGHT_ELEM) + 1;

}


// функция startGame выполняеться после нажатия на блок 'start' и запускает функцию playGame
function startGame() {
  //Добавляем на страницу в конец константы GAME audioMuzlo с помощью метода append, он добавляет набор объектов Node или DOMString в конец после последнего потомка
  GAME.append(audioMuzlo);
  GAME.append(audioEngine);

  // запускаем звуки на странице когда вкл функция startGame()
  audioMuzlo.play();
  audioEngine.play();

  // requestAnimationFrame указывает браузеру на то, что вы хотите произвести анимацию, и просит его запланировать перерисовку на следующем кадре анимациию
  requestAnimationFrame(playGame);

  // присваеваем значение 3 для стилей zIndex константы RESET
  RESET.style.zIndex = 3;

  // присваеваем константе SCORE ещё один класс .active
  SCORE.classList.add('active');

  // обнуляем GAME_AREA
  GAME_AREA.innerHTML = ' ';

  // обращаемся к обьекту setting и его свойству start и записываем туда значение true
  setting.start = true;

  //Добавляем на страницу в конец константы GAME_AREA CAR с помощью метода append, он добавляет набор объектов Node или DOMString в конец после последнего потомка
  GAME_AREA.append(CAR);

  // Добавляем созданному елементу класс car
  CAR.classList.add('car');

  // устанавливаем краёнее левое положение CAR при первом старте игры 
  // отнимая от половины ширины дороги половину ширины авто
  CAR.style.left = ((GAME_AREA.offsetWidth / 2) - CAR.offsetWidth / 2) + 'px';

  // устанавливаем краёнее нижнее положение CAR при первом старте игры 
  CAR.style.bottom = '15px';

  // добавляем в обьект свойст х, у.
  // и добавляем в эти свойста значение в х растояние от левой внутренной границы дороги (GAME_AREA) до левой внешнеё границы машины (CAR)
  setting.x = CAR.offsetLeft;

  // и добавляем в эти свойста значение в у растояние от верхней внутренной границы дороги (GAME_AREA) до верхней внешней границы машины (CAR)
  setting.y = CAR.offsetTop;
  
  // начинаем цикл фор 
  // он начинаеться от 0 заканчиваеться относительно высоты дороги при каждом повтрении итериции i увеличеваеться на  1, чем больше HEIGHT_ELEM тем больше итериций
  // этот цикл создаёт линии (LINE) розметки на дороге (GAME_AREA)
  for (let i = 0; i < getQuantityElements(HEIGHT_ELEM); i++) {
    // создаём див на странице и присваеваем его константе LINE
    const LINE = document.createElement('div');
    // присваеваем елементу div константы LINE класс .line
    LINE.classList.add('line');
    // присваеваем стилям константы LINE значению top "номер" итерации умноженный на высоту елемента, унстанавливаем где появится первый елемент
    LINE.style.top = `${(i * HEIGHT_ELEM)}px`;// изначальное положение линий
    // добавляем в GAME_AREA созданную выше константу LINE
    GAME_AREA.append(LINE);
    // записываем в обьект LINE новое свойство `y` и задаём ему значение
    // В функции moveRoad мы будем обращаться к `LINE.y` как к `elem.y`
    LINE.y = i * HEIGHT_ELEM;
    console.log(LINE.y);
  }


  for (let i = 0; i < getQuantityElements(HEIGHT_ELEM * setting.traffic); i++) {
    const enemy = document.createElement('div');
    const randomEnemy = Math.floor(Math.random() * 11) + 1;
    enemy.classList.add('enemy');
    enemy.y = -HEIGHT_ELEM * setting.traffic * (1 + i);
    enemy.style.left = Math.floor(Math.random() * (GAME_AREA.offsetWidth - HEIGHT_ELEM / 2)) + 'px';
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

// движение дороги 
function moveRoad() {
  // присваеваем переменной linesPage = NodeList.
  // который имеет в себе количевство линий что мы сделали выше.
  let linesPage = document.querySelectorAll('.line');
  // с помощью цикла forEach перебераем все елементы в нутри NodeList переменной linesPage
  // когда мы делаем перебор linesPage с помощью цикла forEach то мы обращаемся к line.
  // а класс line ми уже присвоили дивам которые созадли в startGame() 119 строка
  // Метод forEach() выполняет указанную функцию один раз для каждого элемента в массиве.
  linesPage.forEach((elem) => {
    // обращаясь к elem.y мы обращаемся к константе LINE ктотрая являеться одноимённым обьектом и меняем 
    // в ключе "у" значение добавляя в него каждую итерацию свойство обьекта setting.speed
    elem.y += setting.speed;
    // меняем стили у LINE увеличивая каждую операцию отступ от верхней границы GAME_AREA до line.
    elem.style.top = elem.y + 'px';
    // условие при котором если верхний отступ от line больше чем высота блока GAME_AREA то line пропадает за пределами блока GAME_AREA,
    // потому, что ему установлено в css свойство overflow: hidden.
    // elem.y = i * HEIGHT_ELEM
    // 
    // console.log(elem.y);
    if (elem.y >= GAME_AREA.offsetHeight) { //+++++++++++++++++++++++++++++++++++++++++++++
      elem.y = -HEIGHT_ELEM;                //+++++++++++++++++++++++++++++++++++++++++++++
    }
    console.log(elem.y);
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
      audioEngine.pause();
      audioEngine.currentTime = 0;
      audioMuzlo.pause();
      audioMuzlo.currentTime = 0;


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
RESET.addEventListener('click', () => {
  setting.start = false;
  RESET.style.zIndex = 1;
  audioEngine.pause();
  audioEngine.currentTime = 0;
  audioMuzlo.pause();
  audioMuzlo.currentTime = 0;

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

