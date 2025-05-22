import { randomUUID } from "crypto";
import express from "express";
import fs from "fs";


const server = express();
const PORT = 8000;


server.use(express.json());


function readFile(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, "utf-8", (err, data) => {
      if (err) return reject(err);
      resolve(data ? JSON.parse(data) : []);
    });
  });
}
function writeFile(file, data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(file, JSON.stringify(data, null, 2), (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
  server.post("/logs/registros", async (request, response) => {
    const { name } = request.body;
  
  
    if (!name) {
      return response.status(400).json({ error: "Nome é obrigatório" });
    }
  
  
    const user = {
      id: randomUUID(),
      dateRequested: new Date().toISOString(),
      name,
    };
    try {
        const logs = await readFile("registros.txt");
        logs.push(user);
        await writeFile("registros.txt", logs);
    
    
        return response.status(201).json({
          message: "Registro criado com sucesso",
          user,
        });
      } catch (error) {
        console.error("Erro ao processar registro:", error);
        return response.status(500).json({ error: "Internal Server Error" });
      }
    });
    server.get("/logs/:id", async (request, response) => {
        const { id } = request.params;
      
      
        try {
          const logs = await readFile("logs.txt");
          const registros = await readFile("registros.txt");
      
      
          const logEncontrado = [...logs, ...registros].find((item) => item.id === id);
          if (!logEncontrado) {
            return response.status(404).json({ error: "ID não encontrado" });
          }
      
      
          return response.status(200).json(logEncontrado);
        } catch (error) {
          console.error("Erro ao buscar log:", error);
          return response.status(500).json({ error: "Internal Server Error" });
        }
      });
      
      
      server.listen(PORT, () => {
        console.log(` Server is running on http://localhost:${PORT}`);
      });
      
      
      