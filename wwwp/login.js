import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js"; 
import { newUserDoc, firebaseConfig } from "./firestore.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig); 
const auth = getAuth(); 

const messageBox = document.getElementById("message-box");
const loginForm = document.getElementById("login-form");
const signUpForm = document.getElementById("sign-up-form");
const showSignUpLink = document.getElementById("show-signup");
const showLoginLink = document.getElementById("show-login");
const welcomeText = document.getElementById("welcome-text");

document.addEventListener("DOMContentLoaded", function () {
  if (showSignUpLink && showLoginLink && loginForm && signUpForm) {
    showSignUpLink.addEventListener("click", handleCreateAccount);
    showLoginLink.addEventListener("click", handleLogin);
    loginForm.addEventListener("submit", submitLogin);
    signUpForm.addEventListener("submit", submitNewUser);
  }
});

// Show Sign-Up Form
function handleCreateAccount(event) {
  event.preventDefault();
  clearMessage();
  loginForm.style.display = "none";
  signUpForm.style.display = "block";
  showSignUpLink.style.display = "none";
  welcomeText.style.display = "none";
}

// Show Login Form
function handleLogin(event) {
  event.preventDefault();
  clearMessage();
  signUpForm.style.display = "none";
  loginForm.style.display = "block";
  showSignUpLink.style.display = "block";
  welcomeText.style.display = "block";
}

// Sign-Up Function
function submitNewUser(event) {
  event.preventDefault();

  const email = document.getElementById("email-signup").value.trim();
  const password = document.getElementById("password-signup").value.trim();
  const username = document.getElementById("username-signup").value.trim();

  clearMessage();

  // Client-side validations
  if (!email || !password || !username) {
    showMessage("All fields (email, password, and username) are required.", "error");
    return;
  }

  if (!validateEmail(email)) {
    showMessage("Please enter a valid, trusted email address (e.g., .edu, gmail.com, etc.).", "error");
    return;
  }

  if (username.length < 3) {
    showMessage("Username must be at least 3 characters long.", "error");
    return;
  }

  if (password.length < 6) {
    showMessage("Password must be at least 6 characters long.", "error");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      const user = cred.user;

      return updateProfile(user, {
        displayName: username
      }).then(() => {
        newUserDoc(user.uid, username);
        showMessage("Account created successfully! Welcome, " + username + ".", "success");
        
        // Redirect to home page after 1 second
        setTimeout(() => {
          window.location.href = "home.html";
        }, 1000);
      });
    })
    .catch((error) => {
      handleFirebaseError(error);
    });
}

// Login Function
function submitLogin(event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  clearMessage();

  if (!email || !password) {
    showMessage("Both email and password are required.", "error");
    return;
  }

  if (!validateEmail(email)) {
    showMessage("Please enter a valid, trusted email address (e.g., .edu, gmail.com, etc.).", "error");
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      const user = cred.user;
      showMessage("Welcome, " + (user.displayName || "user") + "!", "success");
      setTimeout(() => {
        window.location.href = "home.html";
      }, 1000);
    })
    .catch((error) => {
      handleFirebaseError(error);
    });
}

// Show messages in the UI
function showMessage(message, type) {
  if (messageBox) {
    messageBox.textContent = message;
    messageBox.style.color = type === "error" ? "red" : "green";
  }
}

function clearMessage() {
  if (messageBox) {
    messageBox.textContent = "";
  }
}

// Allowlist-based email validator
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  if (!re.test(email)) return false;

  const trustedDomains = [
    "gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com",
    "protonmail.com", "aol.com", "students.ecu.edu", "ecu.edu", "edu"
  ];

  const domain = email.split("@")[1].toLowerCase();

  // Allow exact match or ends with trusted domain (like .edu)
  return trustedDomains.some(trusted =>
    domain === trusted ||
    domain.endsWith("." + trusted) ||
    domain.endsWith(trusted)
  );
}

// Firebase error handling
function handleFirebaseError(error) {
  const code = error.code;
  let message = "An unexpected error occurred.";

  switch (code) {
    case "auth/email-already-in-use":
      message = "This email is already in use. Try logging in instead.";
      break;
    case "auth/invalid-email":
      message = "Invalid email format.";
      break;
    case "auth/weak-password":
      message = "Password must be at least 6 characters.";
      break;
    case "auth/user-not-found":
      message = "No account found with this email.";
      break;
    case "auth/wrong-password":
      message = "Incorrect password. Please try again.";
      break;
    case "auth/invalid-credential":
      message = "Invalid email or password.";
      break;
    case "auth/too-many-requests":
      message = "Too many failed attempts. Please try again later.";
      break;
    case "auth/network-request-failed":
      message = "Network error. Check your internet connection.";
      break;
    default:
      message = error.message;
      break;
  }

  showMessage("Error: " + message, "error");
}

// Logout Function
function logout() {
  signOut(auth).then(() => {
    //console.log("User logged out.");
  }).catch((error) => {
    console.log("Logout error:", error.message);
  });
}

export { onAuthStateChanged, auth, logout };