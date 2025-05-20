 document.getElementById('signUpForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const phone = document.getElementById('phone').value;

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      });

      if (response.ok) {
        alert('Account created successfully!');
        window.location.href = '/login.html';
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      alert('Error: Could not connect to server.');
    }
  });