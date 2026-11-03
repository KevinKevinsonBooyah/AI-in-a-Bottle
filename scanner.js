/* Code Scanner for AI in a Bottle.
   Browser-only execution: it does not invoke an OS shell or access your Gemini key. */
(function(){
"use strict";
window.setupCodeScanner=function(win,root,traceCode){
  const doc=win.document;
  const q=id=>root?root.querySelector('#'+id):doc.getElementById(id);
  if(!q('scanLang')||q('scanLang').dataset.bound==='1')return;
  q('scanLang').dataset.bound='1';

  const samples={
    javascript:'var booleanIceCream = readBoolean("Do you like ice cream? ");\n\nif (booleanIceCream) {\n  println("Nice! Me too!");\n} else {\n  println("That\'s okay!");\n}',
    'javascript-graphics':'function start() {\n  var ocean = new Rectangle(getWidth(), getHeight());\n  ocean.setColor("#a6f2e3");\n  add(ocean);\n  var sun = new Circle(35);\n  sun.setPosition(105, 70);\n  sun.setColor(Color.yellow);\n  add(sun);\n  var text = new Text("Ahoy, JavaScript Graphics!", "18px Arial");\n  text.setPosition(28, 160);\n  add(text);\n}',
    html:'<h2>Ship log</h2>\n<p>This HTML runs inside a separate sandbox.</p>\n<button onclick="this.textContent=\'Clicked!\';">Click me</button>',
    css:'body { background: #e8fbf6; font-family: sans-serif; }\nh2 { color: #08776d; letter-spacing: 2px; }\nbutton { background: #076d74; color: white; padding: 9px; border: 0; border-radius: 6px; }',
    typescript:'const greet = (name: string): string => "Ahoy, " + name + "!";\nconsole.log(greet("captain"));\nconst x: number[] = [1, 2, 3];\nconsole.log(x.map(n => n*n));',
    python:'print("Ahoy from Python!")\nfor n in range(1, 4):\n    print(n, "squared =", n*n)',
    sql:"CREATE TABLE IF NOT EXISTS crew(name TEXT, rank TEXT);\nDELETE FROM crew;\nINSERT INTO crew VALUES ('Ada','Captain'),('Lin','Navigator');\nSELECT * FROM crew;",
    json:'{\n  "ship": "AI in a Bottle",\n  "crew": ["Ada", "Lin"],\n  "ready": true\n}',
    pseudo:'x ← 3\nREPEAT 4 TIMES\n{\n  x ← x + 2\n}\nDISPLAY(x)'
  };
  const help={
    javascript:'JavaScript Console: console.log, println, print, readBoolean, readLine, readInt and readFloat work. Input questions with quoted prompts are asked before the sandbox runs. Stoppable, no network.',
    'javascript-graphics':'JavaScript Graphics: CodeHS-style Rectangle, Circle, Line, Oval, Text, add(), Color, mouseClickMethod(), setTimer() and more. Runs in a sandboxed canvas.',
    html:'HTML preview: renders a separate sandboxed webpage. Code cannot access AI in a Bottle or its API key.',
    css:'CSS preview: see your styles applied to a sample webpage, without changing the AI app.',
    typescript:'TypeScript: downloads a compiler on first use, compiles to JavaScript and runs in the console.',
    python:'Python: downloads Pyodide and its WebAssembly runtime on first use. No system installation.',
    sql:'SQL: downloads a SQLite WebAssembly runtime on first use. Tables exist only while the popup remains open.',
    json:'JSON: validate structure and view a pretty-printed result. No code execution.',
    pseudo:'AP CSP pseudocode: follow assignments, DISPLAY, and REPEAT n TIMES blocks.'
  };
  let current=null,limitTimer=null,sequence=0,stopGraphics=null;
  const workers=Object.create(null);
  function output(line){
    const box=q('scanOutput'),original=box.textContent;
    if(original.startsWith('Ready.')||original.startsWith('Console cleared.'))box.textContent='';
    box.textContent+=(box.textContent?'\n':'')+String(line);
    if(box.textContent.length>26000)box.textContent=box.textContent.slice(-22000);
    box.scrollTop=box.scrollHeight;
  }
  function busy(yes){
    q('scanRun').disabled=yes;
    q('scanStop').disabled=!yes;
    q('scanLang').disabled=yes;
  }
  function endRun(){
    if(limitTimer){win.clearTimeout(limitTimer);limitTimer=null;}
    if(current){
      const type=current.language;
      current=null;
      if(type==='javascript'){
        try{workers.javascript?.terminate();}catch(e){}
        delete workers.javascript;
      }
    }
    busy(false);
  }
  function stopRun(silent){
    if(stopGraphics){try{stopGraphics()}catch(e){}stopGraphics=null;if(!silent)output('■ Graphics stopped.');busy(false);return;}
    if(limitTimer){win.clearTimeout(limitTimer);limitTimer=null;}
    if(current){
      const type=current.language;
      try{current.worker.terminate();}catch(e){}
      delete workers[type];
      current=null;
      if(!silent)output('■ Sandbox stopped.');
    }
    busy(false);
  }
  win.__aiBottleStopScanner=()=>stopRun(true);

  function workerProgram(){
    let py=null,sqlite=null,db=null,tsReady=false;
    const post=(id,type,text)=>self.postMessage({id,type,text:String(text)});
    const show=x=>{
      if(typeof x==='string')return x;
      if(x===undefined)return 'undefined';
      if(x instanceof Error)return x.stack||x.message;
      try{return JSON.stringify(x,null,2)??String(x);}catch(e){return String(x);}
    };
    self.addEventListener('message',async event=>{
      const data=event.data||{},id=data.id,lang=data.lang,code=String(data.code||''),inputs=Array.isArray(data.inputs)?data.inputs.slice():[];
      try{
        if(lang==='javascript'||lang==='typescript'){
          let program=code;
          if(lang==='typescript'){
            if(!tsReady){
              post(id,'line','Loading TypeScript compiler…');
              importScripts('https://cdnjs.cloudflare.com/ajax/libs/typescript/5.9.3/typescript.min.js');
              tsReady=true;
            }
            const compiled=self.ts.transpileModule(code,{compilerOptions:{
              target:self.ts.ScriptTarget.ES2020,module:self.ts.ModuleKind.None},reportDiagnostics:true});
            const errors=(compiled.diagnostics||[]).filter(d=>d.category===self.ts.DiagnosticCategory.Error);
            if(errors.length)throw Error(errors.map(d=>self.ts.flattenDiagnosticMessageText(d.messageText,' ')).join('\n'));
            program=compiled.outputText;
          }
          // Restrict networking in the user JavaScript/TypeScript console.
          try{self.fetch=()=>Promise.reject(Error('Network requests are disabled in the JavaScript console.'));}catch(e){}
          try{self.XMLHttpRequest=undefined;self.WebSocket=undefined;self.EventSource=undefined;}catch(e){}
          try{self.importScripts=()=>{throw Error('External imports are disabled in this console.');};}catch(e){}
          const capture={};
          for(const kind of ['log','info','warn','error','debug','table']){
            capture[kind]=(...args)=>post(id,'line',(kind==='warn'?'⚠ ':kind==='error'?'✕ ':'')+args.map(show).join(' '));
          }
          self.console=capture;
          const nextInput=(type)=>{
            const x=inputs.shift();
            if(!x||x.kind!==type)throw Error('Input missing for '+type+'. Use a quoted prompt such as readBoolean("Yes or no?") and run again.');
            return x.value;
          };
          const readBoolean=()=>Boolean(nextInput('readBoolean'));
          const readLine=()=>String(nextInput('readLine'));
          const readInt=()=>Number(nextInput('readInt'));
          const readFloat=()=>Number(nextInput('readFloat'));
          const println=(...args)=>post(id,'line',args.map(show).join(' '));
          const print=(...args)=>post(id,'line',args.map(show).join(' '));
          const Randomizer={
            nextInt:(min,max)=>Math.floor(min+Math.random()*(max-min+1)),
            nextBoolean:()=>Math.random()<0.5,
            nextFloat:(min,max)=>min+Math.random()*(max-min),
            nextColor:()=>['red','green','blue','orange','purple'][Math.floor(Math.random()*5)]
          };
          const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
          const trimmed=program.trim();
          let executor=null;
          // A console also evaluates single expressions such as 2+2 and Math.sqrt(16).
          if(trimmed&&!/[;\n]/.test(trimmed)&&!/^(?:const|let|var|function|class|if|for|while|try|switch|throw|return|import|export)\b/.test(trimmed)){
            try{executor=new AsyncFunction('console','println','print','readBoolean','readLine','readInt','readFloat','Randomizer','return ('+trimmed+');');}catch(e){}
          }
          if(!executor)executor=new AsyncFunction('console','println','print','readBoolean','readLine','readInt','readFloat','Randomizer',program);
          const answer=await executor(capture,println,print,readBoolean,readLine,readInt,readFloat,Randomizer);
          if(answer!==undefined)post(id,'line','↳ '+show(answer));
        }else if(lang==='python'){
          if(!py){
            post(id,'line','Loading Python (Pyodide)…');
            importScripts('https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js');
            py=await self.loadPyodide({indexURL:'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/'});
          }
          py.setStdout({batched:x=>post(id,'line',x)});
          py.setStderr({batched:x=>post(id,'line','⚠ '+x)});
          const result=await py.runPythonAsync(code);
          if(result!==undefined&&result!==null&&String(result)!=='None')post(id,'line','↳ '+show(result));
          try{result?.destroy?.();}catch(e){}
        }else if(lang==='sql'){
          if(!sqlite){
            post(id,'line','Loading SQLite…');
            importScripts('https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.13.0/sql-wasm.js');
            sqlite=await self.initSqlJs({locateFile:file=>'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.13.0/'+file});
            db=new sqlite.Database();
          }
          const tables=db.exec(code);
          if(!tables.length)post(id,'line','✓ Statement finished. No rows returned.');
          for(const table of tables){
            post(id,'line',table.columns.join(' | '));
            for(const row of table.values.slice(0,120))post(id,'line',row.map(show).join(' | '));
            if(table.values.length>120)post(id,'line','… '+(table.values.length-120)+' more rows');
            post(id,'line','✓ '+table.values.length+' row(s)');
          }
        }else throw Error('Unsupported language');
      }catch(error){post(id,'error',error?.stack||error?.message||error);}
      finally{post(id,'done','');}
    });
  }
  function obtainWorker(lang){
    if(workers[lang])return workers[lang];
    const script='('+workerProgram.toString()+')();';
    const blobUrl=win.URL.createObjectURL(new win.Blob([script],{type:'text/javascript'}));
    try{
      workers[lang]=new win.Worker(blobUrl);
      return workers[lang];
    }finally{win.setTimeout(()=>win.URL.revokeObjectURL(blobUrl),8000);}
  }
  function collectConsoleInputs(code){
    const inputs=[];
    const matcher=/\b(readBoolean|readLine|readInt|readFloat)\s*\(\s*(['"])(.*?)\2\s*\)/g;
    let m;
    while((m=matcher.exec(code))){
      if(inputs.length>=30)throw Error('Too many input questions in one run (maximum 30).');
      const kind=m[1],message=m[3].replace(/\n/g,'\n');
      let answer=null,valid=false;
      for(let tries=0;tries<5&&!valid;tries++){
        answer=win.prompt(message+(kind==='readBoolean'?' (true/false or yes/no)':''),kind==='readBoolean'?'yes':'');
        if(answer===null)throw Error('User input cancelled.');
        answer=String(answer).trim();
        if(kind==='readBoolean'){
          if(/^(?:yes|y|true|1)$/i.test(answer)){answer=true;valid=true;}
          else if(/^(?:no|n|false|0)$/i.test(answer)){answer=false;valid=true;}
        }else if(kind==='readInt'){
          valid=/^-?\d+$/.test(answer)&&Number.isSafeInteger(Number(answer));if(valid)answer=Number(answer);
        }else if(kind==='readFloat'){
          valid=answer!==''&&Number.isFinite(Number(answer));if(valid)answer=Number(answer);
        }else valid=true;
      }
      if(!valid)throw Error('Invalid answer for '+kind+' after five tries.');
      inputs.push({kind,value:answer});
    }
    return inputs;
  }
  function run(){
    if(current||stopGraphics)return;
    const lang=q('scanLang').value,code=q('scanInput').value;
    q('scanOutput').textContent='';
    q('scanPreviewWrap').hidden=true;
    if(!code.trim()){output('Enter some code first.');return;}
    if(code.length>50000){output('Code limit: 50,000 characters.');return;}
    if(lang==='json'){
      try{output('✓ Valid JSON\n'+JSON.stringify(JSON.parse(code),null,2));}
      catch(e){output('✕ '+e.message);}
      return;
    }
    if(lang==='pseudo'){
      try{output(traceCode(code));}catch(e){output('✕ '+e.message);}
      return;
    }
    if(lang==='javascript-graphics'){
      if(typeof window.createAIBottleGraphics!=='function'){output('JavaScript Graphics needs graphics.js beside the HTML page.');return;}
      q('scanPreviewWrap').hidden=false;
      busy(true);
      stopGraphics=window.createAIBottleGraphics(win,q('scanPreview'),code,output);
      output('▶ JavaScript Graphics canvas running. Press Stop to clear it.');
      return;
    }
    if(lang==='html'||lang==='css'){
      // srcdoc has an opaque origin: no allow-same-origin, no access to this application's storage.
      const policy='<meta http-equiv="Content-Security-Policy" content="default-src \'none\'; img-src data:; font-src data:; style-src \'unsafe-inline\'; script-src \'unsafe-inline\'; connect-src \'none\'; form-action \'none\'; base-uri \'none\'">';
      const documentText=lang==='css'?
        '<!doctype html><html><head>'+policy+'<style>'+code+'</style></head><body><h2>Sample webpage</h2><p>This is your CSS preview.</p><button>Sample button</button></body></html>':
        '<!doctype html><html><head>'+policy+'</head><body>'+code+'</body></html>';
      q('scanPreview').srcdoc=documentText;
      q('scanPreviewWrap').hidden=false;
      output('✓ '+(lang==='html'?'HTML':'CSS')+' preview running in an isolated frame. External network access is blocked.');
      return;
    }
    if(!win.Worker){output('Your browser cannot run Worker-based code.');return;}
    let runner;
    try{runner=obtainWorker(lang);}catch(e){output('✕ Cannot start code runner: '+e.message);return;}
    let inputs=[];
    if(lang==='javascript'||lang==='typescript'){
      try{inputs=collectConsoleInputs(code);}catch(e){output('Input cancelled: '+e.message);return;}
    }
    const id=++sequence;
    current={id,language:lang,worker:runner};
    busy(true);
    output('▶ Running '+q('scanLang').selectedOptions[0].textContent+'…');
    runner.onmessage=event=>{
      const data=event.data||{};
      if(!current||current.id!==data.id||current.worker!==runner)return;
      if(data.type==='line')output(data.text);
      if(data.type==='error')output('✕ '+data.text);
      if(data.type==='done'){output('✓ Finished');endRun();}
    };
    runner.onerror=event=>{
      event.preventDefault?.();
      output('✕ Runner error: '+(event.message||'Could not load. The school network may block a runtime.'));
      stopRun(true);
    };
    limitTimer=win.setTimeout(()=>{
      output('■ Time limit reached. Sandbox stopped.');
      stopRun(true);
    },lang==='python'||lang==='sql'?120000:20000);
    try{runner.postMessage({id,lang,code,inputs});}
    catch(e){output('✕ '+e.message);stopRun(true);}
  }

  function selectExample(){
    const lang=q('scanLang').value;
    q('scanInput').value=samples[lang]||'';
    q('scanHint').textContent=help[lang]||'';
    q('scanPreviewWrap').hidden=true;
    q('scanPreview').setAttribute('sandbox','allow-scripts');
    q('scanOutput').textContent='Ready. Choose Run code when you want to test '+lang+'.';
  }
  q('scanRun').addEventListener('click',run);
  q('scanStop').addEventListener('click',()=>stopRun(false));
  q('scanExample').addEventListener('click',selectExample);
  q('scanLang').addEventListener('change',selectExample);
  q('scanClear').addEventListener('click',()=>{q('scanOutput').textContent='Console cleared.';});
  q('scanCopy').addEventListener('click',async()=>{
    try{
      await win.navigator.clipboard.writeText(q('scanOutput').textContent);
      q('scanCopy').textContent='Copied!';
      win.setTimeout(()=>{q('scanCopy').textContent='Copy';},1300);
    }catch(e){output('Clipboard unavailable. Select the text and copy manually.');}
  });
  q('scanInput').addEventListener('keydown',event=>{
    if(event.key==='Tab'){
      event.preventDefault();
      const el=event.target;
      el.setRangeText('  ',el.selectionStart,el.selectionEnd,'end');
    }else if(event.key==='Enter'&&(event.ctrlKey||event.metaKey)){
      event.preventDefault();run();
    }
  });
};
})();