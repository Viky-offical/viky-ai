let mode="text", credits=100;
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const promptBox=$("#prompt"), counter=$("#counter"), upload=$("#uploadLabel"), uploadTitle=$("#uploadTitle"), input=$("#mediaInput"), voicePanel=$("#voicePanel"), moreTools=$("#moreTools"), moreMenu=$("#moreMenu"), accountPage=$("#accountPage");

function setMode(m){
  mode=m;
  $$(".mode").forEach(x=>x.classList.toggle("active",x.dataset.mode===m));
  $$(".sidebar a[data-mode]").forEach(x=>x.classList.toggle("active",x.dataset.mode===m));
  const needsMedia=["image","textimage","video"].includes(m);
  upload.classList.toggle("hidden",!needsMedia);
  uploadTitle.textContent=m==="video"?"Upload Video":"Upload Image";
  input.accept=m==="video"?"video/*":"image/*";
  voicePanel.classList.toggle("hidden",m!=="voice");
  if(["music","soundfx","subtitle","thumbnail","story"].includes(m)){
    voicePanel.classList.add("hidden");
    promptBox.placeholder = m==="music" ? "Describe the music you want..." : m==="soundfx" ? "Describe the sound effects..." : m==="subtitle" ? "Paste your video/script text..." : m==="thumbnail" ? "Describe the thumbnail scene..." : "Describe your story...";
  }
  if(m==="voice"){
    promptBox.placeholder="Write your script here. Example: Welcome to Viky AI, where your ideas become videos...";
  }else if(m==="image"){
    promptBox.placeholder="Describe the motion: camera slowly moves forward, subject moves naturally...";
  }else if(m==="textimage"){
    promptBox.placeholder="Describe what should happen to the uploaded image...";
  }else{
    promptBox.placeholder="A cinematic scene with realistic movement...";
  }
}
promptBox.addEventListener("input",()=>counter.textContent=`${promptBox.value.length} / 2000`);

$$(".mode,.sidebar a[data-mode]").forEach(x=>x.addEventListener("click",()=>{
  const m=x.dataset.mode;
  if(["female","male","young","narrator"].includes(m)){setMode("voice");}
  else if(["music","soundfx","subtitle","thumbnail","story","videos","templates","favorites"].includes(m)){setMode(m);}
  else setMode(m);
  if(moreMenu && !moreMenu.classList.contains("hidden") && m!=="more") moreMenu.classList.add("hidden");
}));
moreTools?.addEventListener("click",()=>{moreMenu.classList.toggle("hidden"); moreTools.querySelector("b").textContent=moreMenu.classList.contains("hidden")?"⌄":"⌃"});
$$("[data-page]").forEach(x=>x.addEventListener("click",()=>{
  const p=x.dataset.page;
  if(p==="dashboard") return showDashboard();
  showAccount(p);
}));
$("#backDashboard")?.addEventListener("click",showDashboard);
function showAccount(p){
  accountPage.classList.remove("hidden"); document.querySelector(".content").classList.add("hidden");
  ["profile","subscription","settings"].forEach(x=>$("#"+x+"Page")?.classList.add("hidden"));
  $("#"+p+"Page")?.classList.remove("hidden");
  $("#accountTitle").textContent=p[0].toUpperCase()+p.slice(1);
}
function showDashboard(){accountPage.classList.add("hidden");document.querySelector(".content").classList.remove("hidden");}


$$(".choices button").forEach(b=>b.addEventListener("click",()=>{
  b.parentElement.querySelectorAll("button").forEach(x=>x.classList.remove("selected"));
  b.classList.add("selected");
}));

$$(".voice-choice").forEach(b=>b.addEventListener("click",()=>{
  $$(".voice-choice").forEach(x=>x.classList.remove("selected")); b.classList.add("selected");
}));

input.addEventListener("change",()=>{
  if(input.files[0]){
    upload.querySelector("small").textContent=`Selected: ${input.files[0].name}`;
  }
});

$("#generate").addEventListener("click",()=>{
  const cost=mode==="voice"?10:(mode==="music"?8:(mode==="soundfx"?5:(mode==="subtitle"?5:(mode==="thumbnail"?5:20))));
  if(credits<cost){alert(`Not enough credits. This action needs ${cost} credits.`);scrollToPricing();return}
  if(["image","textimage","video"].includes(mode)&&!input.files.length){
    alert("Please upload the required image/video first.");return
  }
  if(!promptBox.value.trim()){alert(mode==="voice"?"Please enter your voice-over script.":"Please enter a prompt.");return}
  credits-=cost;$("#creditCount").textContent=credits;
  const btn=$("#generate");btn.disabled=true;btn.innerHTML=mode==="voice"?"⏳ CREATING VOICE…":"⏳ GENERATING VIDEO…";
  setTimeout(()=>{
    btn.disabled=false;btn.innerHTML=`⚡ GENERATE ${mode==="voice"?"VOICE":"VIDEO"} <span>${cost} credits</span>`;
    const list=$("#recentList"); if(list.querySelector(".empty")) list.innerHTML="";
    const item=document.createElement("div");item.className="video-item";
    const label=mode==="voice"?"AI Voice Over":mode==="music"?"AI Music":mode==="soundfx"?"Sound Effects":mode==="subtitle"?"AI Subtitles":mode==="thumbnail"?"AI Thumbnail":mode==="story"?"AI Story Video":"AI Video";
    item.innerHTML=`<div class="thumb"></div><div><b>${label}</b><small>✓ Demo complete • ${cost} credits</small></div>`;
    list.prepend(item);
  },1800);
});

function scrollToPricing(){document.querySelector("#pricing").scrollIntoView({behavior:"smooth"})}
function buy(plan){alert(`${plan} selected. Payment gateway will be connected in the backend step.`)}
window.scrollToPricing=scrollToPricing;
