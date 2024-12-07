import express, { Request, Response, NextFunction } from "express";
import session from "express-session";
import asyncHandler from "express-async-handler";
import path from "path";

import {
  renderLoginPageHTML,
  renderDashboard,
  renderSkillsHTML,
  renderProfileHTML,
} from "./index.html";
import {
  verifyLogin,
  UserInformationType,
  getAllSkills,
  getUserSkills,
  addUserSkill,
  removeUserSkill,
  updateUserPassword,
} from "./sql-helper";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/js", express.static(path.join(__dirname, "js")));

declare module "express-session" {
  interface SessionData {
    userInformation: UserInformationType;
  }
}
app.use(
  session({
    secret: "your_secret_key", // Use an environment variable for production
    resave: false,
    saveUninitialized: true,
  })
);

// Main page
app.get("/", renderLoginPageHTML);

// Handle login form submission
app.post(
  "/login",
  asyncHandler(async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const verifyResult = await verifyLogin(username, password);
    if (verifyResult.length) {
      req.session.userInformation = verifyResult[0];
      res.json({ success: true, redirect: "/dashboard" });
    } else {
      res.json({ success: false, message: "Invalid username or password." });
    }
  })
);

// Handle skill addition
app.post(
  "/skills/add",
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.session.userInformation) {
      throw new Error("User information not defined");
    }
    const skill = req.body;
    await addUserSkill(req.session.userInformation.user_id, skill.skill);
    res.json({ ok: true });
  })
);

// Handle skill removing
app.post(
  "/skills/remove",
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.session.userInformation) {
      throw new Error("User information not defined");
    }
    const skill = req.body;
    await removeUserSkill(req.session.userInformation.user_id, skill.skill);
    res.json({ ok: true });
  })
);

app.get("/dashboard", (req, res) => {
  if (!req.session.userInformation) {
    throw new Error("User information not defined");
  }
  renderDashboard(req, res, req.session.userInformation);
});

app.get("/skills", (req, res) => {
  renderSkillsHTML(req, res);
});

app.get("/api/all-skills", async (req: Request, res: Response) => {
  const queryResult = await getAllSkills();
  let allSkills = [];
  for (const skill of queryResult) {
    allSkills.push(skill.skill_abbr);
  }
  res.json({ allSkills });
});

app.get("/api/user-skills", async (req: Request, res: Response) => {
  if (!req.session.userInformation) {
    throw new Error("User information not defined");
  }
  const queryResult = await getUserSkills(req.session.userInformation.user_id);
  let userSkills: string[] = [];
  for (const skill of queryResult) {
    userSkills.push(skill.skill_abbr);
  }
  res.json({ userSkills });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get("/profile", (req, res) => {
  if (!req.session.userInformation) {
    res.redirect("/");
    return;
  }
  renderProfileHTML(req, res);
});

app.post("/api/update-password", asyncHandler(async (req: Request, res: Response) => {
  if (!req.session.userInformation) {
    res.status(401).json({ success: false, message: "Not authenticated" });
    return;
  }

  const { oldPassword, newPassword } = req.body;
  const success = await updateUserPassword(
    req.session.userInformation.user_id,
    oldPassword,
    newPassword
  );

  if (success) {
    res.json({ success: true, message: "Password updated successfully" });
  } else {
    res.json({ success: false, message: "Current password is incorrect" });
  }
}));