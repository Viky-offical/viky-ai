/* =========================================================
   VIKY AI
   SUPABASE AUTH + ADMIN + USER ROLE
   SESSION LOGIN
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

  const messageElement =
    $("#authMessage");

  if (!messageElement) {
    return;
  }

  messageElement.textContent =
    message || "";

  messageElement.style.color =
    isError
      ? "#ff5c5c"
      : "#22c55e";
}


/* =========================================================
   SHOW LOGIN
   ========================================================= */

function showLogin() {

  const authScreen =
    $("#authScreen");

  if (!authScreen) {
    return;
  }

  authScreen.style.display =
    "flex";
}


/* =========================================================
   HIDE LOGIN
   ========================================================= */

function hideLogin() {

  const authScreen =
    $("#authScreen");

  if (!authScreen) {
    return;
  }

  authScreen.style.display =
    "none";
}


/* =========================================================
   HIDE ADMIN NAV
   ========================================================= */

function hideAdminNav() {

  const adminNav =
    $("#adminNav");

  if (!adminNav) {
    return;
  }

  adminNav.classList.add(
    "hidden"
  );
}


/* =========================================================
   UPDATE USER PROFILE
   ========================================================= */

function updateUserProfile() {

  const roleElement =
    $("#userRole");

  const roleDot =
    $("#userRoleDot");

  const nameElement =
    $("#userDisplayName");

  const avatarElement =
    $("#userAvatar");

  const profileEmail =
    $("#profileEmail");

  const profileName =
    $("#profileName");


  if (!currentUser) {

    if (roleElement) {
      roleElement.textContent =
        "User";
    }

    if (roleDot) {
      roleDot.classList.remove(
        "admin"
      );
    }

    if (nameElement) {
      nameElement.textContent =
        "Viky User";
    }

    if (avatarElement) {
      avatarElement.textContent =
        "V";
    }

    if (profileEmail) {
      profileEmail.value =
        "";
    }

    return;
  }


  const email =
    (currentUser.email || "")
      .trim()
      .toLowerCase();


  const adminEmail =
    ADMIN_EMAIL
      .trim()
      .toLowerCase();


  const admin =
    email === adminEmail;


  const userName =
    currentUser.user_metadata?.full_name ||
    email.split("@")[0] ||
    "Viky User";


  if (nameElement) {

    nameElement.textContent =
      userName;

  }


  if (avatarElement) {

    avatarElement.textContent =
      userName
        .charAt(0)
        .toUpperCase();

  }


  if (roleElement) {

    roleElement.textContent =
      admin
        ? "Admin"
        : "User";

  }


  if (roleDot) {

    roleDot.classList.toggle(
      "admin",
      admin
    );

  }


  if (profileEmail) {

    profileEmail.value =
      currentUser.email || "";

  }


  if (profileName) {

    profileName.value =
      userName;

  }

}


/* =========================================================
   SHOW APPLICATION
   ========================================================= */

async function showApp() {

  hideLogin();

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


    if (!data?.user) {

      showLogin();

      return;

    }


    currentUser =
      data.user;


    updateUserProfile();


  } catch (error) {

    console.error(
      "Could not load user:",
      error
    );

    showLogin();

  }

}


