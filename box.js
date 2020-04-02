function Box(x, y, w, h, s, words, pic) {
  var options = {
    friction: 0,
    restitution: 0.8
    //slop: 0
  }
  this.body = Bodies.rectangle(x, y, w, h)
  this.w = w
  this.h = h
  this.s = s
  this.words = words
  this.query1 = pic
  //let query2
  this.resolution = int(s) + 'x' + int(s)
  this.randomPhoto = loadImage(
    'https://source.unsplash.com/' + this.resolution + '/?' + this.query1
  ) // + "," + query2

  World.add(world, this.body)

  this.isOffScreen = function() {
    var pos = this.body.position
    return pos.y > height + 100
  }

  this.removeFromWorld = function() {
    World.remove(world, this.body)
  }

  this.show = function() {
    if (words != 0) {
      var pos = this.body.position
      var angle = this.body.angle
      push()
      translate(pos.x, pos.y)
      rotate(angle)
      rectMode(CENTER)
      strokeWeight(2)
      noStroke()
      fill(map(pos.x, 0, height, 0, 255), 95, 95)
      rect(0, 0, this.w, this.h)
      textSize(s / 2)
      textAlign(CENTER, CENTER)
      fill(250, 250, map(pos.x, 0, height, 200, 225))
      text(this.words, 0, 0)
      pop()
    } else if (words == 0) {
      //console.log(s)
      var pos = this.body.position
      var angle = this.body.angle
      push()
      translate(pos.x, pos.y)
      rotate(angle)
      imageMode(CENTER)
      image(this.randomPhoto, 0, 0)
      pop()
    }
  }
}
