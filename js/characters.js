import {C} from './config.js';
export const CHARACTERS={boy:{id:'boy',name:'왕관이',color:C.COLORS.boy},girl:{id:'girl',name:'하트별이',color:C.COLORS.girl}};

export function drawCharacter(ctx,id,x,y,size,pose='idle',flip=false){
  const c=CHARACTERS[id],s=size/200;
  ctx.save();ctx.translate(x,y);if(flip)ctx.scale(-1,1);ctx.scale(s,s);ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle=C.COLORS.ink;ctx.lineWidth=6;
  const bounce=pose==='win'?-8:0,tilt=pose==='swing'?.16:0;ctx.translate(0,bounce);ctx.rotate(tilt);
  if(id==='girl'){ctx.fillStyle='#6B4E72';ctx.beginPath();ctx.arc(0,-42,46,Math.PI,0);ctx.lineTo(48,22);ctx.quadraticCurveTo(25,5,23,-26);ctx.lineTo(-23,-26);ctx.quadraticCurveTo(-25,5,-48,22);ctx.closePath();ctx.fill();}
  ctx.fillStyle='#FFD7BD';ctx.beginPath();ctx.arc(0,-40,36,0,Math.PI*2);ctx.fill();ctx.stroke();
  if(id==='boy'){ctx.fillStyle=C.COLORS.accent;ctx.beginPath();ctx.moveTo(-30,-74);ctx.lineTo(-34,-105);ctx.lineTo(-12,-88);ctx.lineTo(0,-110);ctx.lineTo(14,-88);ctx.lineTo(34,-105);ctx.lineTo(29,-73);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#6B4E72';ctx.beginPath();ctx.arc(0,-48,37,Math.PI,0);ctx.fill();}
  ctx.strokeStyle=C.COLORS.ink;ctx.lineWidth=5;ctx.beginPath();ctx.arc(-12,-42,3,0,Math.PI*2);ctx.arc(12,-42,3,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(0,-29,10,.1,Math.PI-.1);ctx.stroke();
  ctx.fillStyle=c.color;ctx.strokeStyle=C.COLORS.ink;ctx.lineWidth=6;ctx.beginPath();if(id==='girl'){ctx.moveTo(-24,-4);ctx.lineTo(-45,65);ctx.lineTo(45,65);ctx.lineTo(24,-4);}else{ctx.roundRect(-30,-7,60,75,15)}ctx.closePath();ctx.fill();ctx.stroke();
  const arm=pose==='swing'?-42:-12;ctx.beginPath();ctx.moveTo(-25,8);ctx.lineTo(-55,35);ctx.moveTo(25,8);ctx.lineTo(58,arm);ctx.stroke();ctx.fillStyle='#FFD7BD';ctx.beginPath();ctx.arc(-58,38,7,0,7);ctx.arc(60,arm-2,7,0,7);ctx.fill();
  ctx.strokeStyle=C.COLORS.ink;ctx.beginPath();ctx.moveTo(-18,65);ctx.lineTo(-18,100);ctx.moveTo(18,65);ctx.lineTo(18,100);ctx.stroke();
  ctx.fillStyle=c.color;ctx.beginPath();ctx.ellipse(65,arm-18,18,25,pose==='swing'?.8:-.5,0,7);ctx.fill();ctx.stroke();ctx.restore();
}
