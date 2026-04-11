const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function validateUsername(value) {
    if (value.length < 5)            return 'Username must be at least 5 characters long.';
    if (!/[A-Z]/.test(value))        return 'Username must contain at least one uppercase letter.';
    if (!/[0-9]/.test(value))        return 'Username must contain at least one number.';
    if (!/[^A-Za-z0-9]/.test(value)) return 'Username must contain at least one special character.';
    return null;
}

function updateChecklist(value) {
    const checklist = document.getElementById('usernameChecklist');
    if (!value) { checklist.classList.add('d-none'); return; }
    checklist.classList.remove('d-none');
    const rules = [
        { id: 'req-length',  pass: value.length >= 5 },
        { id: 'req-upper',   pass: /[A-Z]/.test(value) },
        { id: 'req-number',  pass: /[0-9]/.test(value) },
        { id: 'req-special', pass: /[^A-Za-z0-9]/.test(value) }
    ];
    rules.forEach(function (r) {
        const el = document.getElementById(r.id);
        el.className = r.pass ? 'text-success' : 'text-danger';
        el.querySelector('span').textContent = r.pass ? '✓' : '✗';
    });
}

function switchAuthTab(tab) {
    const isSignIn = tab === 'signin';
    document.getElementById('loginForm').classList.toggle('d-none', !isSignIn);
    document.getElementById('registerForm').classList.toggle('d-none', isSignIn);
    document.getElementById('tab-signin').classList.toggle('active', isSignIn);
    document.getElementById('tab-signin').classList.toggle('text-white', isSignIn);
    document.getElementById('tab-signin').classList.toggle('text-white-50', !isSignIn);
    document.getElementById('tab-register').classList.toggle('active', !isSignIn);
    document.getElementById('tab-register').classList.toggle('text-white', !isSignIn);
    document.getElementById('tab-register').classList.toggle('text-white-50', isSignIn);
}

function updateRegisterChecklist(value) {
    const checklist = document.getElementById('regChecklist');
    if (!value) { checklist.classList.add('d-none'); return; }
    checklist.classList.remove('d-none');
    const rules = [
        { id: 'reg-req-length',  pass: value.length >= 5 },
        { id: 'reg-req-upper',   pass: /[A-Z]/.test(value) },
        { id: 'reg-req-number',  pass: /[0-9]/.test(value) },
        { id: 'reg-req-special', pass: /[^A-Za-z0-9]/.test(value) }
    ];
    rules.forEach(function (r) {
        const el = document.getElementById(r.id);
        el.className = r.pass ? 'text-success' : 'text-danger';
        el.querySelector('span').textContent = r.pass ? '✓' : '✗';
    });
}

function register() {
    const usernameInput = document.getElementById('regUsername');
    const passwordInput = document.getElementById('regPassword');
    const confirmInput  = document.getElementById('regConfirm');
    const errorEl       = document.getElementById('registerError');
    const btn           = document.getElementById('registerBtn');
    const username      = usernameInput.value.trim();
    const password      = passwordInput.value;
    const confirm       = confirmInput.value;

    updateRegisterChecklist(username);
    const usernameError = validateUsername(username);

    [usernameInput, passwordInput, confirmInput].forEach(function (el) { el.classList.remove('is-invalid'); });
    errorEl.classList.add('d-none');

    if (usernameError) {
        usernameInput.classList.add('is-invalid');
        errorEl.innerHTML = '<i class="bi bi-exclamation-triangle me-1"></i>' + usernameError;
        errorEl.classList.remove('d-none');
        return;
    }
    if (password.length < 6) {
        passwordInput.classList.add('is-invalid');
        errorEl.innerHTML = '<i class="bi bi-x-circle me-1"></i>Password must be at least 6 characters.';
        errorEl.classList.remove('d-none');
        return;
    }
    if (password !== confirm) {
        confirmInput.classList.add('is-invalid');
        errorEl.innerHTML = '<i class="bi bi-x-circle me-1"></i>Passwords do not match.';
        errorEl.classList.remove('d-none');
        return;
    }

    btn.disabled  = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Creating account…';

    fetch('/api/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ username, password }),
    })
        .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, data: d }; }); })
        .then(function (res) {
            if (!res.ok) {
                usernameInput.classList.add('is-invalid');
                errorEl.innerHTML = '<i class="bi bi-x-circle me-1"></i>' + res.data.error;
                errorEl.classList.remove('d-none');
            } else {
                showApp(res.data.username);
                showToast('success', 'Account created! Welcome, ' + res.data.username + '!');
            }
        })
        .catch(function () {
            errorEl.innerHTML = '<i class="bi bi-wifi-off me-1"></i>Cannot reach server. Is it running?';
            errorEl.classList.remove('d-none');
        })
        .finally(function () {
            btn.disabled  = false;
            btn.innerHTML = '<i class="bi bi-person-check me-2"></i>Create Account';
        });
}

