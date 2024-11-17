CREATE DATABASE IF NOT EXISTS cs411;
USE cs411;

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

LOAD DATA INFILE '/var/lib/mysql-files/jobs_values.csv' 
INTO TABLE `jobs` 
COLUMNS TERMINATED BY ',' ENCLOSED BY '\"' 
LINES TERMINATED BY '\n' 
(job_id, @vmax_salary, @vmed_salary)
SET max_salary=NULLIF(@vmax_salary, ''),
med_salary=NULLIF(@vmed_salary,'');

LOAD DATA INFILE '/var/lib/mysql-files/users_values.csv' 
INTO TABLE `user_information` 
COLUMNS TERMINATED BY ',' ENCLOSED BY '\"' 
LINES TERMINATED BY '\n';

LOAD DATA INFILE '/var/lib/mysql-files/skills_values.csv' 
INTO TABLE `skills` 
COLUMNS TERMINATED BY ',' ENCLOSED BY '\"' 
LINES TERMINATED BY '\n' (skill_abbr, skill_name, embedding);

LOAD DATA INFILE '/var/lib/mysql-files/user_skills_values.csv' 
INTO TABLE `user_skills` 
COLUMNS TERMINATED BY ',' ENCLOSED BY '\"' 
LINES TERMINATED BY '\n';

LOAD DATA INFILE '/var/lib/mysql-files/companies_values.csv' 
INTO TABLE `companies` 
COLUMNS TERMINATED BY ',' ENCLOSED BY '\"' 
LINES TERMINATED BY '\n' 
(company_id, company_name, @company_description )
SET company_description=NULLIF(@company_description, '');

LOAD DATA INFILE '/var/lib/mysql-files/postings_values.csv' 
INTO TABLE `postings` 
COLUMNS TERMINATED BY ',' ENCLOSED BY '\"' 
LINES TERMINATED BY '\n' 
(posting_id,posting_title,@posting_description,job_id,company_id)
SET posting_description=NULLIF(@posting_description, '');

LOAD DATA INFILE '/var/lib/mysql-files/posting_skills_values.csv' 
INTO TABLE `posting_skills` 
COLUMNS TERMINATED BY ',' ENCLOSED BY '\"' 
LINES TERMINATED BY '\n';

-- CREATE USER 'StillThinking'@'%';
-- GRANT ALL PRIVILEGES ON *.* TO 'StillThinking'@'%';
-- FLUSH PRIVILEGES;
