const rows = [
  ["一宮","19:14","00","", "19:14","00"],
  ["観音","19:16","20","", "19:16","50"],
  ["苅安","19:18","30","×", "19:19","00"],
  ["二子","19:20","40","", "19:21","10"],
  ["萩原","19:22","50","×", "19:28","10"],
  ["玉野","19:29","55","", "19:30","25"],
  ["山崎","19:32","10","", "19:32","40"],
  ["森上","19:34","30","", "19:36","30"],
  ["上丸","19:38","40","", "19:39","10"],
  ["丸渕","19:40","50","", "19:41","20"],
  ["渕高","19:42","50","", "19:43","20"],
  ["六輪","19:45","00","", "19:45","30"],
  ["町方","19:47","25","", "19:47","55"],
  ["津島","19:50","10","", "", ""]
];

let zoom = 1;
function renderTable(){
  const tbody=document.querySelector("#schedule tbody");
  tbody.innerHTML="";
  rows.forEach((r,i)=>{
    const tr=document.createElement("tr");
    const leftMin=r[1].slice(-2), rightMin=r[4] ? r[4].slice(-2) : "";
    tr.innerHTML=`
      <td class="station">${r[0]}</td>
      <td class="time">${r[1].slice(0,3)}<span class="${leftMin==="00"?"pink":""}">${leftMin}</span></td>
      <td class="sec">${r[2]}</td>
      <td class="mark">${r[3]}</td>
      <td class="time">${r[4]?r[4].slice(0,3):""}${r[4]?`<span class="${rightMin==="00"?"pink":""}">${rightMin}</span>`:""}</td>
      <td class="sec">${r[5]||""}</td>`;
    tbody.appendChild(tr);
  });
}
function updateClock(){
  const d=new Date();
  const p=n=>String(n).padStart(2,"0");
  document.getElementById("digital").textContent=`${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
  drawClock(d);
}
function drawClock(d){
  const c=document.getElementById("analog"),ctx=c.getContext("2d"),w=c.width,h=c.height,cx=w/2,cy=h/2,r=73;
  ctx.clearRect(0,0,w,h);
  ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fillStyle="#fff";ctx.fill();ctx.strokeStyle="#111";ctx.lineWidth=2;ctx.stroke();
  for(let i=0;i<60;i++){const a=i*Math.PI/30;const outer=r-2, inner=r-(i%5===0?11:6);
    ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*inner,cy+Math.sin(a)*inner);ctx.lineTo(cx+Math.cos(a)*outer,cy+Math.sin(a)*outer);ctx.strokeStyle="#111";ctx.lineWidth=i%5===0?2:1;ctx.stroke();}
  ctx.font="15px sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";
  for(let i=1;i<=12;i++){const a=i*Math.PI/6-Math.PI/2;ctx.fillText(i,cx+Math.cos(a)*(r-19),cy+Math.sin(a)*(r-19));}
  const sec=d.getSeconds(), min=d.getMinutes()+sec/60, hr=(d.getHours()%12)+min/60;
  hand(hr/12*Math.PI*2-Math.PI/2,38,4); hand(min/60*Math.PI*2-Math.PI/2,52,3);
  ctx.strokeStyle="#e33";ctx.lineWidth=2;hand(sec/60*Math.PI*2-Math.PI/2,61,2,"#e33");
  function hand(a,len,lw,color="#111"){ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a)*len,cy+Math.sin(a)*len);ctx.strokeStyle=color;ctx.lineWidth=lw;ctx.stroke();}
  ctx.beginPath();ctx.arc(cx,cy,3,0,Math.PI*2);ctx.fillStyle="#111";ctx.fill();
}
function refresh(){
  const now=new Date();
  document.getElementById("status").textContent=`デモ時刻表 / 最終更新 ${now.toLocaleTimeString("ja-JP")}`;
  document.querySelectorAll("#schedule tr").forEach((tr,i)=>tr.classList.toggle("active",i===Math.floor(now.getSeconds()/5)%rows.length));
}
document.getElementById("refreshBtn").onclick=refresh;
document.getElementById("brightnessBtn").onclick=()=>document.body.classList.toggle("dark");
document.getElementById("zoomIn").onclick=()=>{zoom=Math.min(1.3,zoom+.1);document.body.style.fontSize=zoom+"em"};
document.getElementById("zoomOut").onclick=()=>{zoom=Math.max(.8,zoom-.1);document.body.style.fontSize=zoom+"em"};
document.getElementById("officialBtn").onclick=()=>window.open("https://top.meitetsu.co.jp/em/","_blank");
document.getElementById("backBtn").onclick=()=>alert("列車一覧画面は次の拡張で追加できます。");
document.getElementById("menuBtn").onclick=()=>alert("設定：表示切替・拡大縮小・時刻表更新");
renderTable(); refresh(); updateClock();
setInterval(updateClock,1000);
setInterval(refresh,5000);
