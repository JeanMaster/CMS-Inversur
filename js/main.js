// Theme Toggle Logic
const themeToggleBtn = document.getElementById('themeToggle');
const body = document.body;

// Sidebar Toggle Logic
const sidebarToggleBtn = document.getElementById('sidebarToggle');
const sidebar = document.querySelector('.sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');

if (sidebarToggleBtn) {
    sidebarToggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        sidebarOverlay.classList.toggle('active');
    });
}

if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
    });
}

// Close sidebar when clicking a nav link on mobile
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth < 1024) {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        }
    });
});

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.setAttribute('data-theme', savedTheme);
    updateToggleIcon(savedTheme);
}

themeToggleBtn.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateToggleIcon(newTheme);
});

function updateToggleIcon(theme) {
    themeToggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// Global Search Logic
const searchInput = document.getElementById('globalSearch');

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();

    // Filter Table Rows
    const tableRows = document.querySelectorAll('#shipmentsTableBody tr');
    tableRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });

    // Filter Alerts
    const alertItems = document.querySelectorAll('.alert-item');
    alertItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});