function showApp(username) {
    const initials = username.substring(0, 2).toUpperCase();
    document.getElementById('navAvatar').textContent   = initials;
    document.getElementById('navUsername').textContent = username;
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('mainApp').style.display     = 'block';
    if (typeof chart !== 'undefined' && chart) chart.resize();
}

function togglePasswordVisibility(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon  = document.getElementById(iconId);
    if (input.type === 'password') {
        input.type     = 'text';
        icon.className = 'bi bi-eye-slash';
    } else {
        input.type     = 'password';
        icon.className = 'bi bi-eye';
    }
}

function login() {
    const usernameInput = document.getElementById('loginUsername');
    const passwordInput = document.getElementById('loginPassword');
    const errorEl       = document.getElementById('loginError');
    const btn           = document.querySelector('#loginForm button[type="submit"]');
    const username      = usernameInput.value.trim();
    const password      = passwordInput.value;

    updateChecklist(username);
    const usernameError = validateUsername(username);

    if (usernameError) {
        usernameInput.classList.add('is-invalid');
        passwordInput.classList.remove('is-invalid');
        errorEl.innerHTML = '<i class="bi bi-exclamation-triangle me-1"></i>' + usernameError;
        errorEl.classList.remove('d-none');
        return;
    }

    if (!password) {
        passwordInput.classList.add('is-invalid');
        errorEl.innerHTML = '<i class="bi bi-x-circle me-1"></i>Password is required.';
        errorEl.classList.remove('d-none');
        return;
    }

    usernameInput.classList.remove('is-invalid');
    passwordInput.classList.remove('is-invalid');
    errorEl.classList.add('d-none');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Signing in…';

    fetch('/api/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ username, password }),
    })
        .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, data: d }; }); })
        .then(function (res) {
            if (!res.ok) {
                passwordInput.classList.add('is-invalid');
                errorEl.innerHTML = '<i class="bi bi-x-circle me-1"></i>' + res.data.error;
                errorEl.classList.remove('d-none');
            } else {
                showApp(res.data.username);
                showToast('success', 'Welcome, ' + res.data.username + '!');
            }
        })
        .catch(function () {
            errorEl.innerHTML = '<i class="bi bi-wifi-off me-1"></i>Cannot reach server. Is it running?';
            errorEl.classList.remove('d-none');
        })
        .finally(function () {
            btn.disabled  = false;
            btn.innerHTML = '<i class="bi bi-box-arrow-in-right me-2"></i>Sign In';
        });
}

