import { Request, Response } from "express";

import {UserInformationType} from "./sql-helper"

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

export function renderDashboard(req: Request, res: Response, userInformation: UserInformationType) {
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
      </body>
      </html>
    `;
    res.send(htmlContent);
  }
  