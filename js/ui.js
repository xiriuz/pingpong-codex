import {drawCharacter} from './characters.js';

export class UI{
  constructor(callbacks){this.cb=callbacks;this.mode=null;this.firstPick=null;this.difficulty='easy';this.screens=[...document.querySelectorAll('.screen')];this.bind();this.drawCards();}
  bind(){
    document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{this.mode=b.dataset.mode;this.firstPick=null;this.show('select-screen');this.updateSelect();});
    document.querySelectorAll('[data-character]').forEach(b=>b.onclick=()=>this.pick(b.dataset.character));
    document.querySelectorAll('[data-difficulty]').forEach(b=>b.onclick=()=>{this.difficulty=b.dataset.difficulty;document.querySelectorAll('[data-difficulty]').forEach(x=>x.classList.toggle('selected',x===b));this.save();});
    document.querySelectorAll('[data-back],[data-home]').forEach(b=>b.onclick=()=>this.home());
    document.querySelector('#pause-button').onclick=()=>this.cb.pause();document.querySelector('#resume').onclick=()=>this.cb.resume();document.querySelector('#rematch').onclick=()=>this.cb.rematch();
    document.querySelectorAll('#mute-title,#mute-game').forEach(b=>b.onclick=()=>this.cb.mute());this.restore();
  }
  pick(id){if(this.mode==='single'){this.save(id);this.cb.start(this.mode,id,null,this.difficulty);return;}if(!this.firstPick){this.firstPick=id;this.save(id);this.updateSelect();}else if(id!==this.firstPick)this.cb.start(this.mode,this.firstPick,id,this.difficulty);}
  updateSelect(){const second=!!this.firstPick;document.querySelector('#select-title').textContent=this.mode==='single'?'내 캐릭터를 골라봐!':second?'2P 캐릭터를 골라봐!':'1P 캐릭터를 골라봐!';document.querySelector('#select-step').textContent=this.mode==='versus_local'?(second?`${this.firstPick==='boy'?'왕관이':'하트별이'}는 1P! 이제 친구 차례야`:'친구와 하나씩 골라줘'):'마음에 쏙 드는 친구를 톡!';document.querySelector('#difficulty').style.display=this.mode==='single'?'flex':'none';document.querySelectorAll('[data-character]').forEach(b=>b.classList.toggle('disabled',second&&b.dataset.character===this.firstPick));}
  show(id){this.screens.forEach(s=>s.classList.toggle('active',s.id===id));}
  game(){this.show('game-screen');}
  pause(){this.show('pause-screen');}
  resume(){this.show('game-screen');}
  home(){this.firstPick=null;this.cb.home();this.show('title-screen');}
  score(state){document.querySelector('#p1-score').textContent=state.score[0];document.querySelector('#p2-score').textContent=state.score[1];const board=document.querySelector('#scoreboard');board.classList.remove('bump');void board.offsetWidth;board.classList.add('bump');}
  serve(show){document.querySelector('#serve-guide').classList.toggle('show',show);document.querySelector('#serve-guide').textContent=show?'오른쪽을 두 번 톡! 서브':'멋진 랠리 중!';}
  orientation(block){document.body.classList.toggle('versus-portrait',block);}
  result(state){const win=state.players[state.winner],lost=state.players[1-state.winner];document.querySelector('#result-title').textContent=state.winner===0?'이겼어!':'우와, 멋진 경기!';document.querySelector('#result-message').textContent=state.mode==='single'?(state.winner===0?'정말 잘했어! 반짝반짝 최고야!':'아깝다! 한 번 더 하면 더 잘할 거야!'):`${win.character==='boy'?'왕관이':'하트별이'} 최고! ${lost.character==='boy'?'왕관이':'하트별이'}도 잘했어!`;document.querySelector('#best-rally').textContent=state.bestRally;const c=document.querySelector('#winner'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);drawCharacter(ctx,win.character,130,145,190,'win');this.show('result-screen');}
  mute(muted){document.querySelectorAll('#mute-title,#mute-game').forEach(b=>{b.textContent=muted?'🔇':'🔊';b.setAttribute('aria-label',muted?'소리 켜기':'소리 끄기');});}
  drawCards(){document.querySelectorAll('.character-card').forEach(card=>{const c=card.querySelector('canvas'),ctx=c.getContext('2d');drawCharacter(ctx,card.dataset.character,100,116,130,'win');});}
  save(character){try{localStorage.setItem('pingpong-choice',JSON.stringify({character:character||this.firstPick,difficulty:this.difficulty}));}catch{}}
  restore(){try{const s=JSON.parse(localStorage.getItem('pingpong-choice'));if(s?.difficulty&&['easy','normal','hard'].includes(s.difficulty)){this.difficulty=s.difficulty;document.querySelectorAll('[data-difficulty]').forEach(b=>b.classList.toggle('selected',b.dataset.difficulty===s.difficulty));}}catch{}}
}
