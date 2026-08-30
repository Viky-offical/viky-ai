/* =========================================================
   VIKY AI
   SUPABASE + AUTH + ADMIN + DASHBOARD
   ========================================================= */


/* =========================================================
   SUPABASE CONFIG
   ========================================================= */

const SUPABASE_URL =
  "https://qhcjicfxolurbjnvobur.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_D6EylVAso_ihWIS33ObsYg_onCINCKo";


/* =========================================================
   ADMIN CONFIG
   ========================================================= */

const ADMIN_EMAIL =
  "daimvirk555@gmail.com";


/* =========================================================
   SUPABASE CLIENT
   ONLY ONE CLIENT
   ========================================================= */

let supabaseClient = null;

if (
  window.supabase &&
  typeof window.supabase.createClient === "function"
) {
  supabaseClient =
    window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_KEY
    );
} else {
  console.error(
    "Supabase library was not loaded."
  );
}


/* =========================================================
   GLOBAL AUTH STATE
   ========================================================= */

let currentUser = null;
let isAdmin = false;


/* =========================================================
   AUTH ELEMENTS
   ========================================================= */

const authScreen =
  document.querySelector("#authScreen");

const authTitle =
  document.querySelector("#authTitle");

const authSubtitle =
  document.querySelector("#authSubtitle");

const authName =
  document.querySelector("#authName");

const authEmail =
  document.querySelector("#authEmail");

const authPassword =
  document.querySelector("#authPassword");

const authButton =
  document.querySelector("#authButton");

const authSwitch =
  document.querySelector("#authSwitch");

const authSwitchText =
  document.querySelector("#authSwitchText");

const forgotPassword =
  document.querySelector("#forgotPassword");

const authMessage =
  document.querySelector("#authMessage");


/* =========================================================
   AUTH MODE
   ========================================================= */

let signupMode = false;


/* =========================================================
   AUTH MESSAGE
   ========================================================= */

function showAuthMessage(
  message,
  error = false
) {
  if (!authMessage) {
    return;
  }

  authMessage.textContent =
    message;

  authMessage.style.color =
    error
      ? "#ff5c5c"
      : "#22c55e";
}


/* =========================================================
   ADMIN EMAIL CHECK
   ========================================================= */

function isAdminEmail(email) {
  if (!email) {
    return false;
  }

  return (
    email.trim().toLowerCase() ===
    ADMIN_EMAIL.trim().toLowerCase()
  );
}


/* =========================================================
   LOGIN / SIGNUP SWITCH
   ========================================================= */

authSwitch?.addEventListener(
  "click",
  () => {

    signupMode =
      !signupMode;


    if (signupMode) {

      if (authTitle) {
        authTitle.textContent =
          "Create your account";
      }

      if (authSubtitle) {
        authSubtitle.textContent =
          "Join Viky AI and start creating";
      }

      if (authName) {
        authName.style.display =
          "block";
      }

      if (authButton) {
        authButton.textContent =
          "Create Account";
      }

      if (authSwitchText) {
        authSwitchText.textContent =
          "Already have an account?";
      }

      authSwitch.textContent =
        "Sign In";


      if (forgotPassword) {
        forgotPassword.style.display =
          "none";
      }

    } else {

      if (authTitle) {
        authTitle.textContent =
          "Welcome to Viky AI";
      }

      if (authSubtitle) {
        authSubtitle.textContent =
          "Sign in to continue";
      }

      if (authName) {
        authName.style.display =
          "none";
      }

      if (authButton) {
        authButton.textContent =
          "Sign In";
      }

      if (authSwitchText) {
        authSwitchText.textContent =
          "Don't have an account?";
      }

      authSwitch.textContent =
        "Create Account";


      if (forgotPassword) {
        forgotPassword.style.display =
          "block";
      }
    }


    showAuthMessage("");
  }
);


/* =========================================================
   LOGIN / SIGNUP
   ========================================================= */

