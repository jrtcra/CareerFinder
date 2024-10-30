-- Find all companies with certain keywords in their description, the count of skills needed that are similar to engineering
SELECT
    company_id,
    COUNT(*) AS skill_counts
FROM
    posting_skills
    JOIN skills USING (skill_abbr)
    JOIN postings USING (posting_id)
    JOIN companies USING (company_id)
WHERE
    ABS(embedding - (SELECT embedding FROM skills WHERE skill_abbr='ENG')) < .3 AND
    company_description LIKE ('%compute%')
GROUP BY
    company_id;