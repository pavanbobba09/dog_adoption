import { loginUser, logoutUser, checkSession } from "../models/authModel";

export async function handleLogin(name, email) {
  try {
    const rememberCheckbox = document.getElementById("remember-me");
    const rememberMe = rememberCheckbox && rememberCheckbox.checked;

    if (rememberMe) {
      localStorage.setItem("rememberedEmail", email);
      localStorage.setItem("rememberedUser", name);
    }

    
    sessionStorage.setItem("currentUserEmail", email);
    sessionStorage.setItem("currentUserName", name);
    sessionStorage.setItem("isRememberedUser", rememberMe ? "true" : "false");
    
  
    const response = await loginUser(name, email);
    
    if (response.ok) {
      
      sessionStorage.setItem("authenticationSuccessful", "true");
      
      
      window.location.replace("/search");
      
      return { success: true };
    } else {
      // Clear the session storage if login failed
      sessionStorage.removeItem("currentUserEmail");
      sessionStorage.removeItem("currentUserName");
      sessionStorage.removeItem("isRememberedUser");
      
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
    console.log("Checking session...");
    
    // Check if we have the flag for successful authentication
    const authSuccess = sessionStorage.getItem("authenticationSuccessful") === "true";
    
    // If we have local auth success flag, try to validate with server
    if (authSuccess) {
      const isSessionValid = await checkSession();
      console.log("Server session valid:", isSessionValid);
      
      // If server says no valid session, clear our flag
      if (!isSessionValid) {
        sessionStorage.removeItem("authenticationSuccessful");
      }
      
      return isSessionValid;
    }
    
    // Also check with server regardless
    const isSessionValid = await checkSession();
    console.log("Direct server session check:", isSessionValid);
    
    // If server says we have a valid session, set our flag
    if (isSessionValid) {
      sessionStorage.setItem("authenticationSuccessful", "true");
    }
    
    return isSessionValid;
  } catch (error) {
    console.error("Session check error:", error);
    sessionStorage.removeItem("authenticationSuccessful");
    return false;
  }
}

export async function handleLogout() {
  try {
    // Clear our auth flag
    sessionStorage.removeItem("authenticationSuccessful");
    
    // The rest of your existing logout code
    const isRememberedUser = sessionStorage.getItem("isRememberedUser") === "true";
    const currentUserEmail = sessionStorage.getItem("currentUserEmail");
    
    if (!isRememberedUser && currentUserEmail) {
      const favoritesKey = `dogFavorites_${currentUserEmail}`;
      localStorage.removeItem(favoritesKey);
    }
    
    sessionStorage.removeItem("currentUserEmail");
    sessionStorage.removeItem("currentUserName");
    sessionStorage.removeItem("isRememberedUser");
    sessionStorage.removeItem("matchFavorites");
    
    // Call the API to invalidate the session cookie
    await logoutUser();
    
    // Use location.replace for better cross-browser compatibility
    window.location.replace("/");
  } catch (error) {
    console.error("Logout error:", error);
    alert("Logout not working. Try again");
  }
}