/* =========================================================
   CHECK ADMIN ACCESS
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

      updateUserProfile();

      hideAdminNav();

      return;

    }


    currentUser =
      user;


    updateUserProfile();


    const userEmail =
      (user.email || "")
        .trim()
        .toLowerCase();


    const adminEmail =
      ADMIN_EMAIL
        .trim()
        .toLowerCase();


    isAdmin =
      userEmail === adminEmail;


    if (isAdmin) {

      const adminNav =
        $("#adminNav");

      adminNav?.classList.remove(
        "hidden"
      );


      const adminRole =
        $("#adminRole");

      if (adminRole) {

        adminRole.textContent =
          "Admin";

      }


      const adminStatus =
        $("#adminStatus");

      if (adminStatus) {

        adminStatus.textContent =
          "✓ Authorized";

      }


      const adminEmailElement =
        $("#adminEmail");

      if (adminEmailElement) {

        adminEmailElement.textContent =
          user.email || "—";

      }


    } else {

      hideAdminNav();

    }


  } catch (error) {

    console.error(
      "Admin access check failed:",
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
    Boolean(isSignup);


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

  const authSwitch =
    $("#authSwitch");

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


    updateUserProfile();


    await showApp();

    await checkAdminAccess();


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
      "Login failed. Please try again.",
      true
    );


  } finally {

    if (button) {
      button.disabled = false;
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


      updateUserProfile();


      await showApp();

      await checkAdminAccess();


      showAuthMessage(
        "Account created successfully!"
      );


    } else {

      showAuthMessage(
        "Account created. Please verify your email, then Sign In."
      );


      setAuthMode(false);

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

  const authSwitch =
    $("#authSwitch");


  const authButton =
    $("#authButton");


  const forgotPassword =
    $("#forgotPassword");


  authSwitch?.addEventListener(
    "click",
    (event) => {

      event.preventDefault();

      event.stopPropagation();

      setAuthMode(
        !signupMode
      );

    }
  );


  authButton?.addEventListener(
    "click",
    async (event) => {

      event.preventDefault();

      event.stopPropagation();


      if (signupMode) {

        await signupUser();

      } else {

        await loginUser();

      }

    }
  );


  forgotPassword?.addEventListener(
    "click",
    async (event) => {

      event.preventDefault();

      event.stopPropagation();


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


      await showApp();

      await checkAdminAccess();


    } else {

      currentUser =
        null;

      isAdmin =
        false;

      updateUserProfile();

      hideAdminNav();

      showLogin();

    }


  } catch (error) {

    console.error(
      "Session check failed:",
      error
    );


    currentUser =
      null;

    isAdmin =
      false;

    updateUserProfile();

    hideAdminNav();

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

        if (session?.user) {

          currentUser =
            session.user;


          hideLogin();

          updateUserProfile();


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

          updateUserProfile();

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

    updateUserProfile();

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


    updateUserProfile();

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
          element.dataset.mode === newMode
        );

      }
    );


  $$(".sidebar a[data-mode]")
    .forEach(
      (element) => {

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

        $(`#${pageName}Page`)
          ?.classList
          .add("hidden");

      }
    );


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


  if (page === "profile") {
    updateUserProfile();
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
    .remove("hidden");


  [
    "profile",
    "subscription",
    "settings"
  ]
    .forEach(
      (pageName) => {

        $(`#${pageName}Page`)
          ?.classList
          .add("hidden");

      }
    );


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


  promptBox?.addEventListener(
    "input",
    () => {

      if (counter) {

        counter.textContent =
          `${promptBox.value.length} / 2000`;

      }

    }
  );


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


            moreMenu
              ?.classList
              .add("hidden");

          }
        );

      }
    );


  moreTools?.addEventListener(
    "click",
    (event) => {

      event.preventDefault();


      moreMenu
        ?.classList
        .toggle("hidden");


      const button =
        moreTools.querySelector("b");


      if (button) {

        button.textContent =
          moreMenu?.classList
            .contains("hidden")
            ? "⌄"
            : "⌃";

      }

    }
  );


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


  $("#backDashboard")
    ?.addEventListener(
      "click",
      (event) => {

        event.preventDefault();

        showDashboard();

      }
    );


  $$(".choices button")
    .forEach(
      (button) => {

        button.addEventListener(
          "click",
          (event) => {

            event.preventDefault();


            button.parentElement
              ?.querySelectorAll("button")
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


  $$(".voice-choice")
    .forEach(
      (button) => {

        button.addEventListener(
          "click",
          (event) => {

            event.preventDefault();


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
          "User management requires a secure backend or Supabase Edge Function.";

      }
    );


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
          "Credits management requires a secure backend or Supabase Edge Function.";

      }
    );


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
          "Video management requires a secure backend or Supabase Edge Function.";

      }
    );


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

    /*
       IMPORTANT:
       sessionStorage is used here.

       This means the Supabase Auth session
       is stored only for the current browser tab.

       After the tab/browser session ends,
       the user must login again.
    */

    supabaseClient =
      window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY,
        {
          auth: {

            storage:
              window.sessionStorage,

            autoRefreshToken:
              true,

            persistSession:
              true,

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
