-- Retrieve an ordered list of common skills (ordered by the # of occurrences in job posting) required for top 10%(max) salary jobs
SELECT s.skill_name, COUNT(ps.skill_abbr) AS skill_count
FROM
    postings p
    JOIN jobs j ON p.job_id = j.job_id
    JOIN posting_skills ps ON p.posting_id = ps.posting_id
    JOIN skills s ON ps.skill_abbr = s.skill_abbr
WHERE j.max_salary >= (
    SELECT MIN(j1.max_salary)
    FROM jobs j1
    WHERE (SELECT COUNT(*) FROM jobs j2 WHERE j2.max_salary > j1.max_salary) <= 
          (0.1 * (SELECT COUNT(*) FROM jobs))
)
GROUP BY s.skill_name
ORDER BY skill_count DESC;
