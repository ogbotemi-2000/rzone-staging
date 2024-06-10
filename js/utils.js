/*remove in production
save(new Blob(['<!DOCTYPE HTML>'+html.outerHTML], { type: 'text/html' }), location.pathname.split('/').pop())
*/
function save(blob, name, flag) {
    name = name || 'download';

    // Use native saveAs in IE10+
    if (typeof navigator !== "undefined") {
        if (/MSIE [1-9]\./.test(navigator.userAgent)) {
            alert('IE is unsupported before IE10');
            return;
        }
        if (navigator.msSaveOrOpenBlob) {
            // https://msdn.microsoft.com/en-us/library/hh772332(v=vs.85).aspx
            alert('will download using IE10+ msSaveOrOpenBlob');
            navigator.msSaveOrOpenBlob(blob, name);
            return;
        }
    }

    // Construct URL object from blob
    var win_url = window.URL || window.webkitURL || window;
    var url = win_url.createObjectURL(blob);

    // Use a.download in HTML5
    var a = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    if ('download'in a) {
        flag&&alert('Starting prompted download of auto-generated assets from '+window.location.href);
        a.href = url;
        a.download = name;
        a.dispatchEvent(new MouseEvent('click'));
        // Don't revoke immediately, as it may prevent DL in some browsers
        setTimeout(function() {
            win_url.revokeObjectURL(url);
        }, 500);
        return;
    }

    // Use object URL directly
    window.location.href = url;
    // Don't revoke immediately, as it may prevent DL in some browsers
    setTimeout(function() {
        win_url.revokeObjectURL(url);
    }, 500);
}
/*end*/



/*self contained component*/
function grow_shrink(e,i,c,n,d,k, cls){
  d=grow_shrink,n={500:'base',640:'sm',768:'md',1024:'lg',1280:'xl'},
  c=document.createElement("div"),
  !d.cached&&(d.cached={}),!d.arr&&(d.arr=[].slice.call((d.el=window.growShrink).querySelectorAll(".fluid"))),
  !d.dump&&(d.dump=d.el.querySelector("a+div>div")),
  (e=(k=Object.keys(n).filter((c,n)=>(i=n,c>e)))[0]), k = new RegExp(k.map(e=>n[e]+':show').join('|')),
  d.vw!==e&&!d.cached[d.vw=e]&&d.arr.forEach((n,r,o)=>{
    (n=n.cloneNode(!0)).classList.add(c.className=d.el.getAttribute('data-classname'));
    if(((cls=n.classList)+'').match(k)) cls.remove('clicked'), (cls+'').replace(/(base|sm|md|lg|xl):show/, function(a) {
      cls.remove(a, 'fluid')
    }), /* n.className=l?"clicked":"",*/ c.appendChild(n), !d.cached[e]&&(d.cached[e]=c)
  }),d.dump.replaceChild(d.cached[e]||c,d.dump.firstChild)}

window.addEventListener('DOMContentLoaded', _=>{
  window.growShrink&&(grow_shrink(innerWidth), window.onresize=_=>grow_shrink(innerWidth))
});

/*end*/


/*globals*/
(objWalk.setDict =function(arr){
  objWalk.dict||={};
  if(arr) for(let str, val, i = arr.length; i;  str=(val=arr[--i]).charAt(0), val.replace(/[A-Z]/g, _=>str+=_), objWalk.dict[str]=val);
})(['classList', 'previousSibling', 'nextSibling',  'lastChild', 'firstChild', 'nextElementSibling', 'previousElementSibling', 'parentNode', 'lastElementChild', 'childNodes', 'firstElementChild']);

const xhr=new XMLHttpRequest,w=window, d=document, F=Function,prot =obj=>obj.prototype,prot_F=prot(F),
mDize =obj=>prot_F.call.bind(obj),O=Object,prot_O = prot(O),_toString = mDize(prot_O.toString),
  A = Array, prot_A = prot(A), cLs =cnd=>cnd?'add':'remove',
  slice = mDize(prot_A.slice),
  cloneNode = mDize(d.cloneNode),
  H = HTMLElement,prot_H=prot(H),
  gC = w.getComputedStyle, S = Set, M = Math, N = Number, R = RegExp, qsa=domstr=>slice(d.querySelectorAll(domstr)),
  qs=domstr=>d.querySelector(domstr), html = d.documentElement, getStyle=(el, prop)=>gC(el)[prop],
  promisify=cb=>new Promise(resolve=>setTimeout(_=>resolve(cb()))), map = mDize([].map), forEach=mDize([].forEach);

  function Is(entity, type) {
      let a = entity==void 0?_toString(entity).replace(/\[object |\]/g ,''):entity.constructor.name
      return (type?(type === a || a.toUpperCase()===type.toUpperCase()):a)
	}
  function objWalk(e,a,logStack) {
    let errs=[], trace=[], is_a=Is(a), and=_=>_!==void 0&&_, dict=objWalk.dict;
   
    objWalk.walk_arr=function(e,a,logStack){let i=0; if(Is(a,'Array')) for(let val, j=a.length; (e=Is(val=dict[a[i]]||a[i],'Object')?this.walk_obj(e,val):and(e[val])||(logStack&&errs.push(`${e[dict[a[i-1]]||a[i-1]]} for ${dict[a[i-1]]||a[i-1]} at index ${i-1}`),e))&&(i++, i<j);); return e},
     //[...Is(a[key],'string')?[a[key]]:a[key]].forEach(_=>e=e[_]||(e)) was where ▶ is at.
    objWalk.walk_obj=function(e,a,logStack){if(Is(a,'object')) for(let key in a) for(let val, j=+key; j--;) e=Is(val=dict[a[key]]||a[key],'String')?and(e[val])||e:this.walk_arr(e,val, logStack)/*▶*/; return e};
   
    switch(is_a) {
      case 'Object':
        e=objWalk.walk_obj(e,a,logStack)
      break;
      case 'Array':
        e=objWalk.walk_arr(e,a,logStack)
      break;
      case 'String':
        e=e[dict[a]]||e[a]
      break
    }
    return logStack?{e,errs}:e
  }
  function relation(parent, child) {
      return [parent.compareDocumentPosition(child)&Node.DOCUMENT_POSITION_CONTAINED_BY,
              parent.compareDocumentPosition(child)&Node.DOCUMENT_POSITION_CONTAINS]
  }
