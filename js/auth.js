// BYPASS LOGIN - Skip Firebase completely
// Your credentials: bvuteprimary64@gmail.com / bvute2026

const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginBtn');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const alertDiv = document.getElementById('alertMessage');

loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Check if credentials match
    if (email === 'bvuteprimary64@gmail.com' && password === 'bvute2026') {
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Redirecting...';
        window.location.href = 'admin/dashboard.html';
    } else {
        alertDiv.textContent = 'Invalid credentials. Use: bvuteprimary64@gmail.com / bvute2026';
        alertDiv.className = 'alert alert-danger show';
        setTimeout(() => { alertDiv.classList.remove('show'); }, 4000);
    }
});
