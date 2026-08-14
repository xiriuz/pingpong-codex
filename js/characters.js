import {C} from './config.js';

export const CHARACTERS={
  boy:{id:'boy',name:'뾰족머리',color:C.COLORS.boy},
  girl:{id:'girl',name:'포니테일',color:C.COLORS.girl}
};

export function drawCharacter(ctx,id,x,y,size,pose='idle',flip=false){
  const c=CHARACTERS[id],s=size/200,bounce=pose==='win'?-9:0,armY=pose==='swing'?-42:-12;
  ctx.save();ctx.translate(x,y+bounce);if(flip)ctx.scale(-1,1);ctx.scale(s,s);
  ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle=C.COLORS.ink;ctx.lineWidth=5;

  // 원본의 긴 머리 실루엣: 얼굴 양옆에서 아래로 내려오는 한 덩어리.
  if(id==='girl'){
    ctx.fillStyle='#8C6280';ctx.beginPath();ctx.moveTo(-34,-78);ctx.quadraticCurveTo(-58,-51,-45,25);
    ctx.lineTo(-20,10);ctx.lineTo(20,10);ctx.lineTo(47,25);ctx.quadraticCurveTo(57,-54,31,-78);ctx.closePath();ctx.fill();ctx.stroke();
  }

  ctx.fillStyle='#FFE0C8';ctx.beginPath();ctx.roundRect(-31,-76,62,70,26);ctx.fill();ctx.stroke();

  // 원본처럼 짧고 뾰족한 머리카락입니다.
  if(id==='boy'){
    ctx.fillStyle='#62536F';ctx.beginPath();ctx.moveTo(-31,-60);ctx.lineTo(-30,-82);ctx.lineTo(-19,-74);
    ctx.lineTo(-9,-89);ctx.lineTo(2,-75);ctx.lineTo(14,-89);ctx.lineTo(21,-73);ctx.lineTo(31,-81);
    ctx.lineTo(30,-58);ctx.quadraticCurveTo(0,-70,-31,-60);ctx.closePath();ctx.fill();ctx.stroke();
  }

  ctx.fillStyle=C.COLORS.ink;ctx.beginPath();ctx.arc(-10,-44,2.8,0,Math.PI*2);ctx.arc(10,-44,2.8,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(0,-31,10,.15,Math.PI-.15);ctx.stroke();
  ctx.fillStyle='#FFE0C8';ctx.beginPath();ctx.arc(0,0,7,0,Math.PI*2);ctx.fill();ctx.stroke();

  ctx.fillStyle=c.color;ctx.beginPath();
  if(id==='girl'){ctx.moveTo(-22,8);ctx.lineTo(-42,66);ctx.lineTo(42,66);ctx.lineTo(22,8);}
  else ctx.rect(-29,7,58,59);
  ctx.closePath();ctx.fill();ctx.stroke();

  ctx.beginPath();ctx.moveTo(-25,15);ctx.lineTo(-57,42);ctx.moveTo(25,15);ctx.lineTo(57,armY);ctx.stroke();
  ctx.fillStyle='#FFE0C8';for(const [hx,hy] of [[-59,44],[59,armY-2]]){ctx.beginPath();ctx.arc(hx,hy,6,0,Math.PI*2);ctx.fill();ctx.stroke();}
  ctx.beginPath();ctx.moveTo(-16,66);ctx.lineTo(-16,101);ctx.moveTo(16,66);ctx.lineTo(16,101);ctx.stroke();
  ctx.beginPath();ctx.arc(-16,104,5,0,Math.PI*2);ctx.arc(16,104,5,0,Math.PI*2);ctx.fill();ctx.stroke();

  ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(58,armY-7);ctx.lineTo(67,armY-28);ctx.stroke();
  ctx.fillStyle=c.color;ctx.lineWidth=5;ctx.beginPath();ctx.ellipse(72,armY-42,16,22,-.38,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.restore();
}
