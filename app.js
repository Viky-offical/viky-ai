/* =========================================================
   VIKY AI
   SUPABASE AUTH + ADMIN + UNLIMITED CREDITS
   COMPLETE app.js
   ========================================================= */


/* =========================================================
   SUPABASE CONFIG
   ========================================================= */

const SUPABASE_URL =
  "https://qhcjicfxolurbjnvobur.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_D6EylVAso_ihWIS33ObsYg_onCINCKo";


/* =========================================================
   ADMIN EMAIL
   ONLY THIS EMAIL IS ADMIN
   ========================================================= */

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

function showAuthMessage(message, isError = false) {

  const element = $("#authMessage");

  if (!element) {
    return;
  }

  element.textContent = message || "";

  element.style.color =
    isError
      ? "#ff5c6d"
      : "#20e36d";
}


/* =========================================================
   CLEAR LOGIN FIELDS
   ========================================================= */

function clearLoginFields() {

  const email =
    $("#authEmail");

  const password =
    $("#authPassword");

  const name =
    $("#authName");


  if (email) {
    email.value = "";
  }

  if (password) {
    password.value = "";
  }

  if (name) {
    name.value = "";
  }

}


/* =========================================================
   SHOW LOGIN
   ========================================================= */

function showLogin() {

  $("#authScreen")
    ?.classList
    .remove("hidden");

  $("#app")
    ?.classList
    .add("hidden");

  clearLoginFields();

}


/* =========================================================
   SHOW APP
   ========================================================= */

function showApplication() {

  $("#authScreen")
    ?.classList
    .add("hidden");

  $("#app")
    ?.classList
    .remove("hidden");

}


/* =========================================================
   ADMIN CHECK
   ========================================================= */

function calculateAdmin(user) {

  if (!user?.email) {
    return false;
  }

  const email =
    user.email
      .trim()
      .toLowerCase();

  return email ===
    ADMIN_EMAIL
      .trim()
      .toLowerCase();

}


/* =========================================================
   UPDATE ROLE UI
   ========================================================= */

