import express, { Request, Response, NextFunction } from "express";
import session from "express-session";
import asyncHandler from "express-async-handler";
import path from "path";

import {
  renderLoginPageHTML,
  renderSignupPageHTML,
  renderDashboard,
  renderSkillsHTML,
  renderProfileHTML,
  renderSearchHTML,
  renderDetailHTML,
} from "./index.html";
import {
  verifyLogin,
  createUser,
  UserInformationType,
  getAllSkills,
  getUserSkills,
  addUserSkill,
  removeUserSkill,
  performTransaction,
  updateUserPassword,
  searchJobPosting,
  getMatchingJobs,
  getPostingSkills,
  getPostingDetail,
} from "./sql-helper";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/js", express.static(path.join(__dirname, "js")));
app.use("/public", express.static(path.join(__dirname, "public")));

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

app.get("/signup", renderSignupPageHTML);

app.post(
  "/signup",
  asyncHandler(async (req: Request, res: Response) => {
    const { username, password, age, state } = req.body;
    
    // Basic validation
    if (!username || !password || !age || !state) {
      res.json({ success: false, message: "All fields are required." });
      return;
    }
    
    if (age < 18 || age > 120) {
      res.json({ success: false, message: "Please enter a valid age." });
      return;
    }
    
    if (state.length !== 2) {
      res.json({ success: false, message: "Please enter a valid 2-letter state code." });
      return;
    }

    const success = await createUser(username, password, age, state);
    if (success) {
      const verifyResult = await verifyLogin(username, password);
      req.session.userInformation = verifyResult[0];
      res.json({ success: true, redirect: "/dashboard" });
    } else {
      res.json({ success: false, message: "Username already exists." });
    }
  })
);

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

// Handle job search
app.post(
  "/searching",
  asyncHandler(async (req: Request, res: Response) => {
    let { minsal, maxsal } = req.body;
    if (!minsal) {
      minsal = 0;
    }
    if (!maxsal) {
      maxsal = 1e30;
    }
    const searchResult = await searchJobPosting(minsal, maxsal);
    res.json(searchResult[0]);
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

// Handle transaction
app.get(
  "/api/transaction",
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.session.userInformation) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const userId = req.session.userInformation.user_id;

    try {
      const { matchingPostings, commonSkills } = await performTransaction(userId);
      res.json({ matchingPostings, commonSkills });
    } catch (error) {
      const typedError = error as Error;
      res.status(500).json({ error: "Failed to perform transaction", details: typedError.message });
    }
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

app.get(
  "/search",
  (req, res) => {
    renderSearchHTML(req, res);
  }
);

app.get(
  "/detail/:posting_id",
  asyncHandler(async (req: Request, res: Response) => {
    const posting_id = Number(req.params.posting_id);
    const skills = await getPostingSkills(posting_id);
    const detail = await getPostingDetail(posting_id);
    renderDetailHTML(req, res, detail[0], skills);
  })
);

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