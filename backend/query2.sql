-- Find users with in-demand skills but without niche skills (users who not only have some skills required by 75% of all job postings but also lack any skills required by less than 5% of all job postings)
SELECT 
    DISTINCT ui.user_id
FROM 
    user_information ui
    JOIN user_skills us ON ui.user_id = us.user_id
    JOIN skills s ON us.skill_abbr = s.skill_abbr
    JOIN posting_skills ps ON ps.skill_abbr = s.skill_abbr
    JOIN postings p ON ps.posting_id = p.posting_id
GROUP BY 
    ui.user_id, s.skill_name
HAVING 
    COUNT(DISTINCT p.posting_id) >= (
        0.75 * (SELECT COUNT(DISTINCT posting_id) FROM postings)
    )

EXCEPT

SELECT 
    DISTINCT ui.user_id
FROM 
    user_information ui
    JOIN user_skills us ON ui.user_id = us.user_id
    JOIN skills s ON us.skill_abbr = s.skill_abbr
    JOIN posting_skills ps ON ps.skill_abbr = s.skill_abbr
    JOIN postings p ON ps.posting_id = p.posting_id
GROUP BY 
    ui.user_id, s.skill_name
HAVING 
    COUNT(DISTINCT p.posting_id) < (
        0.05 * (SELECT COUNT(DISTINCT posting_id) FROM postings)
    );