authButton?.addEventListener(
  "click",
  async () => {

    if (!supabaseClient) {

      showAuthMessage(
        "Supabase connection is not available.",
        true
      );

      return;
    }


    const email =
      authEmail?.value.trim() || "";

    const password =
      authPassword?.value || "";

    const name =
      authName?.value.trim() || "";


    /* -------------------------------------------------------
       VALIDATION
       ------------------------------------------------------- */

    if (!email || !password) {

      showAuthMessage(
        "Please enter email and password.",
        true
      );

      return;
    }


    if (signupMode && !name) {

      showAuthMessage(
        "Please enter your name.",
        true
      );

      return;
    }


    if (password.length < 6) {

      showAuthMessage(
        "Password must be at least 6 characters.",
        true
      );

      return;
    }


    /* -------------------------------------------------------
       BUTTON STATE
       ------------------------------------------------------- */

    authButton.disabled =
      true;

    showAuthMessage(
      "Please wait..."
    );


    try {

      /* =====================================================
         SIGNUP
         ===================================================== */

      if (signupMode) {

        const {
          data,
          error
        } =
          await supabaseClient.auth.signUp({
            email: email,
            password: password,

            options: {
              data: {
                full_name: name
              }
            }
          });


        if (error) {
          throw error;
        }


        /*
           If Supabase email confirmation is ON,
           session can be null.
        */

        if (data?.session) {

          currentUser =
            data.user || null;

          showAuthMessage(
            "Account created successfully!"
          );

          await showApp();

          await checkAdminAccess();

        } else {

          showAuthMessage(
            "Account created. Please verify your email, then sign in."
          );
        }


        return;
      }


      /* =====================================================
         LOGIN
         ===================================================== */

      const {
        data,
        error
      } =
        await supabaseClient.auth
          .signInWithPassword({
            email: email,
            password: password
          });


      if (error) {
        throw error;
      }


      if (!data?.user) {

        showAuthMessage(
          "Login failed. User was not returned.",
          true
        );

        return;
      }


      currentUser =
        data.user;


      showAuthMessage(
        "Login successful!"
      );


      await showApp();

      await checkAdminAccess();

    } catch (error) {

      console.error(
        "Authentication error:",
        error
      );


      let message =
        error?.message ||
        "Something went wrong. Please try again.";


      if (
        message
          .toLowerCase()
          .includes("invalid login credentials")
      ) {

        message =
          "Invalid email or password.";
      }


      showAuthMessage(
        message,
        true
      );

    } finally {

      authButton.disabled =
        false;
    }
  }
);


/* =========================================================
   FORGOT PASSWORD
   ========================================================= */

forgotPassword?.addEventListener(
  "click",
  async () => {

    if (!supabaseClient) {

      showAuthMessage(
        "Supabase connection is not available.",
        true
      );

      return;
    }


    const email =
      authEmail?.value.trim() || "";


    if (!email) {

      showAuthMessage(
        "Enter your email first.",
        true
      );

      return;
    }


    try {

      showAuthMessage(
        "Sending password reset email..."
      );


      const {
        error
      } =
        await supabaseClient.auth
          .resetPasswordForEmail(
            email,
            {
              redirectTo:
                window.location.origin
            }
          );


      if (error) {
        throw error;
      }


      showAuthMessage(
        "Password reset email sent."
      );

    } catch (error) {

      console.error(
        "Password reset error:",
        error
      );


      showAuthMessage(
        error?.message ||
        "Unable to send password reset email.",
        true
      );
    }
  }
);


/* =========================================================
   SHOW APP
   ========================================================= */

async function showApp() {

  if (authScreen) {
    authScreen.style.display =
      "none";
  }


  if (!supabaseClient) {
    return;
  }


  try {

    const {
      data,
      error
    } =
      await supabaseClient.auth
        .getUser();


    if (error) {
      throw error;
    }


    if (!data?.user) {
      return;
    }


    currentUser =
      data.user;


    const userName =
      data.user.user_metadata
        ?.full_name ||
      data.user.email
        ?.split("@")[0] ||
      "Viky User";


    document
      .querySelectorAll("body *")
      .forEach(
        (element) => {

          if (
            element.children.length === 0 &&
            element.textContent.trim() ===
              "Viky User"
          ) {

            element.textContent =
              userName;
          }
        }
      );

  } catch (error) {

    console.error(
      "Could not load user:",
      error
    );
  }
}


/* =========================================================
   SHOW LOGIN
   ========================================================= */

function showLogin() {

  if (authScreen) {

    authScreen.style.display =
      "flex";
  }
}


