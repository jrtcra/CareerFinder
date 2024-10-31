-- Find users with in-demand skills but without niche skills (users who not only have some skills required by 10% of all job postings but also lack any skills required by less than 1% of all job postings) that are less than 25 years old
SELECT DISTINCT
    ui.user_id
FROM
    user_information ui
    JOIN user_skills us ON ui.user_id = us.user_id
    JOIN skills s ON us.skill_abbr = s.skill_abbr
    JOIN posting_skills ps ON ps.skill_abbr = s.skill_abbr
    JOIN postings p ON ps.posting_id = p.posting_id
WHERE
    ui.age < 25
GROUP BY
    ui.user_id,
    s.skill_abbr
HAVING
    COUNT(DISTINCT p.posting_id) >= (
        0.1 * (
            SELECT
                COUNT(DISTINCT posting_id)
            FROM
                postings
        )
    )
EXCEPT
SELECT DISTINCT
    ui.user_id
FROM
    user_information ui
    JOIN user_skills us ON ui.user_id = us.user_id
    JOIN skills s ON us.skill_abbr = s.skill_abbr
    JOIN posting_skills ps ON ps.skill_abbr = s.skill_abbr
    JOIN postings p ON ps.posting_id = p.posting_id
GROUP BY
    ui.user_id,
    s.skill_abbr
HAVING
    COUNT(DISTINCT p.posting_id) < (
        0.01 * (
            SELECT
                COUNT(DISTINCT posting_id)
            FROM
                postings
        )
    );
