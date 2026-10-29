const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const today = new Date();
const iso = (d) => { const x=new Date(d); return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}-${String(x.getDate()).padStart(2,'0')}`; };
const offsetDate = n => { const d=new Date(); d.setDate(d.getDate()+n); return iso(d); };
const roleDefinitions = [
 {name:"Штурмовик",short:"Штурм",desc:"Основная боевая единица. Передняя линия атаки и обороны; штурмовая винтовка или автомат. Средний/тяжёлый класс, для тяжёлого — адреналины."},
 {name:"Медик",short:"Медик",desc:"Реанимация бойцов и дымовые гранаты для безопасного занятия позиции. Держится за штурмовиками, вторая линия."},
 {name:"Разведчик",short:"Разведка",desc:"Разведка, наблюдение и устранение целей на дистанции. Глаза клана на поле боя; часто работает с оптикой и скрытно."},
 {name:"Подрывник",short:"Подрыв",desc:"Мины, взрывные устройства, борьба с техникой и разрушение укреплений. Обычно второй/третий ряд; рабочая дистанция от своих — не более 30–50 м."},
 {name:"Строитель",short:"Строитель",desc:"Возводит оборонительные сооружения против пехоты и техники и в первую очередь сам обеспечивает их оборону."},
 {name:"Боевой летчик",short:"Авиация",desc:"Управляет боевой авиацией и поддерживает подразделения с воздуха."},
 {name:"Логист",short:"Логистика",desc:"Доставляет боеприпасы, топливо и материалы по земле и по воздуху."},
 {name:"Танкист",short:"Техника",desc:"Управляет наземной боевой техникой, участвует в прорыве и поддерживает пехоту. Действует во взаимодействии с отрядами."}
];
const leadershipRoles = ["Старший Штурм","Старший Медик","Старший Разведчик","Старший Подрывник","Старший Строитель","Старший Летчик","Старший Логист","Старший Танк"];
const roleAliases = {"Штурм":"Штурмовик","Штурмовик":"Штурмовик","Разведка":"Разведчик","Разведчик":"Разведчик","Поддержка":"Логист","Медик":"Медик","Подрывник":"Подрывник","Строитель":"Строитель","Танкист":"Танкист","Авиация":"Боевой летчик","Резерв":"Штурмовик","Новичок":"Штурмовик","Без подразделения":"Штурмовик"};
function memberRole(m){if(m.role&&roleDefinitions.some(r=>r.name===m.role))return m.role;const s=(m.squad||"").split("/")[0].trim();return roleAliases[s]||"Штурмовик"}
function memberLeadership(m){return m.leadership||""}

const seed = {
 members:[
  ["Raven","active","Штурм / Alpha","2026-10-12",8],["Kiro","active","Разведка / Alpha","2026-10-12",7],["Maddox","active","Штурм / Alpha","2026-10-11",8],["Vektor","active","Поддержка / Bravo","2026-10-11",6],["North","active","Командование","2026-10-12",8],["Ghostline","active","Разведка / Alpha","2026-10-10",7],["Stryker","active","Штурм / Bravo","2026-10-12",6],["ZeroCool","active","Поддержка / Bravo","2026-10-08",5],["Raptor","active","Штурм / Alpha","2026-10-09",7],["Mantis","probation","Новичок","2026-10-06",2],["Warden","active","Командование","2026-10-12",8],["Frost","active","Разведка / Bravo","2026-10-11",6],["Havoc","active","Штурм / Alpha","2026-10-10",7],["Kaiser","reserve","Резерв","2026-09-28",2],["Blitz","active","Штурм / Bravo","2026-10-12",6],["Echo","inactive","Без подразделения","2026-09-11",0],["Nomad","active","Разведка / Alpha","2026-10-12",5],["Dagger","active","Штурм / Alpha","2026-10-08",5],["Onyx","active","Поддержка / Bravo","2026-10-10",6],["Rook","active","Штурм / Bravo","2026-10-09",5],["Viper","active","Разведка / Bravo","2026-10-12",6],["Atlas","active","Поддержка / Alpha","2026-10-07",4],["Cinder","probation","Новичок","2026-10-05",1],["Wolfpack","active","Штурм / Bravo","2026-10-12",5]
 ].map((m,i)=>({id:crypto.randomUUID(),nick:m[0],discord:"",status:m[1],squad:m[2],last:m[3],matches:m[4],joined:offsetDate(-Math.min(200,i*9+7))})),
 tournaments:[
  {id:crypto.randomUUID(),name:"Autumn Conflict Series",organizer:"Wardogs League",format:"Групповой этап",status:"active",start:"2026-10-01",end:"2026-10-30"},
  {id:crypto.randomUUID(),name:"Frontline Cup 2026",organizer:"Community",format:"Single elimination",status:"planned",start:"2026-10-24",end:"2026-11-02"},
  {id:crypto.randomUUID(),name:"Weekly Scrims",organizer:"Wardogs",format:"Тренировочные матчи",status:"active",start:"2026-10-01",end:"2026-12-31"}
 ],
 events:[],
};
function makeEvent(opponent,days,score,outcome,tournamentId,kind="Tournament") {
 return {id:crypto.randomUUID(),opponent,date:offsetDate(days),time:"20:00",map:"Не указана",format:"5v5",organizer:"North",tournamentId,kind,status:score?"completed":"scheduled",ourScore:score?score[0]:null,opponentScore:score?score[1]:null,outcome:outcome||null,report:score?"Демо-отчёт": "",proof:"",registrations:[],attendance:[]};
}
seed.events=[
 makeEvent("Iron Wolves",-2,[13,9],"win",null),makeEvent("Black Division",-5,[8,13],"loss",null),
 makeEvent("Ravens Unit",-7,[13,11],"win",null),makeEvent("Night Ops",-9,[10,13],"loss",null),
 makeEvent("Redline",-12,[13,7],"win",null),makeEvent("Vanguard",-14,[13,10],"win",null),
 makeEvent("Phantom Core",-17,[9,13],"loss",null),makeEvent("Steel Pact",-20,[13,5],"win",null),
 makeEvent("Iron Wolves",2,null,null, null),makeEvent("Ravens Unit",5,null,null,null),makeEvent("Black Division",8,null,null,null)
];
seed.events[0].attendance=seed.members.slice(0,12).map(m=>m.id);
seed.events[0].registrations=seed.members.slice(0,14).map(m=>({memberId:m.id,response:"attending"}));
let state;
function load(){try{const s=localStorage.getItem("wardogs-mvp-state-v1");state=s?JSON.parse(s):structuredClone(seed)}catch(e){state=structuredClone(seed)};state.members=(state.members||[]).map(m=>{const oldSquad=m.squad||"";const migratedSquad=!m.role&&oldSquad.includes("/")?oldSquad.split("/").slice(1).join("/").trim():(!m.role&&["Командование","Резерв","Новичок","Без подразделения"].includes(oldSquad)?"":oldSquad);return {...m,squad:migratedSquad,role:memberRole(m),leadership:memberLeadership(m)}});}
function save(){localStorage.setItem("wardogs-mvp-state-v1",JSON.stringify(state));renderAll()}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2600)}
const statusNames={active:"Активен",probation:"Испытательный срок",inactive:"Неактивен",reserve:"Резерв",vacation:"Отпуск"};
const statusClass={active:"",probation:"probation",inactive:"inactive",reserve:"reserve",vacation:"vacation"};
const dateLabel=d=>{if(!d)return"—";let dt=new Date(d+"T12:00:00");return dt.toLocaleDateString("ru-RU",{day:"2-digit",month:"short"}).replace(".","").toUpperCase()};
const fullDate=d=>d?new Date(d+"T12:00:00").toLocaleDateString("ru-RU",{day:"2-digit",month:"long",year:"numeric"}):"—";
const initials=s=>(s||"?").split(/[\s_-]+/).slice(0,2).map(x=>x[0]||"").join("").toUpperCase();
const tournamentName=id=>state.tournaments.find(t=>t.id===id)?.name||"Клановый матч";
const completed=()=>state.events.filter(e=>e.status==="completed"&&e.outcome);
const wins=()=>completed().filter(e=>e.outcome==="win").length;
const losses=()=>completed().filter(e=>e.outcome==="loss").length;
function navigate(page){if(page==="squads")loadRemoteSquads().catch(err=>toast("Не удалось загрузить отряды: "+(err.message||err)));if(page==="games")loadRemoteGames().catch(err=>toast("Не удалось загрузить игры: "+(err.message||err)));$$(".page").forEach(p=>p.classList.toggle("active",p.id==="page-"+page));$$(".nav-item[data-page]").forEach(b=>b.classList.toggle("active",b.dataset.page===page));$("#crumb").textContent=({overview:"Обзор",roster:"Состав",squads:"Отряды",games:"Игры",matches:"Матчи и события",tournaments:"Турниры",analytics:"Статистика",settings:"Настройки"})[page]||page;$("#sidebar").classList.remove("open");window.scrollTo({top:0,behavior:"smooth"});}
function renderOverview(){
 const future=state.events.filter(e=>e.status!=="completed"&&e.status!=="cancelled").sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time)).slice(0,4);
 $("#upcoming-list").innerHTML=future.length?future.map(e=>`<div class="event-row"><div class="event-date"><b>${new Date(e.date+"T12:00:00").getDate()}</b><small>${dateLabel(e.date).split(" ")[0]}</small></div><div class="event-info"><b>${esc(e.opponent)}</b><small>${esc(e.time)} · ${esc(e.map||"Карта не указана")} · ${esc(tournamentName(e.tournamentId))}</small></div><span class="event-state">${e.registrations?.length||0} ЗАПИСАНО</span></div>`).join(""):`<div class="empty-state">Нет запланированных матчей</div>`;
 const issues=[];
 const stale=state.members.filter(m=>m.status==="active"&&daysSince(m.last)>14);
 if(stale.length)issues.push({icon:"◷",title:`Активность не подтверждена: ${stale.length}`,desc:"Проверьте статус игроков, которые давно не участвовали.",action:"Открыть состав",page:"roster"});
 const noReport=state.events.filter(e=>e.status==="completed"&&!e.report);
 if(noReport.length)issues.push({icon:"!",title:`Не заполнено отчётов: ${noReport.length}`,desc:"Добавьте явку и комментарий по завершённым матчам.",action:"Открыть матчи",page:"matches"});
 const upcoming=state.events.filter(e=>e.status==="scheduled"&&e.date<=offsetDate(3));
 if(upcoming.length)issues.push({icon:"↗",title:`Матчи в ближайшие 3 дня: ${upcoming.length}`,desc:"Проверьте готовность состава и наличие резерва.",action:"Проверить матчи",page:"matches"});
 if(!issues.length)issues.push({icon:"✓",title:"Критичных задач нет",desc:"Состав и ближайшие события выглядят актуально.",action:"Посмотреть состав",page:"roster"});
 $("#attention-count").textContent=String(issues.length).padStart(2,"0");
 $("#attention-list").innerHTML=issues.slice(0,3).map(i=>`<div class="attention-item"><div class="attention-symbol">${i.icon}</div><div><b>${esc(i.title)}</b><p>${esc(i.desc)}</p><button data-goto="${i.page}">${esc(i.action)} ↗</button></div></div>`).join("");
 const recent=completed().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,4);
 $("#recent-results").innerHTML=recent.map(e=>`<div class="result-row"><div class="result-mark ${e.outcome==="win"?"win":"loss"}">${e.outcome==="win"?"W":"L"}</div><div><b>${esc(e.opponent)}</b><small>${dateLabel(e.date)} · ${esc(tournamentName(e.tournamentId))}</small></div><div class="result-score">${e.ourScore} : ${e.opponentScore}</div></div>`).join("")||`<div class="empty-state">Результаты ещё не внесены</div>`;
 const active=state.members.filter(m=>m.status==="active").length;
 $("#metric-members").innerHTML=`${active}<span class="metric-unit"> / ${state.members.length}</span>`;
 $("#metric-matches").textContent=String(completed().length).padStart(2,"0");
 $("#metric-winrate").innerHTML=`${completed().length?(wins()/completed().length*100).toFixed(1):"0"}<span class="metric-unit">%</span>`;
 $("#active-number").textContent=state.members.filter(m=>m.status==="active"&&daysSince(m.last)<=30).length;
 $("#nav-member-count").textContent=state.members.length;
}
function daysSince(date){return date?Math.floor((new Date().setHours(0,0,0,0)-new Date(date+"T12:00:00"))/86400000):9999}
function renderRoleCatalog(){
 const grid=$("#role-grid");
 grid.innerHTML=roleDefinitions.map(r=>`<button class="role-card ${activeRoleFilter===r.name?"selected":""}" data-role-pick="${esc(r.name)}"><span class="role-card-title">${esc(r.name)}</span><span class="role-card-count">${state.members.filter(m=>memberRole(m)===r.name).length} игроков</span></button>`).join("");
 const select=$("#member-role-filter");
 if(select.options.length===1) roleDefinitions.forEach(r=>{const o=document.createElement("option");o.value=r.name;o.textContent=r.name;select.appendChild(o)});
}
let activeRoleFilter="all";
function renderRoster(){
 const q=$("#member-search").value.toLowerCase(),f=$("#member-status-filter").value,rf=$("#member-role-filter").value,lf=$("#member-leadership-filter").value;
 const arr=state.members.filter(m=>(m.nick+" "+m.discord+" "+(m.steam||"")+" "+m.squad+" "+memberRole(m)+" "+memberLeadership(m)+" "+(m.commandRole||"")).toLowerCase().includes(q)&&(f==="all"||m.status===f)&&(rf==="all"||memberRole(m)===rf)&&(lf==="all"||(lf==="none"?!memberLeadership(m):memberLeadership(m)===lf))).sort((a,b)=>a.nick.localeCompare(b.nick));
 $("#member-result-count").textContent=`${arr.length} игроков`;
 $("#members-table").innerHTML=arr.map(m=>{const appointments=[m.commandRole,memberLeadership(m)].filter(Boolean).join(" · ");return `<tr><td><div class="player-cell"><div class="player-avatar">${esc(initials(m.nick))}</div><div><b>${esc(m.nick)}</b><small>${m.discord?`Discord ID: ${esc(m.discord)}`:"Discord не привязан"}${m.steam?` · Steam ID: ${esc(m.steam)}`:""}</small></div></div></td><td><span class="status-pill ${statusClass[m.status]||""}">${statusNames[m.status]||m.status}</span></td><td><span class="role-pill ${m.roleProvisional?"provisional":""}">${esc(memberRole(m))}${m.roleProvisional?" · предварительная":""}</span>${memberExtraRoles(m.id).length?`<small class="extra-role-note">Доп.: ${esc(memberExtraRoles(m.id).join(", "))}</small>`:""}</td><td>${appointments?`<span class="leadership-pill">${esc(appointments)}</span>`:`<span class="muted-cell">—</span>`}</td><td>${esc(squadRows.find(g=>squadAssignments.some(a=>a.member_id===m.id&&a.group_id===g.id))?.name||m.squad||"—")}</td><td>${fullDate(m.last)}</td><td><button class="row-action" data-edit-member="${m.id}" ${!canEditMembers?"hidden":""}>Изменить ↗</button></td></tr>`}).join("")||`<tr><td colspan="7" class="empty-state">Игроки не найдены</td></tr>`;
 renderRoleCatalog();
}
let matchFilter="all";
function renderMatches(){
 let arr=[...state.events].sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
 if(matchFilter==="upcoming")arr=arr.filter(e=>e.status!=="completed"&&e.status!=="cancelled");
 if(matchFilter==="completed")arr=arr.filter(e=>e.status==="completed");
 $("#matches-list").innerHTML=arr.map(e=>{const done=e.status==="completed";return `<article class="match-card"><div class="match-card-top"><span class="match-type">${esc((e.kind||"MATCH").toUpperCase())} / ${esc(e.format||"MATCH")}</span><span class="event-state ${done?"done":e.status==="cancelled"?"warn":""}">${done?"ЗАВЕРШЁН":e.status==="cancelled"?"ОТМЕНЁН":"ЗАПЛАНИРОВАН"}</span></div><h3>AEGIS <span style="color:#7e8878;font-weight:500">vs</span> ${esc(e.opponent)}</h3><div class="match-meta">${fullDate(e.date)} · ${esc(e.time)}<br>${esc(tournamentName(e.tournamentId))} · ${esc(e.map||"Карта не указана")}<br>Ответственный: ${esc(e.organizer||"Не назначен")}</div><div class="match-scoreline"><div><div class="score-big">${done?e.ourScore:"—"}</div><div class="score-label">AEGIS (AGS)</div></div><div style="color:#5e6857;font:11px var(--mono)">VS</div><div style="text-align:right"><div class="score-big">${done?e.opponentScore:"—"}</div><div class="score-label">${esc(e.opponent.toUpperCase())}</div></div></div><div class="match-card-actions"><button class="small-btn" data-edit-event="${e.id}">Изменить матч</button><button class="small-btn primary" data-report-event="${e.id}">${done?"Изменить отчёт":"Внести результат"}</button></div></article>`}).join("")||`<div class="empty-state">Матчей пока нет. Создайте первое событие.</div>`;
}
function renderTournaments(){
 $("#tournaments-list").innerHTML=state.tournaments.map(t=>{const es=state.events.filter(e=>e.tournamentId===t.id),done=es.filter(e=>e.status==="completed"&&e.outcome);return `<article class="tournament-card"><div class="tournament-top"><span class="match-type">COMPETITION / ${esc(t.format.toUpperCase())}</span><span class="event-state ${t.status==="active"?"done":""}">${t.status==="active"?"АКТИВЕН":t.status==="completed"?"ЗАВЕРШЁН":"ЗАПЛАНИРОВАН"}</span></div><h3>${esc(t.name)}</h3><p>${esc(t.organizer)} · ${fullDate(t.start)} — ${fullDate(t.end)}</p><div class="tournament-stats"><div><b>${es.length}</b><small>МАТЧЕЙ</small></div><div><b>${done.length?Math.round(done.filter(e=>e.outcome==="win").length/done.length*100)+"%":"—"}</b><small>WIN RATE</small></div><div><b>${done.length}</b><small>С РЕЗУЛЬТАТОМ</small></div></div><div class="match-card-actions"><button class="small-btn" data-tournament-matches="${t.id}">Матчи турнира ↗</button><button class="small-btn" data-edit-tournament="${t.id}">Изменить</button></div></article>`}).join("")||`<div class="empty-state">Турниров пока нет</div>`;
}
function renderAnalytics(){
 const done=completed();const attRows=state.events.filter(e=>e.status==="completed"&&Array.isArray(e.attendance));
 let totalExpected=0,totalPresent=0;
 attRows.forEach(e=>{const expected=e.registrations?.filter(r=>r.response==="attending").length||e.attendance.length;totalExpected+=expected;totalPresent+=e.attendance.length});
 $("#an-matches").textContent=done.length;$("#an-wins").textContent=wins();$("#an-attendance").textContent=totalExpected?Math.round(totalPresent/totalExpected*100)+"%":"—";
 const cutoff=offsetDate(-30),activeIds=new Set(state.events.filter(e=>e.date>=cutoff&&e.status==="completed").flatMap(e=>e.attendance||[]));
 $("#an-players").textContent=activeIds.size;
 $("#analytics-table").innerHTML=[...done].sort((a,b)=>b.date.localeCompare(a.date)).map(e=>`<tr><td>${fullDate(e.date)}</td><td>${esc(tournamentName(e.tournamentId))}</td><td>${esc(e.opponent)}</td><td><span class="status-pill ${e.outcome==="win"?"":"inactive"}">${e.outcome==="win"?"Победа":e.outcome==="loss"?"Поражение":"Ничья"}</span></td><td><b>${e.ourScore} : ${e.opponentScore}</b></td><td>${esc(e.organizer||"—")}</td></tr>`).join("")||`<tr><td colspan="6" class="empty-state">Нет подтверждённых результатов</td></tr>`;
}
function renderAll(){renderOverview();renderRoster();renderMatches();renderTournaments();renderAnalytics()}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
let supabaseClient=null, currentUser=null, currentProfile=null, canEditMembers=false, recoveryMode=false;
let squadRows=[], squadAssignments=[], extraRoleRows=[];
const extraRoleOptions=["Штурмовик","Медик","Разведчик","Подрывник","Строитель","Боевой летчик"];
const roleLabels={commander:"Командир",officer:"Офицер",viewer:"Просмотр"};
function showAuth(show){const screen=$("#auth-screen");if(screen)screen.hidden=!show;document.querySelector(".app-shell").style.display=show?"none":"";}
function authMessage(message,success=false){const el=$("#auth-message");if(el){el.textContent=message;el.classList.toggle("success",success)}}
function configReady(){return window.AEGIS_SUPABASE_URL&&window.AEGIS_SUPABASE_KEY&&!window.AEGIS_SUPABASE_URL.includes("ВСТАВЬТЕ_")&&!window.AEGIS_SUPABASE_KEY.includes("ВСТАВЬТЕ_")}
function fromDb(m){return {id:m.id,nick:m.nick||"",steam:m.steam_id||"",discord:m.discord_id||"",status:m.status||"active",role:m.combat_role||"Штурмовик",roleProvisional:!!m.role_provisional,leadership:m.senior_role||"",commandRole:m.command_role||"",squad:m.squad||"",last:m.last_activity||"",joined:m.joined_at||"",matches:0}}
function toDb(m){return {nick:m.nick,steam_id:m.steam||null,discord_id:m.discord||null,status:m.status,combat_role:m.role,role_provisional:!!m.roleProvisional,senior_role:m.leadership||null,command_role:m.commandRole||null,squad:m.squad||null,last_activity:m.last||null,joined_at:m.joined||null}}
async function loadRemoteMembers(){const {data,error}=await supabaseClient.from("members").select("*").order("nick");if(error)throw error;state.members=(data||[]).map(fromDb);renderRoster();const count=state.members.length;const nav=$("#nav-member-count");if(nav)nav.textContent=count;const conn=$("#connection-label");if(conn)conn.textContent="Синхронизация включена";}
async function loadRemoteExtraRoles(){
 const {data,error}=await supabaseClient.from("member_extra_roles").select("id,member_id,combat_role");
 if(error)throw error;extraRoleRows=data||[];renderRoster();
}
function memberExtraRoles(memberId){return extraRoleRows.filter(r=>r.member_id===memberId).map(r=>r.combat_role)}
async function saveRemoteExtraRoles(memberId,selectedRoles){
 const selected=[...new Set(selectedRoles)].filter(role=>extraRoleOptions.includes(role));
 const existing=extraRoleRows.filter(r=>r.member_id===memberId);
 const remove=existing.filter(r=>!selected.includes(r.combat_role)).map(r=>r.id);
 if(remove.length){const {error}=await supabaseClient.from("member_extra_roles").delete().in("id",remove);if(error)throw error;}
 const add=selected.filter(role=>!existing.some(r=>r.combat_role===role));
 if(add.length){const {data,error}=await supabaseClient.from("member_extra_roles").insert(add.map(combat_role=>({member_id:memberId,combat_role}))).select("id,member_id,combat_role");if(error)throw error;extraRoleRows=extraRoleRows.filter(r=>r.member_id!==memberId||selected.includes(r.combat_role)).concat(data||[]);}else{extraRoleRows=extraRoleRows.filter(r=>r.member_id!==memberId||selected.includes(r.combat_role));}
 renderRoster();
}
async function loadRemoteSquads(){
 if(!supabaseClient||!currentUser)return;
 const [groupsRes,assignRes]=await Promise.all([
  supabaseClient.from("assault_groups").select("id,name,commander_member_id,description,sort_order,created_at,updated_at").order("sort_order").order("name"),
  supabaseClient.from("member_group_assignments").select("member_id,group_id,assigned_by,assigned_at")
 ]);
 if(groupsRes.error)throw groupsRes.error;if(assignRes.error)throw assignRes.error;
 squadRows=groupsRes.data||[];squadAssignments=assignRes.data||[];renderSquads();renderRoster();
}
function renderSquads(){
 const list=$("#squad-list"),summary=$("#squad-summary"),count=$("#nav-squad-count");if(!list)return;
 if(count)count.textContent=squadRows.length;
 const assigned=new Set(squadAssignments.map(a=>a.member_id));
 if(summary)summary.innerHTML=`<div class="squad-stat"><b>${squadRows.length}</b><span>отрядов</span></div><div class="squad-stat"><b>${assigned.size}</b><span>бойцов распределено</span></div><div class="squad-stat"><b>${Math.max(0,state.members.length-assigned.size)}</b><span>без отряда</span></div>`;
 if(!squadRows.length){list.innerHTML='<div class="panel squad-empty">Отрядов пока нет. Нажмите «Создать отряд», чтобы добавить первый.</div>';return;}
 list.innerHTML=squadRows.map(g=>{
  const commander=state.members.find(m=>m.id===g.commander_member_id);
  const members=squadAssignments.filter(a=>a.group_id===g.id).map(a=>state.members.find(m=>m.id===a.member_id)).filter(Boolean).sort((a,b)=>a.nick.localeCompare(b.nick));
  const available=state.members.filter(m=>!squadAssignments.some(a=>a.member_id===m.id)).sort((a,b)=>a.nick.localeCompare(b.nick));
  return `<article class="panel squad-card"><div class="squad-card-head"><div><div class="section-kicker">БОЕВОЙ ОТРЯД · ${members.length} БОЙЦОВ</div><h2>${esc(g.name)}</h2><p class="muted">Командир: <b>${esc(commander?.nick||"не назначен")}</b></p></div><button class="secondary-btn squad-edit-btn" data-edit-squad="${g.id}" ${!canEditMembers?"hidden":""}>Изменить</button></div>
  ${canEditMembers?`<form class="squad-assign-form" data-assign-form="${g.id}"><label for="assign-${g.id}">Добавить бойца</label><div class="squad-assign-row"><select id="assign-${g.id}" name="member_id" required><option value="">Выберите бойца без отряда</option>${available.map(m=>`<option value="${m.id}">${esc(m.nick)} · ${esc(memberRole(m))}</option>`).join("")}</select><button class="primary-btn" type="submit" ${available.length?"":"disabled"}>Добавить</button></div></form>`:""}
  <div class="squad-member-list">${members.length?members.map(m=>`<div class="squad-member"><div><b>${esc(m.nick)}</b><small>${esc(memberRole(m))}${m.commandRole?` · ${esc(m.commandRole)}`:""}</small></div>${canEditMembers?`<button class="row-action" data-unassign-member="${m.id}" title="Убрать из отряда">Убрать</button>`:""}</div>`).join(""):'<div class="squad-empty-inline">В этом отряде пока нет бойцов.</div>'}</div></article>`;
 }).join("");
}
async function saveRemoteSquad(data,id){
 const payload={name:data.name.trim(),commander_member_id:data.commander_member_id||null,description:data.description.trim()||null};
 const query=id?supabaseClient.from("assault_groups").update({...payload,updated_at:new Date().toISOString()}).eq("id",id):supabaseClient.from("assault_groups").insert(payload);
 const {error}=await query;if(error)throw error;await loadRemoteSquads();
}
async function assignMemberToSquad(memberId,groupId){
 const {error}=await supabaseClient.from("member_group_assignments").upsert({member_id:memberId,group_id:groupId,assigned_by:currentUser.id},{onConflict:"member_id"});if(error)throw error;await loadRemoteSquads();
}
async function unassignMemberFromSquad(memberId){const {error}=await supabaseClient.from("member_group_assignments").delete().eq("member_id",memberId);if(error)throw error;await loadRemoteSquads();}
async function saveRemoteMember(member,id){const payload=toDb(member);let query;if(id)query=supabaseClient.from("members").update(payload).eq("id",id).select().single();else query=supabaseClient.from("members").insert(payload).select().single();const {data,error}=await query;if(error)throw error;const saved=fromDb(data);if(id){const i=state.members.findIndex(x=>x.id===id);if(i>=0)state.members[i]=saved;}else state.members.push(saved);renderRoster();const nav=$("#nav-member-count");if(nav)nav.textContent=state.members.length;return saved;}
let remoteGames=[];
let remoteGameRoster=[];
let remoteGameSettings=[];
const gameStatusLabels={confirmed:"Предстоящая",draft:"Черновик",cancelled:"Отменена"};
const signupStatusLabels={confirmed:"Участвует",late:"Опоздает",declined:"Не участвует",unsure:"Пока не определился"};
function gameDateLabel(value){if(!value)return"Дата не указана";const d=new Date(value);return d.toLocaleString("ru-RU",{day:"2-digit",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit",timeZone:"Europe/Moscow"})+" МСК";}
async function loadRemoteGames(){
 if(!supabaseClient||!currentUser)return;
 const [gamesRes,rosterRes,settingsRes]=await Promise.all([
  supabaseClient.from("games").select("id,title,description,starts_at,status,created_at").order("starts_at",{ascending:true}),
  supabaseClient.from("game_roster").select("id,game_id,member_id,roster_status,confirmation_status,sort_order").order("sort_order",{ascending:true}),
  supabaseClient.from("game_settings").select("game_id,signup_channel_id,signup_message_id,required_count,player_reminder_minutes")
 ]);
 if(gamesRes.error)throw gamesRes.error;if(rosterRes.error)throw rosterRes.error;if(settingsRes.error)throw settingsRes.error;
 remoteGames=gamesRes.data||[];remoteGameRoster=rosterRes.data||[];remoteGameSettings=settingsRes.data||[];
 const count=$("#nav-games-count");if(count)count.textContent=remoteGames.filter(g=>g.status==="confirmed").length;
 renderRemoteGames();
}
function renderRemoteGames(){
 const root=$("#games-list");if(!root)return;
 if(!remoteGames.length){root.innerHTML='<div class="panel squad-empty">Игр пока нет. Создайте игру выше или создайте её через Discord-бота.</div>';return;}
 root.innerHTML=remoteGames.map(g=>{
  const rows=remoteGameRoster.filter(r=>r.game_id===g.id);
  const gameSettings=remoteGameSettings.find(x=>x.game_id===g.id);
  const discordSync=gameSettings?.signup_channel_id?"Discord подключён":"Ожидает синхронизации с Discord";
  const buckets={confirmed:[],late:[],declined:[],unsure:[]};
  rows.forEach(r=>{const key=buckets[r.confirmation_status]?r.confirmation_status:"confirmed";const m=state.members.find(x=>x.id===r.member_id);if(m)buckets[key].push({row:r,member:m});});
  const columns=[['confirmed','Участвуют'],['late','Опоздают'],['declined','Не участвуют'],['unsure','Пока не определились']];
  return `<article class="panel game-card" data-game-card="${g.id}"><div class="game-card-head"><div><div class="section-kicker">${esc((g.title||'ИГРА').split('-')[0].toUpperCase())} · ${esc(gameStatusLabels[g.status]||g.status||'Статус неизвестен')} · ${esc(discordSync)}</div><h2>${esc(g.title||'Без названия')}</h2><div class="game-meta">Начало: ${esc(gameDateLabel(g.starts_at))}<br>${esc(g.description||'Описание не указано')}<br>${rows.length} записей</div></div><div class="game-card-actions"><button class="secondary-btn" data-refresh-game-roster="${g.id}">Обновить</button>${canEditMembers&&g.status==='confirmed'?`<button class="secondary-btn" data-cancel-game="${g.id}">Отменить игру</button>`:''}</div></div><div class="game-status-columns">${columns.map(([key,label])=>`<section class="game-status-column"><h4>${label} · ${buckets[key].length}</h4>${buckets[key].length?buckets[key].map(({row,member})=>`<div class="game-player"><span>${esc(member.nick)}</span>${canEditMembers?`<select aria-label="Статус ${esc(member.nick)}" data-game-roster-status="${row.id}"><option value="confirmed" ${row.confirmation_status==='confirmed'?'selected':''}>Участвует</option><option value="late" ${row.confirmation_status==='late'?'selected':''}>Опоздает</option><option value="declined" ${row.confirmation_status==='declined'?'selected':''}>Не участвует</option><option value="unsure" ${row.confirmation_status==='unsure'?'selected':''}>Не определился</option><option value="remove">Убрать</option></select>`:''}</div>`).join(''):'<div class="game-empty">Нет участников</div>'}</section>`).join('')}</div><div class="game-roster-tools">${canEditMembers?`<select data-add-game-member="${g.id}"><option value="">Добавить участника из ростера…</option>${state.members.filter(m=>!rows.some(r=>r.member_id===m.id)).sort((a,b)=>a.nick.localeCompare(b.nick)).map(m=>`<option value="${m.id}">${esc(m.nick)}</option>`).join('')}</select>`:''}</div></article>`;
 }).join('');
}
async function createRemoteGame(form){
 if(!canEditMembers)throw new Error('Создавать игры могут только командир и офицеры.');
 const fd=new FormData(form),type=String(fd.get('game_type')||'прак'),teamA=String(fd.get('team_a')||'').trim(),teamB=String(fd.get('team_b')||'').trim(),dateValue=String(fd.get('starts_at')||''),requiredCount=Number(fd.get('required_count')||10),description=String(fd.get('description')||'').trim();
 if(!teamA||!teamB||!dateValue)throw new Error('Заполни команды и дату игры.');
 const localDate=new Date(`${dateValue}:00+03:00`);if(Number.isNaN(localDate.getTime())||localDate<=new Date())throw new Error('Дата игры должна быть в будущем. Время указывается по Москве.');
 const dateParts=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Moscow',day:'2-digit',month:'2-digit'}).formatToParts(localDate);const day=dateParts.find(p=>p.type==='day')?.value||'00',month=dateParts.find(p=>p.type==='month')?.value||'00';
 const displayType=type==='прак'?'Прак':'Комьюнити';
 const title=`${displayType}-${teamA}-${teamB}-${day}${month}`;
 const {data:game,error}=await supabaseClient.from('games').insert({title,description,starts_at:localDate.toISOString(),status:'confirmed',created_by:currentUser.id}).select('id,title,description,starts_at,status,created_at').single();
 if(error)throw error;
 const {error:settingsError}=await supabaseClient.from('game_settings').insert({game_id:game.id,required_count:requiredCount,player_reminder_minutes:60});
 if(settingsError){await supabaseClient.from('games').delete().eq('id',game.id);throw settingsError;}
 await loadRemoteGames();
 toast('Игра сохранена. Бот создаст канал и панель записи в Discord в течение минуты, если он запущен.');
}
async function updateGameRosterStatus(rowId,value){
 if(value==='remove'){const {error}=await supabaseClient.from('game_roster').delete().eq('id',rowId);if(error)throw error;}
 else {const {error}=await supabaseClient.from('game_roster').update({confirmation_status:value}).eq('id',rowId);if(error)throw error;}
 await loadRemoteGames();toast('Статус участника обновлён');
}
async function addMemberToGame(gameId,memberId){
 if(!memberId)return;
 const existing=remoteGameRoster.find(r=>r.game_id===gameId&&r.member_id===memberId);
 if(existing){toast('Игрок уже записан на эту игру');return;}
 const {error}=await supabaseClient.from('game_roster').insert({game_id:gameId,member_id:memberId,assigned_role:null,roster_status:'main',confirmation_status:'confirmed',sort_order:9999});if(error)throw error;
 await loadRemoteGames();toast('Игрок добавлен в состав');
}
async function cancelRemoteGame(gameId){
 if(!canEditMembers||!confirm('Отменить эту игру?'))return;
 const {error}=await supabaseClient.from('games').update({status:'cancelled'}).eq('id',gameId);if(error)throw error;
 await loadRemoteGames();toast('Игра отменена в общей базе.');
}
$("#game-create-form")?.addEventListener('submit',async e=>{e.preventDefault();const btn=e.submitter;btn.disabled=true;btn.textContent='Создаём…';try{await createRemoteGame(e.currentTarget);e.currentTarget.reset();e.currentTarget.elements.required_count.value=10;}catch(err){toast('Не удалось создать игру: '+(err.message||err));}finally{btn.disabled=false;btn.textContent='Создать игру';}});
$("#refresh-games-btn")?.addEventListener('click',()=>loadRemoteGames().then(()=>toast('Список игр обновлён')).catch(err=>toast('Ошибка обновления: '+(err.message||err))));
document.addEventListener('change',async e=>{
 const statusSelect=e.target.closest('[data-game-roster-status]');if(statusSelect){try{statusSelect.disabled=true;await updateGameRosterStatus(statusSelect.dataset.gameRosterStatus,statusSelect.value);}catch(err){toast('Не удалось изменить статус: '+(err.message||err));}finally{statusSelect.disabled=false;}return;}
 const addSelect=e.target.closest('[data-add-game-member]');if(addSelect&&addSelect.value){try{addSelect.disabled=true;await addMemberToGame(addSelect.dataset.addGameMember,addSelect.value);}catch(err){toast('Не удалось добавить участника: '+(err.message||err));}finally{addSelect.disabled=false;}}
});
document.addEventListener('click',async e=>{
 const refresh=e.target.closest('[data-refresh-game-roster]');if(refresh){loadRemoteGames().catch(err=>toast('Ошибка обновления: '+(err.message||err)));return;}
 const cancel=e.target.closest('[data-cancel-game]');if(cancel){try{await cancelRemoteGame(cancel.dataset.cancelGame);}catch(err){toast('Не удалось отменить игру: '+(err.message||err));}}
});

async function initializeApp(){
  if(!configReady()){showAuth(true);authMessage("Сначала заполните config.js значениями Project URL и Publishable key из Supabase.");$("#auth-submit").disabled=true;return;}
  if(!window.supabase?.createClient){showAuth(true);authMessage("Не удалось загрузить библиотеку Supabase. Обновите страницу или проверьте подключение к CDN.");return;}
  supabaseClient=window.supabase.createClient(window.AEGIS_SUPABASE_URL,window.AEGIS_SUPABASE_KEY);
  supabaseClient.auth.onAuthStateChange((event) => {
    if(event === "PASSWORD_RECOVERY") {
      recoveryMode=true;
      showAuth(true);
      $("#auth-form").hidden=true;
      $("#recovery-form").hidden=false;
      $("#recovery-message").textContent="";
    }
  });
  const {data:{session},error}=await supabaseClient.auth.getSession();if(error){showAuth(true);authMessage("Ошибка авторизации: "+error.message);return;}
  if(recoveryMode || location.hash.includes("type=recovery") || new URLSearchParams(location.search).get("type")==="recovery") {
    recoveryMode=true;showAuth(true);$("#auth-form").hidden=true;$("#recovery-form").hidden=false;return;
  }
  if(!session){showAuth(true);return;}
  await finishLogin(session.user);
}
async function finishLogin(user){
  currentUser=user;showAuth(false);
  try{
    const {data:profile,error}=await supabaseClient.from("profiles").select("display_name,role").eq("id",user.id).single();
    if(error)throw error;if(!profile)throw new Error("Для пользователя не создан профиль клана.");
    currentProfile=profile;canEditMembers=["commander","officer"].includes(profile.role);
    $("#profile-name").textContent=profile.display_name||user.email||"Участник AEGIS";$("#profile-role").textContent=roleLabels[profile.role]||"Участник";$("#profile-avatar").textContent=initials(profile.display_name||user.email||"A");
    $("#add-member-btn").hidden=!canEditMembers;$("#add-squad-btn").hidden=!canEditMembers;$("#game-create-form").hidden=!canEditMembers;
    await loadRemoteMembers();
    await loadRemoteSquads();
    await loadRemoteExtraRoles();
    await loadRemoteGames();
    state.events=[];state.tournaments=[];renderRoster();navigate("roster");
  }catch(err){showAuth(true);authMessage("Не удалось загрузить профиль или состав: "+(err.message||err));}
}
$("#auth-form").addEventListener("submit",async ev=>{ev.preventDefault();if(!supabaseClient){if(configReady())supabaseClient=window.supabase.createClient(window.AEGIS_SUPABASE_URL,window.AEGIS_SUPABASE_KEY);else return;}
 const button=$("#auth-submit");button.disabled=true;button.textContent="Входим…";authMessage("");
 try{const {data,error}=await supabaseClient.auth.signInWithPassword({email:$("#auth-email").value.trim(),password:$("#auth-password").value});if(error)throw error;await finishLogin(data.user);if(currentUser)authMessage("Вход выполнен",true);}
 catch(err){authMessage("Не удалось войти: "+(err.message||err));}
 finally{button.disabled=false;button.textContent="Войти";}
});
$("#forgot-password-btn").addEventListener("click",async()=>{
  if(!supabaseClient){if(configReady()&&window.supabase?.createClient)supabaseClient=window.supabase.createClient(window.AEGIS_SUPABASE_URL,window.AEGIS_SUPABASE_KEY);else{authMessage("Не настроено подключение к Supabase.");return;}}
  const email=$("#auth-email").value.trim();
  if(!email){authMessage("Сначала укажи электронную почту в поле выше.");$("#auth-email").focus();return;}
  const btn=$("#forgot-password-btn");btn.disabled=true;authMessage("");
  try{
    const {error}=await supabaseClient.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin+window.location.pathname});
    if(error)throw error;
    authMessage("Если адрес зарегистрирован, письмо для восстановления отправлено. Проверь входящие и папку «Спам».",true);
  }catch(err){authMessage("Не удалось отправить письмо: "+(err.message||err));}
  finally{btn.disabled=false;}
});
$("#recovery-form").addEventListener("submit",async ev=>{
  ev.preventDefault();
  const password=$("#new-password").value, confirm=$("#new-password-confirm").value;
  if(password.length<8){$("#recovery-message").textContent="Пароль должен содержать не менее 8 символов.";return;}
  if(password!==confirm){$("#recovery-message").textContent="Пароли не совпадают.";return;}
  const btn=$("#recovery-submit");btn.disabled=true;btn.textContent="Сохраняем…";$("#recovery-message").textContent="";
  try{
    const {error}=await supabaseClient.auth.updateUser({password});if(error)throw error;
    await supabaseClient.auth.signOut();recoveryMode=false;$("#recovery-form").hidden=true;$("#auth-form").hidden=false;$("#auth-password").value=password;authMessage("Пароль изменён. Теперь войди с новым паролем.",true);
    history.replaceState({},document.title,window.location.pathname);
  }catch(err){$("#recovery-message").textContent="Не удалось изменить пароль: "+(err.message||err);}
  finally{btn.disabled=false;btn.textContent="Сохранить новый пароль";}
});

$("#sign-out-btn").addEventListener("click",async()=>{if(supabaseClient)await supabaseClient.auth.signOut();currentUser=null;currentProfile=null;canEditMembers=false;state.members=[];showAuth(true);authMessage("Вы вышли из системы.",true);});

const backdrop=$("#modal-backdrop"),fields=$("#modal-fields"),form=$("#modal-form");let modalMode="",editingId=null;
function field(name,label,type="text",value="",opts=null,full=false,placeholder=""){let html=`<div class="field ${full?"full-field":""}"><label for="f-${name}">${label}</label>`;if(type==="select"){html+=`<select id="f-${name}" name="${name}">${opts.map(o=>`<option value="${esc(o.value)}" ${String(o.value)===String(value)?"selected":""}>${esc(o.label)}</option>`).join("")}</select>`}else if(type==="textarea"){html+=`<textarea id="f-${name}" name="${name}" placeholder="${esc(placeholder)}">${esc(value)}</textarea>`}else{html+=`<input id="f-${name}" name="${name}" type="${type}" value="${esc(value)}" placeholder="${esc(placeholder)}" ${type==="number"?'min="0"':""}>`}return html+"</div>"}
function openModal(mode,id=null){
 modalMode=mode;editingId=id;fields.innerHTML="";
 const m=state.members.find(x=>x.id===id),e=state.events.find(x=>x.id===id),t=state.tournaments.find(x=>x.id===id);
 if(mode==="member"){
  $("#modal-kicker").textContent=m?"PERSONNEL / EDIT":"PERSONNEL / NEW";$("#modal-title").textContent=m?"Редактировать игрока":"Добавить игрока";
  fields.innerHTML=field("nick","ИГРОВОЙ НИК","text",m?.nick||"",null,false,"Например, Raven")+field("steam","STEAM ID","text",m?.steam||"",null,false,"Можно добавить позже")+field("discord","DISCORD ID","text",m?.discord||"",null,false,"Можно добавить позже")+field("status","СТАТУС","select",m?.status||"active",Object.entries(statusNames).map(([value,label])=>({value,label})))+field("role","БОЕВАЯ РОЛЬ","select",memberRole(m||{}),roleDefinitions.map(r=>({value:r.name,label:r.name})))+field("roleProvisional","СТАТУС БОЕВОЙ РОЛИ","select",m?.roleProvisional?"yes":"no",[{value:"no",label:"Подтверждена"},{value:"yes",label:"Предварительная — требует подтверждения"}])+field("leadership","СТАРШАЯ БОЕВАЯ РОЛЬ","select",memberLeadership(m||{}),[{value:"",label:"Нет назначения"},...leadershipRoles.map(r=>({value:r,label:r}))])+field("commandRole","НАЗНАЧЕНИЕ В УПРАВЛЕНИИ","select",m?.commandRole||"",[{value:"",label:"Нет назначения"},{value:"Командир",label:"Командир"},{value:"Офицер",label:"Офицер"}])+field("squad","ОТРЯД / ПОДРАЗДЕЛЕНИЕ","text",m?.squad||"",null,false,"Например, Alpha / 1-й отряд")+field("last","ПОСЛЕДНЯЯ АКТИВНОСТЬ","date",m?.last||iso(today))+field("joined","ДАТА ВСТУПЛЕНИЯ","date",m?.joined||iso(today));
  fields.innerHTML+=`<div class="field full-field"><label>ДОПОЛНИТЕЛЬНЫЕ БОЕВЫЕ РОЛИ ДЛЯ ЗАМЕНЫ</label><div class="extra-role-picker">${extraRoleOptions.filter(role=>role!==memberRole(m||{})).map(role=>`<label class="extra-role-option"><input type="checkbox" name="extra_roles" value="${esc(role)}" ${memberExtraRoles(m?.id).includes(role)?"checked":""}><span>${esc(role)}</span></label>`).join("")}</div><small class="muted">Основная роль задаётся выше. Здесь отметьте роли, на которые боец может заменять других.</small></div>`;
 }else if(mode==="squad"){
  const g=squadRows.find(x=>x.id===id);
  if(!canEditMembers){toast("Недостаточно прав для управления отрядами");return;}
  $("#modal-kicker").textContent=g?"UNIT / EDIT":"UNIT / NEW";$("#modal-title").textContent=g?"Изменить отряд":"Создать отряд";
  const commanderOptions=[{value:"",label:"Не назначен"},...state.members.slice().sort((a,b)=>a.nick.localeCompare(b.nick)).map(m=>({value:m.id,label:m.nick+(m.commandRole?` · ${m.commandRole}`:"")}))];
  fields.innerHTML=field("name","НАЗВАНИЕ ОТРЯДА","text",g?.name||"",null,true,"Например, Отряд Askeladd")+field("commander_member_id","КОМАНДИР ОТРЯДА","select",g?.commander_member_id||"",commanderOptions,true)+field("description","ОПИСАНИЕ (НЕОБЯЗАТЕЛЬНО)","textarea",g?.description||"",null,true,"Заметка для старшего состава");
 }else if(mode==="event"){
  $("#modal-kicker").textContent=e?"OPERATIONS / EDIT":"OPERATIONS / NEW";$("#modal-title").textContent=e?"Редактировать матч":"Создать матч";
  fields.innerHTML=field("opponent","СОПЕРНИК","text",e?.opponent||"",null,false,"Название команды")+field("tournamentId","ТУРНИР","select",e?.tournamentId||"",[{value:"",label:"Клановый матч"},...state.tournaments.map(x=>({value:x.id,label:x.name}))])+field("date","ДАТА","date",e?.date||offsetDate(2))+field("time","ВРЕМЯ","time",e?.time||"20:00")+field("map","КАРТА","text",e?.map||"",null,false,"Если известна")+field("format","ФОРМАТ","select",e?.format||"5v5",["5v5","10v10","16v16","20v20","Другое"].map(x=>({value:x,label:x})))+field("organizer","ОТВЕТСТВЕННЫЙ","text",e?.organizer||"North",null,false,"Ник офицера")+field("kind","ТИП","select",e?.kind||"Tournament",[{value:"Tournament",label:"Турнир"}, {value:"Scrim",label:"Тренировка"}, {value:"Clan event",label:"Клановое событие"}]);
 }else if(mode==="report"){
  $("#modal-kicker").textContent="MATCH / AFTER ACTION REPORT";$("#modal-title").textContent="Отчёт по матчу";
  fields.innerHTML=field("opponent","СОПЕРНИК","text",e?.opponent||"",null,false)+field("date","ДАТА МАТЧА","date",e?.date||iso(today))+field("ourScore","СЧЁТ AEGIS","number",e?.ourScore??"",null,false,"0")+field("opponentScore","СЧЁТ СОПЕРНИКА","number",e?.opponentScore??"",null,false,"0")+field("proof","ССЫЛКА НА ПОДТВЕРЖДЕНИЕ","url",e?.proof||"",null,true,"Скриншот или ссылка на результат")+field("report","КОММЕНТАРИЙ","textarea",e?.report||"",null,true,"Короткий разбор матча");
  const attend=state.members.filter(m=>m.status!=="inactive").sort((a,b)=>a.nick.localeCompare(b.nick));
  fields.innerHTML+=`<div class="field full-field"><label>ФАКТИЧЕСКАЯ ЯВКА · ОТМЕТЬТЕ ПРИСУТСТВОВАВШИХ</label><div class="attendance-picker">${attend.map(m=>`<label class="checkline"><input type="checkbox" name="attendance" value="${m.id}" ${(e?.attendance||[]).includes(m.id)?"checked":""}><span>${esc(m.nick)}</span></label>`).join("")}</div></div>`;
 }else if(mode==="tournament"){
  $("#modal-kicker").textContent=t?"COMPETITION / EDIT":"COMPETITION / NEW";$("#modal-title").textContent=t?"Редактировать турнир":"Новый турнир";
  fields.innerHTML=field("name","НАЗВАНИЕ","text",t?.name||"",null,true,"Название турнира")+field("organizer","ОРГАНИЗАТОР","text",t?.organizer||"Wardogs")+field("format","ФОРМАТ","select",t?.format||"Групповой этап",["Групповой этап","Single elimination","Double elimination","Лига","Тренировочные матчи","Другое"].map(x=>({value:x,label:x})))+field("status","СТАТУС","select",t?.status||"planned",[{value:"planned",label:"Запланирован"},{value:"active",label:"Активен"},{value:"completed",label:"Завершён"}])+field("start","НАЧАЛО","date",t?.start||iso(today))+field("end","ОКОНЧАНИЕ","date",t?.end||offsetDate(30));
 }
 $("#modal-submit").textContent=mode==="report"?"Сохранить отчёт":"Сохранить";backdrop.classList.add("open");setTimeout(()=>fields.querySelector("input,select")?.focus(),50);
}
function closeModal(){backdrop.classList.remove("open")}
function formData(){return Object.fromEntries(new FormData(form).entries())}
form.addEventListener("submit",async ev=>{ev.preventDefault();const d=formData();
 if(modalMode==="member"){if(!d.nick.trim()){toast("Укажите игровой ник");return}const duplicate=state.members.find(m=>m.id!==editingId&&((d.discord.trim()&&m.discord===d.discord.trim())||(d.steam.trim()&&m.steam===d.steam.trim())));if(duplicate){toast("Этот Steam ID или Discord ID уже привязан к игроку: "+duplicate.nick);return}const obj={nick:d.nick.trim(),steam:d.steam.trim(),discord:d.discord.trim(),status:d.status,role:d.role,roleProvisional:d.roleProvisional==="yes",leadership:d.leadership,commandRole:d.commandRole,squad:d.squad.trim(),last:d.last,joined:d.joined,matches:Number(d.matches)||0};try{const saved=await saveRemoteMember(obj,editingId);const selectedRoles=$$('#modal-fields input[name="extra_roles"]:checked').map(input=>input.value);await saveRemoteExtraRoles(saved.id,selectedRoles.filter(role=>role!==d.role));toast(editingId?"Карточка игрока обновлена":"Игрок добавлен");}catch(err){toast("Ошибка сохранения: "+(err.message||err));return;}}
 if(modalMode==="squad"){
  if(!canEditMembers){toast("Недостаточно прав");return;}if(!d.name?.trim()){toast("Укажите название отряда");return;}
  try{await saveRemoteSquad(d,editingId);toast(editingId?"Отряд обновлён":"Отряд создан");}catch(err){toast("Не удалось сохранить отряд: "+(err.message||err));return;}
 }
 if(modalMode==="event"){if(!d.opponent.trim()){toast("Укажите соперника");return}const obj={opponent:d.opponent.trim(),tournamentId:d.tournamentId||null,date:d.date,time:d.time,map:d.map,format:d.format,organizer:d.organizer,kind:d.kind};if(editingId)Object.assign(state.events.find(x=>x.id===editingId),obj);else state.events.push({id:crypto.randomUUID(),...obj,status:"scheduled",ourScore:null,opponentScore:null,outcome:null,report:"",proof:"",registrations:[],attendance:[]});save();toast(editingId?"Матч обновлён":"Матч создан");}
 if(modalMode==="report"){const e=state.events.find(x=>x.id===editingId);Object.assign(e,{opponent:d.opponent,date:d.date,ourScore:Number(d.ourScore),opponentScore:Number(d.opponentScore),proof:d.proof,report:d.report,attendance:$$('input[name="attendance"]:checked').map(x=>x.value),status:"completed",outcome:Number(d.ourScore)>Number(d.opponentScore)?"win":Number(d.ourScore)<Number(d.opponentScore)?"loss":"draw"});save();toast("Результат и явка сохранены");}
 if(modalMode==="tournament"){if(!d.name.trim()){toast("Укажите название турнира");return}const obj={name:d.name.trim(),organizer:d.organizer,format:d.format,status:d.status,start:d.start,end:d.end};if(editingId)Object.assign(state.tournaments.find(x=>x.id===editingId),obj);else state.tournaments.push({id:crypto.randomUUID(),...obj});save();toast(editingId?"Турнир обновлён":"Турнир создан");}
 closeModal();
});
$("#modal-close").onclick=closeModal;$("#modal-cancel").onclick=closeModal;backdrop.addEventListener("click",e=>{if(e.target===backdrop)closeModal()});document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
$("#add-member-btn").onclick=()=>openModal("member");
$("#member-search").addEventListener("input",renderRoster);$("#member-status-filter").addEventListener("change",renderRoster);$("#member-role-filter").addEventListener("change",()=>{activeRoleFilter=$("#member-role-filter").value;renderRoster()});$("#member-leadership-filter").addEventListener("change",renderRoster);
$$(".nav-item[data-page]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.page)));
$("#add-squad-btn").addEventListener("click",()=>openModal("squad"));
$("#add-squad-btn").hidden=!canEditMembers;
document.addEventListener("submit",async e=>{const assignmentForm=e.target.closest("[data-assign-form]");if(!assignmentForm)return;e.preventDefault();if(!canEditMembers)return;const fd=new FormData(assignmentForm);const memberId=fd.get("member_id");if(!memberId)return;const button=assignmentForm.querySelector('button[type="submit"]');button.disabled=true;try{await assignMemberToSquad(memberId,assignmentForm.dataset.assignForm);toast("Боец добавлен в отряд");}catch(err){toast("Не удалось назначить бойца: "+(err.message||err));}finally{button.disabled=false;}});
document.addEventListener("click",async e=>{
 const editSquad=e.target.closest("[data-edit-squad]");if(editSquad){openModal("squad",editSquad.dataset.editSquad);return;}
 const unassign=e.target.closest("[data-unassign-member]");if(unassign){if(!canEditMembers)return;if(!confirm("Убрать бойца из этого отряда? Его карточка и основная роль не изменятся."))return;try{await unassignMemberFromSquad(unassign.dataset.unassignMember);toast("Боец убран из отряда");}catch(err){toast("Не удалось изменить состав: "+(err.message||err));}return;}
 const rolePick=e.target.closest("[data-role-pick]");if(rolePick){activeRoleFilter=activeRoleFilter===rolePick.dataset.rolePick?"all":rolePick.dataset.rolePick;$("#member-role-filter").value=activeRoleFilter;renderRoster()}
 const go=e.target.closest("[data-goto]");if(go)navigate(go.dataset.goto);
 const em=e.target.closest("[data-edit-member]");if(em)openModal("member",em.dataset.editMember);
 const ee=e.target.closest("[data-edit-event]");if(ee)openModal("event",ee.dataset.editEvent);
 const re=e.target.closest("[data-report-event]");if(re)openModal("report",re.dataset.reportEvent);
 const et=e.target.closest("[data-edit-tournament]");if(et)openModal("tournament",et.dataset.editTournament);
 const tm=e.target.closest("[data-tournament-matches]");if(tm){navigate("matches");matchFilter="all";$$("[data-match-filter]").forEach(b=>b.classList.toggle("selected",b.dataset.matchFilter==="all"));renderMatches();const cards=$$(".match-card");cards.forEach(c=>{if(!c.textContent.includes(tournamentName(tm.dataset.tournamentMatches)))c.style.display="none"})}
 const mf=e.target.closest("[data-match-filter]");if(mf){matchFilter=mf.dataset.matchFilter;$$("[data-match-filter]").forEach(b=>b.classList.toggle("selected",b===mf));renderMatches()}
});
$("#mobile-menu").onclick=()=>$("#sidebar").classList.toggle("open");
function exportJSON(){const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});downloadBlob(blob,"wardogs-backup.json")}
function downloadBlob(blob,name){const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
$("#export-btn").onclick=exportJSON;$("#settings-export").onclick=exportJSON;
function exportCSV(){const rows=[["date","opponent","tournament","outcome","our_score","opponent_score","organizer"],...completed().map(e=>[e.date,e.opponent,tournamentName(e.tournamentId),e.outcome,e.ourScore,e.opponentScore,e.organizer])];const csv=rows.map(r=>r.map(v=>`"${String(v??"").replace(/"/g,'""')}"`).join(",")).join("\r\n");downloadBlob(new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8"}),"wardogs-match-results.csv")}
$("#analytics-export").onclick=exportCSV;

$("#analytics-period").onchange=()=>renderAnalytics();
// Do not load the demo roster into the live database. The shared roster is loaded after authentication.
state=structuredClone(seed);state.members=[];renderAll();navigate("roster");initializeApp().catch(err=>{showAuth(true);authMessage("Ошибка запуска: "+(err.message||err));});
