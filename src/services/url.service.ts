import pool from "../db/pool";
import { nanoid } from "nanoid";
import { isValidUrl } from "../utils/isValidUrl";
import ServiceError from "../utils/ServiceError";

interface UrlData {
  short_url: string; // Unique identifier for the short URL
  redirect_url: string; // The original URL
  visited_history: { timestamp: string }[] | null; // Array of timestamps or null
  created_at: string; // ISO string of the creation date
  updated_at: string; // ISO string of the last update date
}

class UrlService {
  // Find All Urls
  static async findMany(): Promise<UrlData[] | undefined> {
    try {
      const { rows } = await pool.query("SELECT * FROM url");
      return rows;
    } catch (error) {
      console.error("Error Fetching Url Data: " + error);
    }
  }

  // Find Single Url with short-url params
  static async findById(short_url: string): Promise<UrlData | undefined> {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM url WHERE short_url = $1",
        [short_url]
      );
      return rows[0]; // Return single URL data
    } catch (error) {
      console.error(
        `Error Fetching Url Data with short url ${short_url}: ` + error
      );
    }
  }

  // Create or Update Short Url
  static async insert(redirect_url: string): Promise<UrlData | undefined> {
    try {
      if (!isValidUrl(redirect_url)) {
        throw new Error("The Redirect Url is not a Valid Url");
      }

      const timestamp = new Date().toISOString();
      await pool.query("BEGIN");

      // Attempt to update if redirect_url exists
      const updateQuery = `
        UPDATE url
        SET 
          visited_history = COALESCE(ARRAY_APPEND(visited_history, ROW($1)::timevalue), ARRAY[ROW($1)::timevalue]),
          updated_at = NOW()
        WHERE redirect_url = $2
        RETURNING *;
      `;
      const result = await pool.query(updateQuery, [timestamp, redirect_url]);

      if (result.rowCount === 0) {
        // If no update occurred, insert a new record
        const short_url = nanoid(8);
        const insertQuery = `
          INSERT INTO url (short_url, redirect_url, visited_history) 
          VALUES ($1, $3, ARRAY[ROW($2)::timevalue])
          RETURNING *;
        `;
        const { rows } = await pool.query(insertQuery, [
          short_url,
          timestamp,
          redirect_url,
        ]);
        await pool.query("COMMIT");
        return rows[0];
      } else {
        await pool.query("COMMIT");
        return result.rows[0];
      }
    } catch (error) {
      await pool.query("ROLLBACK");
      console.error(
        `Error Inserting or Updating Url Data with Redirect url ${redirect_url}: ` +
          error
      );
      throw error;
    }
  }

  static async update(short_url: string): Promise<UrlData | undefined> {
    try {
      const timestamp = new Date().toISOString();
      await pool.query("BEGIN");
      const updateQuery = `
        UPDATE url 
        SET visited_history = COALESCE(ARRAY_APPEND(visited_history, ROW($2)::timevalue), ARRAY[ROW($2)::timevalue]),
        updated_at = NOW()
        WHERE short_url = $1
        RETURNING *;
      `;
      const { rows } = await pool.query(updateQuery, [short_url, timestamp]);
      await pool.query("COMMIT");
      return rows[0];
    } catch (error) {
      await pool.query("ROLLBACK");
      console.error("Error Updating Url: " + error);
      throw error;
    }
  }

  static async findAndUpdate(short_url: string): Promise<UrlData | undefined> {
    try {
      const urlData = await UrlService.findById(short_url);
      if (!urlData) {
        throw new Error(`URL with short_url ${short_url} not found`);
      }
      // Update Url
      const updatedUrl = await UrlService.update(short_url);
      return updatedUrl;
    } catch (error) {
      console.error(
        `Error Finding and Updating URL with short_url ${short_url}: ` + error
      );
      throw error;
    }
  }
}

export default UrlService;
