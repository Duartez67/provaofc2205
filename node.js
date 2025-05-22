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
    