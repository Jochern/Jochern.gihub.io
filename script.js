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

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Construct the payload object
  const payload = {
    "email": email,
    "password": password
  };

  // Log payload to verify JSON structure before sending
  console.log("Login Payload:", payload);

  try {
    const response = await fetch(
      'https://xnqiewcxmqeibmslyhmc.supabase.co/auth/v1/token?grant_type=password',
      {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' ,
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhucWlld2N4bXFlaWJtc2x5aG1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc3NjYzMjcsImV4cCI6MjAyMzM0MjMyN30.rVuxr93dRaqr2rRBqhtG7-8cOdloSRQ45RAXFrYBsCc'
          },
        body: JSON.stringify(payload) // Ensure payload is stringified correctly
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

addUserForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('new-user-email').value;
  const password = document.getElementById('new-user-password').value;
  const role = document.getElementById('new-user-role').value;
  const name = document.getElementById('new-user-name').value;
  const schoolId = parseInt(document.getElementById('new-user-school-id').value, 10);

  // Construct the payload with all required fields
  const payload = {
    action: 'create',
    email: email,
    password: password,
    profileData: {
      name: name,
      role: role,
      school_id: schoolId
    }
  };

  console.log("Add User Payload:", payload);

  try {
    const response = await fetch(
      'https://xnqiewcxmqeibmslyhmc.supabase.co/functions/v1/manageUsers',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
          'apikey': '[your-api-key]' // Add your Supabase API key here
        },
        body: JSON.stringify(payload)
      }
    );

    console.log("Add User Raw Response:", response);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response from Supabase:", errorText);
      alert(`Failed to add user: ${errorText}`);
      return;
    }

    const data = await response.json();
    console.log("Add User Response Data:", data);

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
