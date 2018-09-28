class SNPDot {
  constructor(sgv,options){
    // Get options
    if (! options.SNPData )
      throw new Error(`${this.constructor.name}: SNPData should be passed to ${sgv.constructor.name} in options object.`);
    this.SNPData = options.SNPData;
    this.height = options.height || this.HEIGHT;
    this.sgv = sgv;
    this.canvas = document.createElement("canvas");
    // Styling
    this.canvas.style.height = this.height+"px";
    this.canvas.style.display = "block";
    this.canvas.style.width = "100%";
    sgv.drawDiv.appendChild(this.canvas);
    // Connect with sgv
    sgv.register("layout", this);
    sgv.register("clear", this);
    sgv.register("draw", this);
  }
  
  destroy(){
    //TODO
  }

  layout(){
    let sgv = this.sgv;
    sgv.reserve("drawing",this.height);
  }
  
  clear(){
    let ctx = this.canvas.getContext("2d");
    ctx.clearRect(0,0,this.canvas.height,this.canvas.width);
  }
  
  draw(){
    let sgv = this.sgv;
    let area = sgv.getDrawingArea();
    let r = Math.max(sgv.bpScale/2,2);
    this.canvas.height = this.height;
    this.canvas.width = area.w;
    let ctx = this.canvas.getContext("2d");
    // Set up ctx
    ctx.globalAlpha=0.2;
    ctx.strokeStyle=this.COLOR;
    // Plot SNP as dots colored
    for (let i=0; i<this.SNPData.length; i++) {
      let row = this.SNPData[i];
      if (row.pos<sgv.bpMin || row.pos>=sgv.bpMax)
        continue;
      let x = sgv.toDrawingXCoord(row.pos);
      let y = Math.random()*this.height;
      ctx.beginPath();
      ctx.arc(x,y,r,0,2*Math.PI);
      ctx.stroke();
    }
  }
}
SNPDot.prototype.HEIGHT = 100;
SNPDot.prototype.COLOR = "red";

export {SNPDot};
