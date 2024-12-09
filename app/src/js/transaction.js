document.addEventListener("DOMContentLoaded", () => {
  const transactionButton = document.getElementById("transactionButton");

  if (transactionButton) {
    transactionButton.addEventListener("click", (event) => {
      event.preventDefault();
      Promise.all([
        fetch("/api/transaction"),
        fetch("/api/popular-skills")
      ])
        .then(([transactionResponse, popularSkillsResponse]) => {
          if (!transactionResponse.ok || !popularSkillsResponse.ok) {
            throw new Error("Failed to fetch results.");
          }
          return Promise.all([
            transactionResponse.json(),
            popularSkillsResponse.json()
          ]);
        })
        .then(([transactionData, popularSkillsData]) => {
          const resultsDiv = document.getElementById("transactionResults");
          
          if (resultsDiv) {
            resultsDiv.innerHTML = "";

            // Create flex container
            const flexContainer = document.createElement("div");
            flexContainer.style.display = "flex";
            flexContainer.style.justifyContent = "space-between";
            flexContainer.style.gap = "20px";
            flexContainer.style.margin = "20px 0";
            resultsDiv.appendChild(flexContainer);

            // Create three sections
            const section1 = document.createElement("div");
            const section2 = document.createElement("div");
            const section3 = document.createElement("div");

            [section1, section2, section3].forEach(section => {
              section.style.flex = "1";
              section.style.backgroundColor = "#f8f9fa";
              section.style.padding = "20px";
              section.style.borderRadius = "8px";
              section.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
              flexContainer.appendChild(section);
            });

            // Matching Job Postings Section
            const postingsTitle = document.createElement("h3");
            postingsTitle.textContent = "Matching Job Postings";
            postingsTitle.style.marginTop = "0";
            section1.appendChild(postingsTitle);

            if (transactionData.matchingPostings.length) {
              const postingsList = document.createElement("ul");
              postingsList.style.paddingLeft = "20px";
              transactionData.matchingPostings.forEach((posting) => {
                const item = document.createElement("li");
                item.textContent = `${posting.posting_title} at ${posting.company_name}`;
                postingsList.appendChild(item);
              });
              section1.appendChild(postingsList);
            } else {
              section1.appendChild(document.createTextNode("No matching postings found."));
            }

            // Common Skills Section
            const skillsTitle = document.createElement("h3");
            skillsTitle.textContent = "Common Skills for High-Salary Jobs";
            skillsTitle.style.marginTop = "0";
            section2.appendChild(skillsTitle);

            if (transactionData.commonSkills.length) {
              const skillsList = document.createElement("ul");
              skillsList.style.paddingLeft = "20px";
              transactionData.commonSkills.forEach((skill) => {
                const item = document.createElement("li");
                item.textContent = `${skill.skill_name} (${skill.skill_count} occurrences)`;
                skillsList.appendChild(item);
              });
              section2.appendChild(skillsList);
            } else {
              section2.appendChild(document.createTextNode("No skills found."));
            }

            // Popular Skills Section
            const popularTitle = document.createElement("h3");
            popularTitle.textContent = "Most Popular Skills";
            popularTitle.style.marginTop = "0";
            section3.appendChild(popularTitle);

            if (popularSkillsData.popularSkills.length) {
              const popularList = document.createElement("ol");  // Changed to ordered list
              popularList.style.paddingLeft = "20px";
              popularSkillsData.popularSkills.forEach((skill) => {
                const item = document.createElement("li");
                item.textContent = `${skill.skill_name} (${skill.usage_count} users)`;
                popularList.appendChild(item);
              });
              section3.appendChild(popularList);
            } else {
              section3.appendChild(document.createTextNode("No popular skills found."));
            }
          }
        })
        .catch((error) => {
          console.error(error);
          alert("Failed to run transaction.");
        });
    });
  }
});