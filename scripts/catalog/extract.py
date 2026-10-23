import json, re, unicodedata
from collections import Counter, defaultdict
out=json.load(open('tables.json',encoding='utf-8'))
DATE_H=('発売日','配信開始日','配信日','配布日','当初の発売日','提供時期')
def clean(s):
    s=re.sub(r'\s+',' ',s.replace('　',' ')).strip()
    s=re.sub(r'\s*/\s*$','',s)
    return s
def grid(rows):
    g=[];pending={}
    for r in rows:
        row=[];ci=0;it=iter(r)
        cells=list(r);k=0
        while k<len(cells) or ci in pending:
            if ci in pending:
                txt,left,th=pending[ci]; row.append((txt,th))
                if left<=1: del pending[ci]
                else: pending[ci]=(txt,left-1,th)
                ci+=1; continue
            c=cells[k];k+=1
            for _ in range(c['cs']):
                row.append((c['t'],c['th']))
                if c['rs']>1: pending[ci]=(c['t'],c['rs']-1,c['th'])
                ci+=1
        g.append(row)
    return g
res=defaultdict(list); stats=Counter(); skipped=Counter()
for pf,tbs in out.items():
    for tb in tbs:
        rows=tb['rows']
        if not rows: continue
        g=grid(rows)
        hdr=[clean(t) for t,th in g[0]]
        if not hdr or not any(h in DATE_H for h in hdr[:1]): continue
        try: ti=next(i for i,h in enumerate(hdr) if h.startswith('タイトル') or h.startswith('作品名'))
        except StopIteration: continue
        pi=next((i for i,h in enumerate(hdr) if h.startswith('発売元') or h.startswith('オリジナルブランド')),None)
        heads=' '.join(h for _,h in tb['heading'])
        dl = hdr[0].startswith('配信') or 'ダウンロード' in heads or '配信' in heads
        free = hdr[0] in ('配布日',) or any(w in heads for w in ('体験版','非売品','発売中止','発売日未定','その他','Xbox用タイトル','ダウンロードコード版'))
        if free: continue
        ctxyear=None
        m=re.findall(r'(\d{4})年',heads) or re.findall(r'\((\d{4})年',tb['page'])
        if m: ctxyear=int(m[-1])
        for row in g[1:]:
            if len(row)<=ti or row[0][1] and row[ti][1]: continue
            d=clean(row[0][0]); t=clean(row[ti][0]); p=clean(row[pi][0]) if pi is not None and len(row)>pi else ''
            if not t or t in hdr: continue
            m2=re.match(r'^(.*?[ぁ-んァ-ヶ一-龥ー].*?)\s+/\s+[ -~’À-ɏ]+$',t)
            if m2: t=m2.group(1).strip()
            t=re.sub(r'\s*[*＊]+$','',t)
            p=re.sub(r'\s*/\s*.*$','',p) if ' / ' in p else p
            y=re.search(r'(\d{4})年',d); md=re.search(r'(\d{1,2})月(\d{1,2})日',d); mm=re.search(r'(\d{1,2})月',d)
            year=int(y.group(1)) if y else ctxyear
            if not year: skipped[pf]+=1; continue
            date=f"{year:04d}-{int(md.group(1)):02d}-{int(md.group(2)):02d}" if md else (f"{year:04d}-{int(mm.group(1)):02d}" if mm else f"{year:04d}")
            res[pf].append({'t':t,'d':date,'p':p,'dl':dl})
# dedupe
final={}
for pf,lst in res.items():
    seen=set();L=[]
    for e in lst:
        k=(unicodedata.normalize('NFKC',e['t']).lower(),e['d'][:7],e['dl'])
        if k in seen: continue
        seen.add(k);L.append(e)
    L=[e for e in L if e['d']<='2026-10-23' and not (len(e['d'])==4 and e['d']>='2026') and not (len(e['d'])==7 and e['d']>'2026-10')]
    L.sort(key=lambda e:(e['d'],e['t']))
    final[pf]=L
json.dump(final,open('catalog.json','w',encoding='utf-8'),ensure_ascii=False)
tot=0
for pf,L in final.items():
    ys=Counter(e['d'][:4] for e in L); dl=sum(e['dl'] for e in L); tot+=len(L)
    print(pf,len(L),'dl',dl,'skip',skipped[pf],min(ys),max(ys),'|',L[0]['d'],L[0]['t'][:25],'/',L[len(L)//2]['d'],L[len(L)//2]['t'][:25],L[len(L)//2]['p'][:15])
print('TOTAL',tot)
