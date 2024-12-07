import { Request, Response } from "express";

import { UserInformationType } from "./sql-helper";

export function renderLoginPageHTML(req: Request, res: Response) {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Job-Seeker</title>
    </head>
    <body>
      <h1>Welcome to Job-Seeker! Please log in.</h1>
    </body>

    <form id="login-form">
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" required />
        <br><br>
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required />
        <br><br>
        <button type="button" onclick="handleLogin()">Login</button>
      </form>

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
            // Redirect to another page
            window.location.href = result.redirect;
            } else {
            // Alert the user about invalid credentials
            alert(result.message);
            }
        }
      </script>
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
      </head>
      <body>
        <h1>Welcome to the Dashboard, ${userInformation.username}!</h1>
        <p>This is a protected page accessible only after login.</p>
        <a href="/">Go back to login</a>
        <a href="/skills">Manage skills</a>
        <a href="#" id="transactionButton">Get your matching job postings & Display skills for high-salary jobs</a>
        <div id="transactionResults"></div>
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
      body {
        font-family: Arial, sans-serif;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        min-height: 100vh;
        margin: 0;
        padding: 20px;
        background-color: #f9f9f9;
      }
      .container {
        display: flex;
        gap: 20px;
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
    <div class="container">
      <!-- Panel 1: Skills the user has -->
      <div class="panel" id="panel1">
        <div class="panel-header">Skills You Have</div>
        <div class="panel-content" id="skillsUserHas">
          <!-- Skills dynamically populated here -->
        </div>
      </div>

      <!-- Panel 2: Skills the user doesn't have -->
      <div class="panel" id="panel2">
        <div class="panel-header">Skills You Don't Have</div>
        <div class="panel-content" id="skillsUserDoesNotHave">
          <!-- Skills dynamically populated here -->
        </div>
      </div>
    </div>

    <script src="js/skills.js"></script>
  </body>
  </html>`;
  res.send(htmlContent);
}
