import fs from "fs";
import { Command } from "commander";
const program = new Command();

program.option("-f, --filePath <type>", "enter the file path");

program.parse(process.argv);

const options = program.opts();
const file = options.filePath;

const fileContent = fs.readFileSync(`${file}`, "utf-8");

const words = fileContent.split(/[ \t\n\r.,;:!?(){}[\]"'-]+/);
//console.log(words);

let wordCount = 0;

for (let word of words) {
  //console.log(word);
  if (word.trim() !== "") {
    wordCount++;
  }
}

console.log(`You have ${wordCount} in this File`);
