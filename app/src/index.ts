import express, { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";

import { renderLoginPageHTML, renderDashboard } from "./index.html";
import { verifyLogin, UserInformationType } from "./sql-helper";

const app = express();
const PORT = 3000;

app.use(express.json());

// Middleware information
let userInformation: UserInformationType;

// Main page
app.get("/", renderLoginPageHTML);

// Handle login form submission
app.post(
  "/login",
  asyncHandler(async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const verifyResult = await verifyLogin(username, password);
    if (verifyResult.length) {
      userInformation = verifyResult[0];
      res.json({ success: true, redirect: "/dashboard" });
    } else {
      res.json({ success: false, message: "Invalid username or password." });
    }
  })
);

app.get("/dashboard", (req, res) => {
  renderDashboard(req, res, userInformation);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
