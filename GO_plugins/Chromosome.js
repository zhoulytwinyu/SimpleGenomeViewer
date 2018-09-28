class Chromosome {
  constructor(go,options){
    this.go = go;
    this.svg = document.createElementNS(this.XMLNS,"svg");
    this.svg.style.position = "absolute";
    go.mainDiv.appendChild(this.svg);
    go.register("draw", this);
  }

  draw(){
    let go = this.go;
    let area = go.getDrawingArea();
    let svgHeight = area.h;
    let svgWidth = area.w;
    this.svg.style.left = area.x+"px";
    this.svg.style.top = area.y+"px";
    this.svg.setAttribute("viewBox",
                          `0 0 ${svgWidth} ${svgHeight}`);
    this.svg.setAttribute("height",svgHeight);
    this.svg.setAttribute("width",svgWidth);
    
    for (let i=0; i<go.data.length; i++) {
      let chr = go.data[i];
      let x = go.toDrawingXCoord(i)-go.chrScale*1/4;
      let y = go.toDrawingYCoord(0);
      let h = go.toDrawingYCoord(chr.length)-y;
      // Plot chromosome as rect
      let rect = document.createElementNS(this.XMLNS,"rect");
      rect.id = chr.label;
      rect.setAttribute("x", x);
      rect.setAttribute("y", go.toDrawingYCoord(0));
      rect.setAttribute("width", go.chrScale/2);
      rect.setAttribute("height", h);
      rect.setAttribute("rx", this.CHR_RX);
      rect.setAttribute("ry", this.CHR_RY);
      rect.setAttribute("fill", this.CHR_FILL);
      rect.setAttribute("stroke", this.CHR_STROKE);
      rect.setAttribute("stroke-width", this.CHR_STROKEWIDTH);
      this.svg.appendChild(rect);
    } // END OF FOR
  }
}

Chromosome.prototype.XMLNS = "http://www.w3.org/2000/svg";
Chromosome.prototype.CHR_FILL="bisque";
Chromosome.prototype.CHR_RX="10";
Chromosome.prototype.CHR_RY="4";
Chromosome.prototype.CHR_STROKE="black"
Chromosome.prototype.CHR_STROKEWIDTH="2"

export {Chromosome};