function updateRoleUI() {

  const nameElement =
    $("#topUserName");

  const roleElement =
    $("#topUserRole");

  const roleDot =
    $("#roleDot");

  const avatar =
    $("#topAvatar");

  const adminNav =
    $("#adminNav");

  const creditCount =
    $("#creditCount");

  const planName =
    $("#planName");

  const planCredits =
    $("#planCredits");

  const planStatus =
    $("#planStatus");

  const creditBar =
    $("#creditBar");

  const profileRole =
    $("#profileRole");

  const profileRoleText =
    $("#profileRoleText");

  const profileRoleDot =
    $("#profileRoleDot");

  const adminEmail =
    $("#adminEmail");


  if (!currentUser) {
    return;
  }


  const userName =
    currentUser.user_metadata?.full_name ||
    currentUser.email?.split("@")[0] ||
    "User";


  if (nameElement) {

    nameElement.textContent =
      userName;

  }


  if (avatar) {

    avatar.textContent =
      userName
        .charAt(0)
        .toUpperCase();

  }


  if (isAdmin) {

    /* ============================================
       ADMIN
       ============================================ */

    if (roleElement) {

      roleElement.textContent =
        "ADMIN";

      roleElement.style.color =
        "#ff5265";

    }


    if (roleDot) {

      roleDot.className =
        "role-dot admin-dot";

    }


    if (adminNav) {

      adminNav.classList
        .remove("hidden");

    }


    if (creditCount) {

      creditCount.textContent =
        "∞";

    }


    if (planName) {

      planName.textContent =
        "Unlimited";

    }


    if (planCredits) {

      planCredits.textContent =
        "Unlimited Credits";

    }


    if (planStatus) {

      planStatus.textContent =
        "All features unlocked";

    }


    if (creditBar) {

      creditBar.style.width =
        "100%";

    }


    if (profileRole) {

      profileRole.textContent =
        "ADMIN";

      profileRole.style.color =
        "#ff5265";

    }


    if (profileRoleText) {

      profileRoleText.textContent =
        "Administrator account • All features unlocked";

    }


    if (profileRoleDot) {

      profileRoleDot.className =
        "role-dot admin-dot";

    }


    if (adminEmail) {

      adminEmail.textContent =
        currentUser.email || "—";

    }


  } else {

    /* ============================================
       NORMAL USER
       ============================================ */

    if (roleElement) {

      roleElement.textContent =
        "USER";

      roleElement.style.color =
        "#20e36d";

    }


    if (roleDot) {

      roleDot.className =
        "role-dot user-dot";

    }


    if (adminNav) {

      adminNav.classList
        .add("hidden");

    }


    if (creditCount) {

      creditCount.textContent =
        credits;

    }


    if (planName) {

      planName.textContent =
        "Free";

    }


    if (planCredits) {

      planCredits.textContent =
        `${credits} credits available`;

    }


    if (planStatus) {

      planStatus.textContent =
        `${credits} credits remaining`;

    }


    if (creditBar) {

      const percentage =
        Math.max(
          0,
          Math.min(
            100,
            credits
          )
        );

      creditBar.style.width =
        `${percentage}%`;

    }


    if (profileRole) {

      profileRole.textContent =
        "USER";

      profileRole.style.color =
        "#20e36d";

    }


    if (profileRoleText) {

      profileRoleText.textContent =
        "Standard Viky AI account";

    }


    if (profileRoleDot) {

      profileRoleDot.className =
        "role-dot user-dot";

    }

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
   AUTH MODE
   ========================================================= */

function setAuthMode(isSignup) {

  signupMode =
    Boolean(isSignup);


  const title =
    $("#authTitle");

  const subtitle =
    $("#authSubtitle");

  const nameWrap =
    $("#signupNameWrap");

  const button =
    $("#authButton");

  const switchText =
    $("#authSwitchText");

  const switchButton =
    $("#authSwitch");

  const forgot =
    $("#forgotPassword");


  clearLoginFields();


  if (signupMode) {

    if (title) {
      title.textContent =
        "Create your account";
    }

    if (subtitle) {
      subtitle.textContent =
        "Join Viky AI and start creating";
    }

    nameWrap
      ?.classList
      .remove("hidden");

    if (button) {
      button.textContent =
        "Create Account";
    }

    if (switchText) {
      switchText.textContent =
        "Already have an account?";
    }

    if (switchButton) {
      switchButton.textContent =
        "Sign In";
    }

    forgot
      ?.classList
      .add("hidden");


  } else {

    if (title) {
      title.textContent =
        "Welcome to Viky AI";
    }

    if (subtitle) {
      subtitle.textContent =
        "Sign in to continue";
    }

    nameWrap
      ?.classList
      .add("hidden");

    if (button) {
      button.textContent =
        "Sign In";
    }

    if (switchText) {
      switchText.textContent =
        "Don't have an account?";
    }

    if (switchButton) {
      switchButton.textContent =
        "Create Account";
    }

    forgot
      ?.classList
      .remove("hidden");

  }


  showAuthMessage("");

}


/* =========================================================
   LOGIN
   ========================================================= */

async function loginUser() {

  if (!supabaseClient) {

    showAuthMessage(
      "Supabase is not connected.",
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


  if (!email) {

    showAuthMessage(
      "Please enter your email.",
      true
    );

    return;

  }


  if (!password) {

    showAuthMessage(
      "Please enter your password.",
      true
    );

    return;

  }


  const button =
    $("#authButton");


  if (button) {

    button.disabled =
      true;

  }


  showAuthMessage(
    "Signing in..."
  );


  try {

    const {
      data,
      error
    } =
      await supabaseClient.auth
        .signInWithPassword({

          email,
          password

        });


    if (error) {
      throw error;
    }


    if (!data?.user) {

      throw new Error(
        "Login completed but user was not returned."
      );

    }


    currentUser =
      data.user;


    isAdmin =
      calculateAdmin(
        currentUser
      );


    /*
      This marker tells the application that
      the current browser session has explicitly
      logged in.

      sessionStorage disappears when the browser
      session is closed.
    */

    sessionStorage.setItem(
      "viky_login_verified",
      "true"
    );


    /*
      Make sure credentials are never kept
      in the form after login.
    */

    clearLoginFields();


    showApplication();

    updateRoleUI();

    loadProfile();


    showAuthMessage(
      "Login successful!"
    );


  } catch (error) {

    console.error(
      "Login error:",
      error
    );


    showAuthMessage(
      error?.message ||
      "Invalid login credentials.",
      true
    );


  } finally {

    if (button) {

      button.disabled =
        false;

    }

  }

}


/* =========================================================
   SIGNUP
   ========================================================= */

async function signupUser() {

  if (!supabaseClient) {

    showAuthMessage(
      "Supabase is not connected.",
      true
    );

    return;

  }


  const name =
    ($("#authName")?.value || "")
      .trim();


  const email =
    ($("#authEmail")?.value || "")
      .trim()
      .toLowerCase();


  const password =
    $("#authPassword")?.value || "";


  if (!name) {

    showAuthMessage(
      "Please enter your name.",
      true
    );

    return;

  }


  if (!email) {

    showAuthMessage(
      "Please enter your email.",
      true
    );

    return;

  }


  if (!password) {

    showAuthMessage(
      "Please enter your password.",
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


  const button =
    $("#authButton");


  if (button) {
    button.disabled = true;
  }


  showAuthMessage(
    "Creating account..."
  );


  try {

    const {
      data,
      error
    } =
      await supabaseClient.auth
        .signUp({

          email,
          password,

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


    if (
      data?.session &&
      data?.user
    ) {

      currentUser =
        data.user;

      isAdmin =
        calculateAdmin(
          currentUser
        );


      sessionStorage.setItem(
        "viky_login_verified",
        "true"
      );


      clearLoginFields();

      showApplication();

      updateRoleUI();

      loadProfile();


    } else {

      setAuthMode(false);

      showAuthMessage(
        "Account created. Please verify your email, then Sign In."
      );

    }


  } catch (error) {

    console.error(
      "Signup error:",
      error
    );


    showAuthMessage(
      error?.message ||
      "Account creation failed.",
      true
    );


  } finally {

    if (button) {
      button.disabled = false;
    }

  }

}


/* =========================================================
   AUTH SETUP
   ========================================================= */

function setupAuth() {

  $("#authSwitch")
    ?.addEventListener(
      "click",
      () => {

        setAuthMode(
          !signupMode
        );

      }
    );


  $("#authButton")
    ?.addEventListener(
      "click",
      async () => {

        if (signupMode) {

          await signupUser();

        } else {

          await loginUser();

        }

      }
    );


  $("#authPassword")
    ?.addEventListener(
      "keydown",
      async (event) => {

        if (
          event.key === "Enter"
        ) {

          event.preventDefault();

          if (signupMode) {
            await signupUser();
          } else {
            await loginUser();
          }

        }

      }
    );


  $("#authEmail")
    ?.addEventListener(
      "keydown",
      async (event) => {

        if (
          event.key === "Enter"
        ) {

          event.preventDefault();

          if (signupMode) {
            await signupUser();
          } else {
            await loginUser();
          }

        }

      }
    );


  $("#forgotPassword")
    ?.addEventListener(
      "click",
      async () => {

        if (!supabaseClient) {

          showAuthMessage(
            "Supabase is not connected.",
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


        showAuthMessage(
          "Sending password reset email..."
        );


        try {

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
   PROFILE
   ========================================================= */

function loadProfile() {

  if (!currentUser) {
    return;
  }


  const name =
    currentUser.user_metadata?.full_name ||
    currentUser.email?.split("@")[0] ||
    "Viky User";


  const email =
    currentUser.email || "";


  if ($("#profileName")) {

    $("#profileName").value =
      name;

  }


  if ($("#profileEmail")) {

    $("#profileEmail").value =
      email;

  }


  if ($("#profileUsername")) {

    $("#profileUsername").value =
      "@" +
      (
        email
          .split("@")[0]
          .replace(
            /[^a-zA-Z0-9]/g,
            ""
          )
          .toLowerCase()
      );

  }

}


/* =========================================================
   CHECK LOGIN
   ========================================================= */

async function checkLogin() {

  if (!supabaseClient) {

    showLogin();

    return;

  }


  /*
    IMPORTANT:

    Supabase normally keeps its session in localStorage.

    We intentionally require a browser-session marker.

    When the browser is closed, sessionStorage disappears.

    On the next browser open there is no marker, so we
    sign out the old Supabase session and show Login.

    A normal page refresh keeps sessionStorage and therefore
    does not unnecessarily log the user out.
  */

  const verified =
    sessionStorage.getItem(
      "viky_login_verified"
    );


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


    if (
      verified === "true" &&
      data?.session?.user
    ) {

      currentUser =
        data.session.user;

      isAdmin =
        calculateAdmin(
          currentUser
        );

      showApplication();

      updateRoleUI();

      loadProfile();

      return;

    }


    /*
      No browser-session marker.
      Remove any old persisted Supabase session.
    */

    sessionStorage.removeItem(
      "viky_login_verified"
    );


    if (data?.session) {

      await supabaseClient.auth
        .signOut();

    }


    currentUser = null;

    isAdmin = false;

    hideAdminNav();

    showLogin();


  } catch (error) {

    console.error(
      "Session check failed:",
      error
    );


    currentUser = null;

    isAdmin = false;

    showLogin();

  }

}


/* =========================================================
   AUTH STATE LISTENER
   ========================================================= */

function setupAuthStateListener() {

  if (!supabaseClient) {
    return;
  }


  supabaseClient.auth
    .onAuthStateChange(
      (event, session) => {

        if (
          session?.user &&
          sessionStorage.getItem(
            "viky_login_verified"
          ) === "true"
        ) {

          currentUser =
            session.user;

          isAdmin =
            calculateAdmin(
              currentUser
            );

          showApplication();

          updateRoleUI();

          loadProfile();


        } else if (
          !session?.user
        ) {

          currentUser = null;

          isAdmin = false;

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

  try {

    if (supabaseClient) {

      await supabaseClient.auth
        .signOut();

    }

  } catch (error) {

    console.error(
      "Logout error:",
      error
    );

  }


  sessionStorage.removeItem(
    "viky_login_verified"
  );


  currentUser = null;

  isAdmin = false;

  credits = 100;


  hideAdminNav();

  clearLoginFields();

  setAuthMode(false);

  showLogin();

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
      element => {

        element.classList.toggle(
          "active",
          element.dataset.mode === newMode
        );

      }
    );


  $$(".sidebar a[data-mode]")
    .forEach(
      element => {

        element.classList.toggle(
          "active",
          element.dataset.mode === newMode
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


  upload
    ?.classList
    .toggle(
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


  voicePanel
    ?.classList
    .toggle(
      "hidden",
      newMode !== "voice"
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
      "Paste your video or script text...",

    thumbnail:
      "Describe the thumbnail scene...",

    story:
      "Describe your story..."

  };


  if (promptBox) {

    promptBox.placeholder =
      placeholders[newMode] ||
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


  $("#dashboardContent")
    ?.classList
    .remove("hidden");


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


/* =========================================================
   ACCOUNT
   ========================================================= */

function showAccount(page) {

  $("#dashboardContent")
    ?.classList
    .add("hidden");


  $("#accountPage")
    ?.classList
    .remove("hidden");


  $("#adminPage")
    ?.classList
    .add("hidden");


  [
    "profile",
    "subscription",
    "settings"
  ]
    .forEach(
      pageName => {

        $(`#${pageName}Page`)
          ?.classList
          .add("hidden");

      }
    );


  $(`#${page}Page`)
    ?.classList
    .remove("hidden");


  if ($("#accountTitle")) {

    $("#accountTitle")
      .textContent =
      page.charAt(0).toUpperCase() +
      page.slice(1);

  }


  if (page === "profile") {

    loadProfile();

  }


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

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


  $("#dashboardContent")
    ?.classList
    .add("hidden");


  $("#accountPage")
    ?.classList
    .remove("hidden");


  [
    "profile",
    "subscription",
    "settings"
  ]
    .forEach(
      pageName => {

        $(`#${pageName}Page`)
          ?.classList
          .add("hidden");

      }
    );


  $("#adminPage")
    ?.classList
    .remove("hidden");


  if ($("#accountTitle")) {

    $("#accountTitle")
      .textContent =
      "Admin Panel";

  }


  if ($("#adminEmail")) {

    $("#adminEmail")
      .textContent =
      currentUser?.email || "—";

  }


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


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
   BUY
   ========================================================= */

function buy(plan) {

  if (isAdmin) {

    alert(
      "Admin account already has Unlimited Credits and all premium features unlocked."
    );

    return;

  }


  alert(
    `${plan} selected. Payment gateway can be connected in the backend.`
  );

}


window.buy =
  buy;


/* =========================================================
   GENERATE
   ========================================================= */

function generateContent() {

  const promptBox =
    $("#prompt");

  const input =
    $("#mediaInput");

  const button =
    $("#generate");


  if (!promptBox || !button) {
    return;
  }


  /*
    ADMIN HAS UNLIMITED CREDITS
  */

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


  if (
    !isAdmin &&
    credits < cost
  ) {

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
      "Please upload the required image or video first."
    );

    return;

  }


  if (
    !promptBox.value.trim()
  ) {

    alert(
      mode === "voice"
        ? "Please enter your voice-over script."
        : "Please enter a prompt."
    );

    return;

  }


  /*
    Only NORMAL USERS lose credits.
    ADMIN never loses credits.
  */

  if (!isAdmin) {

    credits -= cost;

  }


  updateRoleUI();


  button.disabled =
    true;


  button.innerHTML =
    isAdmin
      ? "⏳ GENERATING... <span>UNLIMITED</span>"
      : mode === "voice"
      ? "⏳ CREATING VOICE..."
      : "⏳ GENERATING VIDEO...";


  setTimeout(
    () => {

      button.disabled =
        false;


      button.innerHTML =
        isAdmin
          ? "⚡ GENERATE VIDEO <span>UNLIMITED</span>"
          : `⚡ GENERATE ${
              mode === "voice"
                ? "VOICE"
                : "VIDEO"
            } <span>${cost} credits</span>`;


      addRecentVideo(
        mode,
        cost
      );

    },
    1800
  );

}


/* =========================================================
   RECENT VIDEO
   ========================================================= */

function addRecentVideo(
  selectedMode,
  cost
) {

  const list =
    $("#recentList");


  if (!list) {
    return;
  }


  list
    .querySelector(".empty")
    ?.remove();


  const item =
    document.createElement(
      "div"
    );


  item.className =
    "video-item";


  const label =
    selectedMode === "voice"
      ? "AI Voice Over"
      : selectedMode === "music"
      ? "AI Music"
      : selectedMode === "soundfx"
      ? "Sound Effects"
      : selectedMode === "subtitle"
      ? "AI Subtitles"
      : selectedMode === "thumbnail"
      ? "AI Thumbnail"
      : selectedMode === "story"
      ? "AI Story Video"
      : "AI Video";


  const creditText =
    isAdmin
      ? "✓ Admin • Unlimited Credits"
      : `✓ Demo complete • ${cost} credits`;


  item.innerHTML = `
    <div class="thumb"></div>

    <div>
      <b>${label}</b>
      <small>${creditText}</small>
    </div>
  `;


  list.prepend(
    item
  );

}


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

  const moreArrow =
    $("#moreArrow");


  /* =======================================================
     PROMPT COUNTER
     ======================================================= */

  promptBox?.addEventListener(
    "input",
    () => {

      if (counter) {

        counter.textContent =
          `${promptBox.value.length} / 2000`;

      }

    }
  );


  /* =======================================================
     MODE BUTTONS
     ======================================================= */

  $$(".mode, .sidebar a[data-mode]")
    .forEach(
      element => {

        element.addEventListener(
          "click",
          event => {

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


            moreMenu
              ?.classList
              .add("hidden");

          }
        );

      }
    );


  /* =======================================================
     MORE
     ======================================================= */

  moreTools?.addEventListener(
    "click",
    event => {

      event.preventDefault();


      moreMenu
        ?.classList
        .toggle("hidden");


      if (moreArrow) {

        moreArrow.textContent =
          moreMenu?.classList
            .contains("hidden")
            ? "⌄"
            : "⌃";

      }

    }
  );


  /* =======================================================
     PAGE NAVIGATION
     ======================================================= */

  $$("[data-page]")
    .forEach(
      element => {

        element.addEventListener(
          "click",
          event => {

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


  /* =======================================================
     BACK
     ======================================================= */

  $("#backDashboard")
    ?.addEventListener(
      "click",
      event => {

        event.preventDefault();

        showDashboard();

      }
    );


  /* =======================================================
     CHOICES
     ======================================================= */

  $$(".choices button")
    .forEach(
      button => {

        button.addEventListener(
          "click",
          event => {

            event.preventDefault();


            button.parentElement
              ?.querySelectorAll("button")
              .forEach(
                item => {

                  item.classList
                    .remove("selected");

                }
              );


            button.classList
              .add("selected");

          }
        );

      }
    );


  /* =======================================================
     VOICE
     ======================================================= */

  $$(".voice-choice")
    .forEach(
      button => {

        button.addEventListener(
          "click",
          event => {

            event.preventDefault();


            $$(".voice-choice")
              .forEach(
                item => {

                  item.classList
                    .remove("selected");

                }
              );


            button.classList
              .add("selected");

          }
        );

      }
    );


  /* =======================================================
     FILE
     ======================================================= */

  input?.addEventListener(
    "change",
    () => {

      if (
        input.files &&
        input.files.length
      ) {

        const small =
          $("#uploadLabel")
            ?.querySelector("small");


        if (small) {

          small.textContent =
            `Selected: ${input.files[0].name}`;

        }

      }

    }
  );


  /* =======================================================
     GENERATE
     ======================================================= */

  $("#generate")
    ?.addEventListener(
      "click",
      event => {

        event.preventDefault();

        generateContent();

      }
    );


  /* =======================================================
     LOGOUT
     ======================================================= */

  $("#logoutButton")
    ?.addEventListener(
      "click",
      logout
    );


  /* =======================================================
     ADMIN BUTTONS
     ======================================================= */

  $("#adminUsersBtn")
    ?.addEventListener(
      "click",
      () => {

        showAdminMessage(
          "User management is ready for connection to a secure Supabase backend or Edge Function."
        );

      }
    );


  $("#adminCreditsBtn")
    ?.addEventListener(
      "click",
      () => {

        showAdminMessage(
          "Admin account status: UNLIMITED CREDITS. Credit deduction is disabled for this account."
        );

      }
    );


  $("#adminVideosBtn")
    ?.addEventListener(
      "click",
      () => {

        showAdminMessage(
          "Video management is ready for connection to your video-generation backend."
        );

      }
    );


  $("#adminSettingsBtn")
    ?.addEventListener(
      "click",
      () => {

        showAdminMessage(
          "Admin settings are protected by the Admin email check."
        );

      }
    );

}


/* =========================================================
   ADMIN MESSAGE
   ========================================================= */

function showAdminMessage(message) {

  const box =
    $("#adminMessage");


  if (!box) {
    return;
  }


  box.textContent =
    message;


  box.classList
    .remove("hidden");

}


/* =========================================================
   INITIALIZE
   ========================================================= */

async function initializeVikyAI() {

  console.log(
    "Viky AI initializing..."
  );


  /*
    Clear HTML autofill/value.
    This prevents accidentally displaying credentials
    that may have been placed in old HTML.
  */

  clearLoginFields();


  if (
    !window.supabase ||
    typeof window.supabase.createClient !==
    "function"
  ) {

    console.error(
      "Supabase JavaScript library was not loaded."
    );

    showLogin();

    return;

  }


  try {

    supabaseClient =
      window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY,
        {

          auth: {

            persistSession: true,

            autoRefreshToken: true,

            detectSessionInUrl: true

          }

        }
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

  setAuthMode(false);

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
    initializeVikyAI,
    {
      once: true
    }
  );

} else {

  initializeVikyAI();

}
