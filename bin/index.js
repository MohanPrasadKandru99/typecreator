#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import { processTypes } from "../lib/typeProcessor.js"; // Ensure the .js extension is included

const { green, blue, red } = chalk;
const program = new Command();

program
  .name("typecreator")
  .description("CLI to dynamically process and migrate TypeScript types")
  .version("1.0.0");

program
  .command("create <filename>")
  .option("--migrate <newDir>", "Migrate types to the specified directory")
  .option("--overwrite", "Overwrite existing files")
  .description("Create and migrate TypeScript types")
  .action(async (filename, options) => {
    const { migrate, overwrite = false } = options;

    // Validate the output directory path
    if (!migrate) {
      console.error(red("Error: Please specify the output directory with --migrate"));
      return;
    }

    // Check if the output directory exists
    const outputDir = path.resolve(migrate);
    const typesDirExists = await fs.pathExists(outputDir);

    // If the directory doesn't exist, create it
    if (!typesDirExists) {
      console.log(green(`Creating directory: ${outputDir}`));
      await fs.ensureDir(outputDir);
    }

    // Check for existing files in the output directory before processing
    const filesToCheck = ["Employees.ts", "Departments.ts"];
    let skipFiles = [];

    for (let fileName of filesToCheck) {
      const filePath = path.join(outputDir, fileName);
      const fileExists = await fs.pathExists(filePath);

      if (fileExists && !overwrite) {
        skipFiles.push(fileName);
      }
    }

    if (skipFiles.length > 0) {
      console.log(red(`The following files already exist and will not be overwritten: ${skipFiles.join(", ")}`));
      if (!overwrite) {
        return; // Exit the process if no overwrite is allowed
      }
    }

    // Proceed with type processing
    try {
      const { count, types } = await processTypes(filename, migrate);

      console.log(green(`Processed ${count} types.`));
      Object.entries(types).forEach(([name, file]) => {
        console.log(blue(`- ${name}: ${file}`));
      });
    } catch (err) {
      console.error(red(`Error: ${err.message}`));
    }
  });

program.parse(process.argv);
