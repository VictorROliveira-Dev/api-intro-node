import { randomUUID } from "crypto";
import { pool } from "./db.js";

export class DatabasePostgres {
  async list(search) {
    let videos;

    if (search) {
      // Usar placeholder para evitar erros e injeção de SQL
      // "ILIKE" é usado para buscas insensíveis a maiúsculas e minúsculas
      const query = `
            SELECT * FROM video
            WHERE title ILIKE $1
          `;
      const values = [`%${search}%`];
      const result = await pool.query(query, values);
      videos = result.rows;
    } else {
      const result = await pool.query("SELECT * FROM video");
      videos = result.rows;
    }

    return videos;
  }

  async create(video) {
    const videoId = randomUUID(); // Gera um UUID único
    const { title, description, duration } = video;

    // Usando placeholders para passar os valores
    const query = `
      INSERT INTO video (id, title, description, duration)
      VALUES ($1, $2, $3, $4)
    `;
    const values = [videoId, title, description, duration];

    await pool.query(query, values);
    console.log("Vídeo criado com sucesso!");
  }

  async update(id, video) {
    const { title, description, duration } = video;

    const query = `
        UPDATE video SET title = $2, description = $3, duration = $4
        WHERE id = $1
    `;

    const values = [id, title, description, duration];
    await pool.query(query, values);
    console.log("Vídeo atualizado com sucesso!");
  }

  async delete(id) {
    const query = `
            DELETE FROM video WHERE id = $1
        `;

    const value = [id];

    try {
      const result = await pool.query(query, value);
      if (result.rowCount === 0) {
        console.log(`Nenhum vídeo encontrado com o ID: ${id}`);
      } else {
        console.log("Vídeo removido com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao remover o vídeo:", error.message);
      throw error; 
    }
  }
}
