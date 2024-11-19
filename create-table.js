import dotenv from "dotenv";
import { pool } from "./db.js";

dotenv.config(); // Carrega variáveis de ambiente do arquivo .env

(async () => {
  try {
    await pool.query(`
      CREATE TABLE video ( 
          id TEXT PRIMARY KEY,
          title TEXT,
          description TEXT,
          duration INTEGER
      );
    `);
    console.log("Tabela criada!");
  } catch (error) {
    console.error("Erro ao criar a tabela:", error);
  } finally {
    pool.end(); // Fecha a conexão com o banco
  }
})();
