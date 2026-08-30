/* =========================================================
   VIKY AI
   SUPABASE AUTH + ADMIN + USER
   SESSION DOES NOT PERSIST AFTER PAGE CLOSE
   ADMIN = daimvirk555@gmail.com
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
   AUTH MESSAGE
   ========================================================= */

function showAuthMessage(message, isError = false) {

  const element =
    $("#authMessage");

  if (!element) {
    return;
  }

  element.textContent =
    message || "";

  element.style.color =
    isError
      ? "#ef4444"
      : "#22c55e";
}


/* =========================================================
   LOGIN SCREEN
   ========================================================= */

function showLogin() {

  const screen =
    $("#authScreen");

  if (screen) {
    screen.style.display = "flex";
  }

}


function hideLogin() {

  const screen =
    $("#authScreen");

  if (screen) {
    screen.style.display = "none";
  }

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
   RESET UI
   ========================================================= */

function resetUserUI() {

  const name =
    $("#userDisplayName");

  const avatar =
    $("#userAvatar");

  const roleBadge =
    $("#userRoleBadge");

  const roleText =
    roleBadge?.querySelector("span");

  const creditCount =
    $("#creditCount");

  const planName =
    $("#planName");

  const planText =
    $("#planCreditsText");

  const description =
    $("#creditDescription");

  const bar =
    $("#creditBar");

  const profileName =
    $("#profileName");

  const profileEmail =
    $("#profileEmail");

  const profileRoleName =
    $("#profileRoleName");

  const profileRoleStatus =
    $("#profileRoleStatus");


  if (name) {
    name.textContent =
      "Viky User";
  }


  if (avatar) {
    avatar.textContent =
      "V";
  }


  if (roleBadge) {

    roleBadge.classList.remove(
      "admin-role"
    );

    roleBadge.classList.add(
      "user-role"
    );

  }


  if (roleText) {
    roleText.textContent =
      "USER";
  }


  if (creditCount) {
    creditCount.textContent =
      "100";
  }


  if (planName) {
    planName.textContent =
      "Free";
  }


  if (planText) {
    planText.textContent =
      "100 welcome credits";
  }


  if (description) {
    description.textContent =
      "100 credits available";
  }


  if (bar) {
    bar.style.width =
      "100%";
  }


  if (profileName) {
    profileName.value =
      "Viky User";
  }


  if (profileEmail) {
    profileEmail.value =
      "";
  }


  if (profileRoleName) {
    profileRoleName.textContent =
      "USER";
  }


  if (profileRoleStatus) {
    profileRoleStatus.textContent =
      "● Normal User";

    profileRoleStatus.style.color =
      "#22c55e";
  }


  hideAdminNav();

}


/* =========================================================
   HIDE ADMIN NAV
   ========================================================= */

function hideAdminNav() {

  const adminNav =
    $("#adminNav");

  if (adminNav) {

    adminNav.classList.add(
      "hidden"
    );

  }

}


/* =========================================================
   UPDATE USER UI
   ========================================================= */

function updateUserUI(user) {

  if (!user) {
    resetUserUI();
    return;
  }


  const email =
    (user.email || "")
      .trim()
      .toLowerCase();


  const adminEmail =
    ADMIN_EMAIL
      .trim()
      .toLowerCase();


  isAdmin =
    email === adminEmail;


  const name =
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "Viky User";


  const displayName =
    $("#userDisplayName");


  const avatar =
    $("#userAvatar");


  const roleBadge =
    $("#userRoleBadge");


  const roleText =
    roleBadge?.querySelector("span");


  const creditCount =
    $("#creditCount");


  const planName =
    $("#planName");


  const planText =
    $("#planCreditsText");


  const description =
    $("#creditDescription");


  const bar =
    $("#creditBar");


  const profileName =
    $("#profileName");


  const profileEmail =
    $("#profileEmail");


  const profileRoleName =
    $("#profileRoleName");


  const profileRoleStatus =
    $("#profileRoleStatus");


  if (displayName) {

    displayName.textContent =
      name;

  }


  if (avatar) {

    avatar.textContent =
      name
        .charAt(0)
        .toUpperCase();

  }


  if (profileName) {

    profileName.value =
      name;

  }


  if (profileEmail) {

    profileEmail.value =
      user.email || "";

  }


  /* =====================================================
     ADMIN
     ===================================================== */

  if (isAdmin) {

    credits =
      Infinity;


    if (roleBadge) {

      roleBadge.classList.remove(
        "user-role"
      );

      roleBadge.classList.add(
        "admin-role"
      );

    }


    if (roleText) {

      roleText.textContent =
        "ADMIN";

    }


    if (creditCount) {

      creditCount.textContent =
        "∞";

    }


    if (planName) {

      planName.textContent =
        "Unlimited";

    }


    if (planText) {

      planText.textContent =
        "Unlimited Credits";

    }


    if (description) {

      description.textContent =
        "All features unlocked";

    }


    if (bar) {

      bar.style.width =
        "100%";

    }


    if (profileRoleName) {

      profileRoleName.textContent =
        "ADMIN";

    }


    if (profileRoleStatus) {

      profileRoleStatus.textContent =
        "● Authorized Admin";

      profileRoleStatus.style.color =
        "#ef4444";

    }


    const adminNav =
      $("#adminNav");

    adminNav?.classList.remove(
      "hidden"
    );


    /* Admin panel email */

    const adminEmailElement =
      $("#adminEmail");

    if (adminEmailElement) {

      adminEmailElement.textContent =
        user.email || ADMIN_EMAIL;

    }


    return;

  }


  /* =====================================================
     NORMAL USER
     ===================================================== */

  credits =
    100;


  if (roleBadge) {

    roleBadge.classList.remove(
      "admin-role"
    );

    roleBadge.classList.add(
      "user-role"
    );

  }


  if (roleText) {

    roleText.textContent =
      "USER";

  }


  if (creditCount) {

    creditCount.textContent =
      credits;

  }


  if (planName) {

    planName.textContent =
      "Free";

  }


  if (planText) {

    planText.textContent =
      "100 welcome credits";

  }


  if (description) {

    description.textContent =
      "100 credits available";

  }


  if (bar) {

    bar.style.width =
      "100%";

  }


  if (profileRoleName) {

    profileRoleName.textContent =
      "USER";

  }


  if (profileRoleStatus) {

    profileRoleStatus.textContent =
      "● Normal User";

    profileRoleStatus.style.color =
      "#22c55e";

  }


  hideAdminNav();

}


/* =========================================================
   ADMIN ACCESS
   ========================================================= */

async function checkAdminAccess() {

  if (!supabaseClient) {

    isAdmin =
      false;

    hideAdminNav();

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

      currentUser =
        null;

      isAdmin =
        false;

      hideAdminNav();

      return false;

    }


    currentUser =
      user;


    updateUserUI(
      user
    );


    return isAdmin;

  } catch (error) {

    console.error(
      "Admin check failed:",
      error
    );

    isAdmin =
      false;

    hideAdminNav();

    return false;

  }

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

    title &&
      (title.textContent =
        "Create your account");


    subtitle &&
      (subtitle.textContent =
        "Join Viky AI and start creating");


    name &&
      (name.style.display =
        "block");


    button &&
      (button.textContent =
        "Create Account");


    switchText &&
      (switchText.textContent =
        "Already have an account?");


    switchButton &&
      (switchButton.textContent =
        "Sign In");


    forgot &&
      (forgot.style.display =
        "none");

  } else {

    title &&
      (title.textContent =
        "Welcome to Viky AI");


    subtitle &&
      (subtitle.textContent =
        "Sign in to continue");


    name &&
      (name.style.display =
        "none");


    button &&
      (button.textContent =
        "Sign In");


    switchText &&
      (switchText.textContent =
        "Don't have an account?");


    switchButton &&
      (switchButton.textContent =
        "Create Account");


    forgot &&
      (forgot.style.display =
        "block");

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

    button.textContent =
      "Signing in...";

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

          email:
            email,

          password:
            password

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


    updateUserUI(
      currentUser
    );


    hideLogin();


    showAuthMessage(
      "Login successful!"
    );


    /* Clear password immediately */

    const passwordInput =
      $("#authPassword");

    if (passwordInput) {
      passwordInput.value =
        "";
    }


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

    button.disabled =
      true;

    button.textContent =
      "Creating...";

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

          email:
            email,

          password:
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


    if (data?.session && data?.user) {

      currentUser =
        data.user;


      updateUserUI(
        currentUser
      );


      hideLogin();


      showAuthMessage(
        "Account created successfully!"
      );

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

      button.disabled =
        false;

      button.textContent =
        signupMode
          ? "Create Account"
          : "Sign In";

    }

  }

}


