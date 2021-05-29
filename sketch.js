
const WIDTH = 700;
const HEIGHT = 700;
[667-567,
   567-447,
   447-273,273]
const PALETTE = [[273, '#364f6b'], [447, '#3fc1c9'], [567, '#f5f5f5'], [667, '#fc5185']]

function setup() {
   createCanvas(WIDTH, HEIGHT);
   //   frameRate(60);
   noLoop()
   smooth();
   strokeJoin(ROUND);
}

function draw() {
   const grid = createGrid();
   drawGrid(grid);
   // drawFrame();
     save('_results_split-' + Math.floor(Date.now() / 1000) + '.jpg');
}

function createGrid() {
   const boxes = splitBox(Box(V(10, 10), V(WIDTH - 10, 10), V(WIDTH - 10, HEIGHT - 10), V(10, HEIGHT - 10)))
   let grid = boxes;
   return grid;
}

function splitBox(box, lvl = 1) {
   if (box.size() < 100 || Math.random() > 3 / lvl) {
      return [box];
   }
   let b1, b2;
   const d = + Math.random() * (500 / (lvl * 3));
   if (lineLen(box.nodes[0], box.nodes[1]) > lineLen(box.nodes[1], box.nodes[2])) {
      const d1 = V((box.nodes[0].x + box.nodes[1].x) / 2 + d, (box.nodes[0].y + box.nodes[1].y) / 2);
      const d2 = V((box.nodes[2].x + box.nodes[3].x) / 2 + d, (box.nodes[2].y + box.nodes[3].y) / 2);
      b1 = Box(box.nodes[0], d1, d2, box.nodes[3]);
      b2 = Box(d1, box.nodes[1], box.nodes[2], d2);
   } else {
      const d1 = V((box.nodes[1].x + box.nodes[2].x) / 2, (box.nodes[1].y + box.nodes[2].y) / 2 + d);
      const d2 = V((box.nodes[3].x + box.nodes[0].x) / 2, (box.nodes[3].y + box.nodes[0].y) / 2 + d);
      b1 = Box(box.nodes[0], box.nodes[1], d1, d2);
      b2 = Box(d2, d1, box.nodes[2], box.nodes[3]);
   }
   if (b1.shortestEdge() < 20 || b2.shortestEdge() < 20) {
      return [box];
   }
   return [splitBox(b1, lvl + 1), splitBox(b2, lvl + 1)].flat()
}

function drawGrid(grid) {
   fill(0)
   rect(0, 0, WIDTH, HEIGHT)
   grid.forEach((box) => drawBox(box))
}

function drawFrame() {
   fill(255)

   beginShape();

   vertex(0, 0);
   vertex(WIDTH, 0);
   vertex(WIDTH, HEIGHT);
   vertex(0, HEIGHT);

   beginContour();
   
  const r = WIDTH * 0.25;
   vertex(WIDTH/2, -r)
   quadraticVertex(r, -r, r, WIDTH/2);
   quadraticVertex(r, r, WIDTH/2, r);
   quadraticVertex(-r, r, -r, WIDTH/2);
   quadraticVertex(-r, -r, WIDTH/2, -r); 
   endContour();

   endShape(CLOSE);
}

function drawBox(box) {
   fill(255)
   const margin = 2;
   noStroke();
   fill(selectColor());
   quad(
      box.nodes[0].x + margin, box.nodes[0].y + margin,
      box.nodes[1].x - margin, box.nodes[1].y + margin,
      box.nodes[2].x - margin, box.nodes[2].y - margin,
      box.nodes[3].x + margin, box.nodes[3].y - margin)
   }

function lineLen(v1, v2) {
   return Math.sqrt((v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2);
}

const V = (x, y) => ({ x: x, y: y });
const Box = (v1, v2, v3, v4) => ({
   nodes: [v1, v2, v3, v4],
   size: function () {
      return lineLen(v1, v2) + lineLen(v2, v3) + lineLen(v3, v4) + lineLen(v4, v1)
   },
   shortestEdge: function () {
      return Math.min(lineLen(v1, v2), lineLen(v2, v3), lineLen(v3, v4), lineLen(v4, v1))
   }
});

function selectColor() {
   const v = getRandomInt(0, PALETTE[PALETTE.length - 1][0]);
   
   for (let i=0; i<PALETTE.length; i++) {
      if (PALETTE[i][0] >= v) {
         return PALETTE[i][1];
      }
   }
}

function getRandomInt(min, max) {
   min = Math.ceil(min);
   max = Math.floor(max);
   return Math.floor(Math.random() * (max - min)) + min;
 }