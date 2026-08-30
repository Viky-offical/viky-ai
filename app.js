/* =========================================================
   VIKY AI
   SUPABASE AUTH + ADMIN + DASHBOARD
   COMPLETE app.js
   ========================================================= */

const SUPABASE_URL =
  "https://qhcjicfxolurbjnvobur.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_D6EylVAso_ihWIS33ObsYg_onCINCKo";

const ADMIN_EMAIL =
  "daimvirk555@gmail.com";


/* =========================================================
   GLOBAL STATE
   ========================================================= */

let supabaseClient = null;
let currentUser = null;
let isAdmin = false;
let signupMode = false;

let mode = "text";
let credits = 100;


/* =========================================================
   HELPERS
   ========================================================= */

function $(selector) {
  return document.querySelector(selector);
}


function $$(selector) {
  return document.querySelectorAll(selector);
}


/* =========================================================
   AUTH MESSAGE
   ========================================================= */

function showAuthMessage(message, error = false) {

  const element = $("#authMessage");

  if (!element) {
    return;
  }

  element.textContent = message;

  element.style.color =
    error
      ? "#ff5c5c"
      : "#22c55e";
}


/* =========================================================
   SHOW LOGIN
   ========================================================= */

function showLogin() {

  const authScreen =
    $("#authScreen");

  if (authScreen) {
    authScreen.style.display = "flex";
  }
}


/* =========================================================
   SHOW APP
   ========================================================= */

async function showApp() {

  const authScreen =
    $("#authScreen");

  if (authScreen) {
    authScreen.style.display = "none";
  }

  if (!supabaseClient) {
    return;
  }

  try {

    const {
      data,
      error
    } =
      await supabaseClient.auth.getUser();

    if (error) {
      throw error;
    }

    if (data?.user) {

      currentUser =
        data.user;

      const userName =
        data.user.user_metadata?.full_name ||
        data.user.email?.split("@")[0] ||
        "Viky User";

      document
        .querySelectorAll("body *")
        .forEach((element) => {

          if (
            element.children.length === 0 &&
            element.textContent.trim() === "Viky User"
          ) {

            element.textContent =
              userName;
          }

        });
    }

  } catch (error) {

    console.error(
      "Could not load user:",
      error
    );

  }
}


/* =========================================================
   HIDE ADMIN NAV
   ========================================================= */

function hideAdminNav() {

  $("#adminNav")
    ?.classList
    .add("hidden");
}


/* =========================================================
   ADMIN ACCESS
   ========================================================= */

async function checkAdminAccess() {

  if (!supabaseClient) {

    isAdmin = false;

    hideAdminNav();

    return;
  }

  try {

    const {
      data,
      error
    } =
      await supabaseClient.auth.getUser();

    if (error) {
      throw error;
    }

    const user =
      data?.user;

    if (!user) {

      currentUser = null;

      isAdmin = false;

      hideAdminNav();

      return;
    }

    currentUser =
      user;


    /* -----------------------------------------------------
       ADMIN EMAIL
       ----------------------------------------------------- */

    const emailIsAdmin =
      (user.email || "")
        .toLowerCase() ===
      ADMIN_EMAIL.toLowerCase();


    /* -----------------------------------------------------
       OPTIONAL DATABASE ROLE
       ----------------------------------------------------- */

    let databaseIsAdmin = false;

    try {

      const {
        data: roleRow,
        error: roleError
      } =
        await supabaseClient
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .maybeSingle();

      if (!roleError) {

        databaseIsAdmin =
          roleRow?.role === "admin";

      }

    } catch (roleCheckError) {

      console.warn(
        "Optional admin role check failed:",
        roleCheckError
      );

    }


    /* -----------------------------------------------------
       FINAL ADMIN CHECK
       ----------------------------------------------------- */

    isAdmin =
      emailIsAdmin ||
      databaseIsAdmin;


    if (isAdmin) {

      $("#adminNav")
        ?.classList
        .remove("hidden");


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

    isAdmin = false;

    hideAdminNav();

  }
}


/* =========================================================
   AUTH MODE
   ========================================================= */

function setAuthMode(isSignup) {

  signupMode =
    isSignup;

  const authTitle =
    $("#authTitle");

  const authSubtitle =
    $("#authSubtitle");

  const authName =
    $("#authName");

  const authButton =
    $("#authButton");

  const authSwitchText =
    $("#authSwitchText");

  const forgotPassword =
    $("#forgotPassword");


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
        "Already have an account? Sign In";

    }


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
        "Don't have an account? Create Account";

    }


    if (forgotPassword) {

      forgotPassword.style.display =
        "block";

    }

  }


  showAuthMessage("");

}


