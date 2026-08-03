// ============================================
// BVUTE PORTAL - Simple Login
// Credentials: bvuteprimary64@gmail.com / bvute2026
// ============================================

document.addEventListener('DOMContentLoaded', function() {

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

    // --- Login ---
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            showAlert('Please fill in both email and password.', 'danger');
            return;
        }

        // Hardcoded credentials
        if (email === 'bvuteprimary64@gmail.com' && password === 'bvute2026') {
            loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Redirecting...';
            
            // Role-based redirect
            const redirectMap = {
                'admin': 'admin/dashboard.html',
                'teacher': 'teacher/dashboard.html',
                'parent': 'parent/dashboard.html',
                'learner': 'learner/dashboard.html'
            };
            window.location.href = redirectMap[selectedRole] || 'admin/dashboard.html';
        } else {
            showAlert('Invalid credentials. Use: bvuteprimary64@gmail.com / bvute2026', 'danger');
        }
    });

    // --- Forgot Password ---
    document.getElementById('resetRequestBtn')?.addEventListener('click', function() {
        alert('Contact the school administrator to reset your password.');
    });

});
