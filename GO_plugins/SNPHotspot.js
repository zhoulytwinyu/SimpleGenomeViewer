class SNPHotspot {
  constructor(go,options){
    this.go = go;
    if (!options.SNPData) 
      throw new Error(`${this.constructor.name}: SNPData should be passed to ${go.constructor.name} in options object.`);
    this.SNPData = options.SNPData;
    this.canvas = document.createElement("canvas");
    go.mainDiv.appendChild(this.canvas);
    go.register("draw", this);
  }
  
  destroy(){
    //TODO
  }
  
  draw(){
    let go = this.go;
    let area = go.getDrawingArea();
    let canvas = this.canvas;
    let ctx = canvas.getContext("2d");
    let canvasHeight = area.h;
    let canvasWidth = area.w;
    let jitter = go.chrScale/2;
    canvas.style.position = "absolute";
    canvas.style.left = area.x+"px"
    canvas.style.top = area.y+"px";
    canvas.style.height = canvasHeight;
    canvas.style.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.width = canvasWidth;
    ctx.lineWidth = this.STROKE_WIDTH;
    ctx.strokeStyle = this.STROKE_COLOR;
    this.SNPData.forEach((record) => {
      let x = go.toDrawingXCoord(record.chrom);
      let y = go.toDrawingYCoord(record.pos);
      ctx.beginPath();
      ctx.arc(x+Math.random()*jitter-jitter/2, y,
              this.RADIUS,
              0, 2*Math.PI
             );
      ctx.stroke();
    })
  }
  
  clear(){
  }
}

SNPHotspot.prototype.STROKE_WIDTH = 1;
SNPHotspot.prototype.STROKE_COLOR = "rgba(246,50,62,0.1)";
SNPHotspot.prototype.RADIUS=2;

export {SNPHotspot};
