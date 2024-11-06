const loginForm = document.getElementById('login-form');
const addUserForm = document.getElementById('add-user-form');
const loginContainer = document.getElementById('login-container');
const dashboardContainer = document.getElementById('dashboard-container');
const logoutButton = document.getElementById('logout-button');

let authToken = null;

// Function to display dashboard if logged in
function showDashboard() {
  loginContainer.style.display = 'none';
  dashboardContainer.style.display = 'block';
}

// Function to display login if logged out
function showLogin() {
  loginContainer.style.display = 'block';
  dashboardContainer.style.display = 'none';
}

// Login form submission
loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch(
      'https://xnqiewcxmqeibmslyhmc.supabase.co/auth/v1/token?grant_type=password',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      }
    );
    const data = await response.json();
    if (data.access_token) {
      authToken = data.access_token;
      showDashboard();
    } else {
      alert('Invalid login credentials.');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Login failed.');
  }
});

// Add user form submission
addUserForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('new-user-email').value;
  const password = document.getElementById('new-user-password').value;
  const role = document.getElementById('new-user-role').value;

  try {
    const response = await fetch(
      'https://xnqiewcxmqeibmslyhmc.supabase.co/auth/v1/token?grant_type=password',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          action: 'create',
          email: email,
          password: password,
          profileData: { role: role }
        })
      }
    );
    const data = await response.json();
    if (data.error) {
      alert('Error adding user');
    } else {
      alert('User added successfully');
      addUserForm.reset();
    }
  } catch (error) {
    console.error('Error adding user:', error);
    alert('Failed to add user.');
  }
});

// Logout button
logoutButton.addEventListener('click', () => {
  authToken = null;
  showLogin();
});

// Initial check for token
if (authToken) {
  showDashboard();
} else {
  showLogin();
}
