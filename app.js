/* =========================================================
   VIKY AI
   SUPABASE AUTH + PERMANENT CREDITS + RECENT VIDEOS
   COPY-PASTE READY
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
   DEFAULT CREDITS
   ========================================================= */

const INITIAL_CREDITS = 100;


/* =========================================================
   GLOBAL STATE
   ========================================================= */

let supabaseClient = null;

let currentUser = null;

let isAdmin = false;

let signupMode = false;

let mode = "text";

let credits = 0;


/* =========================================================
   HELPER
   ========================================================= */

function $(selector) {
  return document.querySelector(selector);
}


function $$(selector) {
  return document.querySelectorAll(selector);
}


/* =========================================================
   ADMIN CHECK
   ========================================================= */

function isCurrentAdmin() {

  if (!currentUser?.email) {
    return false;
  }

  return (
    currentUser.email.trim().toLowerCase() ===
    ADMIN_EMAIL.trim().toLowerCase()
  );
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

  [email, password, name].forEach((field) => {

    if (!field) {
      return;
    }

    field.value = "";
    field.removeAttribute("value");

  });

  showAuthMessage("");
}


/* =========================================================
   FORCE EMPTY LOGIN FIELDS
   ========================================================= */

function forceEmptyLoginFields() {

  const email = $("#authEmail");
  const password = $("#authPassword");
  const name = $("#authName");

  [email, password, name].forEach((field) => {

    if (!field) {
      return;
    }

    field.value = "";
    field.removeAttribute("value");

    field.setAttribute(
      "autocomplete",
      "off"
    );

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
  clearLoginFields();

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

  const headerName =
    $("#headerUserName");

  const headerRole =
    $("#headerRole");

  const avatar =
    $("#userAvatar");

  const adminNav =
    $("#adminNav");


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
    (user.email || "")
      .trim()
      .toLowerCase();


  const admin =
    email ===
    ADMIN_EMAIL.trim().toLowerCase();


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


  /*
     ADMIN
  */

  if (isAdmin) {

    credits = Infinity;


    if (creditCount) {

      creditCount.textContent =
        "∞";

      creditCount.title =
        "Unlimited Credits";

    }

  }


  /*
     NORMAL USER
  */

  else {

    if (
      !Number.isFinite(credits)
    ) {

      credits =
        INITIAL_CREDITS;

    }


    credits =
      Math.max(
        0,
        Number(credits)
      );


    if (creditCount) {

      creditCount.textContent =
        String(credits);

      creditCount.title =
        "Credits remaining";

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


  /*
     ADMIN UI
  */

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

  }


  /*
     USER UI
  */

  else {

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

      planBar.style.display =
        "block";

    }


    if (planBarInner) {

      const percentage =
        Math.max(
          0,
          Math.min(
            100,
            (credits / INITIAL_CREDITS) * 100
          )
        );


      planBarInner.style.width =
        `${percentage}%`;

    }

  }

}


/* =========================================================
   CREATE FIRST USER PROFILE
   =========================================================

   IMPORTANT:
   100 CREDITS ARE GIVEN ONLY WHEN
   THE PROFILE DOES NOT EXIST.

   EXISTING PROFILE NEVER GETS RESET TO 100.
   ========================================================= */

async function createUserProfileIfNeeded() {

  if (
    !supabaseClient ||
    !currentUser
  ) {

    return false;

  }


  /*
     ADMIN
  */

  if (isCurrentAdmin()) {

    isAdmin = true;

    credits = Infinity;

    return true;

  }


  try {

    /*
       FIRST CHECK IF PROFILE ALREADY EXISTS
    */

    const {
      data: existingProfile,
      error: selectError
    } =
      await supabaseClient
        .from("profiles")
        .select("id, credits, email, full_name")
        .eq(
          "id",
          currentUser.id
        )
        .maybeSingle();


    if (selectError) {

      console.error(
        "Profile lookup error:",
        selectError
      );

      return false;

    }


    /*
       PROFILE ALREADY EXISTS
       DO NOT GIVE 100 AGAIN
    */

    if (existingProfile) {

      if (
        typeof existingProfile.credits === "number"
      ) {

        credits =
          Math.max(
            0,
            existingProfile.credits
          );

      }


      return true;

    }


    /*
       PROFILE DOES NOT EXIST
       THIS IS THE FIRST TIME
       GIVE 100 CREDITS
    */

    const newProfile = {

      id:
        currentUser.id,

      email:
        currentUser.email || "",

      full_name:
        currentUser.user_metadata?.full_name ||
        currentUser.email?.split("@")[0] ||
        "Viky User",

      credits:
        INITIAL_CREDITS

    };


    const {
      data: insertedProfile,
      error: insertError
    } =
      await supabaseClient
        .from("profiles")
        .insert(
          newProfile
        )
        .select()
        .single();


    /*
       INSERT FAILED
    */

    if (insertError) {

      /*
         Another request may have created
         the profile at the same time.
      */

      const errorText =
        String(
          insertError.message || ""
        ).toLowerCase();


      if (
        errorText.includes("duplicate") ||
        errorText.includes("unique")
      ) {

        const {
          data: profileAfterDuplicate
        } =
          await supabaseClient
            .from("profiles")
            .select("credits")
            .eq(
              "id",
              currentUser.id
            )
            .maybeSingle();


        if (profileAfterDuplicate) {

          credits =
            Number(
              profileAfterDuplicate.credits
            ) || 0;

          return true;

        }

      }


      console.error(
        "Create profile error:",
        insertError
      );

      return false;

    }


    /*
       SUCCESS
    */

    credits =
      Number(
        insertedProfile?.credits
      ) || INITIAL_CREDITS;


    return true;

  } catch (error) {

    console.error(
      "createUserProfileIfNeeded error:",
      error
    );

    return false;

  }

}


/* =========================================================
   LOAD USER PROFILE
   ========================================================= */

async function loadUserProfile() {

  if (
    !supabaseClient ||
    !currentUser
  ) {

    return false;

  }


  /*
     ADMIN
  */

  if (isCurrentAdmin()) {

    isAdmin = true;

    credits = Infinity;

    updateCreditUI();

    return true;

  }


  try {

    /*
       GET PROFILE
    */

    const {
      data,
      error
    } =
      await supabaseClient
        .from("profiles")
        .select(
          "id, email, full_name, credits"
        )
        .eq(
          "id",
          currentUser.id
        )
        .maybeSingle();


    if (error) {

      console.error(
        "Load profile error:",
        error
      );

      /*
         DO NOT RESET TO 100 HERE.
      */

      return false;

    }


    /*
       PROFILE EXISTS
    */

    if (data) {

      /*
         VERY IMPORTANT:
         USE DATABASE VALUE EXACTLY.
         NEVER RESET IT TO 100.
      */

      credits =
        Math.max(
          0,
          Number(data.credits) || 0
        );


      /*
         USE DATABASE NAME
      */

      if (
        data.full_name
      ) {

        currentUser.user_metadata =
          currentUser.user_metadata || {};

        currentUser.user_metadata.full_name =
          data.full_name;

      }


      updateCreditUI();

      return true;

    }


    /*
       PROFILE DOES NOT EXIST
       CREATE ONCE WITH 100
    */

    const created =
      await createUserProfileIfNeeded();


    if (!created) {

      /*
         DO NOT GIVE FAKE 100 CREDITS
         IF DATABASE PROFILE COULD NOT BE CREATED.
      */

      credits = 0;

      updateCreditUI();

      return false;

    }


    updateCreditUI();

    return true;

  } catch (error) {

    console.error(
      "loadUserProfile error:",
      error
    );

    /*
       IMPORTANT:
       NEVER DO:
       credits = 100
       HERE.
    */

    return false;

  }

}


/* =========================================================
   SAVE USER CREDITS
   ========================================================= */

async function saveUserCredits() {

  if (
    !supabaseClient ||
    !currentUser ||
    isCurrentAdmin()
  ) {

    return true;

  }


  const newCredits =
    Math.max(
      0,
      Number(credits) || 0
    );


  try {

    const {
      error
    } =
      await supabaseClient
        .from("profiles")
        .update({

          credits:
            newCredits

        })
        .eq(
          "id",
          currentUser.id
        );


    if (error) {

      console.error(
        "Save credits error:",
        error
      );

      return false;

    }


    credits =
      newCredits;


    updateCreditUI();


    return true;

  } catch (error) {

    console.error(
      "Save credits exception:",
      error
    );

    return false;

  }

}


/* =========================================================
   DEDUCT CREDITS
   ========================================================= */

async function deductCredits(cost) {

  /*
     ADMIN
  */

  if (isCurrentAdmin()) {

    isAdmin = true;

    credits = Infinity;

    updateCreditUI();

    return true;

  }


  /*
     NOT LOGGED IN
  */

  if (!currentUser) {

    alert(
      "Please login first."
    );

    showLogin();

    return false;

  }


  /*
     CHECK BALANCE
  */

  if (
    !Number.isFinite(credits)
  ) {

    await loadUserProfile();

  }


  if (
    credits < cost
  ) {

    alert(
      `Not enough credits. This action needs ${cost} credits.`
    );

    return false;

  }


  /*
     DEDUCT
  */

  credits -= cost;


  /*
     UPDATE UI IMMEDIATELY
  */

  updateCreditUI();


  /*
     SAVE TO SUPABASE
  */

  const saved =
    await saveUserCredits();


  /*
     IF DATABASE SAVE FAILED,
     RELOAD THE REAL BALANCE.
  */

  if (!saved) {

    await loadUserProfile();

    alert(
      "Credits could not be saved. Please try again."
    );

    return false;

  }


  return true;

}


/* =========================================================
   ADMIN DASHBOARD
   ========================================================= */

function setupAdminDashboard() {

  if (!isAdmin) {
    return;
  }


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
   NORMAL USER DASHBOARD
   ========================================================= */

function setupUserDashboard() {

  if (isAdmin) {
    return;
  }


  if (!Number.isFinite(credits)) {
    credits = 0;
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


  document
    .querySelectorAll("body *")
    .forEach((element) => {

      if (
        element.children.length === 0 &&
        element.textContent.trim() ===
          "Viky User"
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
     LOAD REAL DATABASE CREDITS
  */

  const profileLoaded =
    await loadUserProfile();


  if (!profileLoaded) {

    console.warn(
      "Profile could not be loaded."
    );

  }


  /*
     ADMIN / USER UI
  */

  if (isCurrentAdmin()) {

    isAdmin = true;

    credits = Infinity;

    setupAdminDashboard();

  } else {

    isAdmin = false;

    setupUserDashboard();

  }


  updateCreditUI();


  /*
     LOAD PERMANENT RECENT VIDEOS
  */

  await loadRecentVideos();

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

    }


    updateCreditUI();


    return isAdmin;

  } catch (error) {

    console.error(
      "Admin check failed:",
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


  clearLoginFields();

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

          email,
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


    await checkAdminAccess();


    await showApp();


    clearLoginFields();


    /*
       DO NOT ADD 100 CREDITS HERE.
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


    if (!data?.user) {

      throw new Error(
        "Account could not be created."
      );

    }


    currentUser =
      data.user;


    /*
       SESSION EXISTS
    */

    if (data.session) {

      await checkAdminAccess();


      /*
         CREATE PROFILE ONLY IF NEEDED.
         FIRST USER = 100 CREDITS.
      */

      if (!isCurrentAdmin()) {

        await createUserProfileIfNeeded();

      }


      await showApp();


      clearLoginFields();


      showAuthMessage(
        "Account created successfully!"
      );

    }


    /*
       EMAIL CONFIRMATION REQUIRED
    */

    else {

      clearLoginFields();

      setAuthMode(false);

      showAuthMessage(
        "Account created. Please confirm your email and then sign in.",
        false
      );

    }

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
      lower.includes("user already registered")
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


  form?.addEventListener(
    "submit",
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


  forgotPassword?.addEventListener(
    "click",
    async (event) => {

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

    }


    else {

      currentUser = null;

      isAdmin = false;

      credits = 0;

      showLogin();

    }

  } catch (error) {

    console.error(
      "Session check failed:",
      error
    );


    currentUser = null;

    isAdmin = false;

    credits = 0;

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


          updateRoleUI(
            currentUser
          );


          hideLogin();


          /*
             Give Supabase auth state time to finish.
          */

          setTimeout(
            async () => {

              await checkAdminAccess();

              await showApp();

            },
            0
          );

        }


        else {

          currentUser = null;

          isAdmin = false;

          credits = 0;

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

    credits = 0;


    hideAdminNav();

    updateRoleUI(null);

    clearLoginFields();

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
   HIDE ADMIN NAV
   ========================================================= */

function hideAdminNav() {

  $("#adminNav")
    ?.classList
    .add("hidden");

}


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
   RECENT VIDEOS
   =========================================================

   TABLE REQUIRED:

   videos

   Suggested columns:

   id
   user_id
   title
   mode
   prompt
   status
   video_url
   thumbnail_url
   created_at

   IMPORTANT:
   user_id MUST contain currentUser.id
   ========================================================= */


/* =========================================================
   LOAD RECENT VIDEOS
   ========================================================= */

async function loadRecentVideos() {

  const list =
    $("#recentList");


  if (!list) {
    return;
  }


  /*
     Not logged in
  */

  if (!currentUser) {

    return;

  }


  /*
     Show loading
  */

  list.innerHTML = `
    <div class="empty">
      Loading recent videos...
    </div>
  `;


  try {

    const {
      data,
      error
    } =
      await supabaseClient
        .from("videos")
        .select(
          "id, title, mode, prompt, status, video_url, thumbnail_url, created_at"
        )
        .eq(
          "user_id",
          currentUser.id
        )
        .order(
          "created_at",
          {
            ascending: false
          }
        );


    if (error) {

      console.error(
        "Load recent videos error:",
        error
      );


      list.innerHTML = `
        <div class="empty">
          No recent videos found.
        </div>
      `;


      return;

    }


    /*
       EMPTY
    */

    if (
      !data ||
      data.length === 0
    ) {

      list.innerHTML = `
        <div class="empty">
          No recent videos yet.
        </div>
      `;


      return;

    }


    /*
       RENDER
    */

    list.innerHTML = "";


    data.forEach(
      (video) => {

        renderRecentVideo(
          video,
          false
        );

      }
    );

  } catch (error) {

    console.error(
      "Recent videos exception:",
      error
    );


    list.innerHTML = `
      <div class="empty">
        No recent videos found.
      </div>
    `;

  }

}


/* =========================================================
   RENDER RECENT VIDEO
   ========================================================= */

function renderRecentVideo(
  video,
  prepend = true
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
    document.createElement("div");


  item.className =
    "video-item";


  /*
     VIDEO LABEL
  */

  const label =
    getVideoLabel(
      video.mode
    );


  /*
     DATE
  */

  let dateText =
    "";


  if (video.created_at) {

    try {

      dateText =
        new Date(
          video.created_at
        ).toLocaleString();

    } catch {

      dateText = "";

    }

  }


  /*
     THUMBNAIL
  */

  let thumbHTML =
    `<div class="thumb"></div>`;


  if (video.thumbnail_url) {

    thumbHTML =
      `
        <div
          class="thumb"
          style="
            background-image:url('${escapeHTML(video.thumbnail_url)}');
            background-size:cover;
            background-position:center;
          "
        ></div>
      `;

  }


  /*
     STATUS
  */

  const status =
    video.status ||
    "completed";


  /*
     VIDEO LINK
  */

  let titleHTML =
    `<b>${escapeHTML(video.title || label)}</b>`;


  if (video.video_url) {

    titleHTML =
      `
        <b>${escapeHTML(video.title || label)}</b>
        <a
          href="${escapeHTML(video.video_url)}"
          target="_blank"
          rel="noopener noreferrer"
          style="display:block;margin-top:5px;"
        >
          ▶ Open Video
        </a>
      `;

  }


  item.innerHTML = `
    ${thumbHTML}

    <div>
      ${titleHTML}

      <small>
        ✓ ${escapeHTML(status)}
        ${dateText ? ` • ${escapeHTML(dateText)}` : ""}
      </small>
    </div>
  `;


  if (prepend) {

    list.prepend(item);

  } else {

    list.appendChild(item);

  }

}


/* =========================================================
   GET VIDEO LABEL
   ========================================================= */

function getVideoLabel(videoMode) {

  switch (videoMode) {

    case "voice":
      return "AI Voice Over";

    case "music":
      return "AI Music";

    case "soundfx":
      return "Sound Effects";

    case "subtitle":
      return "AI Subtitles";

    case "thumbnail":
      return "AI Thumbnail";

    case "story":
      return "AI Story Video";

    case "image":
      return "AI Image Video";

    case "textimage":
      return "AI Image Video";

    case "video":
      return "AI Video Edit";

    default:
      return "AI Video";

  }

}


/* =========================================================
   SAVE RECENT VIDEO
   ========================================================= */

async function saveRecentVideo(videoData) {

  if (
    !supabaseClient ||
    !currentUser
  ) {

    return null;

  }


  if (isCurrentAdmin()) {

    /*
       Admin can still have recent videos.
       They are saved under admin user_id.
    */

  }


  try {

    const record = {

      user_id:
        currentUser.id,

      title:
        videoData.title ||
        getVideoLabel(videoData.mode),

      mode:
        videoData.mode ||
        mode,

      prompt:
        videoData.prompt ||
        "",

      status:
        videoData.status ||
        "completed",

      video_url:
        videoData.video_url ||
        null,

      thumbnail_url:
        videoData.thumbnail_url ||
        null

    };


    const {
      data,
      error
    } =
      await supabaseClient
        .from("videos")
        .insert(record)
        .select()
        .single();


    if (error) {

      console.error(
        "Save recent video error:",
        error
      );

      return null;

    }


    /*
       ADD TO UI
    */

    renderRecentVideo(
      data,
      true
    );


    return data;

  } catch (error) {

    console.error(
      "saveRecentVideo exception:",
      error
    );

    return null;

  }

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {

  if (
    value === null ||
    value === undefined
  ) {

    return "";

  }


  return String(value)
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
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
              ].includes(selectedMode)
            ) {

              setMode("voice");

            }

            else if (selectedMode) {

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


  /*
     MORE MENU
  */

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


  /*
     ACCOUNT / ADMIN NAVIGATION
  */

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

              showAccount(page);

            }

          }
        );

      }
    );


  /*
     BACK DASHBOARD
  */

  $("#backDashboard")
    ?.addEventListener(
      "click",
      (event) => {

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
      (event) => {

        event.preventDefault();

        showDashboard();

      }
    );


  /*
     CHOICES
  */

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
                    .remove("selected");

                }
              );


            button.classList
              .add("selected");

          }
        );

      }
    );


  /*
     VOICE CHOICES
  */

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
                    .remove("selected");

                }
              );


            button.classList
              .add("selected");

          }
        );

      }
    );


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
      async (event) => {

        event.preventDefault();


        /*
           LOGIN CHECK
        */

        if (!currentUser) {

          alert(
            "Please login first."
          );

          showLogin();

          return;

        }


        /*
           COST
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


        /*
           ADMIN
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
           REQUIRED MEDIA
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
           REQUIRED PROMPT
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
           DEDUCT CREDITS FIRST
        */

        if (!isAdmin) {

          const deducted =
            await deductCredits(cost);


          if (!deducted) {

            return;

          }

        }


        /*
           GENERATE BUTTON
        */

        const button =
          $("#generate");


        if (!button) {
          return;
        }


        button.disabled = true;


        button.innerHTML =
          mode === "voice"
            ? "⏳ CREATING VOICE…"
            : "⏳ GENERATING VIDEO…";


        /*
           DEMO GENERATION
        */

        setTimeout(
          async () => {

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


            /*
               SAVE PERMANENT RECENT VIDEO
            */

            await saveRecentVideo({

              title:
                getVideoLabel(mode),

              mode:
                mode,

              prompt:
                promptBox?.value.trim() || "",

              status:
                "Demo complete",

              video_url:
                null,

              thumbnail_url:
                null

            });

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
    .forEach(
      (button) => {

        button.addEventListener(
          "click",
          async () => {

            /*
               SAVE CURRENT DATABASE BALANCE
            */

            await saveUserCredits();


            alert(
              "Settings saved successfully."
            );

          }
        );

      }
    );


  /*
     UPGRADE BUTTONS
  */

  $$(".side-card button")
    .forEach(
      (button) => {

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

      }
    );

}


/* =========================================================
   CREATE SUPABASE CLIENT
   ========================================================= */

function createSupabaseClient() {

  if (
    !window.supabase ||
    typeof window.supabase.createClient !== "function"
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

          persistSession:
            true,

          autoRefreshToken:
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
     LOGIN FIELDS
  */

  forceEmptyLoginFields();

  clearLoginFields();

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
     CHECK SESSION
  */

  await checkLogin();


  /*
     FINAL LOGIN FIELD CLEANUP
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

}

else {

  initializeVikyAI();

}
