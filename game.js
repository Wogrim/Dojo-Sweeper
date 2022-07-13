//theDojo is a 2D array of objects ("squares") which keep track of their status
var theDojo = [];
var dojoDiv = document.querySelector("#the-dojo");

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
    //status is default 0
    //1 revealed
    //2 marked
  }
}

function leftclick(i, j) {
  var square = theDojo[i][j];

  // if the square is marked or already revealed, don't do anything
  if (square.status > 0)
    return;

  // lose condition
  if (square.ninja) {
    alert("game over");
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
    var imax = Math.min(theDojo.length - 1, i + 1);
    var jmin = Math.max(0, j - 1);
    var jmax = Math.min(theDojo[i].length - 1, j + 1);

    for (var i2 = imin; i2 <= imax; i2++)
      for (var j2 = jmin; j2 <= jmax; j2++)
        if (theDojo[i2][j2].status === 0)
          leftclick(i2, j2);
  }
}

function rightclick(i, j) {
  var square = theDojo[i][j];
  //don't let the user mark buttons that are already revealed
  if (square.status === 1)
    return;

  // mark or unmark the square via class for special CSS styling
  if (square.status === 2) {
    square.status = 0;
    square.btn.classList.remove("marked");
    square.btn.innerText = "";
  }
  else {
    square.status = 2;
    square.btn.innerText = "*";
    square.btn.classList.add("marked");
  }
}

function randomBoard(width, height, ninjas) {
  // console.log(`making board with ${width} width, ${height} height, ${ninjas} ninjas`);
  // create the empty board
  theDojo = [];
  for (var i = 0; i < height; i++) {
    theDojo.push([])
    for (var j = 0; j < width; j++)
      theDojo[i].push(makeSquare(i, j));
  }

  // set {ninjas} random spots on the board to 1
  // infinite loop if ninjas > # squares on the board
  var count = 0;
  while (count < ninjas) {
    // get location of a random spot on the board
    var i = Math.floor(Math.random() * theDojo.length);
    var j = Math.floor(Math.random() * theDojo[i].length);
    // if the spot is empty, fill it, otherwise try again
    if (!theDojo[i][j].ninja) {
      theDojo[i][j].ninja = true;
      count++;
    }
  }

  // count nearby ninjas for each square and save it
  for (var i = 0; i < height; i++)
    for (var j = 0; j < width; j++) {
      var imin = Math.max(0, i - 1);
      var imax = Math.min(theDojo.length - 1, i + 1);
      var jmin = Math.max(0, j - 1);
      var jmax = Math.min(theDojo[i].length - 1, j + 1);
      for (var i2 = imin; i2 <= imax; i2++)
        for (var j2 = jmin; j2 <= jmax; j2++)
          if (theDojo[i2][j2].ninja)
            theDojo[i][j].nearby++;
    }

  // set width of the board so the buttons wrap properly (buttons are 32px)
  dojoDiv.style.width = width * 32 + "px";

  //create the board buttons
  buttonshtml = "";
  for (var i = 0; i < height; i++)
    for (var j = 0; j < width; j++)
      buttonshtml += `<button onclick="leftclick(${i}, ${j})" oncontextmenu="rightclick(${i}, ${j});return false;"></button>`;
  dojoDiv.innerHTML = buttonshtml;

  //save the references to the board buttons
  for (var i = 0; i < height; i++)
    for (var j = 0; j < width; j++)
      theDojo[i][j].btn = document.querySelector(`#the-dojo > button:nth-child(${i * height + j + 1})`);

}

function updateLabel(element, labelID) {
  var span = document.querySelector("#" + labelID + " span");
  span.innerText = element.value;
}

function calculateNinjas(width, height, difficulty) {
  //convert difficulty range (1 to 8)
  //to ninja density range (1/12 to 1/5)
  var density = 1 / (13 - difficulty);
  return Math.round(width * height * density);
}

function newGame() {
  var width = parseInt(width_input.value);
  var height = parseInt(height_input.value);
  var difficulty = parseInt(difficulty_input.value);

  randomBoard(width, height, calculateNinjas(width, height, difficulty));
}

newGame();