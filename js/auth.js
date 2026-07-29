/* =========================================================
   AUTH — Bvute Primary School Portal
   Roles live in Firestore: users/{uid} => { role, fullName, ... }
   Valid roles: admin | teacher | parent | learner
   ========================================================= */

const ROLE_HOME = {
  admin: "admin/dashboard.html",
  teacher: "teacher/dashboard.html",
  parent: "parent/dashboard.html",
  learner: "learner/dashboard.html"
};

/** Call from index.html on login submit */
async function loginUser(email, password, selectedRole, onError) {
  try {
    const cred = await auth.signInWithEmailAndPassword(email, password);
    const uid = cred.user.uid;
    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      await auth.signOut();
      onError("No profile found for this account. Ask the school admin to set up your access.");
      return;
    }

    const data = userDoc.data();

    if (data.status === "disabled") {
      await auth.signOut();
      onError("This account has been disabled. Contact the school admin.");
      return;
    }

    if (data.role !== selectedRole) {
      await auth.signOut();
      onError(`This account is registered as ${data.role}, not ${selectedRole}. Select the correct role and try again.`);
      return;
    }

    window.location.href = ROLE_HOME[data.role];
  } catch (err) {
    onError(friendlyAuthError(err));
  }
}

function friendlyAuthError(err) {
  const map = {
    "auth/invalid-email": "That email address doesn't look right.",
    "auth/user-not-found": "No account found with that email.",
    "auth/wrong-password": "Incorrect password. Try again or contact the admin to reset it.",
    "auth/invalid-login-credentials": "Incorrect email or password.",
    "auth/too-many-requests": "Too many attempts. Wait a few minutes and try again.",
    "auth/network-request-failed": "No internet connection. Check your data/wifi and try again."
  };
  return map[err.code] || "Something went wrong signing in. Please try again.";
}

/**
 * Call at the top of every dashboard page.
 * Redirects to login if not authenticated or wrong role.
 * Calls onReady(userData, uid) once confirmed.
 */
function guardPage(requiredRole, onReady) {
  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      window.location.href = "../index.html";
      return;
    }
    const doc = await db.collection("users").doc(user.uid).get();
    if (!doc.exists || doc.data().role !== requiredRole || doc.data().status === "disabled") {
      await auth.signOut();
      window.location.href = "../index.html";
      return;
    }
    onReady(doc.data(), user.uid);
  });
}

function logoutUser() {
  auth.signOut().then(() => (window.location.href = "../index.html"));
}

/**
 * Password recovery is admin-controlled (not self-service email reset),
 * per school policy. This logs a request the admin can action in
 * Admin > User Access > Reset Requests.
 */
async function requestPasswordReset(email, onDone, onError) {
  try {
    await db.collection("passwordResetRequests").add({
      email: email.trim().toLowerCase(),
      requestedAt: firebase.firestore.FieldValue.serverTimestamp(),
      status: "pending"
    });
    onDone();
  } catch (err) {
    onError("Couldn't send the request. Check your connection and try again.");
  }
}
