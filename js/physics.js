import {C} from './config.js';
import {prepareServe,isMatchWon} from './state.js';

export function stepPhysics(state,inputs,dt,events){
  state.time+=dt;state.netWobble=Math.max(0,state.netWobble-dt*4);state.scoreFlash=Math.max(0,state.scoreFlash-dt);
  for(let i=0;i<2;i++)updatePlayer(state,state.players[i],inputs[i],dt,events);
  if(state.pointDelay>0){state.pointDelay-=dt;if(state.pointDelay<=0&&state.status==='playing')prepareServe(state);return;}
  updateServe(state,dt);
  if(!state.ball.active)return;
  const b=state.ball,oldZ=b.z;
  const a=cross(b.spin,{x:b.vx,y:b.vy,z:b.vz});b.vx+=C.MAGNUS_K*a.x*dt;b.vy+=(-C.GRAVITY+C.MAGNUS_K*a.y)*dt;b.vz+=C.MAGNUS_K*a.z*dt;
  b.x+=b.vx*dt;b.y+=b.vy*dt;b.z+=b.vz*dt;
  if(!b.netChecked&&oldZ*b.z<=0){b.netChecked=true;if(b.y-C.BALL_R<C.NET_H&&Math.abs(b.x)<C.TABLE_W/2+C.NET_OVERHANG){b.vx*=.15;b.vz*=.15;b.vy=-Math.abs(b.vy)*.2;state.netWobble=1;events.push({type:'net',x:b.x,y:b.y,z:0});awardPoint(state,1-(b.lastHit??state.server),events,'삐끗!');return;}}
  if(b.y<=C.BALL_R&&b.vy<0){
    const onTable=Math.abs(b.x)<=C.TABLE_W/2&&Math.abs(b.z)<=C.TABLE_L/2;
    if(onTable){b.y=C.BALL_R;b.vy=-b.vy*C.RESTITUTION;b.vz+=b.spin.x*C.TABLE_FRICTION*.004;b.vx-=b.spin.y*C.TABLE_FRICTION*.004;b.spin.x*=.7;b.spin.y*=.7;b.spin.z*=.7;const side=b.z<0?0:1;b.bounces[side]++;events.push({type:'bounce',x:b.x,y:0,z:b.z});if(b.bounces[side]>=2){awardPoint(state,1-side,events,'통통!');return;}}
    else if(b.lastHit!==null){const opponent=1-b.lastHit;awardPoint(state,b.bounces[opponent]>0?b.lastHit:opponent,events,'아깝다!');return;}
  }
  if(b.y<-.9||Math.abs(b.z)>4.1||Math.abs(b.x)>3){const scorer=b.lastHit!==null&&b.bounces[1-b.lastHit]>0?b.lastHit:1-(b.lastHit??state.server);awardPoint(state,scorer,events,'한 번 더 해보자!');}
}

function updatePlayer(state,p,input,dt,events){
  p.x=clamp(p.x+input.moveX*C.PLAYER_SPEED*dt,-1.3,1.3);
  const dz=input.moveZ*C.PLAYER_SPEED*dt*(-p.side);p.z=clamp(p.z+dz,p.side<0?-2.6:1.5,p.side<0?-1.5:2.6);
  p.cooldown=Math.max(0,p.cooldown-dt);p.swingTime=Math.max(0,p.swingTime-dt);p.pose=p.swingTime>0?'swing':'idle';
  if(input.toss&&!state.ball.active&&p.index===state.server&&state.serveStage===0){state.serveStage=1;state.serveTimer=0;events.push({type:'toss',player:p.index});}
  const secondServeTap=!state.ball.active&&p.index===state.server&&state.serveStage===1;
  if(input.swing&&(p.cooldown<=0||secondServeTap)){p.swingTime=C.SWING_TIME;p.cooldown=C.SWING_TIME+C.SWING_COOLDOWN;p.swingShot=input.swing;events.push({type:'swing',player:p.index});
    if(!state.ball.active&&p.index===state.server&&state.serveStage===1)launchServe(state,p,input.swing,events);
  }
  if(state.ball.active&&p.swingTime>0&&state.ball.lastHit!==p.index){
    const h={x:p.x,y:.10,z:p.z+.40*(-p.side)},b=state.ball;const d=Math.hypot(b.x-h.x,b.y-h.y,b.z-h.z);
    if(d<C.HIT_RADIUS)hitBall(state,p,p.swingShot,events);
  }
}
function updateServe(state,dt){if(state.ball.active)return;const p=state.players[state.server],b=state.ball;b.x=p.x;b.z=p.z+.46*(-p.side);if(state.serveStage===1){state.serveTimer+=dt;b.y=.16+Math.sin(Math.min(Math.PI,state.serveTimer*4.2))*.10;if(state.serveTimer>1.4){state.serveStage=0;b.y=.16;}}else b.y=.16;}
function launchServe(state,p,shot,events){const b=state.ball;state.serveStage=2;b.active=true;b.lastHit=p.index;b.bounces=[0,0];b.netChecked=false;aimVelocity(b,p,shot,true);events.push({type:'hit',player:p.index,x:b.x,y:b.y,z:b.z});}
function hitBall(state,p,shot,events){const b=state.ball;b.lastHit=p.index;b.bounces=[0,0];b.netChecked=false;aimVelocity(b,p,shot,false);state.rally++;state.bestRally=Math.max(state.bestRally,state.rally);events.push({type:'hit',player:p.index,x:b.x,y:b.y,z:b.z,rally:state.rally});}
function aimVelocity(b,p,shot,isServe){
  const strength=clamp(shot.power||0,0,1),vertical=clamp(shot.dirY||0,-1,1),targetX=clamp(-p.x*.12,-.3,.3);
  const targetZ=isServe?p.side*.62:-p.side*.74;
  const speed=5.80+strength*1.00;
  const travel=isServe?.38:Math.max(.16,Math.abs(targetZ-b.z)/speed);
  b.vz=(targetZ-b.z)/travel;
  // 서브는 첫 목표가 반드시 자기 코트입니다. 바운드 반발로 네트를 넘어 상대 코트에 두 번째로 떨어집니다.
  const xTravel=isServe?travel+.34:travel;b.vx=clamp((targetX-b.x)/xTravel,-2.1,2.1);
  // 목표 지점에서 공의 아랫면이 상판에 닿도록 역산해 낮은 탁구 탄도를 만듭니다.
  b.vy=(C.BALL_R-b.y+.5*C.GRAVITY*travel*travel)/travel-vertical*(isServe?.015:.08);
  b.spin.x=clamp(vertical*C.MAX_SPIN*(isServe?.20:.65),-C.MAX_SPIN,C.MAX_SPIN);b.spin.y=0;b.spin.z=0;
}
function awardPoint(state,index,events,message){
  if(state.status!=='playing')return;state.ball.active=false;state.score[index]++;state.totalPoints++;state.scoreFlash=.55;events.push({type:'score',player:index,message});
  if(isMatchWon(state.score,index)){state.status='ended';state.winner=index;events.push({type:'gameover',player:index});return;}
  state.server=Math.floor(state.totalPoints/C.SERVE_SWITCH)%2;state.pointDelay=.65*C.GAME_SPEED;
}
function cross(a,b){return{x:a.y*b.z-a.z*b.y,y:a.z*b.x-a.x*b.z,z:a.x*b.y-a.y*b.x};}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