/* =========================================================
   CHECK LOGIN SESSION
   ========================================================= */

async function checkLogin() {

  if (!supabaseClient) {

    showLogin();

    return;
  }


  try {

    const {
      data,
      error
    } =
      await supabaseClient.auth
        .getSession();


    if (error) {
      throw error;
    }


    if (data?.session) {

      currentUser =
        data.session.user;

      await showApp();

      await checkAdminAccess();

    } else {

      showLogin();
    }

  } catch (error) {

    console.error(
      "Session check failed:",
      error
    );

    showLogin();
  }
}


/* =========================================================
   AUTH STATE CHANGE
   ========================================================= */

if (supabaseClient) {

  supabaseClient.auth
    .onAuthStateChange(
      (event, session) => {

        if (session) {

          currentUser =
            session.user;

          /*
             Give the current event time to finish.
          */

          setTimeout(
            () => {
              showApp();
              checkAdminAccess();
            },
            0
          );

        } else {

          currentUser =
            null;

          isAdmin =
            false;

          hideAdminNav();

          showLogin();
        }
      }
    );
}


/* =========================================================
   LOGOUT
   ========================================================= */

async function logout() {

  if (!supabaseClient) {
    return;
  }


  try {

    const {
      error
    } =
      await supabaseClient.auth
        .signOut();


    if (error) {
      throw error;
    }


    currentUser =
      null;

    isAdmin =
      false;

    hideAdminNav();

    showLogin();

  } catch (error) {

    console.error(
      "Logout error:",
      error
    );


    alert(
      error?.message ||
      "Logout failed."
    );
  }
}


/*
   Allows HTML:
   onclick="logout()"
*/

window.logout =
  logout;


/* =========================================================
   BASIC DASHBOARD
   ========================================================= */

let mode =
  "text";

let credits =
  100;


const $ =
  (selector) =>
    document.querySelector(
      selector
    );


const $$ =
  (selector) =>
    document.querySelectorAll(
      selector
    );


const promptBox =
  $("#prompt");


const counter =
  $("#counter");


const upload =
  $("#uploadLabel");


const uploadTitle =
  $("#uploadTitle");


const input =
  $("#mediaInput");


const voicePanel =
  $("#voicePanel");


const moreTools =
  $("#moreTools");


const moreMenu =
  $("#moreMenu");


const accountPage =
  $("#accountPage");


/* =========================================================
   MODE
   ========================================================= */

function setMode(m) {

  mode =
    m;


  $$(".mode").forEach(
    (element) => {

      element.classList.toggle(
        "active",
        element.dataset.mode === m
      );
    }
  );


  $$(".sidebar a[data-mode]")
    .forEach(
      (element) => {

        element.classList.toggle(
          "active",
          element.dataset.mode === m
        );
      }
    );


  const needsMedia =
    [
      "image",
      "textimage",
      "video"
    ].includes(m);


  upload?.classList.toggle(
    "hidden",
    !needsMedia
  );


  if (uploadTitle) {

    uploadTitle.textContent =
      m === "video"
        ? "Upload Video"
        : "Upload Image";
  }


  if (input) {

    input.accept =
      m === "video"
        ? "video/*"
        : "image/*";
  }


  voicePanel?.classList.toggle(
    "hidden",
    m !== "voice"
  );


  if (
    [
      "music",
      "soundfx",
      "subtitle",
      "thumbnail",
      "story"
    ].includes(m)
  ) {

    voicePanel?.classList.add(
      "hidden"
    );


    if (promptBox) {

      promptBox.placeholder =
        m === "music"
          ? "Describe the music you want..."
          : m === "soundfx"
          ? "Describe the sound effects..."
          : m === "subtitle"
          ? "Paste your video/script text..."
          : m === "thumbnail"
          ? "Describe the thumbnail scene..."
          : "Describe your story...";
    }
  }


  if (m === "voice") {

    promptBox.placeholder =
      "Write your script here. Example: Welcome to Viky AI, where your ideas become videos...";

  } else if (m === "image") {

    promptBox.placeholder =
      "Describe the motion: camera slowly moves forward, subject moves naturally...";

  } else if (m === "textimage") {

    promptBox.placeholder =
      "Describe what should happen to the uploaded image...";

  } else if (
    ![
      "music",
      "soundfx",
      "subtitle",
      "thumbnail",
      "story"
    ].includes(m)
  ) {

    promptBox.placeholder =
      "A cinematic scene with realistic movement...";
  }
}


