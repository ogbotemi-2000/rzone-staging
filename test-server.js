const express = require('../express'),
      app     = express(),
      fs      = require('fs'),
      path    = require('path'),
      argv    = process.argv.slice(2),
      check   = (a, o, i)=>a[i]?.match(o[i/2]),
      defs    = ['./', 3000, './'],
      options = ['-a', '-p', '-d'],
      values  = {},
      msgs    =[];

defs.map((e, i)=>values[options[i]]=e);

for(let i = 0, arr=[], value, len=argv.length, match=_=>(_=_.match(rgx), _&&_[0]), rgx=new RegExp('^('+options.join('|')+')'); i < len;) {
  if(value=match(argv[i])) len&1&&match(argv[i+1])&&argv.splice(i, 1, ...[value, values[value]]), values[value]=path.normalize('./'+argv[i+1]);
  i+=2
};

/* slot in placeholder values here */
values['-a']==='_'&&(msgs.push(`-a :: replacing placeholder '_' with the value - '${values['-d']}' passed to -d`), values['-a'] = values['-d']),


/* check whether specified folder(s) exist and provide a default fallback otherwise */

['-d', '-a'].forEach(e=>{
  !fs.existsSync(values[e])&&(msgs.push(`${e}, :: ${values[e]}, is not a directory, defaulting to ${values[e]='./'}`))
}),
msgs.forEach(e=>console.log(e));

let served;

//Uncomment if serving files via this test-server

app.get('/', (req, res)=> {  
  served = values['-d']+'/' +req.query['f'],
  served = fs.existsSync(served)?served:(values['-d']+'/index.html'),
  console.log('/ endpoint', served),
  res.sendFile(served, {root:'./'})
}),

app.use(express.static(path.normalize(values['-a'])));

let port;
app.listen(port=+values['-p'], function() {
  console.log('Server listening on <PORT>', port, 'under <DIRECTORY>', values['-d'], 'and serving assets from <DIRECTORY>', values['-a']);
})
