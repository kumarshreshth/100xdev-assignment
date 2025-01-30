import express from "express";
import fs from "fs";

const app = express();
const filePath = "todo.json";

function readFile(file) {
  try {
    const fileContent = fs.readFileSync(file, "utf-8");
    return [0, JSON.parse(fileContent)];
  } catch (error) {
    const message = `Cannot able read the file ${error}`;
    return [1, message];
  }
}

function writeFile(file, data) {
  try {
    const fileContent = fs.writeFileSync(
      file,
      JSON.stringify(data, null, 2),
      "utf-8"
    );
    return "data is successfully added";
  } catch (error) {
    return `cannot able to write in the file ${error}`;
  }
}

app.use(express.json());

app.get("/", (request, response) => {
  const [status, res] = readFile(filePath);
  if (status == 0) {
    response.json(res);
  } else {
    response.send(res);
  }
});

app.post("/add", (request, response) => {
  const [status, res] = readFile(filePath);
  if (status == 0) {
    const data = request.body;
    res.push(data);
    const message = writeFile(filePath, res);
    response.send(message);
  } else {
    response.send(res);
  }
});

app.put("/update", (request, response) => {
  const [status, res] = readFile(filePath);
  if (status == 0) {
    const data = request.body;
    const index = res.findIndex((item) => item.id == data.id);
    if (index !== -1) {
      res[index]["task"] = data.task;
      writeFile(filePath, res);
      response.send("Data has been updated");
    } else {
      response.send(
        "Entered data cannot be updated as entered id doesnot exist in list"
      );
    }
  }
});

app.listen(3000);
