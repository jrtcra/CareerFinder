CREATE TABLE
    IF NOT EXISTS user_information (
        user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(20) NOT NULL,
        password VARCHAR(50) NOT NULL
    );

CREATE TABLE
    IF NOT EXISTS skills (
        skill_abbr VARCHAR(10) PRIMARY KEY,
        embedding REAL NOT NULL,
        skill_name VARCHAR(50) NOT NULL
    );

CREATE TABLE
    IF NOT EXISTS jobs (
        job_id BIGINT PRIMARY KEY,
        max_salary REAL,
        med_salary REAL
    );

CREATE TABLE
    IF NOT EXISTS companies (
        company_id BIGINT PRIMARY KEY,
        company_name VARCHAR(10) NOT NULL,
        company_description VARCHAR(2048)
    );

CREATE TABLE
    IF NOT EXISTS postings (
        posting_id BIGINT PRIMARY KEY,
        posting_title VARCHAR(10) NOT NULL,
        posting_description VARCHAR(2048),
        job_id BIGINT NOT NULL,
        company_id BIGINT NOT NULL,
        FOREIGN KEY (job_id) REFERENCES jobs (job_id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (company_id) REFERENCES companies (company_id) ON DELETE CASCADE ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS posting_skills (
        posting_id BIGINT NOT NULL REFERENCES postings ON DELETE CASCADE ON UPDATE CASCADE,
        skill_abbr VARCHAR(10) NOT NULL REFERENCES skills ON DELETE CASCADE ON UPDATE CASCADE,
        PRIMARY KEY (skill_abbr, posting_id)
    );

CREATE TABLE
    IF NOT EXISTS user_skills (
        user_id BIGINT NOT NULL REFERENCES user_information ON DELETE CASCADE ON UPDATE CASCADE,
        skill_abbr VARCHAR(10) NOT NULL REFERENCES skills ON DELETE CASCADE ON UPDATE CASCADE,
        PRIMARY KEY (user_id, skill_abbr)
    );

-- CREATE TABLE IF NOT EXISTS submission_grading_context_embeddings (
--   id bigserial PRIMARY KEY,
--   embedding vector (1536) NOT NULL,
--   submission_id BIGINT NOT NULL REFERENCES submissions ON DELETE CASCADE ON UPDATE CASCADE,
--   submission_text text NOT NULL,
--   created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
--   assessment_question_id BIGINT NOT NULL REFERENCES assessment_questions ON DELETE CASCADE ON UPDATE CASCADE
-- );
-- CREATE UNIQUE INDEX IF NOT EXISTS submission_grading_context_embeddings_submission_id_idx ON submission_grading_context_embeddings (submission_id);
-- CREATE INDEX IF NOT EXISTS submission_grading_context_embeddings_assessment_question_id_idx ON submission_grading_context_embeddings (assessment_question_id);