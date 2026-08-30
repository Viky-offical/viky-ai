/* =========================================================
   VIKY AI
   COMPLETE FIXED APP.JS
   SUPABASE AUTH + ADMIN + USER + CREDITS + LOGOUT
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
   CHECK ADMIN
   ========================================================= */

function isCurrentAdmin() {

  const email =
    currentUser?.email?.trim().toLowerCase();

  return (
    !!email &&
    email === ADMIN_EMAIL.trim().toLowerCase()
  );
}


/* =========================================================
   AUTH MESSAGE
   ========================================================= */

function showAuthMessage(message, isError = false) {

  const element = $("#authMessage");

  if (!element) return;

  element.textContent = message || "";

  element.style.color =
    isError
      ? "#ff5c5c"
      : "#22c55e";
}


/* =========================================================
   CLEAR AUTH FIELDS
   ========================================================= */

function clearLoginFields() {

  const email = $("#authEmail");
  const password = $("#authPassword");
  const name = $("#authName");

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
   FORCE EMPTY AUTH FIELDS
   ========================================================= */

function forceEmptyLoginFields() {

  [
    $("#authEmail"),
    $("#authPassword"),
    $("#authName")
  ].forEach(field => {

    if (!field) return;

    field.value = "";

    field.removeAttribute("value");

  });
}


/* =========================================================
   SHOW LOGIN
   ========================================================= */

function showLogin() {

  const authScreen = $("#authScreen");

  if (authScreen) {
    authScreen.style.display = "flex";
  }

  forceEmptyLoginFields();

  updateRoleUI(null);
}


/* =========================================================
   HIDE LOGIN
   ========================================================= */

function hideLogin() {

  const authScreen = $("#authScreen");

  if (authScreen) {
    authScreen.style.display = "none";
  }
}


/* =========================================================
   ROLE UI
   ========================================================= */

function updateRoleUI(user) {

  const headerName = $("#headerUserName");
  const headerRole = $("#headerRole");
  const avatar = $("#userAvatar");
  const adminNav = $("#adminNav");

  if (!user) {

    if (headerName) {
      headerName.textContent = "Viky User";
    }

    if (headerRole) {
      headerRole.className =
        "role-badge user-role";

      headerRole.innerHTML =
        "<i></i>User";
    }

    if (avatar) {
      avatar.textContent = "V";
    }

    adminNav?.classList.add("hidden");

    return;
  }


  const email =
    user.email?.trim().toLowerCase() || "";

  const admin =
    email === ADMIN_EMAIL.trim().toLowerCase();

  isAdmin = admin;


  const name =
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "Viky User";


  if (headerName) {
    headerName.textContent = name;
  }

  if (avatar) {
    avatar.textContent =
      name.charAt(0).toUpperCase();
  }


  if (admin) {

    if (headerRole) {

      headerRole.className =
        "role-badge admin-role-badge";

      headerRole.innerHTML =
        "<i></i>Admin";
    }

    adminNav?.classList.remove("hidden");

  } else {

    if (headerRole) {

      headerRole.className =
        "role-badge user-role";

      headerRole.innerHTML =
        "<i></i>User";
    }

    adminNav?.classList.add("hidden");
  }
}


/* =========================================================
   CREDIT UI
   ========================================================= */

function updateCreditUI() {

  const creditCount =
    $("#creditCount");


  if (isAdmin) {

    credits = Infinity;

    if (creditCount) {

      creditCount.textContent = "∞";

      creditCount.title =
        "Unlimited Credits";
    }

  } else {

    if (!Number.isFinite(credits)) {
      credits = 100;
    }

    if (creditCount) {
      creditCount.textContent =
        String(credits);
    }
  }


  const unlimited =
    document.querySelector(".unlimited");

  const planParagraph =
    document.querySelector(".plan p");

  const planSmall =
    document.querySelector(".plan small");

  const planBar =
    document.querySelector(".plan .bar");

  const planBarInner =
    document.querySelector(".plan .bar i");


  if (isAdmin) {

    if (unlimited) {
      unlimited.innerHTML =
        "∞ <b>Admin Unlimited</b>";
    }

    if (planParagraph) {
      planParagraph.textContent =
        "Unlimited credits • All features unlocked";
    }

    if (planSmall) {
      planSmall.textContent =
        "Unlimited generation available for admin";
    }

    if (planBar) {
      planBar.style.display = "none";
    }

    if (planBarInner) {
      planBarInner.style.width = "100%";
    }

  } else {

    if (unlimited) {
      unlimited.innerHTML =
        "∞ <b>Free</b>";
    }

    if (planParagraph) {
      planParagraph.textContent =
        "100 welcome credits";
    }

    if (planSmall) {
      planSmall.textContent =
        `${credits} credits remaining`;
    }

    if (planBar) {
      planBar.style.display = "block";
    }

    if (planBarInner) {

      const percentage =
        Math.max(
          0,
          Math.min(
            100,
            credits
          )
        );

      planBarInner.style.width =
        `${percentage}%`;
    }
  }
}


/* =========================================================
   ADMIN DASHBOARD
   ========================================================= */

function setupAdminDashboard() {

  if (!isAdmin) return;

  credits = Infinity;

  updateCreditUI();


  const heroTitle =
    document.querySelector(".hero-title h1");

  const heroSubtitle =
    document.querySelector(".hero-title p");


  if (heroTitle) {

    heroTitle.innerHTML =
      'Admin <span class="admin-highlight">AI Video Dashboard</span>';

  }


  if (heroSubtitle) {

    heroSubtitle.textContent =
      "Full access • Unlimited Credits • All AI features unlocked";

  }


  const generate =
    $("#generate");


  if (generate) {

    const span =
      generate.querySelector("span");

    if (span) {
      span.textContent =
        "∞ Unlimited";
    }
  }


  const note =
    document.querySelector(".note");


  if (note) {

    note.innerHTML =
      "Admin Access: <b>Unlimited Credits</b> • All premium features unlocked.";

  }


  const sideCard =
    document.querySelector(".side-card");


  if (sideCard) {

    const title =
      sideCard.querySelector("b");

    const paragraph =
      sideCard.querySelector("p");

    const button =
      sideCard.querySelector("button");


    if (title) {
      title.textContent =
        "Viky AI ADMIN";
    }

    if (paragraph) {

      paragraph.textContent =
        "Admin account has unlimited credits and full access to all features.";

    }

    if (button) {
      button.textContent =
        "ADMIN ACCESS";
    }
  }
}


/* =========================================================
   USER DASHBOARD
   ========================================================= */

function setupUserDashboard() {

  if (isAdmin) return;

  if (!Number.isFinite(credits)) {
    credits = 100;
  }


  const heroTitle =
    document.querySelector(".hero-title h1");

  const heroSubtitle =
    document.querySelector(".hero-title p");


  if (heroTitle) {
    heroTitle.textContent =
      "Generate AI Video";
  }


  if (heroSubtitle) {

    heroSubtitle.textContent =
      "Choose a mode and turn your idea into a video.";

  }


  const note =
    document.querySelector(".note");


  if (note) {

    note.innerHTML =
      'Generation cost: <b>20 credits</b> per video. Your free account starts with <b>100 credits</b>.';

  }


  updateCreditUI();
}


/* =========================================================
   SHOW APP
   ========================================================= */

async function showApp() {

  if (!currentUser) {

    showLogin();

    return;
  }


  hideLogin();

  updateRoleUI(currentUser);


  const userName =
    currentUser.user_metadata?.full_name ||
    currentUser.email?.split("@")[0] ||
    "Viky User";


  /*
     Replace only exact Viky User text.
  */

  document
    .querySelectorAll("body *")
    .forEach(element => {

      if (
        element.children.length === 0 &&
        element.textContent.trim() === "Viky User"
      ) {

        element.textContent =
          userName;
      }

    });


  const profileName =
    $("#profileName");

  const profileEmail =
    $("#profileEmail");


  if (profileName) {

    profileName.value =
      currentUser.user_metadata?.full_name ||
      userName;

  }


  if (profileEmail) {

    profileEmail.value =
      currentUser.email || "";

  }


  /*
     ADMIN / USER
  */

  if (isCurrentAdmin()) {

    isAdmin = true;

    credits = Infinity;

    setupAdminDashboard();

  } else {

    isAdmin = false;

    if (!Number.isFinite(credits)) {
      credits = 100;
    }

    setupUserDashboard();
  }


  updateCreditUI();
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
   CHECK ADMIN ACCESS
   ========================================================= */

async function checkAdminAccess() {

  if (!supabaseClient) {

    isAdmin = false;

    hideAdminNav();

    updateRoleUI(null);

    return false;
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

      updateRoleUI(null);

      return false;
    }


    currentUser =
      user;


    isAdmin =
      isCurrentAdmin();


    updateRoleUI(user);


    const adminRole =
      $("#adminRole");

    const adminStatus =
      $("#adminStatus");

    const adminEmail =
      $("#adminEmail");


    if (isAdmin) {

      credits = Infinity;


      if (adminRole) {
        adminRole.textContent =
          "Admin";
      }


      if (adminStatus) {

        adminStatus.textContent =
          "✓ Authorized • Unlimited";

      }


      if (adminEmail) {

        adminEmail.textContent =
          user.email || "—";

      }

    } else {

      if (!Number.isFinite(credits)) {
        credits = 100;
      }

    }


    updateCreditUI();

    return isAdmin;


  } catch (error) {

    console.error(
      "Admin access check failed:",
      error
    );


    isAdmin = false;

    hideAdminNav();

    updateRoleUI(currentUser);

    return false;
  }
}


/* =========================================================
   AUTH MODE
   IMPORTANT:
   DO NOT CLEAR FORM HERE
   ========================================================= */

function setAuthMode(isSignup) {

  signupMode =
    Boolean(isSignup);


  const title =
    $("#authTitle");

  const subtitle =
    $("#authSubtitle");

  const name =
    $("#authName");

  const button =
    $("#authButton");

  const switchText =
    $("#authSwitchText");

  const switchButton =
    $("#authSwitch");

  const forgot =
    $("#forgotPassword");


  if (signupMode) {

    if (title) {
      title.textContent =
        "Create your account";
    }

    if (subtitle) {

      subtitle.textContent =
        "Join Viky AI and start creating";

    }

    if (name) {
      name.style.display =
        "block";
    }

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

    if (forgot) {
      forgot.style.display =
        "none";
    }


  } else {

    if (title) {

      title.textContent =
        "Welcome to Viky AI";

    }

    if (subtitle) {

      subtitle.textContent =
        "Sign in to continue";

    }

    if (name) {
      name.style.display =
        "none";
    }

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

    if (forgot) {

      forgot.style.display =
        "block";

    }
  }
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

    button.disabled = true;

    button.textContent =
      "Signing In...";

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

          email: email,

          password: password

        });


    if (error) {
      throw error;
    }


    if (!data?.user) {

      throw new Error(
        "Login completed but no user was returned."
      );

    }


    currentUser =
      data.user;


    await checkAdminAccess();

    await showApp();


    forceEmptyLoginFields();


    /*
       Auth screen is hidden,
       therefore message is not important.
    */

  } catch (error) {

    console.error(
      "Login error:",
      error
    );


    let message =
      error?.message ||
      "Login failed. Please try again.";


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

    if (button) {

      button.disabled = false;

      button.textContent =
        signupMode
          ? "Create Account"
          : "Sign In";

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

    button.textContent =
      "Creating Account...";

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
       IMPORTANT:
       If email confirmation is OFF,
       Supabase returns a session.
    */

    if (
      data?.user &&
      data?.session
    ) {

      currentUser =
        data.user;


      await checkAdminAccess();

      await showApp();


      forceEmptyLoginFields();


      return;
    }


    /*
       If confirmation is still enabled,
       user exists but no session.
    */

    if (data?.user && !data?.session) {

      showAuthMessage(
        "Account created. Email confirmation is still enabled in Supabase.",
        true
      );

      return;
    }


    throw new Error(
      "Account could not be created."
    );


  } catch (error) {

    console.error(
      "Signup error:",
      error
    );


    let message =
      error?.message ||
      "Account creation failed.";


    const lower =
      message.toLowerCase();


    if (
      lower.includes("user already registered") ||
      lower.includes("already registered")
    ) {

      message =
        "This email is already registered. Please Sign In.";

    }


    showAuthMessage(
      message,
      true
    );


  } finally {

    if (button) {

      button.disabled = false;

      button.textContent =
        signupMode
          ? "Create Account"
          : "Sign In";

    }
  }
}