/* =========================================================
   PROMPT COUNTER
   ========================================================= */

promptBox?.addEventListener(
  "input",
  () => {

    if (counter) {

      counter.textContent =
        `${promptBox.value.length} / 2000`;
    }
  }
);


/* =========================================================
   MODE BUTTONS
   ========================================================= */

$$(
  ".mode,.sidebar a[data-mode]"
).forEach(
  (element) => {

    element.addEventListener(
      "click",
      () => {

        const m =
          element.dataset.mode;


        if (
          [
            "female",
            "male",
            "young",
            "narrator"
          ].includes(m)
        ) {

          setMode("voice");

        } else {

          setMode(m);
        }


        if (
          moreMenu &&
          !moreMenu.classList.contains(
            "hidden"
          ) &&
          m !== "more"
        ) {

          moreMenu.classList.add(
            "hidden"
          );
        }
      }
    );
  }
);


/* =========================================================
   MORE MENU
   ========================================================= */

moreTools?.addEventListener(
  "click",
  () => {

    moreMenu?.classList.toggle(
      "hidden"
    );


    const button =
      moreTools?.querySelector("b");


    if (button) {

      button.textContent =
        moreMenu?.classList.contains(
          "hidden"
        )
          ? "⌄"
          : "⌃";
    }
  }
);


/* =========================================================
   ACCOUNT / ADMIN NAVIGATION
   ========================================================= */

$$("[data-page]").forEach(
  (element) => {

    element.addEventListener(
      "click",
      () => {

        const page =
          element.dataset.page;


        if (page === "dashboard") {

          showDashboard();

          return;
        }


        if (page === "admin") {

          showAdminPage();

          return;
        }


        showAccount(page);
      }
    );
  }
);


/* =========================================================
   BACK DASHBOARD
   ========================================================= */

$("#backDashboard")
  ?.addEventListener(
    "click",
    showDashboard
  );


/* =========================================================
   ACCOUNT PAGE
   ========================================================= */

function showAccount(page) {

  accountPage?.classList.remove(
    "hidden"
  );


  $(".content")?.classList.add(
    "hidden"
  );


  [
    "profile",
    "subscription",
    "settings"
  ].forEach(
    (pageName) => {

      $(
        `#${pageName}Page`
      )?.classList.add(
        "hidden"
      );
    }
  );


  $(
    `#${page}Page`
  )?.classList.remove(
    "hidden"
  );


  const title =
    $("#accountTitle");


  if (title) {

    title.textContent =
      page.charAt(0).toUpperCase() +
      page.slice(1);
  }
}


/* =========================================================
   DASHBOARD
   ========================================================= */

function showDashboard() {

  accountPage?.classList.add(
    "hidden"
  );


  $("#adminPage")?.classList.add(
    "hidden"
  );


  $(".content")?.classList.remove(
    "hidden"
  );
}


/* =========================================================
   CHOICES
   ========================================================= */

$$(".choices button").forEach(
  (button) => {

    button.addEventListener(
      "click",
      () => {

        button.parentElement
          ?.querySelectorAll(
            "button"
          )
          .forEach(
            (item) => {

              item.classList.remove(
                "selected"
              );
            }
          );


        button.classList.add(
          "selected"
        );
      }
    );
  }
);


/* =========================================================
   VOICE CHOICES
   ========================================================= */

$$(".voice-choice").forEach(
  (button) => {

    button.addEventListener(
      "click",
      () => {

        $$(".voice-choice")
          .forEach(
            (item) => {

              item.classList.remove(
                "selected"
              );
            }
          );


        button.classList.add(
          "selected"
        );
      }
    );
  }
);


/* =========================================================
   FILE UPLOAD
   ========================================================= */

input?.addEventListener(
  "change",
  () => {

    if (
      input.files &&
      input.files[0]
    ) {

      const small =
        upload?.querySelector(
          "small"
        );


      if (small) {

        small.textContent =
          `Selected: ${input.files[0].name}`;
      }
    }
  }
);


