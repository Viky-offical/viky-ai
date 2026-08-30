/* =========================================================
   VIKY AI
   SUPABASE AUTH + ADMIN + DASHBOARD
   ========================================================= */


/* =========================================================
   SUPABASE CONFIG
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

function showAuthMessage(
  message = "",
  error = false
) {

  const element =
    $("#authMessage");

  if (!element) {
    return;
  }

  element.textContent =
    message;

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

    authScreen.style.display =
      "flex";
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
   INITIALIZE SUPABASE
   ========================================================= */

function initSupabase() {

  if (
    !window.supabase ||
    typeof window.supabase.createClient !==
      "function"
  ) {

    console.error(
      "Supabase library was not loaded."
    );

    showAuthMessage(
      "Supabase library was not loaded. Check your HTML.",
      true
    );

    return false;
  }


  if (!supabaseClient) {

    supabaseClient =
      window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
      );
  }


  return true;
}


/* =========================================================
   LOGIN / SIGNUP UI
   ========================================================= */

function setSignupMode(value) {

  signupMode =
    value;


  const authTitle =
    $("#authTitle");

  const authSubtitle =
    $("#authSubtitle");

  const authName =
    $("#authName");

  const authButton =
    $("#authButton");

  const authSwitch =
    $("#authSwitch");

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
        "Already have an account?";
    }


    if (authSwitch) {

      authSwitch.textContent =
        "Sign In";
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
        "Don't have an account?";
    }


    if (authSwitch) {

      authSwitch.textContent =
        "Create Account";
    }


    if (forgotPassword) {

      forgotPassword.style.display =
        "block";
    }
  }


  showAuthMessage("");
}


/* =========================================================
   LOGIN / SIGNUP
   ========================================================= */