/* =========================================================
   AUTH SETUP
   ========================================================= */

function setupAuth() {

  const form =
    $("#authForm");

  const authSwitch =
    $("#authSwitch");

  const forgotPassword =
    $("#forgotPassword");


  /*
     Prevent duplicate listeners.
  */

  if (form) {

    form.addEventListener(
      "submit",
      async event => {

        event.preventDefault();

        event.stopPropagation();


        if (signupMode) {

          await signupUser();

        } else {

          await loginUser();

        }

      }
    );

  }


  /*
     LOGIN / SIGNUP SWITCH
  */

  authSwitch?.addEventListener(
    "click",
    event => {

      event.preventDefault();

      event.stopPropagation();


      /*
         Save current mode only.
         Do NOT wipe the form here.
      */

      setAuthMode(
        !signupMode
      );

    }
  );


  /*
     FORGOT PASSWORD
  */

  forgotPassword?.addEventListener(
    "click",
    async event => {

      event.preventDefault();


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
   CHECK LOGIN
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


    if (data?.session?.user) {

      currentUser =
        data.session.user;


      await checkAdminAccess();

      await showApp();

    } else {

      currentUser = null;

      isAdmin = false;

      credits = 100;

      showLogin();

    }


  } catch (error) {

    console.error(
      "Session check failed:",
      error
    );


    currentUser = null;

    isAdmin = false;

    credits = 100;

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
      async (event, session) => {

        console.log(
          "Auth event:",
          event
        );


        if (session?.user) {

          currentUser =
            session.user;


          isAdmin =
            isCurrentAdmin();


          updateRoleUI(
            currentUser
          );


          hideLogin();


          /*
             Small delay prevents Supabase
             auth event race conditions.
          */

          setTimeout(
            async () => {

              await checkAdminAccess();

              await showApp();

            },
            0
          );


        } else {

          currentUser = null;

          isAdmin = false;

          credits = 100;


          hideAdminNav();

          updateRoleUI(null);

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

      const {
        error
      } =
        await supabaseClient.auth
          .signOut();


      if (error) {
        throw error;
      }

    }


    currentUser = null;

    isAdmin = false;

    credits = 100;


    hideAdminNav();

    updateRoleUI(null);

    forceEmptyLoginFields();

    setAuthMode(false);

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
    .forEach(element => {

      element.classList.toggle(
        "active",
        element.dataset.mode === newMode
      );

    });


  $$(".sidebar a[data-mode]")
    .forEach(element => {

      element.classList.toggle(
        "active",
        element.dataset.mode === newMode
      );

    });


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
    ].includes(newMode);


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

  $("#adminPage")
    ?.classList
    .add("hidden");

  $(".content")
    ?.classList
    .remove("hidden");


  updateCreditUI();
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
    .forEach(pageName => {

      $(`#${pageName}Page`)
        ?.classList
        .add("hidden");

    });


  $(`#${page}Page`)
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

  if (!isCurrentAdmin()) {

    alert(
      "Admin access required."
    );

    return;
  }


  isAdmin = true;

  credits = Infinity;


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
      "Admin";

  }


  if ($("#adminStatus")) {

    $("#adminStatus")
      .textContent =
      "✓ Authorized • Unlimited";

  }


  if ($("#adminEmail")) {

    $("#adminEmail")
      .textContent =
      currentUser?.email ||
      "—";

  }


  const adminMessage =
    $("#adminMessage");


  if (adminMessage) {

    adminMessage.style.display =
      "block";

    adminMessage.textContent =
      "Admin access active • Unlimited Credits • All features unlocked.";

  }
}


/* =========================================================
   PRICING
   ========================================================= */

function scrollToPricing() {

  showDashboard();


  setTimeout(
    () => {

      $("#pricing")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

    },
    100
  );
}


window.scrollToPricing =
  scrollToPricing;


/* =========================================================
   BUY
   ========================================================= */

function buy(plan) {

  if (isCurrentAdmin()) {

    alert(
      "Admin account already has Unlimited Credits and all premium features unlocked."
    );

    return;
  }


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


  /*
     PROMPT COUNTER
  */

  promptBox?.addEventListener(
    "input",
    () => {

      if (counter) {

        counter.textContent =
          `${promptBox.value.length} / 2000`;

      }

    }
  );


  /*
     MODE BUTTONS
  */

  $$(".mode, .sidebar a[data-mode]")
    .forEach(element => {

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
            ].includes(selectedMode)
          ) {

            setMode("voice");

          } else if (selectedMode) {

            setMode(selectedMode);

          }


          moreMenu
            ?.classList
            .add("hidden");

        }
      );

    });


  /*
     MORE MENU
  */

  moreTools?.addEventListener(
    "click",
    event => {

      event.preventDefault();


      moreMenu
        ?.classList
        .toggle("hidden");


      const button =
        moreTools.querySelector("b");


      if (button) {

        button.textContent =
          moreMenu?.classList.contains("hidden")
            ? "⌄"
            : "⌃";

      }

    }
  );


  /*
     ACCOUNT / ADMIN NAVIGATION
  */

  $$("[data-page]")
    .forEach(element => {

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

            showAccount(page);

          }

        }
      );

    });


  /*
     BACK DASHBOARD
  */

  $("#backDashboard")
    ?.addEventListener(
      "click",
      event => {

        event.preventDefault();

        showDashboard();

      }
    );


  /*
     BACK ADMIN
  */

  $("#backFromAdmin")
    ?.addEventListener(
      "click",
      event => {

        event.preventDefault();

        showDashboard();

      }
    );


  /*
     CHOICES
  */

  $$(".choices button")
    .forEach(button => {

      button.addEventListener(
        "click",
        event => {

          event.preventDefault();


          button.parentElement
            ?.querySelectorAll("button")
            .forEach(item => {

              item.classList
                .remove("selected");

            });


          button.classList
            .add("selected");

        }
      );

    });


  /*
     VOICE CHOICES
  */

  $$(".voice-choice")
    .forEach(button => {

      button.addEventListener(
        "click",
        event => {

          event.preventDefault();


          $$(".voice-choice")
            .forEach(item => {

              item.classList
                .remove("selected");

            });


          button.classList
            .add("selected");

        }
      );

    });


  /*
     FILE UPLOAD
  */

  input?.addEventListener(
    "change",
    () => {

      if (
        input.files &&
        input.files.length > 0
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


  /*
     GENERATE
  */

  $("#generate")
    ?.addEventListener(
      "click",
      event => {

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


        /*
           ADMIN = NO CREDIT LIMIT
        */

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


        /*
           MEDIA REQUIRED
        */

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


        /*
           PROMPT REQUIRED
        */

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


        /*
           DEDUCT ONLY NORMAL USER CREDITS
        */

        if (!isAdmin) {

          credits -= cost;

        } else {

          credits = Infinity;

        }


        updateCreditUI();


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
              } <span>${
                isAdmin
                  ? "∞ Unlimited"
                  : `${cost} credits`
              }</span>`;


            updateCreditUI();


            const list =
              $("#recentList");


            if (!list) {
              return;
            }


            list
              .querySelector(".empty")
              ?.remove();


            const item =
              document.createElement("div");


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
                <small>
                  ✓ Demo complete • ${
                    isAdmin
                      ? "Unlimited Credits"
                      : `${cost} credits`
                  }
                </small>
              </div>
            `;


            list.prepend(item);

          },
          1800
        );

      }
    );


  /*
     ADMIN BUTTONS
  */

  const adminButtons = [

    [
      "#adminUsersBtn",
      "👥 User Management opened."
    ],

    [
      "#adminCreditsBtn",
      "💳 Credits Management opened. Admin has Unlimited Credits."
    ],

    [
      "#adminVideosBtn",
      "🎬 Video Management opened."
    ],

    [
      "#adminSettingsBtn",
      "⚙ Admin Settings opened."
    ]

  ];


  adminButtons.forEach(
    ([selector, message]) => {

      $(selector)?.addEventListener(
        "click",
        () => {

          if (!isCurrentAdmin()) {

            alert(
              "Admin access required."
            );

            return;
          }


          const box =
            $("#adminMessage");


          if (box) {

            box.style.display =
              "block";

            box.textContent =
              message;

          }


          alert(message);

        }
      );

    }
  );


  /*
     SAVE BUTTONS
  */

  $$(".save-btn")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          alert(
            "Settings saved successfully."
          );

        }
      );

    });


  /*
     UPGRADE BUTTONS
  */

  $$(".side-card button")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          if (isAdmin) {

            alert(
              "Admin account already has Unlimited Credits and all features unlocked."
            );

          } else {

            scrollToPricing();

          }

        }
      );

    });
}


