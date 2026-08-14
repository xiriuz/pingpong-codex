export class InputManager{
  constructor(canvas,getMode){this.canvas=canvas;this.getMode=getMode;this.controls=[makeControl(),makeControl()];this.pointers=new Map();this.bind();}
  bind(){for(const type of ['pointerdown','pointermove','pointerup','pointercancel'])this.canvas.addEventListener(type,e=>this.handle(e),{passive:false});}
  handle(e){
    e.preventDefault();const rect=this.canvas.getBoundingClientRect(),x=e.clientX-rect.left,y=e.clientY-rect.top,mode=this.getMode();
    const player=mode==='versus_local'?(x<rect.width/2?0:1):0,vx0=mode==='versus_local'?player*rect.width/2:0,vw=mode==='versus_local'?rect.width/2:rect.width;
    const hand=x-vx0<vw/2?'left':'right',c=this.controls[player];
    if(e.type==='pointerdown'){
      try{this.canvas.setPointerCapture?.(e.pointerId);}catch{}
      const rec={player,hand,startY:y,y,vw,tossed:false,swung:false};this.pointers.set(e.pointerId,rec);
      if(hand==='left'&&c.leftId===null){c.leftId=e.pointerId;c.leftHandLift=.04;}
      if(hand==='right'&&c.rightId===null){c.rightId=e.pointerId;c.swing={dirX:0,dirY:0,power:.4};}
      return;
    }
    const rec=this.pointers.get(e.pointerId);if(!rec)return;rec.y=y;
    if(e.type==='pointermove'){
      const max=Math.min(rec.vw,rect.height)*.24,dy=rec.startY-y;
      if(rec.hand==='left'&&c.leftId===e.pointerId){c.leftHandLift=clamp(dy/max,0,1);if(c.leftHandLift>.32&&!rec.tossed){c.tossQueued=true;rec.tossed=true;}}
      if(rec.hand==='right'&&c.rightId===e.pointerId){c.swing.dirX=0;c.swing.dirY=clamp(dy/max,-1,1);c.swing.power=Math.max(.4,Math.min(1,Math.abs(dy)/max));if(Math.abs(dy)>8&&!rec.swung){c.swingQueued=true;rec.swung=true;}}
      return;
    }
    if(rec.hand==='left'&&c.leftId===e.pointerId){c.leftId=null;c.leftHandLift=0;}
    if(rec.hand==='right'&&c.rightId===e.pointerId){if(!rec.swung)c.swingQueued=true;c.rightId=null;}
    this.pointers.delete(e.pointerId);
  }
  read(index){const c=this.controls[index],s=c.swingQueued?c.swing:null,toss=c.tossQueued;c.swingQueued=false;c.tossQueued=false;return{moveX:0,moveZ:0,toss,swing:s};}
  visuals(index){return this.controls[index];}
  clear(){this.pointers.clear();this.controls=[makeControl(),makeControl()];}
}
function makeControl(){return{leftId:null,rightId:null,leftHandLift:0,tossQueued:false,swing:null,swingQueued:false};}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