/* =========================================================
   AUTH SETUP
   ========================================================= */

function setupAuth() {

  const authSwitch =
    $("#authSwitch");

  const authButton =
    $("#authButton");

  const forgotPassword =
    $("#forgotPassword");


  /* -------------------------------------------------------
     LOGIN / SIGNUP SWITCH
     ------------------------------------------------------- */

  authSwitch?.addEventListener(
    "click",
    (event) => {

      event.preventDefault();

      setAuthMode(
        !signupMode
      );

    }
  );


  /* -------------------------------------------------------
     LOGIN / SIGNUP BUTTON
     ------------------------------------------------------- */

  authButton?.addEventListener(
    "click",
    async (event) => {

      event.preventDefault();


      if (!supabaseClient) {

        showAuthMessage(
          "Supabase connection is not available.",
          true
        );

        return;
      }


      const email =
        ($("#authEmail")?.value || "")
          .trim()
          .toLowerCase();


      const password =
        $("#authPassword")?.value || "";


      const name =
        ($("#authName")?.value || "")
          .trim();


      /* ---------------------------------------------------
         VALIDATION
         --------------------------------------------------- */

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


      authButton.disabled =
        true;


      showAuthMessage(
        "Please wait..."
      );


      try {


        /* =================================================
           SIGNUP
           ================================================= */

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

                  full_name:
                    name

                }

              }

            });


          if (error) {
            throw error;
          }


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
              "Account created! Check your email to verify your account."
            );

          }


        /* =================================================
           LOGIN
           ================================================= */

        } else {

          const {
            data,
            error
          } =
            await supabaseClient.auth
              .signInWithPassword({

                email:
                  email,

                password:
                  password

              });


          if (error) {
            throw error;
          }


          currentUser =
            data?.user || null;


          showAuthMessage(
            "Login successful!"
          );


          await showApp();

          await checkAdminAccess();

        }


      } catch (error) {

        console.error(
          "Authentication error:",
          error
        );


        let message =
          error?.message ||
          "Login failed. Please try again.";


        if (
          error?.message ===
          "Invalid login credentials"
        ) {

          message =
            "Invalid email or password. Check the account and password in Supabase.";

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


  /* -------------------------------------------------------
     FORGOT PASSWORD
     ------------------------------------------------------- */

  forgotPassword?.addEventListener(
    "click",
    async (event) => {

      event.preventDefault();


      if (!supabaseClient) {

        showAuthMessage(
          "Supabase connection is not available.",
          true
        );

        return;
      }


      const email =
        ($("#authEmail")?.value || "")
          .trim()
          .toLowerCase();


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

function setupAuthStateListener() {

  if (!supabaseClient) {
    return;
  }


  supabaseClient.auth
    .onAuthStateChange(
      (event, session) => {

        if (session) {

          currentUser =
            session.user;


          showApp();


          setTimeout(
            () => {

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

    currentUser =
      null;

    isAdmin =
      false;

    showLogin();

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


window.logout =
  logout;


/* =========================================================
   MODE
   ========================================================= */

function setMode(newMode) {

  mode =
    newMode;


  $$(".mode")
    .forEach(
      (element) => {

        element.classList.toggle(
          "active",
          element.dataset.mode ===
          newMode
        );

      }
    );


  $$(".sidebar a[data-mode]")
    .forEach(
      (element) => {

        element.classList.toggle(
          "active",
          element.dataset.mode ===
          newMode
        );

      }
    );


  const upload =
    $("#uploadLabel");

  const uploadTitle =
    $("#uploadTitle");

  const input =
    $("#mediaInput");

  const voicePanel =
    $("#voicePanel");

  const promptBox =
    $("#prompt");


  const needsMedia =
    [
      "image",
      "textimage",
      "video"
    ].includes(
      newMode
    );


  upload?.classList.toggle(
    "hidden",
    !needsMedia
  );


  if (uploadTitle) {

    uploadTitle.textContent =
      newMode === "video"
        ? "Upload Video"
        : "Upload Image";

  }


  if (input) {

    input.accept =
      newMode === "video"
        ? "video/*"
        : "image/*";

  }


  voicePanel?.classList.toggle(
    "hidden",
    newMode !== "voice"
  );


  const specialModes =
    [
      "music",
      "soundfx",
      "subtitle",
      "thumbnail",
      "story"
    ];


  if (
    specialModes.includes(
      newMode
    )
  ) {

    voicePanel?.classList.add(
      "hidden"
    );


    if (promptBox) {

      const placeholders = {

        music:
          "Describe the music you want...",

        soundfx:
          "Describe the sound effects...",

        subtitle:
          "Paste your video/script text...",

        thumbnail:
          "Describe the thumbnail scene...",

        story:
          "Describe your story..."

      };


      promptBox.placeholder =
        placeholders[newMode];

    }

  }


  if (!promptBox) {
    return;
  }


  if (newMode === "voice") {

    promptBox.placeholder =
      "Write your script here. Example: Welcome to Viky AI...";

  } else if (newMode === "image") {

    promptBox.placeholder =
      "Describe the motion: camera slowly moves forward...";

  } else if (newMode === "textimage") {

    promptBox.placeholder =
      "Describe what should happen to the uploaded image...";

  } else if (
    !specialModes.includes(
      newMode
    )
  ) {

    promptBox.placeholder =
      "A cinematic scene with realistic movement...";

  }

}


/* =========================================================
   DASHBOARD
   ========================================================= */

function showDashboard() {

  $("#accountPage")
    ?.classList
    .add("hidden");


  $("#adminPage")
    ?.classList
    .add("hidden");


  $(".content")
    ?.classList
    .remove("hidden");

}


/* =========================================================
   ACCOUNT
   ========================================================= */

function showAccount(page) {

  $("#accountPage")
    ?.classList
    .remove("hidden");


  $(".content")
    ?.classList
    .add("hidden");


  $("#adminPage")
    ?.classList
    .add("hidden");


  [
    "profile",
    "subscription",
    "settings"
  ]
    .forEach(
      (pageName) => {

        $(
          `#${pageName}Page`
        )
          ?.classList
          .add("hidden");

      }
    );


  $(
    `#${page}Page`
  )
    ?.classList
    .remove("hidden");


  const title =
    $("#accountTitle");


  if (title) {

    title.textContent =
      page.charAt(0).toUpperCase() +
      page.slice(1);

  }

}


/* =========================================================
   ADMIN PAGE
   ========================================================= */

function showAdminPage() {

  if (!isAdmin) {

    alert(
      "Admin access required."
    );

    return;
  }


  $(".content")
    ?.classList
    .add("hidden");


  $("#accountPage")
    ?.classList
    .add("hidden");


  $("#adminPage")
    ?.classList
    .remove("hidden");


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
   PRICING
   ========================================================= */

function scrollToPricing() {

  $("#pricing")
    ?.scrollIntoView({
      behavior:
        "smooth"
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
   DASHBOARD SETUP
   ========================================================= */

function setupDashboard() {

  const promptBox =
    $("#prompt");

  const counter =
    $("#counter");

  const input =
    $("#mediaInput");

  const moreTools =
    $("#moreTools");

  const moreMenu =
    $("#moreMenu");


  /* -------------------------------------------------------
     PROMPT COUNTER
     ------------------------------------------------------- */

  promptBox?.addEventListener(
    "input",
    () => {

      if (counter) {

        counter.textContent =
          `${promptBox.value.length} / 2000`;

      }

    }
  );


  /* -------------------------------------------------------
     MODE BUTTONS
     ------------------------------------------------------- */

  $$(".mode, .sidebar a[data-mode]")
    .forEach(
      (element) => {

        element.addEventListener(
          "click",
          (event) => {

            event.preventDefault();


            const selectedMode =
              element.dataset.mode;


            if (
              [
                "female",
                "male",
                "young",
                "narrator"
              ].includes(
                selectedMode
              )
            ) {

              setMode(
                "voice"
              );

            } else if (
              selectedMode
            ) {

              setMode(
                selectedMode
              );

            }


            if (moreMenu) {

              moreMenu
                .classList
                .add("hidden");

            }

          }
        );

      }
    );


  /* -------------------------------------------------------
     MORE MENU
     ------------------------------------------------------- */

  moreTools?.addEventListener(
    "click",
    (event) => {

      event.preventDefault();


      moreMenu
        ?.classList
        .toggle("hidden");


      const button =
        moreTools
          ?.querySelector("b");


      if (button) {

        button.textContent =
          moreMenu?.classList
            .contains("hidden")
            ? "⌄"
            : "⌃";

      }

    }
  );


  /* -------------------------------------------------------
     ACCOUNT / ADMIN NAVIGATION
     ------------------------------------------------------- */

  $$("[data-page]")
    .forEach(
      (element) => {

        element.addEventListener(
          "click",
          (event) => {

            event.preventDefault();


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


            if (page) {

              showAccount(
                page
              );

            }

          }
        );

      }
    );


  /* -------------------------------------------------------
     BACK DASHBOARD
     ------------------------------------------------------- */

  $("#backDashboard")
    ?.addEventListener(
      "click",
      (event) => {

        event.preventDefault();

        showDashboard();

      }
    );


  /* -------------------------------------------------------
     BACK ADMIN
     ------------------------------------------------------- */

  $("#backFromAdmin")
    ?.addEventListener(
      "click",
      (event) => {

        event.preventDefault();

        showDashboard();

      }
    );


  /* -------------------------------------------------------
     CHOICES
     ------------------------------------------------------- */

  $$(".choices button")
    .forEach(
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

                  item.classList
                    .remove(
                      "selected"
                    );

                }
              );


            button.classList
              .add(
                "selected"
              );

          }
        );

      }
    );


  /* -------------------------------------------------------
     VOICE CHOICES
     ------------------------------------------------------- */

  $$(".voice-choice")
    .forEach(
      (button) => {

        button.addEventListener(
          "click",
          () => {

            $$(".voice-choice")
              .forEach(
                (item) => {

                  item.classList
                    .remove(
                      "selected"
                    );

                }
              );


            button.classList
              .add(
                "selected"
              );

          }
        );

      }
    );


  /* -------------------------------------------------------
     FILE UPLOAD
     ------------------------------------------------------- */

  input?.addEventListener(
    "change",
    () => {

      if (
        input.files &&
        input.files[0]
      ) {

        const small =
          $("#uploadLabel")
            ?.querySelector(
              "small"
            );


        if (small) {

          small.textContent =
            `Selected: ${input.files[0].name}`;

        }

      }

    }
  );


  /* -------------------------------------------------------
     GENERATE
     ------------------------------------------------------- */

  $("#generate")
    ?.addEventListener(
      "click",
      (event) => {

        event.preventDefault();


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
          ].includes(
            mode
          ) &&
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


            if (!list) {
              return;
            }


            list
              .querySelector(
                ".empty"
              )
              ?.remove();


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

          },
          1800
        );

      }
    );


  /* -------------------------------------------------------
     ADMIN USERS
     ------------------------------------------------------- */

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


  /* -------------------------------------------------------
     ADMIN CREDITS
     ------------------------------------------------------- */

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
          "Credits management needs a secure backend/Edge Function.";

      }
    );


  /* -------------------------------------------------------
     ADMIN VIDEOS
     ------------------------------------------------------- */

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
          "Video management needs a secure backend/Edge Function.";

      }
    );


  /* -------------------------------------------------------
     ADMIN SETTINGS
     ------------------------------------------------------- */

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
          "Admin settings need a secure backend/Edge Function.";

      }
    );

}


/* =========================================================
   INITIALIZE
   ========================================================= */

async function initializeVikyAI() {

  console.log(
    "Viky AI initializing..."
  );


  if (!window.supabase) {

    console.error(
      "Supabase JavaScript library was not loaded. Make sure the Supabase CDN script is loaded before app.js."
    );


    showLogin();

    return;
  }


  if (
    typeof window.supabase.createClient !==
    "function"
  ) {

    console.error(
      "Supabase createClient function is unavailable."
    );


    showLogin();

    return;
  }


  try {

    supabaseClient =
      window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
      );

  } catch (error) {

    console.error(
      "Supabase client creation failed:",
      error
    );


    showLogin();

    return;
  }


  setupAuth();

  setupDashboard();

  setupAuthStateListener();

  await checkLogin();


  console.log(
    "Viky AI initialized."
  );

}


/* =========================================================
   START APP
   ========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initializeVikyAI,
    {
      once: true
    }
  );

} else {

  initializeVikyAI();

}
