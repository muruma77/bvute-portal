// ============================================
// BVUTE PORTAL - Firebase Authentication
// ============================================

// ⚠️ IMPORTANT: REPLACE WITH YOUR FIREBASE CONFIG
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// DOM Elements
const roleOptions = document.querySelectorAll('.role-option');
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const loginBtn = document.getElementById('loginBtn');
const alertDiv = document.getElementById('alertMessage');

let selectedRole = 'admin';

// --- Role Selection ---
roleOptions.forEach(opt => {
    opt.addEventListener('click', function() {
        roleOptions.forEach(o => o.classList.remove('active'));
        this.classList.add('active');
        selectedRole = this.dataset.role;
    });
});

// --- Show Alert ---
function showAlert(message, type = 'danger') {
    alertDiv.textContent = message;
    alertDiv.className = `alert alert-${type} show`;
    setTimeout(() => { alertDiv.classList.remove('show'); }, 5000);
}

// --- LOGIN ---
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
        showAlert('Please fill in both email and password.', 'danger');
        return;
    }

    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';

    try {
        const userCred = await auth.signInWithEmailAndPassword(email, password);
        const user = userCred.user;

        // Fetch user profile from Firestore
        const doc = await db.collection('users').doc(user.uid).get();
        if (!doc.exists) {
            await auth.signOut();
            showAlert('User profile not found. Contact admin.', 'danger');
            loginBtn.disabled = false;
            loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
            return;
        }

        const data = doc.data();
        const dbRole = data.role || 'learner';
        const status = data.status || 'active';

        // Check if account is disabled
        if (status === 'disabled') {
            await auth.signOut();
            showAlert('Your account has been disabled. Contact admin.', 'danger');
            loginBtn.disabled = false;
            loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
            return;
        }

        // Role Mismatch Check
        if (selectedRole !== dbRole) {
            await auth.signOut();
            showAlert(`You selected "${selectedRole}" but this account is registered as "${dbRole}".`, 'danger');
            loginBtn.disabled = false;
            loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
            return;
        }

        // Redirect based on role
        const redirectMap = {
            'admin': 'admin/dashboard.html',
            'teacher': 'teacher/dashboard.html',
            'parent': 'parent/dashboard.html',
            'learner': 'learner/dashboard.html'
        };
        window.location.href = redirectMap[dbRole] || 'index.html';

    } catch (error) {
        let msg = 'Login failed. Check credentials.';
        if (error.code === 'auth/user-not-found') msg = 'No account found with this email.';
        if (error.code === 'auth/wrong-password') msg = 'Incorrect password.';
        if (error.code === 'auth/too-many-requests') msg = 'Too many failed attempts. Try later.';
        if (error.code === 'auth/invalid-email') msg = 'Invalid email format.';
        if (error.code === 'auth/network-request-failed') msg = 'Network error. Check your internet connection.';
        showAlert(msg, 'danger');
        loginBtn.disabled = false;
        loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
    }
});

// --- Password Reset Request (for users) ---
document.getElementById('resetRequestBtn').addEventListener('click', async () => {
    const email = prompt('Enter your registered email address to request a password reset:');
    if (!email) return;

    try {
        // Check if user exists in Firestore
        const snapshot = await db.collection('users').where('email', '==', email).get();
        if (snapshot.empty) {
            alert('No account found with this email.');
            return;
        }

        // Create reset request in Firestore
        const docId = snapshot.docs[0].id;
        await db.collection('passwordResets').add({
            uid: docId,
            email: email,
            status: 'pending',
            requestedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        alert('✅ Reset request submitted. Admin will review and approve it shortly.');
    } catch (err) {
        alert('Error submitting request. Please try again.');
        console.error(err);
    }
});

// --- Admin: Approve Resets (Hidden feature) ---
document.getElementById('resetApprovalBtn').addEventListener('click', async () => {
    alert('Go to Admin Dashboard -> Settings -> Password Reset Approvals.');
});

console.log('✅ Firebase Auth loaded successfully.');
console.log('📌 BVUTE Primary School Portal ready.');
