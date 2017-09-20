"use strict";

let groundColor = new Uint8Array([255,255,255,255, 255,255,255,255, 255,255,255,255, 255,255,255,255]);
let groundSrc = new Uint8Array([0,0, 64,0, 64,64, 0,64]);

function drawGround(texture, typ, worldPos, pos){
  let offsetX = groundObject[typ].offsetX;
  let offsetY = groundObject[typ].offsetY;
  let groundSrc = [offsetX+0,offsetY+0, offsetX+64,offsetY+0, offsetX+64,offsetY+64, offsetX+0,offsetY+64];
  let heightVertex = worldHeightVertex;
  let vertexPos = 
  [
    32,32-heightVertex[worldPos+(worldWidth+1)]/*u*/, 
    64,16-heightVertex[worldPos+1+(worldWidth+1)]/*r*/, 
    32,0-heightVertex[worldPos+1]/*o*/, 
    0,16-heightVertex[worldPos]/*l*/
  ];
  gl2D.matrix.setTranslate([pos[0],pos[1]])
  gl2D.drawSquare(texture,groundSrc,vertexPos/*l*/,groundColor);
  gl2D.matrix.reset();
}

function setAnimator() {
  for (let ii = 0; ii < 20; ii++){
  if (animator[ii] < ii) animator[ii]++;
  else animator[ii] = 0;
  }
};

function render(curWorld) { 
  if (curWorld.typ !== void 0){
    // try{
      gl2D.startScene();
      let date = Date.now();

      groundColor[0]=groundColor[4]=groundColor[8]=groundColor[12]=color[0];
      groundColor[1]=groundColor[5]=groundColor[9]=groundColor[13]=color[1];
      groundColor[2]=groundColor[6]=groundColor[10]=groundColor[14]=color[2];
      groundColor[3]=groundColor[7]=groundColor[11]=groundColor[15]=color[3];

      let width = canvas.width, height=canvas.height;
      let Indentation = 0;
      let posx = 0;
      let posy = 0;
      let addPosX = (width / 64 + 2)|0 ;
      let addPosY = 1;
      let aktPosX = ((mapPosX|0) + addPosX + addPosY);
      let aktPosY = ((mapPosY|0) + addPosX - addPosY);
      let drawList = [];
      let drawListIndex = 0;
      for (let iy = -1; iy <= (((height+256)/16))|0; iy++) {
        if (Indentation == 0) {Indentation=1;posy++;posx--;}
        else Indentation = 0;
        aktPosX = ((mapPosX|0)+addPosX+addPosY+posx+Indentation);
        aktPosY = ((mapPosY|0)+addPosX-addPosY+posy);
        for (let ix = ((width / 64))|0; ix >= -1;ix--){
          aktPosX--;
          aktPosY--;
          if (aktPosX < worldWidth && aktPosX >= 0 && aktPosY < worldHeight && aktPosY >= 0){
            let worldPos = aktPosX+aktPosY*worldWidth;
            let drawPosX = 64*ix+32*Indentation;
            let drawPosY = 16*iy;
            //gl2D.drawImage(texture,[0,0,64,32],[drawPosX,drawPosY,64,32],color);
            //if (groundTexture !== void 0)
            drawGround(groundTextures,curWorld.ground[worldPos], aktPosX+aktPosY*(worldWidth+1),[drawPosX,drawPosY]);
            // let isAktField = (aktPosX >= aktPlayerPosX && aktPosY >= aktPlayerPosY && aktPosX < aktPlayerPosX + StaticEntity[aktGameObject].size && aktPosY < aktPlayerPosY + StaticEntity[aktGameObject].size)
            let aktReferenceX = (curWorld.referenceX[worldPos]);
            let aktReferenceY = (curWorld.referenceY[worldPos]);
            let typ = curWorld.typ[aktPosX - aktReferenceX+(aktPosY -aktReferenceY)*worldWidth];
            let height = worldHeightMap[aktPosX - aktReferenceX+(aktPosY -aktReferenceY)*worldWidth];

        

            let sObject = staticObject[typ];
            let version = curWorld.version[worldPos]; //graphic version
            if (typ > 0 && sObject.texture[version] !== void 0){

              let addGraphicWidth = sObject.addGraphicWidth;
              let envcode = 0;//findEnvorimentCode(aktWorld,aktPosX, aktPosY, sObject.envmode);//env code for auto tile (0000 - 1111)
              let overDraw = sObject.overDraw[version];
              let animPhase = sObject.animationPhases[version];
              let anim = animator[animPhase];
              let imgSrcX = (aktReferenceX * 32)+ (aktReferenceY * 32) + (sObject.size * 64) * anim;
              let imgSrcY = 16 * (sObject.size - 1) -(aktReferenceX * 16) + (aktReferenceY * 16);

              drawList[drawListIndex++] = [sObject.texture[version], [imgSrcX,imgSrcY,64+addGraphicWidth*2,32+overDraw],[drawPosX-addGraphicWidth,drawPosY-overDraw-height,64+addGraphicWidth*2,32+overDraw],color];
            }

            for (let i = 0; i<curWorld.entity[worldPos].length;i++){
              let curEntity = entityList[curWorld.entity[worldPos][i]];
              if (movableObject[curEntity.typ].texture[0] !== void 0){
                let entitySize = movableObject[curEntity.typ].graphicSize;
                let entitySrcX = (curEntity.directionX+1)*(entitySize)*2;
                let entitySrcY = (curEntity.directionY+1)*(entitySize);

                let directionPosX = (curEntity.moveProcess*32)*curEntity.directionX+(curEntity.moveProcess*32)*curEntity.directionY;
                let directionPosY = -(curEntity.moveProcess*16)*curEntity.directionX+(curEntity.moveProcess*16)*curEntity.directionY;

                drawList[drawListIndex++] = [movableObject[curEntity.typ].texture[0], [entitySrcX,entitySrcY,entitySize*2,entitySize],[drawPosX+directionPosX,drawPosY-height+directionPosY,64,32],color];
              }
            }

            if (worldPos === mapMousePos) drawGround(guiTexture[0],0, aktPosX+aktPosY*(worldWidth+1),[drawPosX,drawPosY]);
          }
        }
      }
      for (let i = 0;i<drawListIndex;i++){
        gl2D.drawImage(drawList[i][0], drawList[i][1],drawList[i][2],drawList[i][3]);
      }
      //gl2D.drawPrimitives(nullTexture,groundSrc,[0,0, width,0, width,height, 0,height],[200,200,255,100, 200,200,255,100, 200,200,255,0, 200,200,255,0]);
      gl2D.endScene();
      gl2D.renderScene();
     console.log("FPS => "+(Date.now()-date));
    // }
    // catch(e) {console.log(e);}
  }
} 
