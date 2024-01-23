import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";
import fs from 'fs';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const dataPath = './data/leads.json';

app.use(express.json());


httpServer.listen(5000, () => {
  console.log("listening on port 5000");
});

// API routes

app.get("/api", (req, res) => {
  const data = readFile();
  res.json(data);
});

app.post("/api", (req, res) => {
  const newData = req.body;

  const requiredFields = ["name", "company", "city", "state", "phoneNumber", "email"];

  if (newData["phoneNumber"].length < 8 || newData["phoneNumber"].length > 12)
    return res.status(400).json({ error: `Phone number have to be 8-12 digits` });

  for (const field of requiredFields) {
    if (!newData[field]) {
      return res.status(400).json({ error: `Missing ${field} field in request body` });
    }
  }

  const data = readFile();

  data.push(newData);
  writeFile(data);
  io.emit("newData", newData);
  res.status(201).json(data);
});

function readFile() {
  try {
    const data = fs.readFileSync(dataPath);
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function writeFile(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}
