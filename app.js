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
const statusNames={active:"Активен",probation:"Испытательный срок",inactive:"Неактивен",reserve:"Резерв"};
const statusClass={active:"",probation:"probation",inactive:"inactive",reserve:"reserve"};
const dateLabel=d=>{if(!d)return"—";let dt=new Date(d+"T12:00:00");return dt.toLocaleDateString("ru-RU",{day:"2-digit",month:"short"}).replace(".","").toUpperCase()};
const fullDate=d=>d?new Date(d+"T12:00:00").toLocaleDateString("ru-RU",{day:"2-digit",month:"long",year:"numeric"}):"—";
const initials=s=>(s||"?").split(/[\s_-]+/).slice(0,2).map(x=>x[0]||"").join("").toUpperCase();
const tournamentName=id=>state.tournaments.find(t=>t.id===id)?.name||"Клановый матч";
const completed=()=>state.events.filter(e=>e.status==="completed"&&e.outcome);
const wins=()=>completed().filter(e=>e.outcome==="win").length;
const losses=()=>completed().filter(e=>e.outcome==="loss").length;
function navigate(page){$$(".page").forEach(p=>p.classList.toggle("active",p.id==="page-"+page));$$(".nav-item[data-page]").forEach(b=>b.classList.toggle("active",b.dataset.page===page));$("#crumb").textContent=({overview:"Обзор",roster:"Состав",matches:"Матчи и события",tournaments:"Турниры",analytics:"Статистика",settings:"Настройки"})[page]||page;$("#sidebar").classList.remove("open");window.scrollTo({top:0,behavior:"smooth"});}
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
 grid.innerHTML=roleDefinitions.map(r=>`<button class="role-card ${activeRoleFilter===r.name?"selected":""}" data-role-pick="${esc(r.name)}"><span class="role-card-title">${esc(r.name)}</span><span class="role-card-desc">${esc(r.desc)}</span><span class="role-card-count">${state.members.filter(m=>memberRole(m)===r.name).length} игроков</span></button>`).join("");
 const select=$("#member-role-filter");
 if(select.options.length===1) roleDefinitions.forEach(r=>{const o=document.createElement("option");o.value=r.name;o.textContent=r.name;select.appendChild(o)});
}
let activeRoleFilter="all";
function renderRoster(){
 const q=$("#member-search").value.toLowerCase(),f=$("#member-status-filter").value,rf=$("#member-role-filter").value,lf=$("#member-leadership-filter").value;
 const arr=state.members.filter(m=>(m.nick+" "+m.discord+" "+(m.steam||"")+" "+m.squad+" "+memberRole(m)+" "+memberLeadership(m)+" "+(m.commandRole||"")).toLowerCase().includes(q)&&(f==="all"||m.status===f)&&(rf==="all"||memberRole(m)===rf)&&(lf==="all"||(lf==="none"?!memberLeadership(m):memberLeadership(m)===lf))).sort((a,b)=>a.nick.localeCompare(b.nick));
 $("#member-result-count").textContent=`${arr.length} игроков`;
 $("#members-table").innerHTML=arr.map(m=>{const appointments=[m.commandRole,memberLeadership(m)].filter(Boolean).join(" · ");return `<tr><td><div class="player-cell"><div class="player-avatar">${esc(initials(m.nick))}</div><div><b>${esc(m.nick)}</b><small>${m.discord?`Discord ID: ${esc(m.discord)}`:"Discord не привязан"}${m.steam?` · Steam ID: ${esc(m.steam)}`:""}</small></div></div></td><td><span class="status-pill ${statusClass[m.status]||""}">${statusNames[m.status]||m.status}</span></td><td><span class="role-pill ${m.roleProvisional?"provisional":""}">${esc(memberRole(m))}${m.roleProvisional?" · предварительная":""}</span></td><td>${appointments?`<span class="leadership-pill">${esc(appointments)}</span>`:`<span class="muted-cell">—</span>`}</td><td>${esc(m.squad||"—")}</td><td>${fullDate(m.last)}</td><td><button class="row-action" data-edit-member="${m.id}">Изменить ↗</button></td></tr>`}).join("")||`<tr><td colspan="7" class="empty-state">Игроки не найдены</td></tr>`;
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
const backdrop=$("#modal-backdrop"),fields=$("#modal-fields"),form=$("#modal-form");let modalMode="",editingId=null;
function field(name,label,type="text",value="",opts=null,full=false,placeholder=""){let html=`<div class="field ${full?"full-field":""}"><label for="f-${name}">${label}</label>`;if(type==="select"){html+=`<select id="f-${name}" name="${name}">${opts.map(o=>`<option value="${esc(o.value)}" ${String(o.value)===String(value)?"selected":""}>${esc(o.label)}</option>`).join("")}</select>`}else if(type==="textarea"){html+=`<textarea id="f-${name}" name="${name}" placeholder="${esc(placeholder)}">${esc(value)}</textarea>`}else{html+=`<input id="f-${name}" name="${name}" type="${type}" value="${esc(value)}" placeholder="${esc(placeholder)}" ${type==="number"?'min="0"':""}>`}return html+"</div>"}
function openModal(mode,id=null){
 modalMode=mode;editingId=id;fields.innerHTML="";
 const m=state.members.find(x=>x.id===id),e=state.events.find(x=>x.id===id),t=state.tournaments.find(x=>x.id===id);
 if(mode==="member"){
  $("#modal-kicker").textContent=m?"PERSONNEL / EDIT":"PERSONNEL / NEW";$("#modal-title").textContent=m?"Редактировать игрока":"Добавить игрока";
  fields.innerHTML=field("nick","ИГРОВОЙ НИК","text",m?.nick||"",null,false,"Например, Raven")+field("steam","STEAM ID","text",m?.steam||"",null,false,"Можно добавить позже")+field("discord","DISCORD ID","text",m?.discord||"",null,false,"Можно добавить позже")+field("status","СТАТУС","select",m?.status||"active",Object.entries(statusNames).map(([value,label])=>({value,label})))+field("role","БОЕВАЯ РОЛЬ","select",memberRole(m||{}),roleDefinitions.map(r=>({value:r.name,label:r.name})))+field("roleProvisional","СТАТУС БОЕВОЙ РОЛИ","select",m?.roleProvisional?"yes":"no",[{value:"no",label:"Подтверждена"},{value:"yes",label:"Предварительная — требует подтверждения"}])+field("leadership","СТАРШАЯ БОЕВАЯ РОЛЬ","select",memberLeadership(m||{}),[{value:"",label:"Нет назначения"},...leadershipRoles.map(r=>({value:r,label:r}))])+field("commandRole","НАЗНАЧЕНИЕ В УПРАВЛЕНИИ","select",m?.commandRole||"",[{value:"",label:"Нет назначения"},{value:"Командир",label:"Командир"},{value:"Офицер",label:"Офицер"}])+field("squad","ОТРЯД / ПОДРАЗДЕЛЕНИЕ","text",m?.squad||"",null,false,"Например, Alpha / 1-й отряд")+field("last","ПОСЛЕДНЯЯ АКТИВНОСТЬ","date",m?.last||iso(today))+field("joined","ДАТА ВСТУПЛЕНИЯ","date",m?.joined||iso(today));
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
form.addEventListener("submit",ev=>{ev.preventDefault();const d=formData();
 if(modalMode==="member"){if(!d.nick.trim()){toast("Укажите игровой ник");return}const duplicate=state.members.find(m=>m.id!==editingId&&((d.discord.trim()&&m.discord===d.discord.trim())||(d.steam.trim()&&m.steam===d.steam.trim())));if(duplicate){toast("Этот Steam ID или Discord ID уже привязан к игроку: "+duplicate.nick);return}const obj={nick:d.nick.trim(),steam:d.steam.trim(),discord:d.discord.trim(),status:d.status,role:d.role,roleProvisional:d.roleProvisional==="yes",leadership:d.leadership,commandRole:d.commandRole,squad:d.squad.trim(),last:d.last,joined:d.joined,matches:Number(d.matches)||0};if(editingId)Object.assign(state.members.find(m=>m.id===editingId),obj);else state.members.push({id:crypto.randomUUID(),...obj});save();toast(editingId?"Карточка игрока обновлена":"Игрок добавлен");}
 if(modalMode==="event"){if(!d.opponent.trim()){toast("Укажите соперника");return}const obj={opponent:d.opponent.trim(),tournamentId:d.tournamentId||null,date:d.date,time:d.time,map:d.map,format:d.format,organizer:d.organizer,kind:d.kind};if(editingId)Object.assign(state.events.find(x=>x.id===editingId),obj);else state.events.push({id:crypto.randomUUID(),...obj,status:"scheduled",ourScore:null,opponentScore:null,outcome:null,report:"",proof:"",registrations:[],attendance:[]});save();toast(editingId?"Матч обновлён":"Матч создан");}
 if(modalMode==="report"){const e=state.events.find(x=>x.id===editingId);Object.assign(e,{opponent:d.opponent,date:d.date,ourScore:Number(d.ourScore),opponentScore:Number(d.opponentScore),proof:d.proof,report:d.report,attendance:$$('input[name="attendance"]:checked').map(x=>x.value),status:"completed",outcome:Number(d.ourScore)>Number(d.opponentScore)?"win":Number(d.ourScore)<Number(d.opponentScore)?"loss":"draw"});save();toast("Результат и явка сохранены");}
 if(modalMode==="tournament"){if(!d.name.trim()){toast("Укажите название турнира");return}const obj={name:d.name.trim(),organizer:d.organizer,format:d.format,status:d.status,start:d.start,end:d.end};if(editingId)Object.assign(state.tournaments.find(x=>x.id===editingId),obj);else state.tournaments.push({id:crypto.randomUUID(),...obj});save();toast(editingId?"Турнир обновлён":"Турнир создан");}
 closeModal();
});
$("#modal-close").onclick=closeModal;$("#modal-cancel").onclick=closeModal;backdrop.addEventListener("click",e=>{if(e.target===backdrop)closeModal()});document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
$("#add-member-btn").onclick=()=>openModal("member");
$("#member-search").addEventListener("input",renderRoster);$("#member-status-filter").addEventListener("change",renderRoster);$("#member-role-filter").addEventListener("change",()=>{activeRoleFilter=$("#member-role-filter").value;renderRoster()});$("#member-leadership-filter").addEventListener("change",renderRoster);
$$(".nav-item[data-page]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.page)));
document.addEventListener("click",e=>{
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
$("#reset-demo").onclick=()=>{if(confirm("Сбросить все изменения и восстановить демонстрационные данные?")){localStorage.removeItem("wardogs-mvp-state-v1");load();renderAll();navigate("roster");toast("Демо-данные восстановлены")}};
$("#analytics-period").onchange=()=>renderAnalytics();
load();renderAll();navigate("roster");
