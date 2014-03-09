function HTMLActuator() {
  this.tileContainer  = document.getElementsByClassName("tile-container")[0];
  this.gameContainer  = document.getElementsByClassName("game-container")[0];
  this.scoreContainer = document.getElementsByClassName("score-container")[0];
}

HTMLActuator.prototype.actuate = function (grid, metadata) {
  var self = this;

  window.requestAnimationFrame(function () {
    self.clearContainer();

    grid.cells.forEach(function (column) {
      column.forEach(function (cell) {
        if (cell) {
          self.addTile(cell);
        }
      });
    });

    self.updateScore(metadata.score);

    if (metadata.over) {
      self.gameOver();
    }
  });
};

HTMLActuator.prototype.clearContainer = function () {
  while (this.tileContainer.firstChild) {
    this.tileContainer.removeChild(this.tileContainer.firstChild);
  }
};

HTMLActuator.prototype.addTile = function (tile) {
  var self = this;

  var element   = document.createElement("div");
  var position  = tile.previousPosition || { x: tile.x, y: tile.y };
  positionClass = this.positionClass(position);

  element.classList.add("tile", "tile-" + tile.value, positionClass);
  element.textContent = tile.value;

  this.tileContainer.appendChild(element);

  if (tile.previousPosition) {
    window.requestAnimationFrame(function () {
      element.classList.remove(element.classList[2]);
      element.classList.add(self.positionClass({ x: tile.x, y: tile.y }));
    });
  } else if (tile.mergedFrom) {
    element.classList.add("tile-merged");
    tile.mergedFrom.forEach(function (merged) {
      self.addTile(merged);
    });
  } else {
    element.classList.add("tile-new");
  }
};

HTMLActuator.prototype.normalizePosition = function (position) {
  return { x: position.x + 1, y: position.y + 1 };
};

HTMLActuator.prototype.positionClass = function (position) {
  position = this.normalizePosition(position);
  return "tile-position-" + position.x + "-" + position.y;
};

HTMLActuator.prototype.updateScore = function (score) {
  this.scoreContainer.textContent = score;
};

HTMLActuator.prototype.gameOver = function () {
  this.gameContainer.classList.add("game-over");
};
