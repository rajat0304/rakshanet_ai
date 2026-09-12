const pages=[...document.querySelectorAll('.page')], nav=[...document.querySelectorAll('.nav-item')];
const alerts=[
 {time:'21:40:12',sev:'High',event:'Unusual read burst — /records/',source:'AI Engine',status:'Open'},
 {time:'21:38:55',sev:'High',event:'New IP, high request rate',source:'AI Engine',status:'Open'},
 {time:'19:02:03',sev:'Low',event:'Login pattern normalized',source:'System',status:'Reviewed'},
 {time:'18:41:26',sev:'Medium',event:'Multiple failed login attempts',source:'AI Engine',status:'Reviewed'},
 {time:'16:12:09',sev:'Low',event:'Scheduled backup completed',source:'System',status:'Reviewed'}
];
const files=[
 ['scholarship_2026','Folder','—','Locked','12 Sep 2026, 21:39'],
 ['health_records','Folder','—','Locked','12 Sep 2026, 21:39'],
 ['id_scans','Folder','—','Encrypted','12 Sep 2026, 21:38'],
 ['welfare_data.db','Database','245 MB','Encrypted','12 Sep 2026, 18:20'],
 ['citizen_forms.pdf','PDF','12 MB','Protected','12 Sep 2026, 16:11'],
 ['ration_list.csv','CSV','5 MB','Protected','12 Sep 2026, 14:05'],
 ['school_records.xlsx','Excel','18 MB','Protected','12 Sep 2026, 12:44']
];
const timeline=[
 ['21:39:02','Anomalous access pattern detected on File Server 2','AI Engine'],
 ['21:39:05','Pre-Attack protocol triggered — remaining files chunked & encrypted','System'],
 ['21:39:08','Source fingerprinted: IP 41.203.x.x, flagged range, no prior access','Forensics'],
 ['21:39:14','Forced access attempt confirmed on health_records/','AI Engine'],
 ['21:39:15','Decryption key revoked; session terminated; no data destroyed','System'],
 ['21:41:30','Incident closed — 0 records exfiltrated, 18,204 files protected','System']
];

function showPage(id){
 pages.forEach(p=>p.classList.toggle('active-page',p.id===id));
 nav.forEach(n=>n.classList.toggle('active',n.dataset.page===id));
 document.getElementById('breadcrumb').textContent='rakshanet.local / '+id;
 window.scrollTo({top:0,behavior:'smooth'});
}
nav.forEach(n=>n.addEventListener('click',()=>showPage(n.dataset.page)));
document.querySelectorAll('[data-page-link]').forEach(b=>b.addEventListener('click',()=>showPage(b.dataset.pageLink)));

function renderAlerts(){
 const list=document.getElementById('alertList');
 list.innerHTML=alerts.slice(0,5).map(a=>`<div class="alert-item"><i class="dot ${a.sev==='Low'?'ok':''}"></i><div><b>${a.time}</b><br>${a.event}<small>${a.source}</small></div></div>`).join('');
 document.getElementById('alertsTable').innerHTML=alerts.map(a=>`<tr><td>${a.time}</td><td><b class="${a.sev==='High'?'red':''}">${a.sev}</b></td><td>${a.event}</td><td>${a.source}</td><td><span class="status ${a.status==='Open'?'locked':''}">${a.status}</span></td></tr>`).join('');
}
function renderFiles(filter=''){
 const rows=files.filter(f=>f.join(' ').toLowerCase().includes(filter.toLowerCase()));
 document.getElementById('vaultTable').innerHTML=rows.map(f=>`<tr><td>▰ &nbsp;${f[0]}</td><td>${f[1]}</td><td>${f[2]}</td><td><span class="status ${f[3]==='Locked'?'locked':''}">${f[3]}</span></td><td>${f[4]}</td><td>•••</td></tr>`).join('');
}
function renderTimeline(target){
 document.getElementById(target).innerHTML=timeline.map(t=>`<div class="timeline-row"><span class="timeline-time">${t[0]}</span><span>${t[1]}</span><span>${t[2]}</span></div>`).join('');
}
renderAlerts();renderFiles();renderTimeline('timeline');renderTimeline('reportTimeline');

