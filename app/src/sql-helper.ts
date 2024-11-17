import mysql, { Connection, RowDataPacket } from "mysql2/promise";

export interface UserInformationType extends RowDataPacket {
  user_id: number;
  username: string;
  password: string;
  age: number;
  state: string;
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
    `SELECT * FROM user_information WHERE username=? AND password=?`, 
    [username, password]
  );

  return rows;
}
