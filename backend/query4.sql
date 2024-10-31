-- order all postings based on similarity between needed skills and skills the user has
CREATE INDEX embedding_idx ON skills(embedding);
-- DROP INDEX embedding_idx ON skills;

explain analyze SELECT
    posting_skill_numerics.posting_id
FROM
    (
        SELECT
            AVG(s.embedding) AS avg_emb
        FROM
            user_skills us
            JOIN skills s USING (skill_abbr)
        WHERE
            user_id = 10 -- replace with real user id
    ) user_skill_numerics,
    (
        SELECT
            ps.posting_id,
            AVG(s.embedding) AS embedding
        FROM
            posting_skills ps
            JOIN skills s USING (skill_abbr)
        GROUP BY
            ps.posting_id
    ) posting_skill_numerics
ORDER BY
    ABS(
        user_skill_numerics.avg_emb - posting_skill_numerics.embedding
    ) ASC;