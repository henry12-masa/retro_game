import { writeFileSync, existsSync, readFileSync } from "node:fs";
const UA={"User-Agent":"game-curation-catalog/1.0 (personal site; contact via napoblog.com)"};
const pages=JSON.parse(readFileSync("pages.json","utf8"));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
for (const [pf,list] of Object.entries(pages)) for (const t of list){
 const f=`html/${t.replace(/[\/:*?"<>| ]/g,"_")}.html`; if(existsSync(f)) continue;
 let ok=false;
 for(let i=0;i<6&&!ok;i++){ const r=await fetch(`https://ja.wikipedia.org/w/api.php?action=parse&prop=text|revid&format=json&formatversion=2&page=${encodeURIComponent(t)}`,{headers:UA}); const s=await r.text();
  if(s.startsWith("{")){ const j=JSON.parse(s); if(j.error){console.log("ERR",t,j.error.code);ok=true;break;} writeFileSync(f,j.parse.text); console.log(pf,t,j.parse.text.length,j.parse.revid); ok=true;} else await sleep(5000*(i+1)); }
 await sleep(1500);
}
