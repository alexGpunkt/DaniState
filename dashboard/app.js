
const {createClient}=supabase; const db=createClient(APP_CONFIG.SUPABASE_URL,APP_CONFIG.SUPABASE_PUBLISHABLE_KEY); const $=id=>document.getElementById(id);
const labels={trust:"Vertrauen",attachment:"Nähe und Bindung",boundaries:"Grenzen und Zustimmung",control:"Kontrolle und Autonomie",hyperarousal:"Alarmbereitschaft",conflict:"Konflikte und Dominanz",selfworth:"Selbstwert und Scham",body:"Körperbezug",emotion:"Emotionsregulation",avoidance:"Vermeidung und Erinnerungen",support:"Hilfesuche",future:"Sinn und Zukunft",work:"Arbeit und Autoritäten",joy:"Freude und Erholung",integration:"Integration und Resilienz"};
let sessions=[],responses=[];
$("loginBtn").onclick=async()=>{const {error}=await db.auth.signInWithPassword({email:$("email").value,password:$("password").value});$("loginStatus").textContent=error?error.message:"";if(!error) init();};
$("logoutBtn").onclick=async()=>{await db.auth.signOut();location.reload();};
async function init(){
 const {data:{session}}=await db.auth.getSession(); if(!session)return;
 $("loginCard").classList.add("hidden");$("app").classList.remove("hidden");$("logoutBtn").classList.remove("hidden");
 await load();
 db.channel("dashboard-live").on("postgres_changes",{event:"*",schema:"public",table:"assessment_sessions"},load)
 .on("postgres_changes",{event:"*",schema:"public",table:"responses"},load).subscribe();
}
async function load(){
 const [s,r]=await Promise.all([db.from("assessment_sessions").select("*").order("started_at",{ascending:false}),db.from("responses").select("*")]);
 if(s.error||r.error){alert("Datenzugriff fehlgeschlagen. Admin-RLS prüfen.");return;}
 sessions=s.data;responses=r.data;render();
}
function render(){
 const completed=sessions.filter(x=>x.status==="completed").length;
 $("summary").innerHTML=`<div class="metric"><span>Teilnahmen</span><b>${sessions.length}</b></div><div class="metric"><span>Abgeschlossen</span><b>${completed}</b></div><div class="metric"><span>Antworten</span><b>${responses.length}</b></div>`;
 $("sessions").innerHTML=sessions.map(s=>{const n=responses.filter(r=>r.session_id===s.id).length;return `<tr class="click" data-id="${s.id}"><td>${escapeHtml(s.participant_code)}</td><td>${s.status}</td><td>${n}/${s.total_questions}</td><td>${new Date(s.started_at).toLocaleString("de-DE")}</td></tr>`}).join("");
 document.querySelectorAll("tr[data-id]").forEach(tr=>tr.onclick=()=>detail(tr.dataset.id));
}
function detail(id){
 const s=sessions.find(x=>x.id===id), rs=responses.filter(x=>x.session_id===id); const groups={};
 rs.forEach(r=>(groups[r.dimension]??=[]).push(r.answer_value));
 $("detailTitle").textContent=`Profil: ${s.participant_code}`;
 $("dimensions").innerHTML=Object.entries(labels).map(([key,label])=>{const a=groups[key]||[];const avg=a.length?a.reduce((x,y)=>x+y,0)/a.length:null;const pct=avg===null?0:Math.round(avg/3*100);return `<div style="margin:14px 0"><div><strong>${label}</strong> <span class="muted">${avg===null?"keine Daten":avg.toFixed(2)+" / 3"}</span></div><div class="bar"><div style="width:${pct}%"></div></div></div>`}).join("");
 const all=rs.map(r=>r.answer_value),avg=all.length?all.reduce((a,b)=>a+b,0)/all.length:0;
 $("interpretation").textContent=avg<0.75?"Überwiegend flexible beziehungsweise wenig belastungsnahe Antworten. Einzelne Bereiche müssen dennoch separat betrachtet werden.":avg<1.5?"Gemischtes Profil mit vorsichtigen oder kontextabhängigen Reaktionen. Auffällige Einzelskalen sollten im Gespräch geklärt werden.":avg<2.25?"Mehrere Bereiche zeigen deutliche belastungsnahe Muster. Das kann verschiedene Ursachen haben und sollte nicht allein als Traumafolge interpretiert werden.":"Breit ausgeprägte belastungsnahe Antwortmuster. Bei persönlichem Leidensdruck wäre eine freiwillige fachliche Abklärung sinnvoll; das Ergebnis selbst ist keine Diagnose.";
 $("detail").classList.remove("hidden");
}
function escapeHtml(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}
init();
