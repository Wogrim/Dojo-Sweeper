//theDojo is a 2D array of objects ("squares") which keep track of their status
var theDojo =
{
  width: 0,
  height: 0,
  ninjas: 0,
  squares: [],
  div: document.querySelector("#the-dojo")
};

var width_input = document.querySelector("#width");
var height_input = document.querySelector("#height");
var difficulty_input = document.querySelector("#difficulty");

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
        square.status=3; //prevent left click / right click code from running
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
        square.status=3; //prevent left click / right click code from running
        square.btn.classList.add('cheat');
        square.btn.classList.remove('marked');
        square.btn.classList.add('mistake');
        square.btn.classList.add('revealed');
        square.btn.innerText = square.nearby > 0 ? square.nearby : "";
      }
    }
  }
}

function leftclick(i, j) {
  var square = theDojo.squares[i][j];

  // do nothing if already revealed or marked
  if (square.status > 0)
    return;

  // lose condition
  if (square.ninja) {
    square.btn.classList.add('mistake');
    cheatReveal();
    return;
  }

  square.status = 1;
  square.btn.classList.add("revealed");
  if (square.nearby > 0)
    square.btn.innerText = square.nearby;
  //add "revealed" class to button for different color

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
}

function rightclick(i, j) {
  var square = theDojo.squares[i][j];
  // mark or unmark the square via class for special CSS styling
  // (do nothing if already revealed)
  if (square.status === 0) {
    square.status = 2;
    square.btn.innerText = "*";
    square.btn.classList.add("marked");
  }
  else if (square.status === 2) {
    square.status = 0;
    square.btn.classList.remove("marked");
    square.btn.innerText = "";
  }
}

function randomBoard(width, height, ninjas) {
  theDojo.width = width;
  theDojo.height = height;
  theDojo.ninjas = ninjas;
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
  theDojo.div.innerHTML = buttonshtml;

  //save the references to the board buttons
  for (var i = 0; i < height; i++)
    for (var j = 0; j < width; j++)
      theDojo.squares[i][j].btn = document.querySelector(`#the-dojo > button:nth-child(${i * width + j + 1})`);

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