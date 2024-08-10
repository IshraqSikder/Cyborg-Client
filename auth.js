const getValue = (id) => {
  const value = document.getElementById(id).value;
  return value;
};

const handleRegistration = (event) => {
  event.preventDefault();
  const username = getValue("username");
  const first_name = getValue("first_name");
  const last_name = getValue("last_name");
  const email = getValue("email");
  const password = getValue("password");
  const confirm_password = getValue("confirm_password");
  const bio = getValue("bio");
  const avatar = document.getElementById("avatar").files[0];

  if (password === confirm_password) {
    const form_data = new FormData();
    form_data.append("username", username);
    form_data.append("first_name", first_name);
    form_data.append("last_name", last_name);
    form_data.append("email", email);
    form_data.append("bio", bio);
    if (avatar) {
      form_data.append("avatar", avatar);
    }
    form_data.append("password", password);
    form_data.append("confirm_password", confirm_password);
  
    document.getElementById("error").innerText = "";
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password)) {

      fetch("http://127.0.0.1:8000/clients/register/", {
        method: "POST",
        body: form_data,
      })
      .then((res) => res.json())
      .then((data) => {
        if (data.error && data.error === 'Email Already exists') {
        document.getElementById("error").innerText = 'Email already exists. Try with an another email';
        } 
        if (data && data === 'Check your email for confirmation') {
          document.getElementById("error").innerText = "Check your email for confirmation";
          alert("Check your email for confirmation");
          window.location.href = "login.html";
        } else {
          console.log(data);
        }
      })
    } else {
      document.getElementById("error").innerText =
        "Password must contain minimum 8 characters, at least a uppercase letter, a lowercase letter and a digit";
        alert("Password must contain minimum 8 characters, at least a uppercase letter, a lowercase letter and a digit");
    }
  } else {
    document.getElementById("error").innerText =
      "Password and Confirm password do not match";
    alert("Password and Confirm password do not match");
  }
};

const handleLogin = (event) => {
  event.preventDefault();
  const username = getValue("l-username");
  const password = getValue("l-password");
  console.log(username, password);
  if (!username || !password) {
    document.getElementById("error").textContent = "All fields are required";
    return;
  }
  
  if ((username, password)) {
    fetch("http://127.0.0.1:8000/clients/login/", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.token && data.user_id) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user_id", data.user_id);
        window.location.href = "index.html";
      }
      if (data.error && data.error === 'Invalid Credential') {
        document.getElementById("error").innerText = 'Invalid username or password';
      } else {
        console.log(data);
      }
    });
  }
};

// const loadClientId = () => {
//   const userId = localStorage.getItem("user_id");
//   fetch(`http://127.0.0.1:8000/clients/list/?user_id=${userId}`)
//     .then((res) => res.json())
//     .then((data) => {
//       if (data.length > 0) {
//         document.getElementById("permission-accessed").style.display = "block";
//         document.getElementById("permission-denied").style.display = "none";
//         localStorage.setItem("client_id", data[0].id);
//       } else {
//         console.log("No user data found");
//       }
//     });
// };

const displayAuth = () => {
  var user_id = localStorage.getItem("user_id");
  if (user_id) {
    document.getElementById("registerBtn").style.display = "none";
    document.getElementById("loginBtn").style.display = "none";
  } else {
    document.getElementById("profilePic").style.display = "none";
    document.getElementById("logoutBtn").style.display = "none";
    document.getElementById("settingsBtn").style.display = "none";
  }
};

const handlelogOut = (event) => {
  event.preventDefault();
  const token = localStorage.getItem("token");
  console.log(token);
  fetch("http://127.0.0.1:8000/clients/logout/", {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("client_id");
      localStorage.removeItem("game_id");
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error("Logout failed:", error);
    });
};

const changePassword = (event) => {
  event.preventDefault();
  const oldPassword = getValue("oldPassword");
  const newPassword = getValue("newPassword");
  const confirmPassword = getValue("confirmPassword");
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

  if (!oldPassword || !newPassword || !confirmPassword) {
    document.getElementById("error").textContent = "All fields are required";
    return;
  }

  if (newPassword !== confirmPassword) {
    document.getElementById("error").textContent = "New passwords do not match";
    return;
  }

  if (!passwordRegex.test(newPassword)) {
    document.getElementById("error").textContent = "New Password must contain minimum 8 characters, at least a uppercase letter, a lowercase letter and a digit";
    return;
  }

  fetch('http://127.0.0.1:8000/clients/change-password/', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      oldPassword: oldPassword,
      newPassword: newPassword,
      confirmPassword: confirmPassword
    })
  })
  .then(res => res.json())
  .then(data => {
    console.log(data);
    if (data.errPassword) {
      document.getElementById("error").textContent = data.errPassword;
    }
  })
  .catch(error => {
    document.getElementById("error").textContent = "Error: " + error.message;
  });
  alert('Password changed successfully');
  window.location.href = "profile.html";
};

const resetPasswordRequest = (event) => {
  event.preventDefault();
  const email = document.getElementById('reset-email').value;

  if (!email) {
    document.getElementById('error').textContent = "All fields are required";
    return;
  }

  fetch(`http://127.0.0.1:8000/clients/reset-password/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    body: JSON.stringify({
      reset_email: email
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data) {
      document.getElementById('error').textContent = data;
      alert(data);
    } else {
        window.location.href = 'login.html';
    }
  })
  .catch(error => {
      document.getElementById('error').textContent = `Error: ${error.message}`;
  });
};

const resetPasswordConfirm = (event) => {
  event.preventDefault();
  const newPassword = document.getElementById('new-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const uidb64 = new URLSearchParams(window.location.search).get('uidb64');
  const token = new URLSearchParams(window.location.search).get('token');

  if (!newPassword || !confirmPassword) {
    document.getElementById('error').textContent = "All fields are required";
    return;
  }

  if (newPassword !== confirmPassword) {
    document.getElementById('error').textContent = "Passwords do not match";
    return;
  }

  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(newPassword)) {
    document.getElementById('error').textContent = "Password must contain minimum 8 characters, at least a uppercase letter, a lowercase letter and a digit";
    return;
  }

  fetch(`http://127.0.0.1:8000/clients/reset-password-confirm/${uidb64}/${token}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      new_password: newPassword,
      confirm_password: confirmPassword
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data) {
      document.getElementById('error').textContent = data;
      alert(data);
      window.location.href = 'login.html';
    } else {
      document.getElementById('error').textContent = 'Password reset is incomplete';
    }
  })
  .catch(error => {
    document.getElementById('error').textContent = `Error: ${error.message}`;
  });
};

const deleteAccount = (event) => {
  event.preventDefault();
  const delete_account_password = getValue('delete-account-password');

  if (delete_account_password) {
    // console.log(delete_account_password);
    fetch("http://127.0.0.1:8000/clients/delete-account/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ password: delete_account_password }),
    })
      .then((response) => {
        if (response.ok) {
          alert("Your account has been successfully deleted. Please register again to join.");
          localStorage.removeItem("token");
          localStorage.removeItem("user_id");
          localStorage.removeItem("client_id");
          localStorage.removeItem("game_id");
          window.location.href = "index.html";
        } else {
          return response.json().then((data) => {
            console.log(data);
            alert(data.detail || "Failed to delete account");
          });
        }
      })
      .catch((error) => {
        console.log(error);
        console.error("Error:", error);
        alert("An error occurred. Please try again later");
      });
  }
};



displayAuth();
// loadClientId();