class GeneModel {
  constructor(sgv,options){
    // Get options
    if (! options.geneModelData )
      throw new Error(`${this.constructor.name}: geneModelData should be passed to ${sgv.constructor.name} in options object.`);
    this.geneModelData = options.geneModelData;
    this.height = this.HEIGHT;
    this.sgv = sgv;
    this.canvas = document.createElement("canvas");
    // Styling
    this.canvas.style.height = this.height+"px";
    this.canvas.style.display = "block";
    this.canvas.style.width = "100%";
    this.ctx = this.canvas.getContext("2d");
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
    this.ctx.clearRect(0,0,this.canvas.height,this.canvas.width);
  }
  
  draw(){
    let sgv = this.sgv;
    let area = sgv.getDrawingArea();
    this.canvas.height = this.height;
    this.canvas.width = area.w;
    let displayDetail = (sgv.bpMax-sgv.bpMin) <= 1000000
    // Draw gene model and label
    for (let row of this.geneModelData) {
      if (row.end<sgv.bpMin || row.start>=sgv.bpMax)
        continue;
      if ( !displayDetail && row.type !== "transcript")
        continue;
      this.drawRecord(row,displayDetail);
    }
  }

  drawRecord(row, displayDetail) {
    let sgv = this.sgv;
    let x = sgv.toDrawingXCoord(row.start);
    let xw = sgv.toDrawingXCoord(row.end);
    let w = xw-x;
    let y = null;
    let h = null;
    switch (row.type){
      case "transcript":
        y=10;
        h=20;
        this.ctx.strokeStyle="gray";
        this.ctx.strokeRect(x,y,w,h);
        break;
      case "exon":
      case "CDS":
        y=10;
        h=20;
        this.ctx.fillStyle="royalblue";
        this.ctx.fillRect(x,y,w,h);
        break;
      case "start_codon":
        y=10;
        h=20;
        this.ctx.fillStyle="limegreen";
        this.ctx.fillRect(x,y,w,h);
        break;
      case "stop_codon":
        y=10;
        h=20;
        this.ctx.fillStyle="firebrick";
        this.ctx.fillRect(x,y,w,h);
        break;
      case "UTR":
        y=15;
        h=10;
        this.ctx.fillStyle="gray";
        this.ctx.fillRect(x,y,w,h);
        break;
      default:
        throw new Error(`${this.constructor.name}: Unknown type of records.`); // Not suppose to reach here
    }
    // Draw label
    if (displayDetail && row.type==="transcript") {
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "top";
      let lbl = row.name;
      let lbl_x = (x+xw)/2;
      this.ctx.fillStyle="black";
      this.ctx.fillText(lbl,lbl_x,40);
    }
  }
}
GeneModel.prototype.HEIGHT = 50;

export {GeneModel};
