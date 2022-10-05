import mysql from "mysql2";

export default class AppServices {

  private static dockerConnection: mysql.ConnectionOptions = {
    host: 'localhost',
    database: 'post_app',
    user: 'admin',
    password: 'admin',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    port: 3398
  }

  private static mysqlConnection: mysql.ConnectionOptions = {
    host: process.env.HOST,
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  }

  public static getConnection(): mysql.ConnectionOptions | undefined {
    if(process.env.NODE_ENV === 'development') return AppServices.dockerConnection;
    if(process.env.NODE_ENV === 'production') return AppServices.mysqlConnection;
  }
}