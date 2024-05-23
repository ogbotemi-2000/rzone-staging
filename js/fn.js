let fs = require('fs')

//temporary
rAF =_=>_, cAF=rAF;

/* new, better algorithm for restruct */


let loop = function(str, props, from, to, cb) {
  len=str.length,
  from = Math.abs(props['from'])||0, to = Math.abs(props['to'])||0, cb = props['cb'];
  if(typeof cb !== 'function') cb =_=>!!0;
  let result = [''], has=!0, reach, down = props['back'];
  if(down) { if(from>len) from=len-1; to=from-to;}
  reach=from+to;

  for(; !cb(str, from, to, result)&&(to?from < reach:has);) {
    result[0] += (has=str.charAt(result[1] = down?from--:from++))||'';

    if(down&&to===from) break;
  }
  if(down) result[0] = result[0].split('').reverse().join(''), result[1] &&= ++result[1];
  return result
},
/* i+=2 below because two characters - /* delimit the start of multi-line comments */
storeComments=(i, s, arr)=>(loop(s, {from:i, cb:(s,f,t,r)=>s.charAt(f++)+s.charAt(f)==='*/'&&(i=f, arr.push(r[0]+'*/'), !0) }), i),
getStyleRule = (fr, s, slctr, exit)=>(slctr=[], loop(s, {from:fr, cb:to=>{

  if(s[fr--]==='}') { return exit = true; }
  else if(s[fr-1]+s[fr] === '*/') for(fr-=2; s[fr]+s[--fr] !=='*/'&&fr; );
  else {
    to = s[fr]||'';
    if(to) slctr.push(to.replace('}', '')), slctr[0]==='*'&&(slctr[0]+='/');
    else return true;
  }
}, back:true}), [slctr.reverse().join('').trim(), ++fr, exit]),
separateProperties=(res, in_bracket, arr=[], prop = '', incr=0)=>(loop(res, {from:0, cb:(_, _f)=>{
  prop +=_=res[_f]||'';
  if(_==='(' ) in_bracket=_;
  else if(_===')') in_bracket=false;
  
  if(!in_bracket&&prop) {
    if(_===';'||!res[_f]) arr[incr++]=prop, prop='';
  }
}}), arr);

function fn(str, input, fast, callbacks, result) {
  let base = {comments:[], indexes:[]};

  if(input&&(input=(input.__proto__===Array.prototype?input:[input]).filter(e=>e)).length) {
    let css='', once = 1, i = 0,
    len = str.length, self = fn, result = self.result ||= {}, rgx, end=id=>(input.forEach((e, res)=>{
      (res = result[e])&&(res.loopedThrough=!0);
      if(!res.matched.length) {
        delete res
      }
    }), clearInterval(id), self.index = i, callbacks&&typeof callbacks['end']==='function'&&callbacks['end'](i, result, input), 0);

    for(let decr=input.length, j; decr--;) {
      j=input[decr], (result[j] ||= (self.index = i = 0, {matched:[], selectors:[], indexes:[]}));
      if(!(result[j]&&result[j].loopedThrough)) (rgx||=[]).push(j);
    }
    rgx &&= new RegExp('('+rgx.join('|')+')');
    for(let canAdd=!0, at_rule='', res='', sel_ind=0, sel_prop='', el; (once||(fast&&i<len))||fast&&end();) {

      if(!self.__loop) self.__loop = id => {

        if(!(i<len)) end(id);
        callbacks&&typeof callbacks['progress']==='function'&&callbacks['progress'](i, result, input);
        // setting once below to 0 prevents an infinite loop
        once = 0, el = str.charAt(i);
        /* prioritize comments by matching them first */
        if(el+str.charAt(i+1)==='/*') canAdd=false, el = str.charAt(i = storeComments(i, str, base.comments));

        if(el==='@') at_rule +=el, loop(str, {from:i, cb:(s, f, t, r, nc)=>{
          /*nc means near comment*/
          f=i++;
          if(loop(s,{from:i,to:2})[0]==='/*') nc=true, i=storeComments(i, s, base.comments);
          !nc&&(at_rule+=s.charAt(i))
          /*increment i below so str.charAt(i) points the character after the '{' or ';' of an @-rule*/
          if(/\{|;/.test(s.charAt(i+1))) { css+=at_rule, at_rule+=(s.charAt(i+1)===';'?';':''); return true }
        }});

        if(el==='{'||str.charAt(i+1)==='{') canAdd=false, css+=el.replace('@', ''), loop(str, {from:i, cb:(s,f,nc,r)=>{
          f=i++;
          if(loop(s,{from:i,to:2})[0]==='/*') nc=true, i=storeComments(i, s, base.comments);
          !nc&&(css+=s.charAt(i))
          if(s.charAt(i)==='}') {
            let sp=res.split('{').filter(e=>e), style=sp[sp.length-1];
            style.replace(rgx, (a, _res)=>{
              console.log(style.trim())
            }), res='';
            return true
          } else !nc&&(res+=s.charAt(i));
        }});

        if(at_rule&&/\}|;/g.test(el)) loop(str, {from:i, cb:(s, f)=>{
            if(/\}|;/g.test(s.charAt(f))) {
              // /*grab at_rule here*/console.log('@-rule', at_rule)
              i=f, at_rule=''; return true
            }
          }
        });
        canAdd&&(css +=at_rule?el.replace('@', ''):el), 
        canAdd=true;
        i++;
      };
      fast&&self.__loop(),
      !fast&&rAF(self.__loop, true)
    }
    // console.log(base),
    fs.writeFile('dump.txt', css, console.log)
  }
  return result
}

console.time();

let result = fn(str=`/*starter comment*//*immediately follows*/:root{--variable:value}
html {
  scroll-behaviour: smooth;
}
.w-1\/2 {
  content-visibility: visible;
  width: 50%
}
@media (min-/*parse error comment*/width: 500px)/*troublesome comment?*/{
  [close]{
    visibility: hidden
  }
  .opaque {
    opacity: 1
  }
  .color {color: auto; background:inherit;border-color: unset;}
  hidden {
    d/*too close for comfort*//*parse-breaking comment*//*closer still*/isplay:none;
  }.bg-unset{
    background-color: unset 
  }
}
@keyframes spin{
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
after-at-rule {
  css-lvl-1: value
}
.selector {
  <property>:<value>;
}.wireframe {
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAICAYAAAA4GpVBAAAAAXNSR0IArs4c6QAAABRJREFUGFdj+P///38GdOLgdnQxAHSiH1tWgHpMAAAAAElFTkSuQmCC);
  color: black
}
/*comments before @-rule*/@import(font/*comment in @ rule css*/.woff2)/*comment after @-rule*/;
@page (media:print) {
  html * {
    border: 2px double black;
  }
}`
//.trim().replace(/\n+|\t+/g, '').replace(/\s+/g, ' ')
, ['deg','or'], true);

console.timeEnd()

console.log(result)