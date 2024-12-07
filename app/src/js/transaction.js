document.addEventListener("DOMContentLoaded", () => {
    const transactionButton = document.getElementById("transactionButton");
  
    if (transactionButton) {
      transactionButton.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent default link behavior
        fetch("/api/transaction")
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to fetch transaction results.");
            }
            return response.json();
          })
          .then((data) => {
            const resultsDiv = document.getElementById("transactionResults");
            
            if (resultsDiv) {
              resultsDiv.innerHTML = "";
  
              // Display matching job postings
              const postingsTitle = document.createElement("h3");
              postingsTitle.textContent = "Matching Job Postings";
              resultsDiv.appendChild(postingsTitle);
  
              if (data.matchingPostings.length) {
                const postingsList = document.createElement("ul");
                data.matchingPostings.forEach((posting) => {
                  const item = document.createElement("li");
                  item.textContent = `${posting.posting_title} at ${posting.company_name}`;
                  postingsList.appendChild(item);
                });
                resultsDiv.appendChild(postingsList);
              } else {
                resultsDiv.appendChild(document.createTextNode("No matching postings found."));
              }
  
              // Display common skills
              const skillsTitle = document.createElement("h3");
              skillsTitle.textContent = "Common Skills for High-Salary Jobs";
              resultsDiv.appendChild(skillsTitle);
  
              if (data.commonSkills.length) {
                const skillsList = document.createElement("ul");
                data.commonSkills.forEach((skill) => {
                  const item = document.createElement("li");
                  item.textContent = `${skill.skill_abbr} (${skill.skill_count} occurrences)`;
                  skillsList.appendChild(item);
                });
                resultsDiv.appendChild(skillsList);
              } else {
                resultsDiv.appendChild(document.createTextNode("No skills found."));
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
