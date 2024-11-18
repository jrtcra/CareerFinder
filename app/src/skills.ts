async function fetchSkills(endpoint: string): Promise<string[]> {
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Failed to fetch skills from ${endpoint}: ${response.statusText}`);
    }
    const data = await response.json();
    return data.allSkills || data.userSkills || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

let allSkills: string[] = [];
let userSkills: string[] = [];

async function initializeSkills() {
  allSkills = await fetchSkills('/api/all-skills');
  userSkills = await fetchSkills('/api/user-skills');
  populatePanels(); // Re-populate the panels after fetching skills
}

const skillsUserHas = document.getElementById("skillsUserHas");
const skillsUserDoesNotHave = document.getElementById("skillsUserDoesNotHave");

// Helper to create a skill item element
function createSkillItem(skill: string, moveToPanel: string) {
  const skillItem = document.createElement("div");
  skillItem.className = "skill-item";

  const skillName = document.createElement("span");
  skillName.textContent = skill;

  const button = document.createElement("button");
  button.className = "button";
  button.textContent = moveToPanel === "panel1" ? "Add" : "Remove";
  button.addEventListener("click", () => {
    if (moveToPanel === "panel1") {
      addSkill(skill);
    } else {
      removeSkill(skill);
    }
  });

  skillItem.appendChild(skillName);
  skillItem.appendChild(button);
  return skillItem;
}

// Populate the panels
function populatePanels() {
  if (!skillsUserHas) {
    throw new Error("User skill panel not found");
  }
  if (!skillsUserDoesNotHave) {
    throw new Error("Remaining skill panel not found");
  }
  skillsUserHas.innerHTML = "";
  skillsUserDoesNotHave.innerHTML = "";

  const userHas = new Set(userSkills);
  allSkills.forEach((skill) => {
    if (userHas.has(skill)) {
      skillsUserHas.appendChild(createSkillItem(skill, "panel2"));
    } else {
      skillsUserDoesNotHave.appendChild(createSkillItem(skill, "panel1"));
    }
  });
}

// Add skill (move from panel 2 to panel 1)
async function addSkill(skill: string) {
  if (!userSkills.includes(skill)) {
    userSkills.push(skill);
    const response = await fetch("/skills/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ skill }),
    });
    if (!response.ok) {
      throw new Error("Failed to add skill.");
    }
  }
  populatePanels();
}

// Remove skill (move from panel 1 to panel 2)
async function removeSkill(skill: string) {
  const index = userSkills.indexOf(skill);
  if (index > -1) {
    userSkills.splice(index, 1);
    const response = await fetch("/skills/remove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ skill }),
    });
    if (!response.ok) {
      throw new Error("Failed to remove skill.");
    }
  }
  populatePanels();
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  initializeSkills();
});