-- Find matching job postings for a user based on matching skills (user meets all skill requirements for the job)
SELECT
    p.posting_id,
    p.posting_title,
    c.company_name
FROM
    postings p
    JOIN posting_skills ps ON p.posting_id = ps.posting_id
    JOIN user_skills us ON us.skill_abbr = ps.skill_abbr
    JOIN companies c ON c.company_id = p.company_id
WHERE
    us.user_id = 10 -- replace with real user id
GROUP BY
    p.posting_id,
    p.posting_title,
    c.company_name
HAVING
    COUNT(ps.skill_abbr) = (
        SELECT
            COUNT(skill_abbr)
        FROM
            posting_skills
        WHERE
            posting_id = p.posting_id
    );