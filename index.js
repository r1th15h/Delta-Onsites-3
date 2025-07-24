const canvas = document.querySelector("canvas");
const imageupload = document.getElementById("imgupl");
const info = document.getElementById("info");
const c = canvas.getContext("2d");

canvas.width = 360;
canvas.height = 360;
const tilewidth = 120;
const rowcol = 3;

let tileind = [];
let img = new Image()
let scaledImg = new Image()

imageupload.addEventListener("change",(e)=>{
    const file = e.target.files[0];
    if(!file) return;
    info.remove();
    img.src = URL.createObjectURL(file);
    img.onload = ()=>{
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');

        const scale = Math.max(canvas.width/img.width,canvas.height/img.height);
        const w = img.width*scale;
        const h = img.height*scale;
        const x = (canvas.width-w)/2;
        const y = (canvas.height-h)/2;
        
        tempCtx.drawImage(img,x,y,w,h);
    
        scaledImg.src = tempCanvas.toDataURL();
        scaledImg.onload = () => {
            generateAndSetTiles();
        };
    };
})

function generateAndSetTiles() {
    generaterandom(); 
    console.log(tiles)
    drawTiles(); 
}

let tiles = []; 
let random = [1,2,3,5,null,6,4,7,8]; 
let toucing = [[1,3],[0,2,4],[1,5],[0,4,6],[1,3,5,7],[2,4,8],[3,7],[4,6,8],[5,7]];

function generaterandom() {
    while(true){
        let temp = [1,2,3,4,5,6,7,8,null];
        tiles = [];
        
        while(temp.length>0){
            const randind = Math.floor(Math.random()*temp.length);
            tiles.push(temp[randind]);
            temp.splice(randind, 1);
        }
        
        let inv=0;
        for(let i=0;i<tiles.length;i++){
            if(tiles[i] === null) continue;
            for(let j=i+1;j<tiles.length;j++){
                if(tiles[j] !== null && tiles[i]>tiles[j]){
                    inv++;
                }
            }
        }
        if(inv%2 === 0){
            break;
        }
    }
}

class Images{
    constructor(x,y,ind){
        this.x=x;
        this.y=y;
        this.index = ind;
    }
    draw(val){
        if(val === null) return;
        const picx = ((val-1)%rowcol)*tilewidth;
        const picy = Math.floor((val-1)/rowcol)*tilewidth;
        c.drawImage(scaledImg,picx,picy,tilewidth,tilewidth,this.x,this.y,tilewidth,tilewidth);
        c.strokeStyle = "black";
        c.strokeRect(this.x, this.y, tilewidth, tilewidth);
    }
}

canvas.addEventListener("click",(e)=>{
    const x = e.offsetX;
    const y = e.offsetY;
    for(let i=0;i<tileind.length;i++){
        const tile = tileind[i];
        if (x>=tile.x && x<tile.x+tilewidth && y>=tile.y && y<tile.y+tilewidth){
            moveTile(i);
            break;
        }
    }
});

function moveTile(index) {
    for(connect of toucing[index]){
        if(tiles[connect]==null){
            [tiles[index], tiles[connect]] = [tiles[connect], tiles[index]];
            drawTiles();
            return;
        }
    }
}

for(let i=0;i<rowcol;i++){
    for(let j=0;j<rowcol;j++){
        let tile = new Images(tilewidth*j,tilewidth*i)
        tileind.push(tile);
    }  
}

function checkWin(){
  const win = [1,2,3,4,5,6,7,8,null];
  for(let i=0;i<tiles.length;i++){
    if(tiles[i]!==win[i]) return false;
  }
  setTimeout(()=>{
    window.alert("You Won!");
  },10);
}

function drawTiles(){
    c.clearRect(0,0,canvas.width,canvas.height);
    for(let i=0;i<tileind.length;i++){
        const val = tiles[i];
        tileind[i].draw(val,i);
    }
    checkWin();
}