/* =========================================================
   CREATE SUPABASE CLIENT
   ========================================================= */

function createSupabaseClient() {

  if (
    !window.supabase ||
    typeof window.supabase.createClient !==
    "function"
  ) {

    console.error(
      "Supabase JavaScript library was not loaded."
    );

    return null;
  }


  try {

    return window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_KEY,
      {

        auth: {

          /*
             Login is not stored permanently.
          */

          persistSession: false,

          autoRefreshToken: false,

          detectSessionInUrl: false

        }

      }
    );


  } catch (error) {

    console.error(
      "Supabase client creation failed:",
      error
    );

    return null;
  }
}


/* =========================================================
   INITIALIZE
   ========================================================= */

async function initializeVikyAI() {

  console.log(
    "Viky AI initializing..."
  );


  /*
     Initial login mode.
     IMPORTANT:
     Do not call clearLoginFields
     after switching signup/login.
  */

  forceEmptyLoginFields();

  setAuthMode(false);


  /*
     SUPABASE
  */

  supabaseClient =
    createSupabaseClient();


  if (!supabaseClient) {

    showLogin();

    return;
  }


  /*
     SETUP
  */

  setupAuth();

  setupDashboard();

  setupAuthStateListener();


  /*
     SESSION
  */

  await checkLogin();


  /*
     Keep login fields empty
     when login screen is visible.
  */

  if (
    $("#authScreen") &&
    $("#authScreen").style.display !== "none"
  ) {

    forceEmptyLoginFields();

  }


  console.log(
    "Viky AI initialized."
  );
}


/* =========================================================
   START
   ========================================================= */

if (
  document.readyState === "loading"
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
