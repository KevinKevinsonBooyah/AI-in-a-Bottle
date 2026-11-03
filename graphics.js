/* AI in a Bottle — JavaScript Graphics (CodeHS-style subset).
   The user program executes inside an iframe with an opaque origin and no network. */
(function(){
"use strict";
function graphicsBoot(userCode, token){
 const canvas=document.getElementById('graphics-canvas');
 const ctx=canvas.getContext('2d');
 const objects=[],timers=new Map();
 const notify=(type,value)=>parent.postMessage({kind:'AI_BOTTLE_GRAPHICS',token,type,text:String(value)},'*');
 function show(x){if(typeof x==='string')return x;try{return JSON.stringify(x)??String(x)}catch(e){return String(x)}}
 function output(...args){notify('line',args.map(show).join(' '))}
 window.println=output;
 window.print=output;
 window.console={log:output,info:output,warn:(...a)=>notify('line','⚠ '+a.map(show).join(' ')),error:(...a)=>notify('line','✕ '+a.map(show).join(' '))};
 window.readLine=(promptText)=>{const value=prompt(String(promptText||'Enter text'),'');if(value===null)throw Error('Input cancelled');return value};
 window.readBoolean=(promptText)=>{
  for(let i=0;i<5;i++){const val=prompt(String(promptText||'True or false?')+'\nType yes/no or true/false.','yes');if(val===null)throw Error('Input cancelled');const lower=val.trim().toLowerCase();if(['true','yes','y','1'].includes(lower))return true;if(['false','no','n','0'].includes(lower))return false;}
  throw Error('Please answer true/false or yes/no.');
 };
 window.readInt=promptText=>{const v=Number(window.readLine(promptText));if(!Number.isInteger(v))throw Error('An integer is required.');return v};
 window.readFloat=promptText=>{const v=Number(window.readLine(promptText));if(!Number.isFinite(v))throw Error('A number is required.');return v};
 window.getWidth=()=>canvas.width;window.getHeight=()=>canvas.height;
 const Color={
  red:'#f04a55',blue:'#3b77f2',green:'#4ab959',yellow:'#f5d443',orange:'#ff9942',
  purple:'#a274ef',black:'#0a1820',white:'#ffffff',gray:'#8e9c9e',grey:'#8e9c9e',
  cyan:'#16cfdb',pink:'#ed8caa',brown:'#95663d',magenta:'#e73cce',lightGray:'#cbd4d5',darkGray:'#4c5a62'
 };
 Color.random=()=>Object.values(Color)[Math.floor(Math.random()*15)];
 window.Color=Color;
 window.Randomizer={
  nextInt:(min,max)=>Math.floor(Number(min)+Math.random()*(Number(max)-Number(min)+1)),
  nextFloat:(min,max)=>Number(min)+Math.random()*(Number(max)-Number(min)),
  nextBoolean:()=>Math.random()<.5,nextColor:()=>Color.random()
 };
 class Thing{
  constructor(){this.x=0;this.y=0;this.color=Color.black;this.filled=true;this.lineWidth=2}
  setPosition(x,y){this.x=Number(x)||0;this.y=Number(y)||0}
  move(dx,dy){this.x+=Number(dx)||0;this.y+=Number(dy)||0}
  setColor(v){this.color=String(v)}
  setFilled(v){this.filled=Boolean(v)}
  setLineWidth(n){this.lineWidth=Math.max(1,Number(n)||1)}
  getX(){return this.x}getY(){return this.y}getType(){return this.constructor.name}
 }
 class Rectangle extends Thing{
  constructor(w,h){super();this.w=Number(w)||0;this.h=Number(h)||0}
  setSize(w,h){this.w=Number(w)||0;this.h=Number(h)||0}
  getWidth(){return this.w}getHeight(){return this.h}
  draw(g){g.beginPath();g.rect(this.x,this.y,this.w,this.h);paint(g,this)}
 }
 class Circle extends Thing{
  constructor(r){super();this.radius=Number(r)||0}
  getRadius(){return this.radius}
  setRadius(r){this.radius=Number(r)||0}
  draw(g){g.beginPath();g.arc(this.x,this.y,Math.max(0,this.radius),0,Math.PI*2);paint(g,this)}
 }
 class Oval extends Thing{
  constructor(w,h){super();this.w=Number(w)||0;this.h=Number(h)||0}
  setSize(w,h){this.w=Number(w)||0;this.h=Number(h)||0}
  draw(g){g.beginPath();g.ellipse(this.x,this.y,Math.max(0,this.w/2),Math.max(0,this.h/2),0,0,2*Math.PI);paint(g,this)}
 }
 class Line extends Thing{
  constructor(x1,y1,x2,y2){super();this.x=Number(x1)||0;this.y=Number(y1)||0;this.x2=Number(x2)||0;this.y2=Number(y2)||0}
  setEndpoint(x,y){this.x2=Number(x)||0;this.y2=Number(y)||0}
  move(dx,dy){super.move(dx,dy);this.x2+=Number(dx)||0;this.y2+=Number(dy)||0}
  draw(g){g.beginPath();g.moveTo(this.x,this.y);g.lineTo(this.x2,this.y2);g.strokeStyle=this.color;g.lineWidth=this.lineWidth;g.stroke()}
 }
 class Text extends Thing{
  constructor(text,font){super();this.text=String(text??'');this.font=font||'20px Arial'}
  setText(t){this.text=String(t)}
  getText(){return this.text}
  setFont(s){this.font=s}
  draw(g){g.font=this.font;g.fillStyle=this.color;g.fillText(this.text,this.x,this.y)}
 }
 function paint(g,obj){g.lineWidth=obj.lineWidth;g.strokeStyle=obj.color;g.fillStyle=obj.color;if(obj.filled)g.fill();else g.stroke()}
 Object.assign(window,{Rectangle,Circle,Oval,Line,Text});
 window.add=obj=>{if(!obj||typeof obj.draw!=='function')throw Error('add() requires a graphics shape.');if(!objects.includes(obj))objects.push(obj)};
 window.remove=obj=>{const at=objects.indexOf(obj);if(at>=0)objects.splice(at,1)};
 window.removeAll=()=>{objects.length=0};
 window.getElementAt=(x,y)=>[...objects].reverse().find(obj=>{
  if(obj instanceof Circle)return Math.hypot(x-obj.x,y-obj.y)<=obj.radius;
  if(obj instanceof Oval)return Math.abs(x-obj.x)<=obj.w/2&&Math.abs(y-obj.y)<=obj.h/2;
  if(obj instanceof Rectangle)return x>=obj.x&&x<=obj.x+obj.w&&y>=obj.y&&y<=obj.y+obj.h;
  return false;
 })||null;
 let clickFn=null,moveFn=null,keyFn=null;
 window.mouseClickMethod=fn=>{clickFn=fn};
 window.mouseMoveMethod=fn=>{moveFn=fn};
 window.keyDownMethod=fn=>{keyFn=fn};
 const coord=e=>{const rect=canvas.getBoundingClientRect();return {getX:()=> (e.clientX-rect.left)*canvas.width/rect.width,getY:()=> (e.clientY-rect.top)*canvas.height/rect.height}};
 canvas.addEventListener('pointerdown',e=>{canvas.focus();try{clickFn?.(coord(e))}catch(err){notify('error',err.message)}});
 canvas.addEventListener('pointermove',e=>{try{moveFn?.(coord(e))}catch(err){notify('error',err.message)}});
 document.addEventListener('keydown',e=>{try{keyFn?.({getKeyCode:()=>e.keyCode,getKey:()=>e.key,preventDefault:()=>e.preventDefault()})}catch(err){notify('error',err.message)}});
 window.setTimer=(fn,interval)=>{const id=setInterval(()=>{try{fn()}catch(e){notify('error',e.message);clearInterval(id)}},Math.max(15,Number(interval)||30));timers.set(fn,id);return id};
 window.stopTimer=fn=>{if(typeof fn==='number'){clearInterval(fn);return}const id=timers.get(fn);if(id!==undefined){clearInterval(id);timers.delete(fn)}};
 let frameCounter=0;
 const render=()=>{
  ctx.fillStyle='#f8fbfd';ctx.fillRect(0,0,canvas.width,canvas.height);
  for(const item of objects){try{item.draw(ctx)}catch(e){}}
  frameCounter++;if(frameCounter<1000000)requestAnimationFrame(render);
 };
 requestAnimationFrame(render);
 try{
  const symbols=['Rectangle','Circle','Oval','Line','Text','Color','Randomizer','add','remove','removeAll','getWidth','getHeight','getElementAt','mouseClickMethod','mouseMoveMethod','keyDownMethod','setTimer','stopTimer','println','print','readBoolean','readInt','readFloat','readLine'];
  const args=symbols.map(key=>window[key]);
  new Function(...symbols,userCode+'\nif(typeof start === "function")start();')(...args);
  notify('line','✓ Graphics started. Click the canvas or use the keyboard to interact.');
 }catch(error){notify('error',error.stack||error.message||String(error));}
}
window.createAIBottleGraphics=function(win,frame,code,write){
 const token='graphics-'+Math.random().toString(36).slice(2);
 const previous=frame.__graphicsMessageListener;
 if(previous)win.removeEventListener('message',previous);
 const onMessage=e=>{
   if(e.source!==frame.contentWindow||!e.data||e.data.kind!=='AI_BOTTLE_GRAPHICS'||e.data.token!==token)return;
   write((e.data.type==='error'?'✕ ':'')+e.data.text);
 };
 frame.__graphicsMessageListener=onMessage;
 win.addEventListener('message',onMessage);
 frame.setAttribute('sandbox','allow-scripts allow-modals');
 frame.setAttribute('referrerpolicy','no-referrer');
 const script='('+graphicsBoot.toString()+')('+JSON.stringify(String(code)).replace(/</g,'\\u003c')+','+JSON.stringify(token)+');';
 const csp="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; font-src data:; connect-src 'none'; form-action 'none'; base-uri 'none'";
 frame.srcdoc='<!doctype html><html><head><meta http-equiv="Content-Security-Policy" content="'+csp+'"><style>*{box-sizing:border-box}html,body{margin:0;background:#eef7f5}canvas{display:block;width:100%;height:auto;max-height:80vh;outline:none;touch-action:none}canvas:focus{box-shadow:inset 0 0 0 2px #37a9a8}</style></head><body><canvas id="graphics-canvas" width="440" height="285" tabindex="0"></canvas><script>'+script.replace(/<\/script/gi,'<\\/script')+'</script></body></html>';
 return ()=>{win.removeEventListener('message',onMessage);frame.__graphicsMessageListener=null;frame.srcdoc='';};
};
})();