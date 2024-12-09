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

            // Display matching job postings
            const postingsTitle = document.createElement("h3");
            postingsTitle.textContent = "Matching Job Postings";
            resultsDiv.appendChild(postingsTitle);

            if (transactionData.matchingPostings.length) {
              const postingsList = document.createElement("ul");
              transactionData.matchingPostings.forEach((posting) => {
                const item = document.createElement("li");
                item.textContent = `${posting.posting_title} at ${posting.company_name}`;
                postingsList.appendChild(item);
              });
              resultsDiv.appendChild(postingsList);
            } else {
              resultsDiv.appendChild(document.createTextNode("No matching postings found."));
            }

            // Display common skills for high-salary jobs
            const skillsTitle = document.createElement("h3");
            skillsTitle.textContent = "Common Skills for High-Salary Jobs";
            resultsDiv.appendChild(skillsTitle);

            if (transactionData.commonSkills.length) {
              const skillsList = document.createElement("ul");
              transactionData.commonSkills.forEach((skill) => {
                const item = document.createElement("li");
                item.textContent = `${skill.skill_abbr} (${skill.skill_count} occurrences)`;
                skillsList.appendChild(item);
              });
              resultsDiv.appendChild(skillsList);
            } else {
              resultsDiv.appendChild(document.createTextNode("No skills found."));
            }

            // Display popular skills
            const popularTitle = document.createElement("h3");
            popularTitle.textContent = "Most Popular Skills";
            resultsDiv.appendChild(popularTitle);

            if (popularSkillsData.popularSkills.length) {
              const popularList = document.createElement("ul");
              popularSkillsData.popularSkills.forEach((skill) => {
                const item = document.createElement("li");
                item.textContent = `${skill.skill_name} (${skill.usage_count} users)`;
                popularList.appendChild(item);
              });
              resultsDiv.appendChild(popularList);
            } else {
              resultsDiv.appendChild(document.createTextNode("No popular skills found."));
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