function logout() {
    fetch('/api/logout', { method: 'POST' })
        .finally(function () {
            // Clear login form
            document.getElementById('loginUsername').value  = '';
            document.getElementById('loginPassword').value  = '';
            document.getElementById('loginPassword').type   = 'password';
            document.getElementById('toggleIcon').className = 'bi bi-eye';
            document.getElementById('usernameChecklist').classList.add('d-none');
            document.getElementById('loginError').classList.add('d-none');
            document.getElementById('loginUsername').classList.remove('is-invalid', 'is-valid');
            document.getElementById('loginPassword').classList.remove('is-invalid', 'is-valid');
            // Clear register form
            document.getElementById('regUsername').value    = '';
            document.getElementById('regPassword').value    = '';
            document.getElementById('regConfirm').value     = '';
            document.getElementById('regPassword').type     = 'password';
            document.getElementById('regToggleIcon').className = 'bi bi-eye';
            document.getElementById('regChecklist').classList.add('d-none');
            document.getElementById('registerError').classList.add('d-none');
            // Return to Sign In tab
            switchAuthTab('signin');
            document.getElementById('mainApp').style.display     = 'none';
            document.getElementById('loginScreen').style.display = 'flex';
            showToast('secondary', 'You have been logged out.');
        });
}

function showToast(type, message) {
    const toast = document.getElementById('appToast');
    const msgEl = document.getElementById('toastMsg');
    if (!toast || !msgEl) return;
    toast.className = 'toast align-items-center border-0 text-bg-' + type;
    msgEl.textContent = message;
    bootstrap.Toast.getOrCreateInstance(toast, { delay: 3500 }).show();
}

function getAllLabels() {
    return document.querySelectorAll('label');
}

function getValues() {
    const incomes   = MONTHS.map(m => parseFloat(document.getElementById('income-'  + m).value)  || 0);
    const expenses  = MONTHS.map(m => parseFloat(document.getElementById('expense-' + m).value) || 0);
    return { incomes, expenses };
}

function updateTotals(incomes, expenses) {
    const totalIncome   = incomes.reduce((a, b) => a + b, 0);
    const totalExpenses = expenses.reduce((a, b) => a + b, 0);
    const net           = totalIncome - totalExpenses;
    document.getElementById('total-income').textContent   = '₹ ' + totalIncome.toFixed(2);
    document.getElementById('total-expenses').textContent = '₹ ' + totalExpenses.toFixed(2);

    // KPI cards (elements may be absent in test environment)
    const kpiIncome   = document.getElementById('kpi-income');
    const kpiExpenses = document.getElementById('kpi-expenses');
    const kpiNet      = document.getElementById('kpi-net');
    const kpiNetIcon  = document.getElementById('kpi-net-icon');
    const kpiNetIconI = document.getElementById('kpi-net-icon-i');
    const kpiNetCard  = document.getElementById('kpi-net-card');

    if (kpiIncome)   kpiIncome.textContent   = '₹ ' + totalIncome.toFixed(2);
    if (kpiExpenses) kpiExpenses.textContent = '₹ ' + totalExpenses.toFixed(2);
    if (kpiNet) {
        const isLoss = net < 0;
        kpiNet.textContent = (isLoss ? '-₹ ' : '₹ ') + Math.abs(net).toFixed(2);
        kpiNet.className   = 'fw-bold fs-5 ' + (isLoss ? 'text-danger' : 'text-success');
        if (kpiNetIcon) {
            kpiNetIcon.classList.toggle('kpi-icon-net-pos', !isLoss);
            kpiNetIcon.classList.toggle('kpi-icon-net-neg', isLoss);
        }
        if (kpiNetIconI) {
            kpiNetIconI.className = isLoss
                ? 'bi bi-exclamation-triangle text-danger'
                : 'bi bi-piggy-bank text-primary';
        }
        if (kpiNetCard) kpiNetCard.classList.toggle('kpi-loss', isLoss);
    }
}

function updateChart() {
    const { incomes, expenses } = getValues();
    chart.data.datasets[0].data = incomes;
    chart.data.datasets[1].data = expenses;
    chart.update();
    updateTotals(incomes, expenses);
}

let chart;

