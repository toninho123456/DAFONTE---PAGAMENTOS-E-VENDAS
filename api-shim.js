(function(){
const j=(m,u,b)=>fetch(u,{method:m,headers:{'Content-Type':'application/json'},body:b?JSON.stringify(b):undefined}).then(r=>r.ok?r.json():Promise.reject(r.status));
let ME=null,pend=0;const runners=[],ready=j('GET','/api/me').then(x=>{ME=x}).catch(()=>{});
const snap=r=>({docs:r.map(d=>({id:d.id,data:()=>d.data})),data:()=>r[0]&&r[0].data});
function poll(url,cb,er){let last='';const run=()=>{if(pend>0)return;j('GET',url).then(r=>{const s=JSON.stringify(r);if(s!==last){last=s;cb(snap(r))}}).catch(e=>{if(er)er(e)})};runners.push(run);run();setInterval(run,4000)}
function w(m,u,b){pend++;return j(m,u,b).finally(()=>{pend--;runners.forEach(f=>f())})}
const mk=(c,id)=>{const u='/api/c/'+c+'/'+encodeURIComponent(id);return{set:d=>w('PUT',u,d),delete:()=>w('DELETE',u),onSnapshot:(cb,er)=>poll(u,cb,er)}};
const db={collection:c=>({onSnapshot:(cb,er)=>poll('/api/c/'+c,cb,er),doc:id=>mk(c,id)}),doc:p=>{const[c,id]=p.split('/');return mk(c,id)}};
const M=()=>!!ME&&ME.role==='Gerente da matriz';
window.claude={use:async n=>{await ready;if(n==='user')return{id:async()=>ME?String(ME.id):'anon',isOwner:M,canEdit:M};if(n==='db')return db;return null}};
})();
