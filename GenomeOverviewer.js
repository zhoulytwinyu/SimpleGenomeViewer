import {Chromosome} from "./GO_plugins/Chromosome.js";
import {Label} from "./GO_plugins/Label.js";
import {SNPHotspot} from "./GO_plugins/SNPHotspot.js";

class GenomeOverviewer {
  constructor(divId, data, height, width, plugins) {
    // Get options
    this.parentDivId = divId;
    if (!this.parentDivId) throw new Error(`${this.constructor.name}: No divId passed to the constructor.`);
    this.data = data;
    if (!this.data) throw new Error(`${this.constructor.name}: No data passed to the constructor.`);
    this.height = height || this.HEIGHT;
    this.width = width || this.WIDTH;
    this.plugins = plugins || [];
    // Prepare other variables
    this.chromosomeOrder = this._getChromosomeOrder();
    this.parentDiv = document.getElementById(this.parentDivId);
    if (!this.parentDiv) throw new Error(`${this.constructor.name}: Invalid divId.`);
    this.mainDiv = document.createElement("div");
    this.layoutTop=0;
    this.layoutBottom=0;
    this.layoutLeft=0;
    this.layoutRight=0;
    this.bpScale = null;
    this.chrScale = this.width/this.data.length;
    this.registry = {layout:[],draw:[]};
    this.events = {};
    this._initPlugins();
    // Layout
    this._layout();
    // Calculate drawing scale
    this.bpScale = this._getBPScale();
    // Draw
    this._draw();
    // Styling
    this.mainDiv.style.width = this.width+"px";
    this.mainDiv.style.height = this.height+"px";
    this.mainDiv.style.overflow = "hidden";
    this.mainDiv.style.position = "relative";
    // Prepare DOM
    this.parentDiv.appendChild(this.mainDiv);
  }
  
  destroy(){
    //TODO
  }

  register(event,obj){
    switch (event){
      case "layout":
        this.registry.layout.push(obj);
        break;
      case "draw":
        this.registry.draw.push(obj);
        break;
      default:
        throw new Error(`${this.constructor.name}: Unknown event: ${event}.`);
    }
  }
  
  reserve(pos,num){
    let ret = null;
    switch (pos){
      case "top":
        ret = this.layoutTop;
        this.layoutTop += num;
        if (this.layoutTop+this.layoutBottom>=this.height)
          throw new Error(`${this.constructor.name}: Not enough vertical space.`);
        break;
      case "bottom":
        this.layoutBottom += num;
        ret = this.height-this.layoutBottom;
        if (this.layoutTop+this.layoutBottom>=this.height)
          throw new Error(`${this.constructor.name}: Not enough vertical space.`);
        break;
      case "left":
        ret = this.layoutLeft;
        this.layoutLeft += num;
        if (this.layoutLeft+this.layoutRight>=this.width)
          throw new Error(`${this.constructor.name}: Not enough horizontal space.`);
        break;
      case "right":
        this.layoutRight += num;
        ret = this.width-this.layoutRight;
        if (this.layoutLeft+this.layoutRight>=this.width)
          throw new Error(`${this.constructor.name}: Not enough horizontal space.`);
        break;
      default:
        throw new Error(`${this.constructor.name}: reserving non-existant position: ${pos}.`);
    }
    return ret;
  }

  getDrawingArea() {
    return {
      x: this.layoutLeft,
      y: this.layoutTop,
      w: this.width-this.layoutRight-this.layoutLeft,
      h: this.height-this.layoutBottom-this.layoutTop
      }
  }
  
  toDrawingXCoord(chr){
    let x=null;
    if (typeof chr === "number")
      x=this.chrScale*chr + this.chrScale/2;
    if (typeof chr === "string")
      chr = this.chromosomeOrder[chr];
      x=this.chrScale*chr + this.chrScale/2;
    return x;
  }
  
  toDrawingYCoord(bp){
    let y=this.CHR_OFFSET_Y+this.bpScale*bp;
    return y;
  }
  
  _getChromosomeOrder(){
    let ret = {};
    for (let i=0; i<this.data.length; i++){
      let row = this.data[i];
      ret[row.chr] = i;
    }
    return ret;
  }
  
  _getBPScale(){
    let lengths = this.data.map((chr) => chr.length);
    let maxLength = lengths.reduce((a,b)=>Math.max(a,b));
    return (this.height-this.layoutTop-this.layoutBottom
            -this.CHR_OFFSET_Y-this.CHR_OFFSET_BOTTOM)
            /maxLength;
  }
  
  _initPlugins(){
    for (let i=0; i<this.plugins.length; i++){
      let [pname,options] = this.plugins[i];
      let p = GenomeOverviewer.Plugins[pname];
      new p(this,options);
    }
  }
  
  _layout(){
    this.registry.layout.forEach( (obj) => obj.layout() );
  }
  
  _draw(){
    this.registry.draw.forEach( (obj) => obj.draw() );
  }

  registerEvent(event,callback){
    this.events[event] = this.events[event] || [callback];
  }

  dispatchEvent(event,details){
    if (!this.events[event]){
      return;
    }
    for (let cb of this.events[event]) {
      cb(details);
    }
  }
}

GenomeOverviewer.prototype.HEIGHT = 400;
GenomeOverviewer.prototype.WIDTH = 1200;
GenomeOverviewer.prototype.CHR_OFFSET_Y = 5;
GenomeOverviewer.prototype.CHR_OFFSET_BOTTOM = 5;

GenomeOverviewer.Plugins={Chromosome,Label,SNPHotspot};

export {GenomeOverviewer};
