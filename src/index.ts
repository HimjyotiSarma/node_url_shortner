import dotenv from "dotenv";
import pool from "./db/pool";
import app from "./app";
import { error } from "console";

dotenv.config({
  path: "./.env",
});

pool
  .connect({
    host: "localhost",
    port: 5432,
    database: "url_shortner",
    user: "postgres",
    password: "Him_Postgre_DB",
  })
  .then(() => {
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log(`Server is Listening at Port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
