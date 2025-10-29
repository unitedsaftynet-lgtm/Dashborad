const body = document.body;

const savedTheme = localStorage.getItem('theme') || 'dark';
body.classList.remove('light', 'dark');
body.classList.add(savedTheme);

function toggleTheme() {
  const currentTheme = body.classList.contains('dark') ? 'dark' : 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  body.classList.remove('light', 'dark');
  body.classList.add(newTheme);
  localStorage.setItem('theme', newTheme);
}

const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  themeToggle.addEventListener('click', toggleTheme);
}