window.onload = function () {
    const ctx = document.getElementById('barChart').getContext('2d');

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: MONTHS,
            datasets: [
                {
                    label: 'Income',
                    data: new Array(12).fill(0),
                    backgroundColor: 'rgba(62, 180, 137, 0.75)',
                    borderColor: 'rgba(62, 180, 137, 1)',
                    borderWidth: 2,
                    borderRadius: 6
                },
                {
                    label: 'Expenses',
                    data: new Array(12).fill(0),
                    backgroundColor: 'rgba(255, 122, 89, 0.75)',
                    borderColor: 'rgba(255, 122, 89, 1)',
                    borderWidth: 2,
                    borderRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: {
                    display: true,
                    text: 'Monthly Income vs Expenses (₹)',
                    color: '#0B1F3A',
                    font: { family: 'Poppins, sans-serif', weight: '700', size: 15 },
                    padding: { bottom: 16 }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    border: { display: false },
                    grid: { color: 'rgba(209,213,219,0.5)' },
                    ticks: {
                        callback: value => '₹ ' + value.toLocaleString(),
                        color: '#6b7280',
                        font: { family: 'Inter, sans-serif', size: 12 }
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#0B1F3A', font: { family: 'Poppins, sans-serif', weight: '600', size: 12 } }
                }
            }
        }
    });

    // Sidebar tab activation helpers
    window.activateSidebarTab = function (tabId) {
        const tabBtn = document.querySelector('#mainTabs [data-bs-target="#' + tabId + '"]');
        if (tabBtn) bootstrap.Tab.getOrCreateInstance(tabBtn).show();
    };

    window.toggleSidebar = function () {
        const sidebar = document.getElementById('r2bSidebar');
        const overlay = document.getElementById('sidebarOverlay');
        if (sidebar) sidebar.classList.toggle('show');
        if (overlay) overlay.classList.toggle('show');
    };

    window.closeSidebar = function () {
        const sidebar = document.getElementById('r2bSidebar');
        const overlay = document.getElementById('sidebarOverlay');
        if (sidebar) sidebar.classList.remove('show');
        if (overlay) overlay.classList.remove('show');
    };

    // Sync sidebar active link when Bootstrap tab changes
    document.querySelectorAll('#mainTabs [data-bs-toggle="tab"]').forEach(function (btn) {
        btn.addEventListener('shown.bs.tab', function (e) {
            const target = e.target.getAttribute('data-bs-target');
            document.querySelectorAll('.sidebar-link[data-tab]').forEach(function (sl) {
                sl.classList.toggle('active', '#' + sl.getAttribute('data-tab') === target);
            });
        });
    });

    // Check if a valid session already exists (page refresh support)
    fetch('/api/me')
        .then(function (r) { return r.json(); })
        .then(function (data) {
            if (data.loggedIn) showApp(data.username);
        })
        .catch(function () { /* server offline — stay on login screen */ });

    // Live register username validation
    document.getElementById('regUsername').addEventListener('input', function () {
        updateRegisterChecklist(this.value.trim());
        this.classList.remove('is-invalid', 'is-valid');
        document.getElementById('registerError').classList.add('d-none');
    });

    // Live login username validation
    document.getElementById('loginUsername').addEventListener('input', function () {
        const value = this.value.trim();
        updateChecklist(value);
        this.classList.remove('is-invalid', 'is-valid');
        document.getElementById('loginError').classList.add('d-none');
    });

    // Download chart as PNG
    window.downloadChart = function () {
        const link = document.createElement('a');
        link.download = 'ruppes2bar-chart.png';
        link.href = document.getElementById('barChart').toDataURL('image/png');
        link.click();
    };

    // Attach live-update listeners to all 24 input fields
    MONTHS.forEach(function (m) {
        document.getElementById('income-'  + m).addEventListener('input', updateChart);
        document.getElementById('expense-' + m).addEventListener('input', updateChart);
    });

    // Populate random defaults (50–100) and render chart immediately
    MONTHS.forEach(function (m) {
        document.getElementById('income-'  + m).value = Math.floor(Math.random() * 51) + 50;
        document.getElementById('expense-' + m).value = Math.floor(Math.random() * 51) + 50;
    });
    updateChart();
};

if (typeof module !== 'undefined') {
    module.exports = { validateUsername, updateChecklist, updateTotals, getValues };
}
