let mode="text", credits=100;

const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);

const promptBox=$("#prompt");
const counter=$("#counter");
const upload=$("#uploadLabel");
const uploadTitle=$("#uploadTitle");
const input=$("#mediaInput");
const voicePanel=$("#voicePanel");
const moreTools=$("#moreTools");
const moreMenu=$("#moreMenu");
const accountPage=$("#accountPage");

function setMode(m){
  mode=m;

  $$(".mode").forEach(x=>
    x.classList.toggle("active",x.dataset.mode===m)
  );

  $$(".sidebar a[data-mode]").forEach(x=>
    x.classList.toggle("active",x.dataset.mode===m)
  );

  const needsMedia=["image","textimage","video"].includes(m);

  upload?.classList.toggle("hidden",!needsMedia);

  if(uploadTitle){
    uploadTitle.textContent=m==="video"?"Upload Video":"Upload Image";
  }

  if(input){
    input.accept=m==="video"?"video/*":"image/*";
  }

  voicePanel?.classList.toggle("hidden",m!=="voice");

  if(["music","soundfx","subtitle","thumbnail","story"].includes(m)){
    voicePanel?.classList.add("hidden");

    if(promptBox){
      promptBox.placeholder =
        m==="music"
        ? "Describe the music you want..."
        : m==="soundfx"
        ? "Describe the sound effects..."
        : m==="subtitle"
        ? "Paste your video/script text..."
        : m==="thumbnail"
        ? "Describe the thumbnail scene..."
        : "Describe your story...";
    }
  }

  if(m==="voice"){
    promptBox.placeholder=
      "Write your script here. Example: Welcome to Viky AI, where your ideas become videos...";
  }
  else if(m==="image"){
    promptBox.placeholder=
      "Describe the motion: camera slowly moves forward, subject moves naturally...";
  }
  else if(m==="textimage"){
    promptBox.placeholder=
      "Describe what should happen to the uploaded image...";
  }
  else if(!["music","soundfx","subtitle","thumbnail","story"].includes(m)){
    promptBox.placeholder=
      "A cinematic scene with realistic movement...";
  }
}

promptBox?.addEventListener("input",()=>{
  if(counter){
    counter.textContent=
      `${promptBox.value.length} / 2000`;
  }
});

$$(".mode,.sidebar a[data-mode]").forEach(x=>
  x.addEventListener("click",()=>{
    const m=x.dataset.mode;

    if(["female","male","young","narrator"].includes(m)){
      setMode("voice");
    }
    else if([
      "music",
      "soundfx",
      "subtitle",
      "thumbnail",
      "story",
      "videos",
      "templates",
      "favorites"
    ].includes(m)){
      setMode(m);
    }
    else{
      setMode(m);
    }

    if(
      moreMenu &&
      !moreMenu.classList.contains("hidden") &&
      m!=="more"
    ){
      moreMenu.classList.add("hidden");
    }
  })
);

moreTools?.addEventListener("click",()=>{
  moreMenu?.classList.toggle("hidden");

  const b=moreTools?.querySelector("b");

  if(b){
    b.textContent=
      moreMenu?.classList.contains("hidden")
      ?"⌄"
      :"⌃";
  }
});

$$("[data-page]").forEach(x=>
  x.addEventListener("click",()=>{
    const p=x.dataset.page;

    if(p==="dashboard"){
      return showDashboard();
    }

    if(p==="admin"){
      return showAdminPage();
    }

    showAccount(p);
  })
);

$("#backDashboard")?.addEventListener("click",showDashboard);

function showAccount(p){
  accountPage?.classList.remove("hidden");

  document.querySelector(".content")?.classList.add("hidden");

  ["profile","subscription","settings"].forEach(x=>{
    $("#"+x+"Page")?.classList.add("hidden");
  });

  $("#"+p+"Page")?.classList.remove("hidden");

  const title=$("#accountTitle");

  if(title){
    title.textContent=
      p[0].toUpperCase()+p.slice(1);
  }
}

