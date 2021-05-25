const WIDTH = 800;
const HEIGHT = 800;
const CENTER_X = WIDTH / 2;
const CENTER_Y = HEIGHT / 2;

function setup() {
  createCanvas(WIDTH, HEIGHT);
  smooth();
  strokeJoin(ROUND);
}

function draw() {
  var box = Box();
  var box1 = Box();
  var box2 = Box();
  // create the projection matrix
  var iso = Mat();
  // angles for X, and Y axis
  const xAxis = Math.PI * ( 1 / 4);
  const yAxis = Math.PI * ( 4 / 6);
  iso.x.set(Math.cos(xAxis), Math.sin(xAxis),0);
  iso.y.set(Math.cos(yAxis), Math.sin(yAxis), 0);
  // the direction of Z
  iso.z.set(0, -1, 0);


  const n = Net(10, [
     Hole(10, 10, 50, 50),
     Hole(70, 70, 400, 400)
  ])

  drawNet(n)

//   // center rendering
      
//   applyMatrix(1,0,0,1,CENTER_X/2,CENTER_Y);

//   // transform and render
//   drawObj(iso.transform(box, box1));

//   iso.projectIso(Math.PI * ( 1 / 6), Math.PI * ( 5 / 6), -Math.PI * ( 1 / 2))
//   applyMatrix(1,0,0,1,CENTER_X/2,CENTER_Y/2);
//   drawObj(iso.transform(box, box1));

//   // iso.transform(box,box1);
//   // iso.rotZ(0.24);
//   // iso.rotY(1);
//   // iso = Mat()
//   iso.rotX(6.1);
//   iso.transform(box,box1);
//   iso.rotY(6.8);
//   iso.transform(box1,box2);
//   applyMatrix(1,0,0,1,CENTER_X/2,CENTER_Y/4);
//   drawObj(box2);
}

const V = (x,y,z) => ({x,y,z,set(x,y,z){this.x = x;this.y = y; this.z = z}});
const Mat = () => ( {
   x : V(1,0,0),
   y : V(0,1,0),
   z : V(0,0,1),
   o : V(0,0,0), // origin
   ident(){
      const m = this;
      m.x.set(1,0,0);
      m.y.set(0,1,0);
      m.z.set(0,0,1);
      m.o.set(0,0,0);
      return m;
   },
   rotX(r) {
      const m = this.ident();      
      m.y.set(0, Math.cos(r), Math.sin(r));
      m.z.set(0, -Math.sin(r), Math.cos(r));
      return m;      
   },
   rotY(r) {
      const m = this.ident();      
      m.x.set(Math.cos(r), 0, Math.sin(r));
      m.z.set(-Math.sin(r), 0, Math.cos(r));
      return m;      
   },      
   rotZ(r) {
      const m = this.ident();      
      m.x.set(Math.cos(r), Math.sin(r), 0);
      m.y.set(-Math.sin(r), Math.cos(r), 0);
      return m;      
   },    
   projectIso(xAxis, yAxis, zAxis, xScale = 1, yScale = 1, zScale = 1) {
      const m = this.ident();      
      m.x.set(Math.cos(xAxis) * xScale, Math.sin(xAxis) * xScale, 0);
      m.y.set(Math.cos(yAxis) * yScale, Math.sin(yAxis) * yScale, 0);
      m.z.set(Math.cos(zAxis) * zScale, Math.sin(zAxis) * zScale, 0);
      return m;
   },
   transform(obj, result){
      const m = this;
      const na = obj.nodes;
      const nb = result.nodes;
      var i = 0;
      while(i < na.length){
         const a = na[i];
         const b = nb[i++];
         b.x = a.x * m.x.x + a.y * m.y.x + a.z * m.z.x + m.o.x;
         b.y = a.x * m.x.y + a.y * m.y.y + a.z * m.z.y + m.o.y;
         b.z = a.x * m.x.z + a.y * m.y.z + a.z * m.z.z + m.o.z;
      }
      return result;
   }
});

const Box = (size = 35) =>( {
  nodes: [
    V(-size, -size, -size),
    V(-size, -size, size),
    V(-size, size, -size),
    V(-size, size, size),
    V(size, -size, -size),
    V(size, -size, size),
    V(size, size, -size),
    V(size, size, size),
  ],
  edges: [[0, 1],[1, 3],[3, 2],[2, 0],[4, 5],[5, 7],[7, 6],[6, 4],[0, 4],[1, 5],[2, 6],[3, 7]],
});

const Hole = (x1, y1, x2, y2) => ( {
   nodes: [V(x1, y1, 0), V(x2, y1, 0), V(x2, y2, 0), V(x1, y2, 0)]
});

const Net = (d, holes) =>( {
   nodes: (() => {
     let nodes = [];
     for (let i=0; i<holes.length; i++) {
        for (let j=0; j<holes[i].nodes.length; j++) {
           nodes.push(V(holes[i].nodes[j].x, holes[i].nodes[j].y, d))
        }
     }
     return nodes;
   })(),
   holes: holes
});

function drawNet(net) {
   stroke(150, 150, 150);
   fill(230, 230, 230)
  beginShape();

  vertex(-WIDTH-50, -HEIGHT-50)
  vertex(WIDTH+50, -HEIGHT-50)
  vertex(WIDTH+50, HEIGHT+50)
  vertex(-WIDTH-50, HEIGHT+50)

  for (var i=0; i<net.holes.length; i++) {
     const n = net.holes[i].nodes
   beginContour();
   for (var j=3; j>=0; j--) {
      vertex(n[j].x, n[j].y)
   }
   endContour();
  }

  endShape(CLOSE);
}

function drawObj(obj) {
  const edges =  obj.edges;
  const nodes =  obj.nodes;

  fill("red")
  stroke("blue")
  
  var i = 0;
  while(i < edges.length){
    var edge = edges[i++];
    line(nodes[edge[0]].x, nodes[edge[0]].y, nodes[edge[1]].x, nodes[edge[1]].y);
  }
}