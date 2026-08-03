document.addEventListener('DOMContentLoaded', function() {

    var roleOptions = document.querySelectorAll('.role-option');
    var loginForm = document.getElementById('loginForm');
    var emailInput = document.getElementById('emailInput');
    var passwordInput = document.getElementById('passwordInput');
    var loginBtn = document.getElementById('loginBtn');
    var alertDiv = document.getElementById('alertMessage');

    var selectedRole = 'admin';

    roleOptions.forEach(function(opt) {
        opt.addEventListener('click', function() {
            roleOptions.forEach(function(o) {
                o.classList.remove('active');
            });
            this.classList.add('active');
            selectedRole = this.getAttribute('data-role');
        });
    });

    function showAlert(message) {
        alertDiv.textContent = message;
        alertDiv.className = 'alert alert-danger show';
        setTimeout(function() {
            alertDiv.classList.remove('show');
        }, 5000);
    }

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        var email = emailInput.value.trim();
        var password = passwordInput.value.trim();

        if (!email || !password) {
            showAlert('Please fill in both email and password.');
            return;
        }

        if (email === 'bvuteprimary64@gmail.com' && password === 'bvute2026') {
            loginBtn.innerHTML = 'Redirecting...';
            var redirectMap = {
                'admin': 'admin/dashboard.html',
                'teacher': 'teacher/dashboard.html',
                'parent': 'parent/dashboard.html',
                'learner': 'learner/dashboard.html'
            };
            window.location.href = redirectMap[selectedRole] || 'admin/dashboard.html';
        } else {
            showAlert('Invalid credentials. Use: bvuteprimary64@gmail.com / bvute2026');
        }
    });

    document.getElementById('resetRequestBtn').addEventListener('click', function() {
        alert('Contact the school administrator to reset your password.');
    });

});
