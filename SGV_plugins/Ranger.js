class Ranger {
  constructor(sgv,options){
    this.sgv = sgv;
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.mouseDownPos = null;
    // Event listener
    this.addEventListeners();
    // Styling
    this.canvas.style.display = "block";
    this.canvas.style.position="absolute";
    this.canvas.style.width="100%";
    this.canvas.style.height="100%";
    this.canvas.style.top=0+"px";
    this.canvas.style.left=0+"px";
    sgv.drawDiv.appendChild(this.canvas);
    // Connect to sgv
    sgv.register("draw", this);
  }
  
  destroy(){
    //TODO
  }

  addEventListeners(){
    let sgv = this.sgv;
    this.canvas.addEventListener("dblclick",(ev)=>{
      sgv.draw(0,this.sgv.chrSize);
    });
    this.canvas.addEventListener("mousedown",(ev)=>{
      this.mouseDownPos = ev.layerX;
    });
    this.canvas.addEventListener("mouseup",(ev)=>{
      if (this.mouseDownPos===null){
        return;
      }
      let x=ev.layerX;
      if (Math.abs(x-this.mouseDownPos)<50) {
        this.mouseDownPos = null;
        this.clear();
        return;
      }
      let end = sgv.fromDrawingXCoord(x);
      let start = sgv.fromDrawingXCoord(this.mouseDownPos);
      if (start >end)
        [start,end]=[end,start];
      if (end-start<100) {
        end = Math.min(sgv.chrSize, start+100);
        start = end-100;
      }
      this.mouseDownPos = null;
      this.clear();
      sgv.draw(start,end);
    });
    this.canvas.addEventListener("mousemove",(ev)=>{
      if (this.mouseDownPos===null) {
        return;
      }
      let x = ev.layerX;
      let start = this.mouseDownPos;
      this.clear();
      this.ctx.fillRect(start,0,x-start,1);
    });
    this.canvas.addEventListener("mouseout",(ev)=>{
      this.mouseDownPos=null;
      this.clear();
    });
  }
  
  clear(){
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
  }

  draw(){
    let sgv = this.sgv;
    let area = sgv.getDrawingArea();
    this.canvas.height = 1;
    this.canvas.width = area.w;
    this.ctx.fillStyle = this.GRAYOUT_COLOR;
  }
}

Ranger.prototype.GRAYOUT_COLOR = "rgba(150,180,180,0.2)";

export {Ranger};
