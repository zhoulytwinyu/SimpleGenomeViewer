class Chromosome {
  constructor(sgv,options){
    // Get options
    if (! options.cytobandData )
      throw new Error(`${this.constructor.name}: cytobandData should be passed to ${sgv.constructor.name} in options object.`);
    this.cytobandData = options.cytobandData;
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
    this.canvas.height = this.height;
    this.canvas.width = area.w;
    let ctx = this.canvas.getContext("2d");
    // Draw cytoband as Rect
    // and label
    ctx.textAlign = "center";
    ctx.textBaseline = "Bottom";
    for (let row of this.cytobandData) {
      if (row.end<sgv.bpMin || row.start>=sgv.bpMax)
        continue;
      let x = Math.max(sgv.toDrawingXCoord(row.start), 0);
      let xw = Math.min(sgv.toDrawingXCoord(row.end), sgv.width);
      let w = xw-x;
      let color = this.COLOR[row.type];
      let lbl = row.label;
      let lbl_x = (x+xw)/2;
      ctx.fillStyle=color;
      ctx.fillRect(x,0,w,this.height-15);
      ctx.fillStyle="black";
      ctx.fillText(lbl,lbl_x,this.height-5);
    }
  }
}
Chromosome.prototype.HEIGHT = 80;
Chromosome.prototype.COLOR = {
  gvar:   "skyblue",
  gneg:   "bisque",
  acen:   "pink",
  gpos25: "rgb(190,190,190)",
  gpos50: "rgb(125,125,125)",
  gpos75: "rgb(60,60,60)",
  gpos100:"rgb(0,0,0)"
  };

export {Chromosome};
