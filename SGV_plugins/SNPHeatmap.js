class SNPHeatmap {
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
    let blockSize = Math.min(this.BLOCK_SIZE, sgv.bpMax-sgv.bpMin);
    this.canvas.height = this.height;
    this.canvas.width = area.w;
    // Get scores into the bins
    let benignBlocks = new Array(blockSize).fill(0);
    let pathogenicBlocks = new Array(blockSize).fill(0);
    for (let i=0; i<this.SNPData.length; i++) {
      let row = this.SNPData[i];
      if (row.pos<sgv.bpMin || row.pos>=sgv.bpMax)
        continue;
      let bScore=this._getBenignScore(row);
      let pScore=this._getPathogenicScore(row);
      let idx = Math.floor( (row.pos-sgv.bpMin)/
                            ((sgv.bpMax-sgv.bpMin)/blockSize)
                            );
      benignBlocks[idx]+=bScore;
      pathogenicBlocks[idx]+=pScore;
    }
    // Draw benign blocks
    let ctx = this.canvas.getContext("2d");
    ctx.scale(area.w/blockSize,this.height/2);
    let maxBenign = Math.max(...benignBlocks);
    if (maxBenign !==0){
      let scaleBenign = 1/maxBenign;
      for (let i=0; i<blockSize; i++){
        ctx.fillStyle = `rgba(0, 255, 0, ${benignBlocks[i]*scaleBenign})`;
        ctx.fillRect(i,0,1,1);
      }
    }
    // Draw patho blocks
    let maxPathogenic = Math.max(...pathogenicBlocks);
    if (maxPathogenic !==0){
      let scalePathogenic = 1/maxPathogenic;
      for (let i=0; i<this.BLOCK_SIZE; i++){
        ctx.fillStyle = `rgba(255, 0, 0, ${pathogenicBlocks[i]*scalePathogenic})`;
        ctx.fillRect(i,1,1,1);
      }
    }
  }

  _getBenignScore(record){
    let score = 0;
    let types = record.clinical_significance.split(';')
    for (let i=0; i<types.length; i++) {
      let sig = types[i];
      switch (sig){
        case "Benign":
          score+=1;
          break;
        case "Likely benign":
          score+=0.5
          break;
        default:
          break;
      }
    }
    return score;
  }

  _getPathogenicScore(record){
    let score = 0;
    let types = record.clinical_significance.split(';')
    for (let i=0; i<types.length; i++) {
      let sig = types[i];
      switch (sig){
        case "Pathogenic":
          score+=1;
          break;
        case "Likely pathogenic":
          score+=0.5
          break;
        default:
          break;
      }
    }
    return score;
  }
}
SNPHeatmap.prototype.HEIGHT =40;
SNPHeatmap.prototype.BLOCK_SIZE =100;

export {SNPHeatmap};