async function makeAwait(entity) {
    return await (entity&&entity.call?entity():entity)
}
function byteFormat(num, res='') {
  if(num<1024) {
    res = num+' bytes';
  } else if(1024<=num&&num<1048576) {
    res += num/1024,
    res = res.slice(0, res.indexOf('.')+3) /*3-1 dp*/+' KB'
  } else {
    res += num/1048576,
    res = res.slice(0, res.indexOf('.')+3) /*3-1 dp*/+' MB'
  }
  return res
}
function toggleTooltip(nodes, index, len) {
   if(len=nodes.length) {
    for(let i = len; i--; ) nodes[i].classList[i==index?'add':'remove']('show');
  }
}
function hrTransit(ctx, index, pad, other, dir, recondex, cped) {
 cped = (hrTransit.recon ||= [[], []]);
 if(ctx) {
  index = +index;
  hrTransit.ctx !== ctx &&(hrTransit.ctx = ctx, hrTransit.arr=map(ctx.querySelectorAll('span >hr'),
(e, i, a, _, _1)=>(!((hrTransit.values||=[])[i]=+(_=((hrTransit.hrs||=[])[i]=e).style).getPropertyValue('--tw-translate-x').replace('%', ''))&&(hrTransit.index=i), _))),
  other = hrTransit.index;
  if(hrTransit.index!==index) {
   dir = (hrTransit.index <index ? '' : '-')+`${110+(pad||'')}%`,
   hrTransit.hrs[other].ontransitionend=function() {
    hrTransit.arr[other].setProperty('--tw-translate-x', dir),
    this.ontransitionend = hrTransit.arr[index].setProperty('--tw-translate-x', '0%'),
        hrTransit.arr.forEach((e, i, arr)=>{
         i !==index &&(
            e.setProperty('--tw-translate-x', (i >index?'-':'')+`${110+(pad||'')}%`)
          )
        })
   },
   hrTransit.arr[other].setProperty('--tw-translate-x', dir),
   hrTransit.index = index,
   cped[0][recondex]===ctx &&(cped[1][recondex] = index)
  }
 }
}

function minMax(obj, isRem, arr=['min','max'], vary, cnst, fn, str) {
  minMax.switch = fn = (value, isRem) => isRem ? value*16 : value/16,
    
  arr.forEach((e, i, arr, max)=>{
    arr[i] = obj[e], max = arr[2+i] = obj['v'+e],
    !i ? vary = (obj[arr[1+i]] - arr[i])/(obj['v'+arr[i+1]] - max) : (cnst = (arr[i] - max * vary)/16, str = `clamp(${fn(arr[i-1], false)}rem, ${cnst.toFixed(3)}rem + ${(100*vary).toFixed(2)}vw, ${fn(arr[i], false)}rem ) `)
  });
  return str
}
function rAF(callback, anim, time, store, _cb) {
  /* cAF(rAF.interval) prevents dangerous clogging but left to be handled by implementations */
  rAF.interval = (rAF.kept=(store=w.requestAnimationFrame)||
  (anim?setInterval:setTimeout))(_cb=_=>{
	anim
    ? store&&(rAF.interval = store(_cb))
     : clearTimeout(rAF.interval),
     (!anim&&+time)?_=setTimeout(_1=>callback(_), time):callback(rAF.interval)
  }, 1000/60);
  return rAF
}
function getIndexes(arr, chks, indxs=[]) {
  chks = typeof chks === 'string'?[chks]:chks;
  for(let i=0,j=arr.length; i<j; chks.find(e=>e===arr[i])!=void 0&&indxs.push(i), i++);
  return indxs
}
