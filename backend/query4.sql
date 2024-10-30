-- order all postings based on similarity between needed skills and skills the user has
SELECT
    posting_skill_numerics.posting_id
FROM
    (
        SELECT
            AVG(s.embedding)
        FROM
            user_skills us
            JOIN skills s USING (skill_abbr)
        WHERE
            user_id = $user_id
    ) user_skill_numerics,
    (
        SELECT
            ps.posting_id,
            AVG(s.embedding)
        FROM
            posting_skills ps
            JOIN skills s USING (skill_abbr)
        GROUP BY
            ps.posting_id
    ) posting_skill_numerics
ORDER BY
    ABS(
        user_skill_numerics - posting_skill_numerics.embedding
    ) ASC;