async function handleAuth() {

  const authButton =
    $("#authButton");

  const authEmail =
    $("#authEmail");

  const authPassword =
    $("#authPassword");

  const authName =
    $("#authName");


  if (
    !supabaseClient &&
    !initSupabase()
  ) {

    return;
  }


  const email =
    (
      authEmail?.value ||
      ""
    )
      .trim()
      .toLowerCase();


  const password =
    authPassword?.value ||
    "";


  const name =
    (
      authName?.value ||
      ""
    )
      .trim();


  /* =====================================================
     VALIDATION
     ===================================================== */

  if (!email || !password) {

    showAuthMessage(
      "Please enter email and password.",
      true
    );

    return;
  }


  if (
    signupMode &&
    !name
  ) {

    showAuthMessage(
      "Please enter your name.",
      true
    );

    return;
  }


  if (authButton) {

    authButton.disabled =
      true;
  }


  showAuthMessage(
    signupMode
      ? "Creating account..."
      : "Signing in..."
  );


  try {

    /* ===================================================
       SIGNUP
       =================================================== */

    if (signupMode) {

      const {
        data,
        error
      } =
        await supabaseClient
          .auth
          .signUp({

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


      currentUser =
        data?.user ||
        null;


      if (data?.session) {

        showAuthMessage(
          "Account created successfully!"
        );


        await showApp();

        await checkAdminAccess();

      } else {

        showAuthMessage(
          "Account created. Check your email to verify the account, then Sign In."
        );
      }


    /* ===================================================
       LOGIN
       =================================================== */

    } else {

      const {
        data,
        error
      } =
        await supabaseClient
          .auth
          .signInWithPassword({

            email: email,

            password: password
          });


      if (error) {

        throw error;
      }


      currentUser =
        data?.user ||
        null;


      await showApp();

      await checkAdminAccess();


      showAuthMessage(
        "Login successful!"
      );
    }


  } catch (error) {

    console.error(
      "Authentication error:",
      error
    );


    showAuthMessage(
      error?.message ||
      "Login failed. Please check your email and password.",
      true
    );


  } finally {

    if (authButton) {

      authButton.disabled =
        false;
    }
  }
}


/* =========================================================
   FORGOT PASSWORD
   ========================================================= */

async function resetPassword() {

  if (
    !supabaseClient &&
    !initSupabase()
  ) {

    return;
  }


  const email =
    (
      $("#authEmail")?.value ||
      ""
    )
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
      await supabaseClient
        .auth
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


/* =========================================================
   SHOW APP
   ========================================================= */

async function showApp() {

  const authScreen =
    $("#authScreen");


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
      await supabaseClient
        .auth
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
      data.user
        .user_metadata
        ?.full_name ||

      data.user.email
        ?.split("@")[0] ||

      "Viky User";


    $$("body *")
      .forEach(
        (element) => {

          if (
            element.children.length ===
              0 &&

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
      await supabaseClient
        .auth
        .getSession();


    if (error) {

      throw error;
    }


    if (
      data?.session?.user
    ) {

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

function bindAuthState() {

  if (!supabaseClient) {

    return;
  }


  supabaseClient
    .auth
    .onAuthStateChange(
      (
        event,
        session
      ) => {

        if (
          session?.user
        ) {

          currentUser =
            session.user;


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
      await supabaseClient
        .auth
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

    showAuthMessage(
      "Logged out."
    );


  } catch (error) {

    console.error(
      "Logout error:",
      error
    );


    showAuthMessage(
      error?.message ||
      "Logout failed.",
      true
    );
  }
}


window.logout =
  logout;


/* =========================================================
   ADMIN ACCESS
   ========================================================= */

async function checkAdminAccess() {

  if (
    !supabaseClient ||
    !currentUser
  ) {

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
      await supabaseClient
        .auth
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
       ADMIN EMAIL
       ===================================================== */

    isAdmin =
      (
        user.email ||
        ""
      )
        .toLowerCase() ===
      ADMIN_EMAIL
        .toLowerCase();


    /* =====================================================
       OPTIONAL USER ROLE
       ===================================================== */

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
        roleRow?.role ===
          "admin"
      ) {

        isAdmin =
          true;
      }

    } catch (_) {

      /*
        user_roles table is optional.
        Admin email still works.
      */
    }


    /* =====================================================
       ADMIN UI
       ===================================================== */

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
          user.email ||
          "—";
      }


    } else {

      hideAdminNav();
    }


  } catch (error) {

    console.error(
      "Admin access check error:",
      error
    );


    hideAdminNav();
  }
}


/* =========================================================
   MODE
   ========================================================= */

function setMode(newMode) {

  mode =
    [
      "female",
      "male",
      "young",
      "narrator"
    ].includes(newMode)

      ? "voice"

      : newMode;


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


  $$(
    ".sidebar a[data-mode]"
  )
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


  const input =
    $("#mediaInput");


  const uploadTitle =
    $("#uploadTitle");


  const voicePanel =
    $("#voicePanel");


  const promptBox =
    $("#prompt");


  const needsMedia =
    [
      "image",
      "textimage",
      "video"
    ].includes(mode);


  upload?.classList.toggle(
    "hidden",
    !needsMedia
  );


  if (uploadTitle) {

    uploadTitle.textContent =
      mode === "video"
        ? "Upload Video"
        : "Upload Image";
  }


  if (input) {

    input.accept =
      mode === "video"
        ? "video/*"
        : "image/*";
  }


  voicePanel?.classList.toggle(
    "hidden",
    mode !== "voice"
  );


  const placeholders = {

    voice:
      "Write your script here. Example: Welcome to Viky AI...",

    image:
      "Describe the motion: camera slowly moves forward...",

    textimage:
      "Describe what should happen to the uploaded image...",

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


  if (promptBox) {

    promptBox.placeholder =
      placeholders[mode] ||
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
   ACCOUNT PAGE
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
      page
        .charAt(0)
        .toUpperCase() +
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
   GENERATE
   ========================================================= */

function generate() {

  const promptBox =
    $("#prompt");


  const input =
    $("#mediaInput");


  const button =
    $("#generate");


  const list =
    $("#recentList");


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


  credits -=
    cost;


  if ($("#creditCount")) {

    $("#creditCount")
      .textContent =
      credits;
  }


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


      const labels = {

        voice:
          "AI Voice Over",

        music:
          "AI Music",

        soundfx:
          "Sound Effects",

        subtitle:
          "AI Subtitles",

        thumbnail:
          "AI Thumbnail",

        story:
          "AI Story Video"
      };


      item.innerHTML =
        `
        <div class="thumb"></div>

        <div>
          <b>
            ${
              labels[mode] ||
              "AI Video"
            }
          </b>

          <small>
            ✓ Demo complete • ${cost} credits
          </small>
        </div>
        `;


      list.prepend(
        item
      );

    },
    1800
  );
}


/* =========================================================
   ADMIN MESSAGE
   ========================================================= */

function showAdminMessage(
  message
) {

  const box =
    $("#adminMessage");


  if (!box) {

    return;
  }


  box.style.display =
    "block";


  box.textContent =
    message;
}


/* =========================================================
   BIND ALL EVENTS
   ========================================================= */

function bindEvents() {

  /* =======================================================
     AUTH SWITCH
     ======================================================= */

  $("#authSwitch")
    ?.addEventListener(
      "click",
      () => {

        setSignupMode(
          !signupMode
        );
      }
    );


  /* =======================================================
     AUTH BUTTON
     ======================================================= */

  $("#authButton")
    ?.addEventListener(
      "click",
      handleAuth
    );


  /* =======================================================
     FORGOT PASSWORD
     ======================================================= */

  $("#forgotPassword")
    ?.addEventListener(
      "click",
      resetPassword
    );


  /* =======================================================
     GENERATE
     ======================================================= */

  $("#generate")
    ?.addEventListener(
      "click",
      generate
    );


  /* =======================================================
     BACK DASHBOARD
     ======================================================= */

  $("#backDashboard")
    ?.addEventListener(
      "click",
      showDashboard
    );


  /* =======================================================
     BACK ADMIN
     ======================================================= */

  $("#backFromAdmin")
    ?.addEventListener(
      "click",
      showDashboard
    );


  /* =======================================================
     UPLOAD
     ======================================================= */

  const upload =
    $("#uploadLabel");


  const input =
    $("#mediaInput");


  upload
    ?.addEventListener(
      "click",
      (event) => {

        if (
          input &&
          event.target !==
            input
        ) {

          event.preventDefault();

          input.click();
        }
      }
    );


  input
    ?.addEventListener(
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


  /* =======================================================
     MODE BUTTONS
     ======================================================= */

  $$(
    ".mode, .sidebar a[data-mode]"
  )
    .forEach(
      (element) => {

        element.addEventListener(
          "click",
          () => {

            setMode(
              element.dataset.mode
            );
          }
        );
      }
    );


  /* =======================================================
     CHOICE BUTTONS
     ======================================================= */

  $$(".choices button")
    .forEach(
      (button) => {

        button.addEventListener(
          "click",
          () => {

            button
              .parentElement
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


  /* =======================================================
     VOICE CHOICES
     ======================================================= */

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


  /* =======================================================
     MORE MENU
     ======================================================= */

  $("#moreTools")
    ?.addEventListener(
      "click",
      () => {

        const menu =
          $("#moreMenu");


        menu
          ?.classList
          .toggle(
            "hidden"
          );


        const button =
          $("#moreTools b");


        if (button) {

          button.textContent =
            menu?.classList.contains(
              "hidden"
            )

              ? "⌄"

              : "⌃";
        }
      }
    );


  /* =======================================================
     ACCOUNT / ADMIN NAV
     ======================================================= */

  $$("[data-page]")
    .forEach(
      (element) => {

        element.addEventListener(
          "click",
          () => {

            const page =
              element.dataset.page;


            if (
              page ===
              "dashboard"
            ) {

              showDashboard();

              return;
            }


            if (
              page ===
              "admin"
            ) {

              showAdminPage();

              return;
            }


            showAccount(
              page
            );
          }
        );
      }
    );


  /* =======================================================
     ADMIN USERS
     ======================================================= */

  $("#adminUsersBtn")
    ?.addEventListener(
      "click",
      () => {

        showAdminMessage(
          "User management needs a secure backend/Edge Function. Never expose the Supabase service_role key in frontend code."
        );
      }
    );


  /* =======================================================
     ADMIN CREDITS
     ======================================================= */

  $("#adminCreditsBtn")
    ?.addEventListener(
      "click",
      () => {

        showAdminMessage(
          "Credits management is ready for the backend step."
        );
      }
    );


  /* =======================================================
     ADMIN VIDEOS
     ======================================================= */

  $("#adminVideosBtn")
    ?.addEventListener(
      "click",
      () => {

        showAdminMessage(
          "Video management is ready for the backend step."
        );
      }
    );


  /* =======================================================
     ADMIN SETTINGS
     ======================================================= */

  $("#adminSettingsBtn")
    ?.addEventListener(
      "click",
      () => {

        showAdminMessage(
          "Admin settings are ready for the backend step."
        );
      }
    );


  /* =======================================================
     PROMPT COUNTER
     ======================================================= */

  $("#prompt")
    ?.addEventListener(
      "input",
      () => {

        const counter =
          $("#counter");


        if (counter) {

          counter.textContent =
            `${$("#prompt").value.length} / 2000`;
        }
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


  if (!initSupabase()) {

    showLogin();

    return;
  }


  bindEvents();

  bindAuthState();

  setSignupMode(
    false
  );

  setMode(
    "text"
  );


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
    initializeVikyAI
  );

} else {

  initializeVikyAI();
}
