//////////////////////////////  GAME CLASSES  //////////////////////////////

class Square {
  constructor(i, j) {
    this.i = i;
    this.j = j;
    this.ninja = false;
    this.nearby = 0;  // number that will be on a square if reveal and not ninja
    this.status = 0;
    //0 fresh
    //1 revealed
    //2 marked
  }
}

class Dojo {
  constructor() {
    this.width = 0;
    this.height = 0;
    this.ninjas = 0;  // count of total ninjas on the board - count of marked squares
    this.safes = 0;  // count of safe squares on the board - count of revealed squares
    this.gameOver = true;  // can't interact with squares when gameOver is true
    this.squares = [];  // a 2D array of Square
  }

  // make a new board with random ninja locations, 
  newGame(width, height, ninjas) {
    // size and counters
    this.width = width;
    this.height = height;
    this.ninjas = ninjas;
    this.safes = width * height - ninjas;

    // create squares
    this.squares = [];  // remove any squares from previous game
    var squares1 = [];  // a temporary 1d array of the squares for choosing ninja locations
    for (var i = 0; i < height; i++) {
      this.squares.push([])
      for (var j = 0; j < width; j++) {
        this.squares[i].push(new Square(i, j));
        squares1.push(this.squares[i][j]);
      }
    }

    // randomly assign ninjas to squares from the 1d array
    var ninja_squares = [];  // temporary 1d array of the squares that have ninjas
    var count = 0;
    while (count < ninjas) {
      var i1 = Math.floor(Math.random() * squares1.length);
      squares1[i1].ninja = true;
      //move the chosen square to ninja_squares array
      ninja_squares.push(squares1.splice(i1, 1)[0]);
      count++;
    }

    // increment 'nearby' for squares next to the squares with ninjas
    // (less calculations than counting all ninjas next to every square)
    for (var ninja_square in ninja_squares) {
      var imin = Math.max(0, ninja_square.i - 1);
      var imax = Math.min(height - 1, ninja_square.i + 1);
      var jmin = Math.max(0, ninja_square.j - 1);
      var jmax = Math.min(width - 1, ninja_square.j + 1);
      for (var i2 = imin; i2 <= imax; i2++)
        for (var j2 = jmin; j2 <= jmax; j2++)  // i2,j2 is an adjacent square
          this.squares[i2][j2].nearby++;
    }

    // make the game playable
    this.gameOver = false;
  }

  checkWinCondition() {
    if (this.safes === 0 && this.ninjas === 0) {
      this.gameOver = true;
      // TODO: notify UI
    }
  }

  tryReveal(i, j) {
    var square = this.squares[i][j];

    // do nothing if already revealed or marked or game is over
    if (square.status > 0 || this.gameOver === true)
      return;

    // lose condition
    if (square.ninja) {
      this.gameOver = true;
      square.btn.classList.add('mistake');
      cheatReveal();
      showLoseMessage();
      return;
    }

    square.status = 1;
    this.safes--;
    square.btn.classList.add("revealed");
    if (square.nearby > 0)
      square.btn.innerText = square.nearby;

    // if there are no nearby ninjas, reveal adjacent squares
    // by recursively calling the leftclick() function
    if (square.nearby === 0) {
      var imin = Math.max(0, i - 1);
      var imax = Math.min(this.height - 1, i + 1);
      var jmin = Math.max(0, j - 1);
      var jmax = Math.min(this.width - 1, j + 1);

      for (var i2 = imin; i2 <= imax; i2++)
        for (var j2 = jmin; j2 <= jmax; j2++)
          if (this.squares[i2][j2].status === 0)
            leftclick(i2, j2);
    }

    this.checkWinCondition();

  }
}

//////////////////////////////  GAME CLASSES  //////////////////////////////

//////////////////////////////  OLD CODE  //////////////////////////////

//theDojo is a 2D array of objects ("squares") which keep track of their status
var theDojo =
{
  width: 0,
  height: 0,
  ninjas: 0, //remaining ninjas
  ninjas_elem: document.querySelector("#ninjas"),
  safes: 0, //remaining safe squares
  safes_elem: document.querySelector("#safes"),
  gameOver: false,
  squares: [],
  div: document.querySelector("#the-dojo"), //for setting board width
  buttons: document.querySelector("#buttons") //where we put button html
};

var width_input = document.querySelector("#width");
var height_input = document.querySelector("#height");
var difficulty_input = document.querySelector("#difficulty");

var win_message = document.querySelector("#win_message");
var lose_message = document.querySelector("#lose_message");

function makeSquare(i, j) {
  return {
    i: i,
    j: j,
    ninja: false,
    nearby: 0,
    btn: 0,
    status: 0
    //0 regular
    //1 revealed
    //2 marked
  }
}

//reveal the rest of the board with alternate colors if you lose
function cheatReveal() {
  var square;
  for (var i = 0; i < theDojo.height; i++) {
    for (var j = 0; j < theDojo.width; j++) {
      square = theDojo.squares[i][j];
      if (square.status === 0) {
        square.btn.classList.add('cheat');
        if (!square.ninja) {
          square.btn.classList.add('revealed');
          square.btn.innerText = square.nearby > 0 ? square.nearby : "";

        }
        else {
          square.btn.classList.add('marked');
          square.btn.innerText = '*';
        }
      }
      else if (square.status === 2 && !square.ninja) {
        //mistake: marked the square but it didn't have a ninja
        square.btn.classList.add('cheat');
        square.btn.classList.remove('marked');
        square.btn.classList.add('mistake');
        square.btn.classList.add('revealed');
        square.btn.innerText = square.nearby > 0 ? square.nearby : "";
      }
    }
  }
}