/* =========================================================
   GENERATE
   ========================================================= */

$("#generate")
  ?.addEventListener(
    "click",
    () => {

      const cost =
        mode === "voice"
          ? 10
          : mode === "music"
          ? 8
          : mode === "soundfx"
          ? 5
          : mode === "subtitle"
          ? 5
          : mode === "thumbnail"
          ? 5
          : 20;


      if (credits < cost) {

        alert(
          `Not enough credits. This action needs ${cost} credits.`
        );


        scrollToPricing();

        return;
      }


      if (
        [
          "image",
          "textimage",
          "video"
        ].includes(mode) &&
        !input?.files?.length
      ) {

        alert(
          "Please upload the required image/video first."
        );

        return;
      }


      if (
        !promptBox?.value.trim()
      ) {

        alert(
          mode === "voice"
            ? "Please enter your voice-over script."
            : "Please enter a prompt."
        );

        return;
      }


      credits -= cost;


      if ($("#creditCount")) {

        $("#creditCount")
          .textContent =
          credits;
      }


      const button =
        $("#generate");


      if (!button) {
        return;
      }


      button.disabled =
        true;


      button.innerHTML =
        mode === "voice"
          ? "⏳ CREATING VOICE…"
          : "⏳ GENERATING VIDEO…";


      setTimeout(
        () => {

          button.disabled =
            false;


          button.innerHTML =
            `⚡ GENERATE ${
              mode === "voice"
                ? "VOICE"
                : "VIDEO"
            } <span>${cost} credits</span>`;


          const list =
            $("#recentList");


          if (list) {

            if (
              list.querySelector(
                ".empty"
              )
            ) {

              list.innerHTML =
                "";
            }


            const item =
              document.createElement(
                "div"
              );


            item.className =
              "video-item";


            const label =
              mode === "voice"
                ? "AI Voice Over"
                : mode === "music"
                ? "AI Music"
                : mode === "soundfx"
                ? "Sound Effects"
                : mode === "subtitle"
                ? "AI Subtitles"
                : mode === "thumbnail"
                ? "AI Thumbnail"
                : mode === "story"
                ? "AI Story Video"
                : "AI Video";


            item.innerHTML = `
              <div class="thumb"></div>
              <div>
                <b>${label}</b>
                <small>✓ Demo complete • ${cost} credits</small>
              </div>
            `;


            list.prepend(
              item
            );
          }

        },
        1800
      );
    }
  );


/* =========================================================
   PRICING
   ========================================================= */

function scrollToPricing() {

  $("#pricing")
    ?.scrollIntoView({
      behavior: "smooth"
    });
}


window.scrollToPricing =
  scrollToPricing;


/* =========================================================
   BUY PLAN
   ========================================================= */

function buy(plan) {

  alert(
    `${plan} selected. Payment gateway will be connected in the backend step.`
  );
}


window.buy =
  buy;


/* =========================================================
   ADMIN ACCESS
   ========================================================= */

async function checkAdminAccess() {

  if (!supabaseClient) {

    isAdmin =
      false;

    hideAdminNav();

    return;
  }


  try {

    const {
      data,
      error
    } =
      await supabaseClient.auth
        .getUser();


    if (error) {
      throw error;
    }


    const user =
      data?.user;


    if (!user) {

      currentUser =
        null;

      isAdmin =
        false;

      hideAdminNav();

      return;
    }


    currentUser =
      user;


    /* =====================================================
       PRIMARY ADMIN CHECK
       EMAIL
       ===================================================== */

    if (
      isAdminEmail(user.email)
    ) {

      isAdmin =
        true;

    } else {

      isAdmin =
        false;


      /*
         Optional role-table check.
         If user_roles exists and contains
         role = admin, that user can also
         receive admin access.
      */

      try {

        const {
          data: roleRow,
          error: roleError
        } =
          await supabaseClient
            .from("user_roles")
            .select("role")
            .eq(
              "user_id",
              user.id
            )
            .maybeSingle();


        if (
          !roleError &&
          roleRow?.role === "admin"
        ) {

          isAdmin =
            true;
        }

      } catch (roleCheckError) {

        /*
           Role table is optional.
           Do not block normal login
           if role table is unavailable.
        */

        console.warn(
          "Optional admin role check skipped:",
          roleCheckError
        );
      }
    }


    /* =====================================================
       SHOW / HIDE ADMIN NAV
       ===================================================== */

    if (isAdmin) {

      $("#adminNav")
        ?.classList.remove(
          "hidden"
        );


      if ($("#adminRole")) {

        $("#adminRole")
          .textContent =
          "admin";
      }


      if ($("#adminStatus")) {

        $("#adminStatus")
          .textContent =
          "✓ Authorized";
      }


      if ($("#adminEmail")) {

        $("#adminEmail")
          .textContent =
          user.email || "—";
      }

    } else {

      hideAdminNav();
    }

  } catch (error) {

    console.error(
      "Admin access check error:",
      error
    );


    /*
       If the logged-in email is the
       configured Admin email, keep
       Admin access even if optional
       role checking fails.
    */

    if (
      isAdminEmail(
        currentUser?.email
      )
    ) {

      isAdmin =
        true;

      $("#adminNav")
        ?.classList.remove(
          "hidden"
        );

    } else {

      isAdmin =
        false;

      hideAdminNav();
    }
  }
}


