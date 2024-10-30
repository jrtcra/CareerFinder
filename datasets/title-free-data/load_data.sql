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