var Engine = Matter.Engine,
  // Render = Matter.Render,
  World = Matter.World,
  Bodies = Matter.Bodies;

var engine;
var world;

var ground;

let data = [{
  "username": "David",
  "food": "croissant",
  "timestamp": 1585834985032,
  "_id": "I5yEZLIxFpBOkNN2"
}];

let balls = []
let letters = []
let word = [{ words: {}, oneWords: {} }];
let receivedWords = false


function setup() {
  createCanvas(480, 480);
  loadData();
  print(data);
  parseResult();
  engine = Engine.create();
  world = engine.world;
  var options = {
    isStatic: true
  }
  ground = Bodies.rectangle(200, height, width, 100, options);
  World.add(world, ground);
}

function loadData() {
  text1();
  fetch('/BFdata')
    .then((response) => {
      return response.json();
    })
    .then((incoming) => {
      console.log("*****");
      console.log(incoming);
      data = incoming.data;
    });
  setTimeout(loadData, 500);
}

function parseResult() {
  for (let i = 0; i < data.length; i++) {
    if (data[i].food) {
      word[i].words = data[i].food.split('')
      word[i].oneWords = data[i].food.split(' ').pop()
      console.log(data[i].food)
      receivedWords = true
      for (j = 0; j < word[i].words.length; j++) {
        console.log(word[i].words[j])
      }
    }
  }
}

function text1() {
  console.log("working")
  if (receivedWords == true) {
    for (let i = 0; i < word.length; i++) {
      for (j = 0; j < word[i].words.length; j++) {
        letters.push(
          new Box(
            width / 2,
            height / 6,
            25,
            25,
            25,
            word[i].words[j],
            word[i].oneWords
          )
        )
      }
      letters.push(
        new Box(
          random(40, 600),
          random(1, 200),
          80,
          80,
          80,
          0,
          word[i].oneWords
        )
      )
    }
    receivedWords = false
  } else {
    receivedWords = false
  }
}

function draw() {
  background(252, 240, 200);
  Engine.update(engine);
  for (k = 0; k < letters.length; k++) {
    letters[k].show()
  }
  noStroke(255);
  fill(170);
  rectMode(CENTER);
  rect(ground.position.x, ground.position.y, width, 100);
}