function showWinMessage() {
  win_message.hidden = false;
  //hide again after 2 seconds
  setTimeout(() => { win_message.hidden = true; }, 2000);
}

function showLoseMessage() {
  lose_message.hidden = false;
  //hide again after 2 seconds
  setTimeout(() => { lose_message.hidden = true; }, 2000);
}

function updateCounters() {
  theDojo.safes_elem.innerText = ('00' + theDojo.safes).slice(-3);
  if (theDojo.ninjas <= -10)
    theDojo.ninjas_elem.innerText = theDojo.ninjas;
  else if (theDojo.ninjas < 0)
    theDojo.ninjas_elem.innerText = ('-0' + Math.abs(theDojo.ninjas));
  else
    theDojo.ninjas_elem.innerText = ('00' + theDojo.ninjas).slice(-3);
}

function checkWinCondition() {
  updateCounters();

  if (theDojo.safes === 0 && theDojo.ninjas === 0) {
    theDojo.gameOver = true;
    showWinMessage();
  }
}

function leftclick(i, j) {
  var square = theDojo.squares[i][j];

  // do nothing if already revealed or marked or game is over
  if (square.status > 0 || theDojo.gameOver === true)
    return;

  // lose condition
  if (square.ninja) {
    theDojo.gameOver = true;
    square.btn.classList.add('mistake');
    cheatReveal();
    showLoseMessage();
    return;
  }

  square.status = 1;
  theDojo.safes--;
  square.btn.classList.add("revealed");
  if (square.nearby > 0)
    square.btn.innerText = square.nearby;

  // if there are no nearby ninjas, reveal adjacent squares
  // by recursively calling the leftclick() function
  if (square.nearby === 0) {
    var imin = Math.max(0, i - 1);
    var imax = Math.min(theDojo.height - 1, i + 1);
    var jmin = Math.max(0, j - 1);
    var jmax = Math.min(theDojo.width - 1, j + 1);

    for (var i2 = imin; i2 <= imax; i2++)
      for (var j2 = jmin; j2 <= jmax; j2++)
        if (theDojo.squares[i2][j2].status === 0)
          leftclick(i2, j2);
  }

  checkWinCondition();
}

function rightclick(i, j) {
  var square = theDojo.squares[i][j];

  //do nothing if game is over
  if (theDojo.gameOver)
    return;

  // mark or unmark the square via class for special CSS styling
  // (do nothing if already revealed)
  if (square.status === 0) {
    square.status = 2;
    theDojo.ninjas--;
    square.btn.innerText = "*";
    square.btn.classList.add("marked");
  }
  else if (square.status === 2) {
    square.status = 0;
    theDojo.ninjas++;
    square.btn.classList.remove("marked");
    square.btn.innerText = "";
  }
  checkWinCondition();
}

function randomBoard(width, height, ninjas) {
  theDojo.width = width;
  theDojo.height = height;
  theDojo.ninjas = ninjas;
  theDojo.safes = width * height - ninjas;
  // create the empty board
  theDojo.squares = [];
  for (var i = 0; i < height; i++) {
    theDojo.squares.push([])
    for (var j = 0; j < width; j++)
      theDojo.squares[i].push(makeSquare(i, j));
  }

  // set {ninjas} random spots on the board to 1
  // infinite loop if ninjas > # squares on the board
  var count = 0;
  while (count < ninjas) {
    // get location of a random spot on the board
    var i = Math.floor(Math.random() * height);
    var j = Math.floor(Math.random() * width);
    // if the spot is empty, fill it, otherwise try again
    if (!theDojo.squares[i][j].ninja) {
      theDojo.squares[i][j].ninja = true;
      count++;
    }
  }

  // count nearby ninjas for each square and save it
  for (var i = 0; i < height; i++)
    for (var j = 0; j < width; j++) {
      var imin = Math.max(0, i - 1);
      var imax = Math.min(height - 1, i + 1);
      var jmin = Math.max(0, j - 1);
      var jmax = Math.min(width - 1, j + 1);
      for (var i2 = imin; i2 <= imax; i2++)
        for (var j2 = jmin; j2 <= jmax; j2++)
          if (theDojo.squares[i2][j2].ninja)
            theDojo.squares[i][j].nearby++;
    }

  // set width of the board so the buttons wrap properly (buttons are 32px)
  theDojo.div.style.width = width * 32 + "px";

  //create the board buttons
  buttonshtml = "";
  for (var i = 0; i < height; i++)
    for (var j = 0; j < width; j++)
      buttonshtml += `<button onclick="leftclick(${i}, ${j})" oncontextmenu="rightclick(${i}, ${j});return false;"></button>`;
  theDojo.buttons.innerHTML = buttonshtml;

  //save the references to the board buttons
  for (var i = 0; i < height; i++)
    for (var j = 0; j < width; j++)
      theDojo.squares[i][j].btn = document.querySelector(`#buttons > button:nth-child(${i * width + j + 1})`);

  theDojo.gameOver = false;
  updateCounters();
}

function updateLabel(element, labelID) {
  var span = document.querySelector("#" + labelID + " span");
  span.innerText = element.value;
}

function calculateNinjas(width, height, difficulty) {
  //convert difficulty range (1 to 4)
  //to ninja density range (8/100 to 20/100)
  var density = 4 * (difficulty + 1) / 100;
  return Math.round(width * height * density);
}

function newGame() {
  var width = parseInt(width_input.value);
  var height = parseInt(height_input.value);
  var difficulty = parseInt(difficulty_input.value);

  randomBoard(width, height, calculateNinjas(width, height, difficulty));
}

newGame();