function showDashboard(){
  accountPage?.classList.add("hidden");

  $("#adminPage")?.classList.add("hidden");

  document.querySelector(".content")?.classList.remove("hidden");
}

$$(".choices button").forEach(b=>
  b.addEventListener("click",()=>{
    b.parentElement
      .querySelectorAll("button")
      .forEach(x=>x.classList.remove("selected"));

    b.classList.add("selected");
  })
);

$$(".voice-choice").forEach(b=>
  b.addEventListener("click",()=>{
    $$(".voice-choice").forEach(x=>
      x.classList.remove("selected")
    );

    b.classList.add("selected");
  })
);

input?.addEventListener("change",()=>{
  if(input.files[0]){
    upload.querySelector("small").textContent=
      `Selected: ${input.files[0].name}`;
  }
});

$("#generate")?.addEventListener("click",()=>{
  const cost=
    mode==="voice"
    ?10
    :mode==="music"
    ?8
    :mode==="soundfx"
    ?5
    :mode==="subtitle"
    ?5
    :mode==="thumbnail"
    ?5
    :20;

  if(credits<cost){
    alert(
      `Not enough credits. This action needs ${cost} credits.`
    );

    scrollToPricing();
    return;
  }

  if(
    ["image","textimage","video"].includes(mode) &&
    !input.files.length
  ){
    alert(
      "Please upload the required image/video first."
    );

    return;
  }

  if(!promptBox.value.trim()){
    alert(
      mode==="voice"
      ?"Please enter your voice-over script."
      :"Please enter a prompt."
    );

    return;
  }

  credits-=cost;

  if($("#creditCount")){
    $("#creditCount").textContent=credits;
  }

  const btn=$("#generate");

  btn.disabled=true;

  btn.innerHTML=
    mode==="voice"
    ?"⏳ CREATING VOICE…"
    :"⏳ GENERATING VIDEO…";

  setTimeout(()=>{
    btn.disabled=false;

    btn.innerHTML=
      `⚡ GENERATE ${
        mode==="voice"?"VOICE":"VIDEO"
      } <span>${cost} credits</span>`;

    const list=$("#recentList");

    if(list){
      if(list.querySelector(".empty")){
        list.innerHTML="";
      }

      const item=document.createElement("div");

      item.className="video-item";

      const label=
        mode==="voice"
        ?"AI Voice Over"
        :mode==="music"
        ?"AI Music"
        :mode==="soundfx"
        ?"Sound Effects"
        :mode==="subtitle"
        ?"AI Subtitles"
        :mode==="thumbnail"
        ?"AI Thumbnail"
        :mode==="story"
        ?"AI Story Video"
        :"AI Video";

      item.innerHTML=`
        <div class="thumb"></div>
        <div>
          <b>${label}</b>
          <small>✓ Demo complete • ${cost} credits</small>
        </div>
      `;

      list.prepend(item);
    }
  },1800);
});

function scrollToPricing(){
  document
    .querySelector("#pricing")
    ?.scrollIntoView({
      behavior:"smooth"
    });
}

function buy(plan){
  alert(
    `${plan} selected. Payment gateway will be connected in the backend step.`
  );
}

window.scrollToPricing=scrollToPricing;


/* =========================================
   SUPABASE ADMIN DASHBOARD
   ========================================= */

let supabaseClient=null;
let currentUser=null;
let isAdmin=false;


/* Initialize Supabase */

function initSupabaseAdmin(){

  const url=window.VIKY_SUPABASE_URL;
  const key=window.VIKY_SUPABASE_ANON_KEY;

  if(
    !url ||
    !key ||
    url.includes("YOUR_SUPABASE") ||
    key.includes("YOUR_SUPABASE")
  ){
    console.warn(
      "Supabase is not configured yet."
    );

    return;
  }

  if(window.supabase?.createClient){

    supabaseClient=
      window.supabase.createClient(
        url,
        key
      );

    checkAdminAccess();
  }
}


