const { createClient } = supabase;
const db = createClient(APP_CONFIG.SUPABASE_URL, APP_CONFIG.SUPABASE_PUBLISHABLE_KEY);
const $ = id => document.getElementById(id);
let sessionId=null, queue=[], answered=new Set(), current=null, startedAt=null;

function show(id){["startScreen","questionScreen","completeScreen"].forEach(x=>$(x).classList.toggle("hidden",x!==id));}
function updateHeader(){
  $("remaining").textContent=`Quedan ${queue.length}`;
  $("progressBar").style.width=`${Math.round(answered.size/QUESTIONS.length*100)}%`;
}
function render(){
  updateHeader();
  if(!queue.length){finish();return;}
  current=queue[0];
  $("dimension").textContent=`Pregunta ${answered.size+1} · ${current.dimensionLabel}`;
  $("scenario").textContent=current.scenario;
  $("options").innerHTML="";
  current.options.forEach((text,index)=>{
    const b=document.createElement("button"); b.className="option";
    b.innerHTML=`<strong>${String.fromCharCode(65+index)}.</strong> ${text}`;
    b.onclick=()=>answer(index); $("options").appendChild(b);
  });
}
async function answer(index){
  [...$("options").children].forEach(b=>b.disabled=true);
  $("saveStatus").textContent="Guardando…";
  const payload={session_id:sessionId,question_id:current.id,dimension:current.dimension,answer_value:index,answered_at:new Date().toISOString()};
  const {error}=await db.from("responses").upsert(payload,{onConflict:"session_id,question_id"});
  if(error){$("saveStatus").textContent="No se pudo guardar: "+error.message;[...$("options").children].forEach(b=>b.disabled=false);return;}
  answered.add(current.id);queue.shift();$("saveStatus").textContent="Guardado.";render();
}
$("deferBtn").onclick=()=>{
  if(queue.length<=1){$("saveStatus").textContent="Tienes que responder la última pregunta pendiente.";return;}
  queue.push(queue.shift());$("saveStatus").textContent="La pregunta se ha movido al final.";render();
};
$("startBtn").onclick=async()=>{
  const code=$("participantCode").value.trim();
  if(!code){$("startStatus").textContent="Escribe un código de participante.";return;}
  if(!$("consent").checked){$("startStatus").textContent="Necesitamos que confirmes que participas de forma voluntaria.";return;}
  $("startBtn").disabled=true;$("startStatus").textContent="Conectando…";
  let {data:{session},error:authError}=await db.auth.getSession();
  if(authError){$("startStatus").textContent=authError.message;$("startBtn").disabled=false;return;}
  if(!session){const r=await db.auth.signInAnonymously();session=r.data.session;authError=r.error;}
  if(authError||!session){$("startStatus").textContent="No se pudo iniciar la sesión anónima. Comprueba que Anonymous Sign-In esté activado en Supabase.";$("startBtn").disabled=false;return;}
  startedAt=new Date().toISOString();
  const r=await db.from("assessment_sessions").insert({participant_code:code,total_questions:QUESTIONS.length,started_at:startedAt}).select("id").single();
  if(r.error){$("startStatus").textContent="No se pudo crear la sesión: "+r.error.message;$("startBtn").disabled=false;return;}
  sessionId=r.data.id;queue=[...QUESTIONS];show("questionScreen");render();
};
async function finish(){
  const {error}=await db.from("assessment_sessions").update({completed_at:new Date().toISOString(),status:"completed"}).eq("id",sessionId);
  $("finalStatus").textContent=error?"No se pudo guardar el estado final: "+error.message:"El envío se ha completado.";
  show("completeScreen");
}
