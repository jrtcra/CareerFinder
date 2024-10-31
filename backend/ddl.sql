CREATE TABLE
    IF NOT EXISTS user_information (
        user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(20) NOT NULL,
        password VARCHAR(50) NOT NULL,
        age INT NOT NULL,
        state VARCHAR(2) NOT NULL
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

CREATE INDEX posting_title_idx ON postings (posting_title);

CREATE INDEX company_name_idx ON companies (company_name);

CREATE INDEX user_age_idx ON user_information (age);