/* Check logged-in user and admin role */

async function checkAdminAccess(){

  if(!supabaseClient){
    return;
  }

  try{

    const {
      data:{user},
      error:userError
    }=
      await supabaseClient.auth.getUser();

    if(userError || !user){

      hideAdminNav();

      return;
    }

    currentUser=user;


    const {
      data:roleRow,
      error:roleError
    }=
      await supabaseClient
        .from("user_roles")
        .select("role")
        .eq("user_id",user.id)
        .maybeSingle();


    if(roleError){

      console.error(
        "Admin role check failed:",
        roleError
      );

      hideAdminNav();

      return;
    }


    isAdmin=
      roleRow?.role==="admin";


    if(isAdmin){

      $("#adminNav")
        ?.classList.remove("hidden");

      if($("#adminRole")){
        $("#adminRole").textContent="admin";
      }

      if($("#adminStatus")){
        $("#adminStatus").textContent=
          "✓ Authorized";
      }

      if($("#adminEmail")){
        $("#adminEmail").textContent=
          user.email || "—";
      }

    }
    else{

      hideAdminNav();

    }

  }
  catch(err){

    console.error(err);

    hideAdminNav();

  }
}


/* Hide Admin Dashboard from normal users */

function hideAdminNav(){

  $("#adminNav")
    ?.classList.add("hidden");

}


/* Open Admin Dashboard */

function showAdminPage(){

  if(!isAdmin){

    alert(
      "Admin access required."
    );

    return;
  }


  document
    .querySelector(".content")
    ?.classList.add("hidden");


  accountPage
    ?.classList.add("hidden");


  $("#adminPage")
    ?.classList.remove("hidden");


  if($("#adminRole")){
    $("#adminRole").textContent=
      "admin";
  }

  if($("#adminStatus")){
    $("#adminStatus").textContent=
      "✓ Authorized";
  }

  if($("#adminEmail")){
    $("#adminEmail").textContent=
      currentUser?.email || "—";
  }

}


/* Back button */

$("#backFromAdmin")
  ?.addEventListener(
    "click",
    ()=>{
      $("#adminPage")
        ?.classList.add("hidden");

      showDashboard();
    }
  );


/* Admin Users */

$("#adminUsersBtn")
  ?.addEventListener(
    "click",
    ()=>{

      const box=$("#adminMessage");

      if(!box) return;

      box.style.display="block";

      box.textContent=
        "User management needs a secure backend/Edge Function. Do not expose the Supabase service_role key in the frontend.";

    }
  );


/* Admin Credits */

$("#adminCreditsBtn")
  ?.addEventListener(
    "click",
    ()=>{

      const box=$("#adminMessage");

      if(!box) return;

      box.style.display="block";

      box.textContent=
        "Credits management is ready for the next backend step.";

    }
  );


/* Admin Videos */

$("#adminVideosBtn")
  ?.addEventListener(
    "click",
    ()=>{

      const box=$("#adminMessage");

      if(!box) return;

      box.style.display="block";

      box.textContent=
        "Video management is ready for the next backend step.";

    }
  );


/* Admin Settings */

$("#adminSettingsBtn")
  ?.addEventListener(
    "click",
    ()=>{

      const box=$("#adminMessage");

      if(!box) return;

      box.style.display="block";

      box.textContent=
        "Admin settings are ready for the next backend step.";

    }
  );


/* Admin navigation */

$$("[data-page]").forEach(x=>{

  x.addEventListener(
    "click",
    ()=>{

      const p=x.dataset.page;

      if(p==="admin"){
        showAdminPage();
      }

    }
  );

});


/* Start Supabase */

document.addEventListener(
  "DOMContentLoaded",
  initSupabaseAdmin
);