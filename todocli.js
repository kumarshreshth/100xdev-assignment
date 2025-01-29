import fs from "fs";
import { Command } from "commander";

const program = new Command();

//console.log(process.argv[2]);

const file = "todo.json";
const selectedCommand = process.argv[2];

function readFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.log("Cannot read the file ", error);
    return [];
  }
}

function writeFile(filePath, data, option) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    if (option == "add")
      console.log("Data has been added successfully in the file");
    if (option == "delete")
      console.log("Data has been deleted successfully from the file");
    if (option == "update") console.log("Data has been successfully updated");
  } catch (error) {
    console.log("Cannot write in the file ", error);
  }
}

program
  .command("add")
  .description("add the task to todo-list(cannot be empty)")
  .argument("<taskName>", "name of the task to be added")
  .action((taskName) => {
    if (taskName.trim() == "") {
      console.log(
        "Error: cannot take empty argument for more information use command- node todocli.js -h"
      );
      return;
    }
    const jsonData = readFile(file);
    const lastId =
      jsonData.length > 0
        ? parseInt(jsonData[jsonData.length - 1]["id"]) + 1
        : 1;
    const newData = {
      id: `${lastId}`,
      task: `${taskName}`,
    };

    jsonData.push(newData);

    writeFile(file, jsonData, selectedCommand);
  });

program
  .command("delete")
  .description("delete the task from todo-list")
  .argument("<taskName>", "name of the task to be deleted")
  .action((taskName) => {
    if (taskName.trim() == "") {
      console.log(
        "Error: cannot take empty argument for more information use command- node todocli.js -h"
      );
      return;
    }
    const jsonData = readFile(file);
    const task = taskName.replace(/\s+/g, "");
    const index = jsonData.findIndex(
      (item) => item.task.replace(/\s+/g, "") === task
    );

    if (index !== -1) {
      jsonData.splice(index, 1);
      writeFile(file, jsonData, selectedCommand);
    } else {
      console.log("Entered data doesnot exist in the list");
    }
  });

program
  .command("update")
  .description(
    "update the details of existing task in list takes two input arguments(both argument cannot be empty)"
  )
  .argument("<taskName>", "enter the task to be updated")
  .argument(
    "<taskNameUpdated>",
    "name of the task to which value must be changed to"
  )
  .action((taskName, taskNameUpdated) => {
    if (taskName.trim() == "" || taskNameUpdated.trim() == "") {
      console.log(
        "Error: cannot take empty argument for more information use command- node todocli.js -h"
      );
      return;
    }
    const jsonData = readFile(file);
    const task = taskName.replace(/\s+/g, "");
    const index = jsonData.findIndex(
      (item) => item.task.replace(/\s+/g, "") === task
    );

    if (index !== -1) {
      jsonData[index]["task"] = taskNameUpdated;
      writeFile(file, jsonData, selectedCommand);
    } else {
      console.log(
        "Entered task is not present in list so it cannot be updated"
      );
    }
  });

program.parse();
