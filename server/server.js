import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";
import fs from 'fs';
import path from "path";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const dataFilePath ='./data/leads.json';
const leadsData = readFile()

app.use(express.json());


httpServer.listen(5000, () => {
  console.log("listening on port 5000");
});

// API routes
app.get("/api", (req, res) => {
  const page = req.query.page || 1; // Current page
  const itemsPerPage = 10;
  const startIndex = (page - 1) * itemsPerPage;

  // Fetch data from leads.json
  const data = leadsData.slice(startIndex, startIndex + itemsPerPage);

  res.json({
    data,
    totalPages: Math.ceil(leadsData.length / itemsPerPage),
    totalRows: leadsData.length
  });
});

app.post("/api", (req, res) => {
  const newData = req.body;

  // tests
  const requiredFields = ["name", "company", "city", "state", "phoneNumber", "email"];

  if (newData["phoneNumber"].length < 8 || newData["phoneNumber"].length > 12)
    return res.status(400).json({ error: `Phone number have to be 8-12 digits` });

  for (const field of requiredFields) {
    if (!newData[field]) {
      return res.status(400).json({ error: `Missing ${field} field in request body` });
    }
  }

  // push to local data
  leadsData.splice(0, 0, newData);

  // push data to leads.json
  writeFile(leadsData);
  io.emit("newData", newData);
  res.status(201).json(leadsData);
});


function readFile() {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function writeFile(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}
