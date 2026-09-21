





const API_URL = "http://localhost:5000/api";


// ============================================================
// LOGIN
// ============================================================

export async function loginUser(email, password) {

  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      email,
      password
    })
  });


  const data = await response.json();


  if (!response.ok) {
    throw new Error(data.error || "Invalid email or password.");
  }


  // Save login information for the current browser session
  sessionStorage.setItem("token", data.token);

  sessionStorage.setItem(
    "user",
    JSON.stringify(data.user)
  );


  return data.user;
}



// ============================================================
// SIGN UP
// ============================================================

export async function registerUser(
  email,
  password,
  userData
) {

  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      first_name: userData.firstName,
      surname: userData.surname,
      email,
      programme: userData.programme,
      subprogramme: userData.subprogramme,
      position: userData.position,
      password
    })
  });


  const data = await response.json();


  if (!response.ok) {
    throw new Error(
      data.error || "Registration failed."
    );
  }


  return data.user;
}


// ============================================================
// UPDATE PROFILE
// ============================================================

export async function updateProfile(userId, profileData) {

  const token = getToken();

  const response = await fetch(
    `${API_URL}/users/${userId}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${token}`
      },

      body: JSON.stringify({
        first_name: profileData.first_name,
        surname: profileData.surname,
        programme: profileData.programme,
        subprogramme: profileData.subprogramme,
        position: profileData.position
      })
    }
  );


  const data = await response.json();


  if (!response.ok) {

    throw new Error(
      data.error || "Failed to update profile."
    );

  }


  // Update the logged-in user stored in the browser
  sessionStorage.setItem(
    "user",
    JSON.stringify(data.user)
  );


  return data.user;
}



// ============================================================
// LOGOUT
// ============================================================

export function logoutUser() {

  sessionStorage.removeItem("token");

  sessionStorage.removeItem("user");

}



// ============================================================
// GET CURRENT USER
// ============================================================

export function getCurrentUser() {

  const user = sessionStorage.getItem("user");


  if (!user) {
    return null;
  }


  try {

    return JSON.parse(user);

  } catch {

    return null;

  }

}



// ============================================================
// GET TOKEN
// ============================================================

export function getToken() {

  return sessionStorage.getItem("token");

}



// ============================================================
// CHECK IF LOGGED IN
// ============================================================

export function isLoggedIn() {

  return !!sessionStorage.getItem("token");

}



// ============================================================
// RESET PASSWORD
// ============================================================


// We will implement PostgreSQL password reset separately.

export async function resetPassword(email) {

  throw new Error(
    "Password reset is not available yet."
  );

}