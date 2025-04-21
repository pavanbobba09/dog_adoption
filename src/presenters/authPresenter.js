import { loginUser, logoutUser, checkSession } from "../models/authModel";

export async function handleLogin(name, email) {
  try {
    const rememberCheckbox = document.getElementById("remember-me");
    const rememberMe = rememberCheckbox && rememberCheckbox.checked;
    // if (rememberCheckbox && rememberCheckbox.checked) {
    //   localStorage.setItem("rememberedEmail", email); // save mail for later use
    // }

    if (rememberMe) {
      localStorage.setItem("rememberedEmail", email);
      localStorage.setItem("rememberedUser", name);
    }

    const response = await loginUser(name, email);
    
    if (response.ok) {
      sessionStorage.setItem("currentUserEmail", email);
      sessionStorage.setItem("currentUserName", name);
      sessionStorage.setItem("isRememberedUser", rememberMe ? "true" : "false");
      //window.location.href = "/search"; // go to main page
      // setTimeout(() => {
      //   window.location.href = "/search";
      // }, 200);
      return { success: true };
    } else {
      switch (response.status) {
        case 400:
          return { 
            success: false, 
            message: "Invalid email or name format. Please check your details." 
          };
        case 401:
          return { 
            success: false, 
            message: "Authentication failed. Please check your credentials." 
          };
        case 429:
          return { 
            success: false, 
            message: "Too many login attempts. Please try again later." 
          };
        case 500:
          return { 
            success: false, 
            message: "Server error. Please try again later." 
          };
        default:
          return { 
            success: false, 
            message: "Login failed. Please try again." 
          };
      }
    }
  } catch (error) {
    console.error("Login error:", error);
    return { 
      success: false, 
      message: "Network error. Please check internet and try again" 
    };
  }
}

export async function checkExistingSession() {
  try {
    const isSessionValid = await checkSession(); // just checking if session active
    return isSessionValid;
  } catch (error) {
    console.error("Session check error:", error);
    return false;
  }
}

// export async function handleLogout() {
//   try {
//     await logoutUser();
//     window.location.href = "/"; // back to login
//   } catch (error) {
//     console.error("Logout error:", error);
//     alert("Logout not working. Try again");
//   }
// }

export async function handleLogout() {
  try {
    // Check if this was a remembered user
    const isRememberedUser = sessionStorage.getItem("isRememberedUser") === "true";
    const currentUserEmail = sessionStorage.getItem("currentUserEmail");
    
    // Only clear favorites if this was not a remembered user
    if (!isRememberedUser && currentUserEmail) {
      const favoritesKey = `dogFavorites_${currentUserEmail}`;
      localStorage.removeItem(favoritesKey);
    }
    
    // Clear session storage
    sessionStorage.removeItem("currentUserEmail");
    sessionStorage.removeItem("currentUserName");
    sessionStorage.removeItem("isRememberedUser");
    sessionStorage.removeItem("matchFavorites");
    
    await logoutUser();
    window.location.href = "/";
  } catch (error) {
    console.error("Logout error:", error);
    alert("Logout not working. Try again");
  }
}
