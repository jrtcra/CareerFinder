import { Request, Response } from "express";

import { UserInformationType, JobDetailType, SkillAbbrType } from "./sql-helper";

function getCommonHeaderStyle() {
  return `
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
    }
    .header {
      background-color: #006400;
      padding: 1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
    }
    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .nav-brand {
      color: white;
      font-size: 1.5rem;
      font-weight: bold;
    }
    .nav-links {
      display: flex;
      gap: 1rem;
    }
    .nav-link {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.2s;
    }
    .nav-link:hover {
      background-color: rgba(255,255,255,0.1);
    }
    .main-content {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 0 1rem;
    }
  `;
}

function getCommonHeader(title: string) {
  return `
    <header class="header">
      <nav class="nav-container">
        <div class="nav-brand">${title}</div>
        <div class="nav-links">
          <a href="/dashboard" class="nav-link">Back to Home</a>
        </div>
      </nav>
    </header>
  `;
}

export function renderLoginPageHTML(req: Request, res: Response) {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Job-Seeker</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .form-group {
          margin-bottom: 15px;
        }
        label {
          display: block;
          margin-bottom: 5px;
        }
        input {
          width: 100%;
          padding: 8px;
          margin-bottom: 10px;
        }
        button {
          background-color: #007bff;
          color: white;
          padding: 10px 15px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        button:hover {
          background-color: #0056b3;
        }
        .signup-link {
          margin-top: 15px;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <h1>Welcome to Job-Seeker! Please log in.</h1>

      <form id="login-form">
        <div class="form-group">
          <label for="username">Username:</label>
          <input type="text" id="username" name="username" required />
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="button" onclick="handleLogin()">Login</button>
      </form>

      <div class="signup-link">
        <p>Don't have an account? <a href="/signup">Sign up here</a></p>
      </div>

      <script>
        async function handleLogin() {
          const username = document.getElementById('username').value;
          const password = document.getElementById('password').value;

          const response = await fetch('/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
          });

          const result = await response.json();
          if (result.success) {
            window.location.href = result.redirect;
          } else {
            alert(result.message);
          }
        }
      </script>
    </html>
  `;
  res.send(htmlContent);
}

export function renderSignupPageHTML(req: Request, res: Response) {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Sign Up - Job-Seeker</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .form-group {
          margin-bottom: 15px;
        }
        label {
          display: block;
          margin-bottom: 5px;
        }
        input {
          width: 100%;
          padding: 8px;
          margin-bottom: 10px;
        }
        button {
          background-color: #007bff;
          color: white;
          padding: 10px 15px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        button:hover {
          background-color: #0056b3;
        }
        .login-link {
          margin-top: 15px;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <h1>Sign Up for Job-Seeker</h1>

      <form id="signup-form">
        <div class="form-group">
          <label for="username">Username:</label>
          <input type="text" id="username" name="username" required />
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <div class="form-group">
          <label for="age">Age:</label>
          <input type="number" id="age" name="age" min="18" max="120" required />
        </div>
        <div class="form-group">
          <label for="state">State (2-letter code):</label>
          <input type="text" id="state" name="state" maxlength="2" pattern="[A-Za-z]{2}" required />
        </div>
        <button type="button" onclick="handleSignup()">Sign Up</button>
      </form>

      <div class="login-link">
        <p>Already have an account? <a href="/">Log in here</a></p>
      </div>

      <script>
        async function handleSignup() {
          const username = document.getElementById('username').value;
          const password = document.getElementById('password').value;
          const age = parseInt(document.getElementById('age').value);
          const state = document.getElementById('state').value.toUpperCase();

          const response = await fetch('/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, age, state }),
          });

          const result = await response.json();
          if (result.success) {
            window.location.href = result.redirect;
          } else {
            alert(result.message);
          }
        }
      </script>
    </body>
    </html>
  `;
  res.send(htmlContent);
}


export function renderDashboard(
  req: Request,
  res: Response,
  userInformation: UserInformationType
) {
  const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dashboard</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
          }
          .header {
            background-color: #006400;
            padding: 1rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            position: sticky;
            top: 0;
          }
          .nav-container {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .nav-brand {
            color: white;
            font-size: 1.5rem;
            font-weight: bold;
          }
          .nav-links {
            display: flex;
            gap: 1rem;
          }
          .nav-link {
            color: white;
            text-decoration: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            transition: background-color 0.2s;
          }
          .nav-link:hover {
            background-color: rgba(255,255,255,0.1);
          }
          .main-content {
            max-width: 1200px;
            margin: 2rem auto;
            padding: 0 1rem;
          }
          h1 {
            color: #333;
            margin-bottom: 2rem;
          }
          #transactionButton {
            display: inline-block;
            background-color: #006400;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            text-decoration: none;
            margin-bottom: 1rem;
            transition: background-color 0.2s;
          }
          #transactionButton:hover {
            background-color: #005400;
          }
        </style>
      </head>
      <body>
        <header class="header">
          <nav class="nav-container">
            <div class="nav-brand">Job-Seeker</div>
            <div class="nav-links">
              <a href="/" class="nav-link">Log Out</a>
              <a href="/skills" class="nav-link">Manage Skills</a>
              <a href="/search" class="nav-link">Search Jobs</a>
              <a href="/profile" class="nav-link">Update Profile</a>
            </div>
          </nav>
        </header>

        <div class="main-content">
          <h1>Welcome to the Dashboard, ${userInformation.username}!</h1>
          <a href="#" id="transactionButton">Get your matching job postings & Display skills for high-salary jobs</a>
          <div id="transactionResults"></div>
        </div>
        <script src="/js/transaction.js"></script>
      </body>
      </html>
    `;
  res.send(htmlContent);
}

export function renderSkillsHTML(req: Request, res: Response) {
  const htmlContent = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Skill Management</title>
    <style>
      ${getCommonHeaderStyle()}
      .container {
        display: flex;
        gap: 20px;
        padding: 20px;
        justify-content: center;
      }
      .panel {
        width: 300px;
        border: 1px solid #ccc;
        border-radius: 5px;
        background-color: #fff;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      }
      .panel-header {
        background-color: #007bff;
        color: #fff;
        padding: 10px;
        font-weight: bold;
        text-align: center;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
      }
      .panel-content {
        padding: 10px;
        max-height: 400px;
        overflow-y: auto;
      }
      .skill-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 10px;
        border-bottom: 1px solid #eee;
      }
      .skill-item:last-child {
        border-bottom: none;
      }
      .button {
        background-color: #007bff;
        color: #fff;
        border: none;
        border-radius: 3px;
        padding: 5px 10px;
        cursor: pointer;
      }
      .button:hover {
        background-color: #0056b3;
      }
    </style>
  </head>
  <body>
    ${getCommonHeader('Manage Skills')}
    <div class="container">
      <div class="panel" id="panel1">
        <div class="panel-header">Skills You Have</div>
        <div class="panel-content" id="skillsUserHas">
        </div>
      </div>
      <div class="panel" id="panel2">
        <div class="panel-header">Skills You Don't Have</div>
        <div class="panel-content" id="skillsUserDoesNotHave">
        </div>
      </div>
    </div>
    <script src="js/skills.js"></script>
  </body>
  </html>`;
  res.send(htmlContent);
}

