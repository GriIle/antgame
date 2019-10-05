export function loadImage(path){
  let image = new Image();
  image.onload = function () {}
  image.src = path;
  return image;
}
export function loadJSON(){
  let request = new XMLHttpRequest();
  request.open("GET", "./data/templates.json", false);
  request.send(null)
  data.template = JSON.parse(request.responseText);
}
export function loadGameData(){
  let data = {};
  let request = new XMLHttpRequest();
  request.open("GET", "./data/templates.json", false);
  request.send(null)
  data.template = JSON.parse(request.responseText);
  request.open("GET", "./data/groundTexture.json", false);
  request.send(null)
  data.ground = JSON.parse(request.responseText);
  request.open("GET", "./data/staticObjects.json", false);
  request.send(null)
  data.staticObject = JSON.parse(request.responseText);
  request.open("GET", "./data/movableObjects.json", false);
  request.send(null)
  data.movableObject = JSON.parse(request.responseText);
  request.open("GET", "./data/icons.json", false);
  request.send(null)
  data.icons = JSON.parse(request.responseText);

  // request.open("GET", "./data/gameObjects.json", false);
  // request.send(null)
  // let data = JSON.parse(request.responseText);


  // let groundTexture = document.createElement("canvas");
  // let context  = groundTexture.getContext("2d");

  groundTextures = gl2D.textureFromFile(data.template.ground.path);
  underGroundTextures = gl2D.textureFromFile(data.template.ground.upath);
  underGroundWallTextures = gl2D.textureFromFile(data.template.ground.uwpath);

  for (let i = 0;i<data.icons.length;i++){
    iconGraphic[i] = gl2D.textureFromFile(data.icons[i] + ".png");
  }

  for (let i = 0;i<data.ground.length;i++){
    groundObject[i] = {};

    if (data.ground[i].name === void 0) groundObject[i].name = data.template.ground.name;
    else groundObject[i].name = data.ground[i].name;

    if (data.ground[i].passable === void 0) groundObject[i].passable = data.template.ground.passable;
    else groundObject[i].passable = data.ground[i].passable;

    if (data.ground[i].offsetX === void 0) groundObject[i].offsetX = data.template.ground.offsetX*64;
    else groundObject[i].offsetX = data.ground[i].offsetX*64;

    if (data.ground[i].offsetY === void 0) groundObject[i].offsetY = data.template.ground.offsetY*64;
    else groundObject[i].offsetY = data.ground[i].offsetY*64;
    
      // context.imageSmoothingEnabled = false;//Chrome
      // context.mozImageSmoothingEnabled = false;//Firefox
      // canvas.width = img.width;
      // canvas.height = img.height;
      // context .drawImage(img, 0, 0, img.width, img.height);

  }

  for (let i = 0;i<data.staticObject.length;i++){
    staticObject[i] = {};

    if (data.staticObject[i].name === void 0) staticObject[i].name = data.template.staticObject.name;
    else staticObject[i].name = data.staticObject[i].name;

    if (data.staticObject[i].path === void 0) staticObject[i].path = data.template.staticObject.path;
    else staticObject[i].path = data.staticObject[i].path;

    if (data.staticObject[i].passable === void 0) staticObject[i].passable = data.template.staticObject.passable;
    else staticObject[i].passable = data.staticObject[i].passable;

    if (data.staticObject[i].size === void 0) staticObject[i].size = data.template.staticObject.size;
    else staticObject[i].size = data.staticObject[i].size;

    if (data.staticObject[i].versions === void 0) staticObject[i].versions = data.template.staticObject.versions;
    else staticObject[i].versions = data.staticObject[i].versions;

    if (data.staticObject[i].addGraphicWidth === void 0) staticObject[i].addGraphicWidth = data.template.staticObject.addGraphicWidth;
    else staticObject[i].addGraphicWidth = data.staticObject[i].addGraphicWidth;

    staticObject[i].texture = [];
    staticObject[i].overDraw = [];
    staticObject[i].animationPhases = [];
    for (let iv = 0;iv<staticObject[i].versions;iv++){
      let image = new Image();
      image.onload = function () {
        staticObject[i].texture[iv] = gl2D.textureFromImage(image);
        staticObject[i].overDraw[iv] = staticObject[i].texture[iv].height - 32*staticObject[i].size;
        staticObject[i].animationPhases[iv] = image.width / (staticObject[i].addGraphicWidth*2 + (64*staticObject[i].size));
      }
      image.src = staticObject[i].path + "_" + iv + ".png";
    }
  }

  for (let i = 0;i<data.movableObject.length;i++){
    movableObject[i] = {};

    if (data.movableObject[i].name === void 0) movableObject[i].name = data.template.movableObject.name;
    else movableObject[i].name = data.movableObject[i].name;

    if (data.movableObject[i].path === void 0) movableObject[i].path = data.template.movableObject.path;
    else movableObject[i].path = data.movableObject[i].path;

    if (data.movableObject[i].hitPoints === void 0) movableObject[i].hitPoints = data.template.movableObject.hitPoints;
    else movableObject[i].hitPoints = data.movableObject[i].hitPoints;

    if (data.movableObject[i].speed === void 0) movableObject[i].speed = data.template.movableObject.speed;
    else movableObject[i].speed = data.movableObject[i].speed;

    if (data.movableObject[i].viewRange === void 0) movableObject[i].viewRange = data.template.movableObject.viewRange;
    else movableObject[i].viewRange = data.movableObject[i].viewRange;

    // if (data.movableObject[i].size === void 0) movableObject[i].size = data.template.movableObject.size;
    // else movableObject[i].size = data.movableObject[i].size;

    if (data.movableObject[i].versions === void 0) movableObject[i].versions = data.template.movableObject.versions;
    else movableObject[i].versions = data.movableObject[i].versions;

    movableObject[i].texture = [];
    movableObject[i].animationPhases = [];
    for (let iv = 0;iv<movableObject[i].versions;iv++){
      let image = new Image();
      image.onload = function () {
        movableObject[i].texture[iv] = gl2D.textureFromImage(image);
        movableObject[i].animationPhases[iv] = 0;//image.width / (64*movableObject[i+1].size)-1
        movableObject[i].graphicSize = image.height/3;
      }
      image.src = movableObject[i].path + "_" + iv + ".png";
    }
  }

  nullTexture = gl2D.textureFromPixelArray(new Uint8Array([255,255,255]),1,1);
  guiTexture[0] = gl2D.textureFromFile("./data/png/gui/selectField.png");
  effects[0] = gl2D.textureFromFile("./data/png/effects/fog.png");
}