kaboom({
  global: true,
  fullscreen: true,
  scale: 2,
  debug: true,
  clearColor: [0, 0, 0, 1],
});

// loadRoot("https://i.imgur.com/");

loadSprite("coin", "https://i.imgur.com/wbKxhcd.png");
loadSprite("evil-shroom", "https://i.imgur.com/KPO3fR9.png");
loadSprite("brick", "https://i.imgur.com/pogC9x5.png");
loadSprite("block", "https://i.imgur.com/M6rwarW.png");
loadSprite("mario", "https://i.imgur.com/Wb1qfhK.png");
loadSprite("mushroom", "https://i.imgur.com/0wMd92p.png");
loadSprite("surprise", "https://i.imgur.com/gesQ1KP.png");
loadSprite("unboxed", "https://i.imgur.com/bdrLpi6.png");
loadSprite("pipe-top-left", "https://i.imgur.com/ReTPiWY.png");
loadSprite("pipe-top-right", "https://i.imgur.com/hj2GK4n.png");
loadSprite("pipe-bottom-left", "https://i.imgur.com/c1cYSbt.png");
loadSprite("pipe-bottom-right", "https://i.imgur.com/nqQ79eI.png");

scene("game", () => {
  layers(["bg", "obj", "ui"], "obj");
  const map = [
    "                                  ",
    "                                  ",
    "                                  ",
    "                                  ",
    "                                  ",
    "                                  ",
    "  %      =*=%=                    ",
    "                             -+   ",
    "                   ^    ^    ()   ",
    "===========================  =====",
  ];

  const levelConfig = {
    width: 20,
    height: 20,
    "=": [sprite("block"), solid()],
    "@": [sprite("coin"), "coin"],
    "%": [sprite("surprise"), solid(), "coin-surprise"],
    "*": [sprite("surprise"), solid(), "mushroom-surprise"],
    "^": [sprite("evil-shroom"), solid()],
    "}": [sprite("unboxed"), solid()],
    "(": [sprite("pipe-bottom-left"), solid(), scale(0.5)],
    ")": [sprite("pipe-bottom-right"), solid(), scale(0.5)],
    "-": [sprite("pipe-top-left"), solid(), scale(0.5)],
    "+": [sprite("pipe-top-right"), solid(), scale(0.5)],
    "#": [sprite("mushroom"), solid(), "mushroom", body()],
  };

  const gameLevel = addLevel(map, levelConfig);

  const scoreLabel = add([
    text("test"),
    pos(30, 6),
    layer("ui"),
    {
      value: "s",
    },
  ]);

  add(["level " + "test", pos(4, 6)]);

  const MOVE_SPEED = 120;
  const JUMP_FORCE = 260;
  let BIGGER_JUMP_FORCE = 560;
  let CURRENT_JUMP_FORCE = JUMP_FORCE;

  function big() {
    let timer = 0;
    let isBig = false;
    return {
      update() {
        if (isBig) {
          CURRENT_JUMP_FORCE = BIGGER_JUMP_FORCE;
          timer -= dt();
          if (timer <= 0) {
            this.smallify();
          }
        }
      },
      isBig() {
        return isBig;
      },
      smallify() {
        this.scale = vec2(1);
        timer = 0;
        isBig = false;
      },
      biggify(time) {
        this.scale = vec2(2);
        timer = time;
        isBig = true;
      },
    };
  }

  const player = add([
    sprite("mario"),
    solid(),
    pos(30, 0),
    body(),
    big(),
    origin("bot"),
  ]);

  action("mushroom", (mushroom) => {
    mushroom.move(20, 0);
  });

  player.collides("mushroom", (mushroom) => {
    destroy(mushroom);
    player.biggify(6);
  });

  player.collides("coin", (c) => {
    destroy(c);
    scoreLabel.value++;
    scoreLabel.text = scoreLabel.value;
  });

  player.on("headbump", (obj) => {
    if (obj.is("coin-surprise")) {
      gameLevel.spawn("@", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn("}", obj.gridPos.sub(0, 0));
    }
    if (obj.is("mushroom-surprise")) {
      gameLevel.spawn("#", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn("}", obj.gridPos.sub(0, 0));
    }
  });

  keyDown("left", () => {
    player.move(-MOVE_SPEED, 0);
  });
  keyDown("right", () => {
    player.move(MOVE_SPEED, 0);
  });
  keyPress("up", () => {
    if (player.grounded()) {
      player.jump(CURRENT_JUMP_FORCE);
    }
  });
});

start("game");