export function renderProfileHTML(req: Request, res: Response) {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Edit Profile</title>
      <style>
        ${getCommonHeaderStyle()}
        .form-group {
          margin-bottom: 15px;
        }
        label {
          display: block;
          margin-bottom: 5px;
        }
        input[type="password"] {
          width: 100%;
          padding: 8px;
          margin-bottom: 10px;
        }
        button {
          background-color: #006400;
          color: white;
          padding: 10px 15px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        button:hover {
          background-color: #005400;
        }
        .error-message {
          color: red;
          margin-top: 10px;
          display: none;
        }
        .success-message {
          color: green;
          margin-top: 10px;
          display: none;
        }
      </style>
    </head>
    <body>
      ${getCommonHeader('Update Profile')}
      <div class="main-content">
        <form id="password-form">
          <div class="form-group">
            <label for="oldPassword">Old Password:</label>
            <input type="password" id="oldPassword" name="oldPassword" required>
          </div>
          <div class="form-group">
            <label for="newPassword">New Password:</label>
            <input type="password" id="newPassword" name="newPassword" required>
          </div>
          <div class="form-group">
            <label for="confirmPassword">Confirm New Password:</label>
            <input type="password" id="confirmPassword" name="confirmPassword" required>
          </div>
          <button type="button" onclick="updatePassword()">Update Password</button>
        </form>
        <div id="errorMessage" class="error-message"></div>
        <div id="successMessage" class="success-message"></div>
      </div>

      <script>
        async function updatePassword() {
          const oldPassword = document.getElementById('oldPassword').value;
          const newPassword = document.getElementById('newPassword').value;
          const confirmPassword = document.getElementById('confirmPassword').value;
          const errorMessage = document.getElementById('errorMessage');
          const successMessage = document.getElementById('successMessage');

          errorMessage.style.display = 'none';
          successMessage.style.display = 'none';

          if (newPassword !== confirmPassword) {
            errorMessage.textContent = 'New passwords do not match';
            errorMessage.style.display = 'block';
            return;
          }

          try {
            const response = await fetch('/api/update-password', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                oldPassword,
                newPassword
              }),
            });

            const result = await response.json();
            
            if (result.success) {
              successMessage.textContent = 'Password updated successfully';
              successMessage.style.display = 'block';
              document.getElementById('password-form').reset();
            } else {
              errorMessage.textContent = result.message;
              errorMessage.style.display = 'block';
            }
          } catch (error) {
            errorMessage.textContent = 'An error occurred while updating the password';
            errorMessage.style.display = 'block';
          }
        }
      </script>
    </body>
    </html>
  `;
  res.send(htmlContent);
}

export function renderSearchHTML(req: Request, res: Response) {
  const htmlContent = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Search for a job</title>
    <style>
      ${getCommonHeaderStyle()}
      .search-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }
      .table-container {
        width: 100%;
        overflow-x: auto;
        margin-top: 20px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        min-width: 600px;
      }
      th, td {
        border: 1px solid #ddd;
        padding: 12px;
        text-align: left;
      }
      th {
        background-color: #f2f2f2;
        white-space: nowrap;
      }
      td {
        max-width: 300px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
      }
      form {
        margin: 20px 0;
      }
      .form-row {
        margin-bottom: 15px;
      }
      label {
        display: inline-block;
        width: 120px;
      }
      input[type="number"] {
        padding: 8px;
        width: 200px;
      }
      button {
        padding: 8px 16px;
        background-color: #006400;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 10px;
      }
      button:hover {
        background-color: #005400;
      }
    </style>
  </head>
  <body>
    ${getCommonHeader('Search Jobs')}
    <div class="search-container">
      <form id="search-form">
        <div class="form-row">
          <label for="min-salary">Minimum salary:</label>
          <input type="number" id="min-salary" name="min-salary"/>
        </div>
        <div class="form-row">
          <label for="max-salary">Maximum salary:</label>
          <input type="number" id="max-salary" name="max-salary"/>
        </div>
        <button type="button" onclick="handleSearch()">Search</button>
      </form>
      <div class="table-container">
        <table id="postingsTable">
          <thead>
            <tr>
              <th>Job posting ID</th>
              <th>Job posting title</th>
              <th>Job posting description</th>
              <th>Company name</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
      </div>
    </div>
    <script>
      async function handleSearch() {
        const minsal = document.getElementById('min-salary').value;
        const maxsal = document.getElementById('max-salary').value;
        const response = await fetch('/searching', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ minsal, maxsal }),
        });
        const result = await response.json();
        populateTable(result);
      }
      function populateTable(postings) {
        const tableBody = document.querySelector("#postingsTable tbody");
        tableBody.innerHTML = "";
        postings.forEach((posting) => {
          const row = document.createElement("tr");
          row.innerHTML = \`
            <td><a href="/detail/\${posting.posting_id}">\${posting.posting_id}</a></td>
            <td>\${posting.posting_title}</td>
            <td>\${posting.posting_description}</td>
            <td>\${posting.company_name}</td>
          \`;
          tableBody.appendChild(row);
        });
      }
    </script>
  </body>
  </html>`;
  res.send(htmlContent);
}

export function renderDetailHTML(req: Request, res: Response, detail: JobDetailType, skills: SkillAbbrType[]) {
  let skill_str = '';
  skills.forEach((skill) => {skill_str += skill.skill_abbr;skill_str += ' ';})
  const htmlContent = `
  <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Posting details</title>
      <link rel="stylesheet" href="/public/ui4.css">
    </head>
    <body>
      <!-- Header -->
      <header>
        <div class="header-content">
          <h1>Posting details</h1>
        </div>
      </header>
      <!-- Main content -->
      <main>
        <section class="career-details">
          <h2>${detail.posting_title}</h2> <!-- Career Title Above White Box -->     
          <div class="career-info">
            <h3>Posting descriptions:</h3>
            ${detail.posting_description}
            <br>
            <h3>Company name:</h3>
            ${detail.company_name}
            <br>
            <h3>Company descriptions:</h3>
            ${detail.company_description}
            <br>
            <h3>Median salary:</h3>
            ${detail.med_salary}
            <br>
            <h3>Required skills:</h3>
            ${skill_str}
          </div>
        </section>
      </main>
    </body>
    </html>`;
  res.send(htmlContent);
}