/* =========================================================
   HIDE ADMIN NAV
   ========================================================= */

function hideAdminNav() {

  $("#adminNav")
    ?.classList.add(
      "hidden"
    );
}


/* =========================================================
   SHOW ADMIN PAGE
   ========================================================= */

function showAdminPage() {

  if (!isAdmin) {

    alert(
      "Admin access required."
    );

    return;
  }


  $(".content")
    ?.classList.add(
      "hidden"
    );


  accountPage
    ?.classList.add(
      "hidden"
    );


  $("#adminPage")
    ?.classList.remove(
      "hidden"
    );


  if ($("#adminRole")) {

    $("#adminRole")
      .textContent =
      "admin";
  }


  if ($("#adminStatus")) {

    $("#adminStatus")
      .textContent =
      "✓ Authorized";
  }


  if ($("#adminEmail")) {

    $("#adminEmail")
      .textContent =
      currentUser?.email ||
      "—";
  }
}


/* =========================================================
   BACK FROM ADMIN
   ========================================================= */

$("#backFromAdmin")
  ?.addEventListener(
    "click",
    () => {

      $("#adminPage")
        ?.classList.add(
          "hidden"
        );


      showDashboard();
    }
  );


/* =========================================================
   ADMIN USERS
   ========================================================= */

$("#adminUsersBtn")
  ?.addEventListener(
    "click",
    () => {

      const box =
        $("#adminMessage");


      if (!box) {
        return;
      }


      box.style.display =
        "block";


      box.textContent =
        "User management needs a secure backend/Edge Function. Never expose the Supabase service_role key in frontend code.";
    }
  );


/* =========================================================
   ADMIN CREDITS
   ========================================================= */

$("#adminCreditsBtn")
  ?.addEventListener(
    "click",
    () => {

      const box =
        $("#adminMessage");


      if (!box) {
        return;
      }


      box.style.display =
        "block";


      box.textContent =
        "Credits management is ready for the backend step.";
    }
  );


/* =========================================================
   ADMIN VIDEOS
   ========================================================= */

$("#adminVideosBtn")
  ?.addEventListener(
    "click",
    () => {

      const box =
        $("#adminMessage");


      if (!box) {
        return;
      }


      box.style.display =
        "block";


      box.textContent =
        "Video management is ready for the backend step.";
    }
  );


/* =========================================================
   ADMIN SETTINGS
   ========================================================= */

$("#adminSettingsBtn")
  ?.addEventListener(
    "click",
    () => {

      const box =
        $("#adminMessage");


      if (!box) {
        return;
      }


      box.style.display =
        "block";


      box.textContent =
        "Admin settings are ready for the backend step.";
    }
  );


/* =========================================================
   INITIALIZE
   ========================================================= */

async function initializeVikyAI() {

  console.log(
    "Viky AI initializing..."
  );


  if (!supabaseClient) {

    console.error(
      "Supabase client could not be created."
    );

    showLogin();

    return;
  }


  await checkLogin();


  console.log(
    "Viky AI initialized."
  );
}


/* =========================================================
   START
   ========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initializeVikyAI
  );

} else {

  initializeVikyAI();
}
