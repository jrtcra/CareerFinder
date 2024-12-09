import mysql, { Connection, RowDataPacket } from "mysql2/promise";

export interface UserInformationType extends RowDataPacket {
  user_id: number;
  username: string;
  password: string;
  age: number;
  state: string;
}

export interface PopularSkillType extends RowDataPacket {
  skill_abbr: string;
  skill_name: string;
  usage_count: number;
}

export interface SkillAbbrType extends RowDataPacket {
  skill_abbr: string;
}

export interface MatchingPostingType extends RowDataPacket {
  posting_id: number;
  posting_title: string;
  company_name: string;
}

export interface SkillFrequencyType extends RowDataPacket {
  skill_abbr: string;
  skill_name: string;
  skill_count: number;
}

export interface PostingInformationType extends RowDataPacket {
  posting_id: number;
  posting_description: string;
  posting_title: string;
  company_name: string;
}

export interface JobDetailType extends RowDataPacket {
  posting_description: string;
  posting_title: string;
  company_name: string;
  company_description: string;
  med_salary: number;
}

export async function getPopularSkills(): Promise<PopularSkillType[]> {
  const connection = await connectToDatabase();

  const [rows] = await connection.query<PopularSkillType[]>(
    `SELECT skill_abbr, skill_name, usage_count 
     FROM skills 
     ORDER BY usage_count DESC 
     LIMIT 10`
  );
  
  return rows;
}

export async function performTransaction(
  userId: number
): Promise<{
  matchingPostings: MatchingPostingType[];
  commonSkills: SkillFrequencyType[];
}> {
  const connection = await connectToDatabase();

  try {
    await connection.execute("SET TRANSACTION ISOLATION LEVEL REPEATABLE READ");
    await connection.beginTransaction(); 
    // Query 1: Fetch matching job postings
    const [matchingPostings] = await connection.query<MatchingPostingType[]>(
      `
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
          us.user_id = ?
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
      `,
      [userId]
    );

    // Query 2 (Query 3 in last checkpoint): Fetch common skills for high-salary jobs
    const [commonSkills] = await connection.query<SkillFrequencyType[]>(
      `
      SELECT
          s.skill_abbr,
          s.skill_name,
          COUNT(ps.skill_abbr) AS skill_count
      FROM
          postings p
          JOIN jobs j ON p.job_id = j.job_id
          JOIN posting_skills ps ON p.posting_id = ps.posting_id
          JOIN skills s ON ps.skill_abbr = s.skill_abbr
      WHERE
          j.max_salary >= (
              SELECT
                  MIN(j1.max_salary)
              FROM
                  jobs j1
              WHERE
                  (
                      SELECT
                          COUNT(*)
                      FROM
                          jobs j2
                      WHERE
                          j2.max_salary > j1.max_salary
                  ) <= (
                      0.05 * (
                          SELECT
                              COUNT(*)
                          FROM
                              jobs
                      )
                  )
          )
      GROUP BY
          s.skill_abbr,
          s.skill_name
      ORDER BY
          skill_count DESC;
      `
    );

    await connection.commit();

    return { matchingPostings, commonSkills };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.end();
  }
}

export async function connectToDatabase(): Promise<Connection> {
  const connection = await mysql.createConnection({
    host: "mysql", // Use service name defined in docker-compose.yml
    user: "StillThinking", // MySQL username
    password: "password", // MySQL password
    database: "cs411", // Database name
  });

  return connection;
}

export async function verifyLogin(
  username: string,
  password: string
): Promise<UserInformationType[]> {
  const connection = await connectToDatabase();

  const [rows] = await connection.query<UserInformationType[]>(
    "SELECT * FROM user_information WHERE username = ? AND password = ?",
    [username, password]
  );

  return rows;
}

export async function getAllSkills(): Promise<SkillAbbrType[]> {
  const connection = await connectToDatabase();

  const [rows] = await connection.query<SkillAbbrType[]>(
    "SELECT skill_abbr FROM skills"
  );
  return rows;
}

export async function getUserSkills(user_id: number): Promise<SkillAbbrType[]> {
  const connection = await connectToDatabase();

  const [rows] = await connection.query<SkillAbbrType[]>(
    "SELECT skill_abbr FROM user_skills WHERE user_id = ?",
    [user_id]
  );
  return rows;
}

export async function addUserSkill(
  user_id: number,
  skill_abbr: string
): Promise<void> {
  const connection = await connectToDatabase();

  await connection.query(
    "INSERT INTO user_skills (user_id, skill_abbr) VALUES (?, ?)",
    [user_id, skill_abbr]
  );
}

export async function removeUserSkill(
  user_id: number,
  skill_abbr: string
): Promise<void> {
  const connection = await connectToDatabase();

  await connection.query(
    "DELETE FROM user_skills WHERE user_id = ? AND skill_abbr = ?",
    [user_id, skill_abbr]
  );
}

export async function updateUserPassword(
  userId: number,
  oldPassword: string,
  newPassword: string
): Promise<boolean> {
  const connection = await connectToDatabase();

  // First verify the old password
  const [rows] = await connection.query<UserInformationType[]>(
    "SELECT * FROM user_information WHERE user_id = ? AND password = ?",
    [userId, oldPassword]
  );

  if (rows.length === 0) {
    return false;
  }

  // Update the password
  await connection.query(
    "UPDATE user_information SET password = ? WHERE user_id = ?",
    [newPassword, userId]
  );

  return true;
}

export async function createUser(
  username: string,
  password: string,
  age: number,
  state: string
): Promise<boolean> {
  const connection = await connectToDatabase();

  // First check if username already exists
  const [existing] = await connection.query<UserInformationType[]>(
    "SELECT username FROM user_information WHERE username = ?",
    [username]
  );

  if (existing.length > 0) {
    return false;
  }

  // Create new user
  await connection.query(
    "INSERT INTO user_information (username, password, age, state) VALUES (?, ?, ?, ?)",
    [username, password, age, state]
  );

  return true;
}

export async function getMatchingJobs(
  user_id: number
): Promise<PostingInformationType[]> {
  const connection = await connectToDatabase();

  const [rows] = await connection.query<PostingInformationType[]>(
    "CALL GetMatchingPostings(?)",
    [user_id]
  );
  return rows;
}

export async function searchJobPosting(
  min_salary: number,
  max_salary: number
): Promise<PostingInformationType[]> {
  const connection = await connectToDatabase();

  const [rows] = await connection.query<PostingInformationType[]>(
    "CALL SearchForJobs(?, ?)",
    [min_salary, max_salary]
  );
  return rows;
}

export async function getPostingSkills(
  posting_id: number
): Promise<SkillAbbrType[]> {
  const connection = await connectToDatabase();

  const [rows] = await connection.query<SkillAbbrType[]>(
    "SELECT skill_abbr FROM posting_skills WHERE posting_id = ?",
    [posting_id]
  );
  return rows;
}

export async function getPostingDetail(
  posting_id: number
): Promise<JobDetailType[]> {
  const connection = await connectToDatabase();

  const [rows] = await connection.query<JobDetailType[]>(
    `SELECT p.posting_title, p.posting_description,c.company_name, c.company_description, j.med_salary
      FROM postings p JOIN jobs j ON p.job_id = j.job_id JOIN companies c ON c.company_id = p.company_id 
      WHERE p.posting_id = ?;`,
    [posting_id]
  );
  return rows;
}

