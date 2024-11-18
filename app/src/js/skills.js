var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function fetchSkills(endpoint) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(endpoint);
            if (!response.ok) {
                throw new Error(`Failed to fetch skills from ${endpoint}: ${response.statusText}`);
            }
            const data = yield response.json();
            return data.allSkills || data.userSkills || [];
        }
        catch (error) {
            console.error(error);
            return [];
        }
    });
}
let allSkills = [];
let userSkills = [];
function initializeSkills() {
    return __awaiter(this, void 0, void 0, function* () {
        allSkills = yield fetchSkills('/api/all-skills');
        userSkills = yield fetchSkills('/api/user-skills');
        populatePanels(); // Re-populate the panels after fetching skills
    });
}
const skillsUserHas = document.getElementById("skillsUserHas");
const skillsUserDoesNotHave = document.getElementById("skillsUserDoesNotHave");
// Helper to create a skill item element
function createSkillItem(skill, moveToPanel) {
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
        }
        else {
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
        }
        else {
            skillsUserDoesNotHave.appendChild(createSkillItem(skill, "panel1"));
        }
    });
}
// Add skill (move from panel 2 to panel 1)
function addSkill(skill) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!userSkills.includes(skill)) {
            userSkills.push(skill);
            const response = yield fetch("/skills/add", {
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
    });
}
// Remove skill (move from panel 1 to panel 2)
function removeSkill(skill) {
    return __awaiter(this, void 0, void 0, function* () {
        const index = userSkills.indexOf(skill);
        if (index > -1) {
            userSkills.splice(index, 1);
            const response = yield fetch("/skills/remove", {
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
    });
}
// Initialize
document.addEventListener("DOMContentLoaded", () => {
    initializeSkills();
});
