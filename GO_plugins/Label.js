class Label {
  constructor(go,options){
    this.go = go;
    this.top = null;
    this.div = document.createElement("div");
    this.div.style.position="absolute";
    go.mainDiv.appendChild(this.div);
    go.register("layout", this);
    go.register("draw", this);
  }
  
  destroy(){
    //TODO
  }
  
  layout(){
    let go = this.go;
    this.top = go.reserve("top",this.RESERVE_HEIGHT);
  }
  
  draw(){
    let go = this.go;
    let area = go.getDrawingArea();
    this.div.style.height = this.RESERVE_HEIGHT+"px";
    this.div.style.top = this.top+"px";
    this.div.style.left = area.x+"px";
    go.data.forEach( (row) => {
      let textDiv = document.createElement("div");
      textDiv.innerHTML = row.chr;
      textDiv.style.textAlign = "center";
      textDiv.style.cursor = "pointer";
      textDiv.style.position = "absolute";
      textDiv.style.width = this.DIV_WIDTH+"px";
      textDiv.style.left = go.toDrawingXCoord(row.chr)-this.DIV_WIDTH/2+"px";
      textDiv.addEventListener("click", (ev)=>{
        let detail={selected:row.chr};
        go.dispatchEvent("select",detail);
      });
      this.div.appendChild(textDiv);
    });
  }
  
  clear(){
  }
}

Label.prototype.DIV_WIDTH = 20;
Label.prototype.RESERVE_HEIGHT = 20;

export {Label};
