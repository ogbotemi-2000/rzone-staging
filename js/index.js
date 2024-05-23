function onScroll(page, mthd, sTop, t) {
  !(t = onScroll).lastY&&(t.lastY=0), sTop = page.scrollY||page.scrollTop,
  mthd = cLs, window.topCta&&['show', 'relative', 'absolute']
  .forEach((e, i, a, cls)=>{(cls = topCta.classList)[mthd(heap = sTop < t.lastY)](e),
    i===2&&cls[mthd(!heap)](e), i===1&&cls[mthd(heap)](e)
  }),
  setTimeout(_=>t.lastY=sTop);
  return t.lastY/(page.scrollHeight||innerHeight)
}

/*
Used for development purposes only
*/

function minMax(obj, isRem, arr=['min','max'], vary, cnst, fn, str) {
  minMax.switch = fn = (value, isRem) =>isRem ? value*16 : value/16,
    
  arr.forEach((e, i, arr, max)=>{
    arr[i] = obj[e], max = arr[2+i] = obj['v'+e],
    !i ? vary = (obj[arr[1+i]] - arr[i])/(obj['v'+arr[i+1]] - max) : (cnst = (arr[i] - max * vary)/16, str = `clamp(${fn(arr[i-1], false)}rem, ${cnst.toFixed(3)}rem + ${(100*vary).toFixed(2)}vw, ${fn(arr[i], false)}rem ) `)
  });
  return str
}
