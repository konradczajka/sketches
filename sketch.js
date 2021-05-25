
const WIDTH = 800;
const HEIGHT = 800;
const RESOLUTION = Math.floor(WIDTH * 0.005) 
const NUM_COLUMNS = WIDTH / RESOLUTION
const NUM_ROWS = HEIGHT / RESOLUTION

const STEP_LENGTH = 1

function setup() {
   createCanvas(WIDTH, HEIGHT);
//   frameRate(60);
   noLoop()
   smooth();
   strokeJoin(ROUND);
}

function draw() {
   const grid = createGrid();
   // drawFieldVectors(grid);
   strokeWeight(1);
   for (var i=0; i< 3000; i++) {
      // let c = noise(i, i)*255+30;
      let x = getRandomInt(0, WIDTH);
      let y = getRandomInt(0, WIDTH);
      let c = (100*Math.sin(y) + y) % 200 + 50
      stroke(c, c, 0);
      drawCurve(grid, x, y, c)
   }
   // save('_results_flow-' + Math.floor(Date.now() / 1000) + '.jpg');
}

function createGrid() {
   const grid = []
   for (var column=0; column<NUM_COLUMNS; column++) {
      grid[column] = []
      for (var row=0; row<NUM_ROWS; row++) {
         // const angle = (column / NUM_COLUMNS) * PI
         const angle = noise(column / 50, row / RESOLUTION / 50) * 2 * PI
         grid[column][row] = angle;
       }
   }
   return grid;
}

function drawCurve(grid, startX, startY, length) {
   noFill();
   beginShape();
   vertex(startX, startY);
   let x = startX;
   let y = startY;
   for (var i=0; i<length; i++) {
      const columnIndex = Math.floor(x / RESOLUTION);
      const rowIndex = Math.floor(y / RESOLUTION);
      // NOTE: normally you want to check the bounds here
      if (columnIndex >= grid.length || rowIndex >= grid[0].length || columnIndex < 0 || rowIndex < 0) {
         endShape();
         return;
      }
      const angle = grid[columnIndex][rowIndex];
      const xStep = STEP_LENGTH * Math.sin(angle);
      const yStep = STEP_LENGTH * Math.cos(angle);
      x += xStep;
      y += yStep;
      vertex(x, y);
   }
   endShape();
}

function drawFieldVectors(grid) {
   for (var column=0; column<NUM_COLUMNS; column++) {
      for (var row=0; row<NUM_ROWS; row++) {
         var x = column * RESOLUTION;
         var y = row * RESOLUTION;
         circle(x, y, 2);
         line(x, y, x + 7*Math.sin(grid[column][row]), y+ 7*Math.cos(grid[column][row]), 20);
      }
   }
}

function getRandomInt(min, max) {
   min = Math.ceil(min);
   max = Math.floor(max);
   return Math.floor(Math.random() * (max - min)) + min;
 }