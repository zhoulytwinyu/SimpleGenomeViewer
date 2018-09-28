import {Chromosome} from "./SGV_plugins/Chromosome.js";
import {GeneModel} from "./SGV_plugins/GeneModel.js";
import {Ranger} from "./SGV_plugins/Ranger.js";
import {SNPDot} from "./SGV_plugins/SNPDot.js";
import {SNPHeatmap} from "./SGV_plugins/SNPHeatmap.js";

class SimpleGenomeViewer {
  constructor(divId, chrSize, width, plugins) {
    // Get options
    this.parentDivId = divId;
    if (!this.parentDivId) throw new Error(`${this.constructor.name}: No divId passed to the constructor.`);
    this.chrSize = chrSize;
    if (!this.chrSize) throw new Error(`${this.constructor.name}: No chrSize passed to the constructor.`);
    this.width = width;
    if (!this.width) throw new Error(`${this.constructor.name}: No width passed to the constructor.`);
    this.plugins = plugins || [];
    // Prepare other variables
    this.parentDiv = document.getElementById(this.parentDivId);
    if (!this.parentDiv) throw new Error(`${this.constructor.name}: Invalid divId.`);
    this.mainDiv = document.createElement("div");
    this.drawDiv = document.createElement("div");
    this.layoutTop=0;
    this.layoutLeft=0;
    this.layoutRight=0;
    this.layoutDraw=0;
    this.bpMin=null;
    this.bpMax=null;
    this.bpScale=null;
    this.isZoomed=null;
    this.registry = {layout:[],draw:[],clear:[]};
    this._initPlugins();
    // Layout
    this._layout();
    // Draw
    this.draw(0,this.chrSize,false);
    // Styling
    let area = this.getDrawingArea();
    this.mainDiv.style.width = this.width+"px";
    this.mainDiv.style.height = area.y+area.h+"px";
    this.mainDiv.style.position = "relative";
    this.drawDiv.style.position = "absolute";
    this.drawDiv.style.left = area.x+"px";
    this.drawDiv.style.top = area.y+"px";
    // Prepare DOM
    this.mainDiv.append(this.drawDiv);
    this.parentDiv.appendChild(this.mainDiv);
  }
  
  destroy(){
    // TODO
    this.mainDiv.remove();
  }

  register(event,obj){
    switch (event){
      case "layout":
        this.registry.layout.push(obj);
        break;
      case "draw":
        this.registry.draw.push(obj);
        break;
      case "clear":
        this.registry.clear.push(obj);
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
      case "drawing":
        ret=this.layoutDraw; 
        this.layoutDraw += num;
        break;
      default:
        throw new Error(`${this.constructor.name}: reserving non-existant position: ${pos}.`);
    }
    return ret;
  }

  getDrawingArea(){
    return {x: this.layoutLeft,
            y: this.layoutTop,
            h: this.layoutDraw,
            w: this.width-this.layoutLeft-this.layoutRight
            }
  }
  
  toDrawingXCoord(bp){
    return (bp-this.bpMin)*this.bpScale;
  }

  fromDrawingXCoord(x){
    return x/this.bpScale + this.bpMin;
  }
  
  resetZoom(){
    this.draw(0,this.chrSize);
  }
  
  draw(start,end, clear){
    start = Math.floor(start);
    end = Math.ceil(end);
    if (end<=start) throw new Error(`${this.constructor.name} unable to draw non-positive span.`);
    // Determine isZoom
    if (start!==0 || end !== this.chrSize){
      this.isZoom=true;
    }
    else {
      this.isZoom=false;
    }
    this.bpMin=start;
    this.bpMax=end;
    // Determine bpScale
    let area = this.getDrawingArea();
    this.drawDiv.style.width = area.w;
    this.drawDiv.style.top = area.y;
    this.drawDiv.style.left = area.y;
    this.bpScale = area.w/(end-start);
    if (clear) this._clear();
    this.registry.draw.forEach( (obj) => obj.draw() );
  }

  _clear(){
    this.registry.clear.forEach( (obj) => obj.clear() );
  }
  
  _initPlugins(){
    for (let i=0; i<this.plugins.length; i++){
      let [pname,options] = this.plugins[i];
      console.log(pname);
      let p=SimpleGenomeViewer.Plugins[pname];
      // TODO: Try catch
      new p(this,options);
    }
  }
  
  _layout(){
    this.registry.layout.forEach( (obj) => obj.layout() );
  }
}

SimpleGenomeViewer.Plugins = {Chromosome,GeneModel,Ranger,SNPDot,SNPHeatmap};

export {SimpleGenomeViewer}