/* =========================================================
   FORGOT PASSWORD
   ========================================================= */

async function forgotPassword() {

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


/* =========================================================
   AUTH SETUP
   ========================================================= */

function setupAuth() {

  const authSwitch =
    $("#authSwitch");

  const authButton =
    $("#authButton");

  const forgotButton =
    $("#forgotPassword");

  const logoutButton =
    $("#logoutButton");


  authSwitch?.addEventListener(
    "click",
    (event) => {

      event.preventDefault();

      setAuthMode(
        !signupMode
      );

    }
  );


  authButton?.addEventListener(
    "click",
    async (event) => {

      event.preventDefault();

      if (signupMode) {

        await signupUser();

      } else {

        await loginUser();

      }

    }
  );


  forgotButton?.addEventListener(
    "click",
    async (event) => {

      event.preventDefault();

      await forgotPassword();

    }
  );


  logoutButton?.addEventListener(
    "click",
    async (event) => {

      event.preventDefault();

      await logout();

    }
  );


  /* Enter key login */

  ["#authEmail", "#authPassword"]
    .forEach((selector) => {

      $(selector)?.addEventListener(
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

    });

}


/* =========================================================
   LOGOUT
   ========================================================= */

async function logout() {

  try {

    if (supabaseClient) {

      await supabaseClient.auth
        .signOut({
          scope: "local"
        });

    }

  } catch (error) {

    console.error(
      "Logout error:",
      error
    );

  }


  currentUser =
    null;

  isAdmin =
    false;

  credits =
    100;


  resetUserUI();

  clearLoginFields();

  setAuthMode(false);

  showLogin();

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
    .forEach((pageName) => {

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


  const email =
    $("#adminEmail");

  if (email) {

    email.textContent =
      currentUser?.email ||
      ADMIN_EMAIL;

  }

}


/* =========================================================
   MODE
   ========================================================= */

function setMode(newMode) {

  mode =
    newMode;


  $$(".mode")
    .forEach((element) => {

      element.classList.toggle(
        "active",
        element.dataset.mode === newMode
      );

    });


  $$(".sidebar a[data-mode]")
    .forEach((element) => {

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
      "Admin account already has Unlimited Credits and all features unlocked."
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


  /* =====================================================
     PROMPT COUNTER
     ===================================================== */

  promptBox?.addEventListener(
    "input",
    () => {

      if (counter) {

        counter.textContent =
          `${promptBox.value.length} / 2000`;

      }

    }
  );


  /* =====================================================
     MODE BUTTONS
     ===================================================== */

  $$(".mode, .sidebar a[data-mode]")
    .forEach((element) => {

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
            ].includes(selectedMode)
          ) {

            setMode("voice");

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

    });


  /* =====================================================
     MORE MENU
     ===================================================== */

  moreTools?.addEventListener(
    "click",
    (event) => {

      event.preventDefault();

      moreMenu
        ?.classList
        .toggle("hidden");


      const arrow =
        moreTools.querySelector("b");


      if (arrow) {

        arrow.textContent =
          moreMenu?.classList
            .contains("hidden")
            ? "⌄"
            : "⌃";

      }

    }
  );


  /* =====================================================
     ACCOUNT / ADMIN NAV
     ===================================================== */

  $$("[data-page]")
    .forEach((element) => {

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

    });


  /* =====================================================
     BACK DASHBOARD
     ===================================================== */

  $("#backDashboard")
    ?.addEventListener(
      "click",
      (event) => {

        event.preventDefault();

        showDashboard();

      }
    );


  /* =====================================================
     BACK ADMIN
     ===================================================== */

  $("#backFromAdmin")
    ?.addEventListener(
      "click",
      (event) => {

        event.preventDefault();

        showDashboard();

      }
    );


  /* =====================================================
     CHOICES
     ===================================================== */

  $$(".choices button")
    .forEach((button) => {

      button.addEventListener(
        "click",
        (event) => {

          event.preventDefault();


          button.parentElement
            ?.querySelectorAll("button")
            .forEach((item) => {

              item.classList.remove(
                "selected"
              );

            });


          button.classList.add(
            "selected"
          );

        }
      );

    });


  /* =====================================================
     VOICE CHOICES
     ===================================================== */

  $$(".voice-choice")
    .forEach((button) => {

      button.addEventListener(
        "click",
        (event) => {

          event.preventDefault();


          $$(".voice-choice")
            .forEach((item) => {

              item.classList.remove(
                "selected"
              );

            });


          button.classList.add(
            "selected"
          );

        }
      );

    });


  /* =====================================================
     FILE UPLOAD
     ===================================================== */

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


  /* =====================================================
     GENERATE
     ===================================================== */

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


        /* Admin has unlimited credits */

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


        /* Normal users lose credits */

        if (!isAdmin) {

          credits -= cost;

        }


        if ($("#creditCount")) {

          $("#creditCount")
            .textContent =
            isAdmin
              ? "∞"
              : credits;

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
              } <span>${
                isAdmin
                  ? "∞ credits"
                  : `${cost} credits`
              }</span>`;


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
                      ? "Unlimited"
                      : cost + " credits"
                  }
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
    );


  /* =====================================================
     ADMIN USERS
     ===================================================== */

  $("#adminUsersBtn")
    ?.addEventListener(
      "click",
      () => {

        if (!isAdmin) {
          return;
        }


        const box =
          $("#adminMessage");


        if (!box) {
          return;
        }


        box.style.display =
          "block";


        box.textContent =
          "User management requires a secure backend or Supabase Edge Function.";

      }
    );


  /* =====================================================
     ADMIN CREDITS
     ===================================================== */

  $("#adminCreditsBtn")
    ?.addEventListener(
      "click",
      () => {

        if (!isAdmin) {
          return;
        }


        const box =
          $("#adminMessage");


        if (!box) {
          return;
        }


        box.style.display =
          "block";


        box.textContent =
          "Admin account: Unlimited Credits. All features are unlocked.";

      }
    );


  /* =====================================================
     ADMIN VIDEOS
     ===================================================== */

  $("#adminVideosBtn")
    ?.addEventListener(
      "click",
      () => {

        if (!isAdmin) {
          return;
        }


        const box =
          $("#adminMessage");


        if (!box) {
          return;
        }


        box.style.display =
          "block";


        box.textContent =
          "Video management requires a secure backend or Supabase Edge Function.";

      }
    );


  /* =====================================================
     ADMIN SETTINGS
     ===================================================== */

  $("#adminSettingsBtn")
    ?.addEventListener(
      "click",
      () => {

        if (!isAdmin) {
          return;
        }


        const box =
          $("#adminMessage");


        if (!box) {
          return;
        }


        box.style.display =
          "block";


        box.textContent =
          "Admin settings require a secure backend or Supabase Edge Function.";

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


  resetUserUI();

  clearLoginFields();


  /* =====================================================
     CHECK SUPABASE LIBRARY
     ===================================================== */

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


  /* =====================================================
     CREATE CLIENT
     
     IMPORTANT:
     persistSession = false

     This means the login session is NOT saved
     to localStorage. Closing/reopening the
     website requires login again.
     ===================================================== */

  try {

    supabaseClient =
      window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY,
        {
          auth: {

            persistSession:
              false,

            autoRefreshToken:
              false,

            detectSessionInUrl:
              true

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

  setAuthMode(false);


  /* =====================================================
     IMPORTANT:
     Start with empty login screen.
     We DO NOT automatically restore old login.
     ===================================================== */

  await supabaseClient.auth.signOut({
    scope: "local"
  });


  currentUser =
    null;

  isAdmin =
    false;

  credits =
    100;


  resetUserUI();

  clearLoginFields();

  showLogin();


  console.log(
    "Viky AI initialized successfully."
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
