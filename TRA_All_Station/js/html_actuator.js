function HTMLActuator() {
  this.tileContainer    = document.querySelector(".tile-container");
  this.scoreContainer   = document.querySelector(".score-container");
  this.bestContainer    = document.querySelector(".best-container");
  this.messageContainer = document.querySelector(".game-message");

  this.score = 0;
}

HTMLActuator.prototype.actuate = function (grid, metadata) {
  var self = this;

  window.requestAnimationFrame(function () {
    self.clearContainer(self.tileContainer);

    grid.cells.forEach(function (column) {
      column.forEach(function (cell) {
        if (cell) {
          self.addTile(cell);
        }
      });
    });

    self.updateScore(metadata.score);
    self.updateBestScore(metadata.bestScore);

    if (metadata.terminated) {
      if (metadata.over) {
        self.message(false); // You lose
      } else if (metadata.won) {
        self.message(true); // You win!
      }
    }

  });
};

// Continues the game (both restart and keep playing)
HTMLActuator.prototype.continueGame = function () {
  this.clearMessage();
};

HTMLActuator.prototype.clearContainer = function (container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

HTMLActuator.prototype.addTile = function (tile) {
  var self = this;

  var wrapper   = document.createElement("div");
  var inner     = document.createElement("div");
  var position  = tile.previousPosition || { x: tile.x, y: tile.y };
  var positionClass = this.positionClass(position);

  // We can't use classlist because it somehow glitches when replacing classes
  const transfer = [1, 17, 37, 59, 76, 123, 144, 156, 183, 196]
  var classes = ["tile", "tile-" + ((transfer.indexOf(tile.value) > -1) ? "transfer" : Math.floor(tile.value/5)), positionClass];
  const mapping = [
    "緃貫線北",  "基隆",  "三坑",  "八堵",  "七堵",  "百福",  "五堵",  "汐止",  "汐科",  "南港",  "松山",
    "台北",  "萬華",  "板橋",  "浮洲",  "樹林",  "南樹林",  "山佳",  "鶯歌",  "桃園",  "內壢",  "中壢",
    "埔心",  "楊梅",  "富岡",  "新富",  "北湖",  "湖口",  "新豐",  "竹北",  "北新竹",  "新竹",  "三姓橋",
    "香山",  "崎頂",  "竹南",  "山線",  "造橋",  "豐富",  "苗栗",  "南勢",  "銅鑼",  "三義",  "泰安",
    "后里",  "豐原",  "栗林",  "潭子",  "頭家厝",  "松竹",  "太原",  "精武",  "台中",  "五權",  "大慶",
    "烏日",  "新烏日",  "成功",  "海線",  "談文",  "大山",  "後龍",  "龍港",  "白沙屯",  "新埔",  "通霄",
    "苑裡",  "日南",  "大甲",  "台中港",  "清水",  "沙鹿",  "龍井",  "大肚",  "追分",  "緃貫線南",  "彰化",
    "花壇",  "大村",  "員林",  "永靖",  "社頭",  "田中",  "二水",  "林內",  "石榴",  "斗六",  "斗南",
    "石龜",  "大林",  "民雄",  "嘉北",  "嘉義",  "水上",  "南靖",  "後壁",  "新營",  "柳營",  "林鳳營",
    "隆田",  "拔林",  "善化",  "南科",  "新市",  "永康",  "大橋",  "台南",  "保安",  "仁德",  "中洲",
    "大湖",  "路竹",  "岡山",  "橋頭",  "楠梓",  "新左營",  "左營",  "內惟",  "美術館",  "鼓山",  "三塊厝",
    "高雄",  "屏東線",  "民族",  "科工館",  "正義",  "鳳山",  "後庄",  "九曲堂",  "六塊厝",  "屏東",  "歸來",
    "麟洛",  "西勢",  "竹田",  "潮州",  "崁頂",  "南州",  "鎮安",  "林邊",  "佳冬",  "東海",  "枋寮",  
    "南迴線",  "加祿",  "內獅",  "枋山",  "枋野",  "古莊號",  "大武",  "瀧溪",  "金崙",  "太麻里",  "知本",  
    "康樂",  "台東線",  "台東",  "山里",  "鹿野",  "瑞源",  "瑞和",  "關山",  "海端",  "池上",  "富里",
    "東竹",  "東里",  "玉里",  "三民",  "瑞穗",  "富源",  "大富",  "光復",  "萬榮",  "鳳林",  "南平",
    "林榮新光",  "豐田",  "壽豐",  "平和",  "志學",  "吉安",  "北迴線",  "花蓮",  "北埔",  "景美",  "新城",
    "崇德",  "和仁",  "和平",  "漢本",  "武塔",  "南澳",  "東澳",  "永樂",  "宜蘭線",  "蘇澳",  "蘇澳新",
    "新馬",  "冬山",  "羅東",  "中里",  "二結",  "宜蘭",  "四城",  "礁溪",  "頂埔",  "頭城",  "外澳",  
    "龜山",  "大溪",  "大里",  "石城",  "福隆",  "貢寮",  "雙溪",  "牡丹",  "三貂嶺",  "侯硐",  "瑞芳",
    "四腳亭",  "暖暖"
  ]

  if (tile.value > 222) classes.push("tile-super");
  else classes.push("tile-word" + mapping[tile.value-1].length);

  this.applyClasses(wrapper, classes);

  inner.classList.add("tile-inner");
  if (tile.value <= 222)
    inner.textContent = mapping[tile.value-1];
  else
    inner.textContent = "神人" + (tile.value - 222) + "站";

  if (tile.previousPosition) {
    // Make sure that the tile gets rendered in the previous position first
    window.requestAnimationFrame(function () {
      classes[2] = self.positionClass({ x: tile.x, y: tile.y });
      self.applyClasses(wrapper, classes); // Update the position
    });
  } else if (tile.mergedFrom) {
    classes.push("tile-merged");
    this.applyClasses(wrapper, classes);

    // Render the tiles that merged
    tile.mergedFrom.forEach(function (merged) {
      self.addTile(merged);
    });
  } else {
    classes.push("tile-new");
    this.applyClasses(wrapper, classes);
  }

  // Add the inner part of the tile to the wrapper
  wrapper.appendChild(inner);

  // Put the tile on the board
  this.tileContainer.appendChild(wrapper);
};

HTMLActuator.prototype.applyClasses = function (element, classes) {
  element.setAttribute("class", classes.join(" "));
};

HTMLActuator.prototype.normalizePosition = function (position) {
  return { x: position.x + 1, y: position.y + 1 };
};

HTMLActuator.prototype.positionClass = function (position) {
  position = this.normalizePosition(position);
  return "tile-position-" + position.x + "-" + position.y;
};

HTMLActuator.prototype.updateScore = function (score) {
  this.clearContainer(this.scoreContainer);

  var difference = score - this.score;
  this.score = score;

  this.scoreContainer.textContent = this.score;

  if (difference > 0) {
    var addition = document.createElement("div");
    addition.classList.add("score-addition");
    addition.textContent = "+" + difference;

    this.scoreContainer.appendChild(addition);
  }
};

HTMLActuator.prototype.updateBestScore = function (bestScore) {
  this.bestContainer.textContent = bestScore;
};

HTMLActuator.prototype.message = function (won) {
  var type    = won ? "game-won" : "game-over";
  var message = won ? "恭喜抵達山海交會站！" : "請重新挑戰！";

  this.messageContainer.classList.add(type);
  this.messageContainer.getElementsByTagName("p")[0].textContent = message;
};

HTMLActuator.prototype.clearMessage = function () {
  // IE only takes one value to remove at a time.
  this.messageContainer.classList.remove("game-won");
  this.messageContainer.classList.remove("game-over");
};