function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2600)}
document.getElementById('vaultSearch').addEventListener('input',e=>renderFiles(e.target.value));
document.getElementById('clearAlerts').addEventListener('click',()=>{alerts.forEach(a=>a.status='Reviewed');renderAlerts();toast('All alerts marked as reviewed.');});

function drawChart(canvasId, spike=false){
 const c=document.getElementById(canvasId), ctx=c.getContext('2d'), dpr=devicePixelRatio||1, rect=c.getBoundingClientRect();
 c.width=rect.width*dpr;c.height=rect.height*dpr;ctx.scale(dpr,dpr);
 const w=rect.width,h=rect.height;ctx.clearRect(0,0,w,h);
 ctx.strokeStyle='#e5edf4';ctx.lineWidth=1;
 for(let y=25;y<h;y+=42){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke()}
 const pts=[];for(let i=0;i<=80;i++){let x=i/80*w;let base=90+Math.sin(i*.7)*20+Math.random()*22;if(spike&&i>65&&i<72)base+=300*(1-Math.abs(68-i)/4);pts.push([x,h-20-base*.48])}
 ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.strokeStyle='#1775e5';ctx.lineWidth=2;ctx.stroke();
 ctx.lineTo(w,h-20);ctx.lineTo(0,h-20);ctx.closePath();ctx.globalAlpha=.07;ctx.fillStyle='#1775e5';ctx.fill();ctx.globalAlpha=1;
 if(spike){ctx.beginPath();ctx.arc(pts[68][0],pts[68][1],4,0,Math.PI*2);ctx.fillStyle='#e43d45';ctx.fill();}
}
function resizeCharts(){drawChart('trafficChart',true);drawChart('trafficChart2',true)}
window.addEventListener('resize',resizeCharts);setTimeout(resizeCharts,50);

document.getElementById('simulateAttack').addEventListener('click',()=>{
 document.getElementById('anomalyCount').textContent='2';
 document.getElementById('threatScore').textContent='91';
 document.getElementById('scoreRing').style.background='conic-gradient(#df3037 91%,#e8eef3 0)';
 document.getElementById('anomalyDelta').textContent='↑ +1 in last 1h';
 document.querySelector('.big.green').textContent='⚠ INCIDENT';
 document.querySelector('.big.green').className='big red';
 toast('AI detected forced access. Opening containment workspace…');
 setTimeout(()=>showPage('incident'),700);
});
document.getElementById('generateReport').addEventListener('click',()=>{
 toast('Forensic report generated successfully.');
 setTimeout(()=>showPage('reports'),600);
});
document.getElementById('exportReport').addEventListener('click',()=>{
 const text=`RAKSHANET — INCIDENT FORENSIC REPORT\n\nIncident: INC-2026-0091\nDate: 12 Sep 2026\nSeverity: High\nStatus: Closed\nRecords Exfiltrated: 0\nFiles Protected: 18,204\n\nTIMELINE\n`+timeline.map(t=>t.join(' | ')).join('\n');
 const blob=new Blob([text],{type:'text/plain'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='RakshaNet_INC-2026-0091_Report.txt';a.click();URL.revokeObjectURL(url);toast('Report exported.');
});
document.getElementById('securedFiles').innerHTML=['scholarship_2026.csv → locked','health_records/ → locked','id_scans/ → chunked + encrypted','welfare_data.db → locked','examination_forms/ → locked'].map(x=>`<li>✓ ${x}</li>`).join('');
setInterval(()=>{const rpm=document.getElementById('rpm');if(rpm)rpm.textContent=300+Math.floor(Math.random()*100)},1800);
setInterval(()=>{document.getElementById('clock').textContent=new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',second:'2-digit'});},1000);
