#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import { processTypes } from "../lib/typeProcessor.js";

const { green, blue, red } = chalk;
const program = new Command();

program
  .name("typecreator")
  .description("CLI to dynamically process and migrate TypeScript types, enums, and interfaces")
  .version("1.0.0");

program
  .command("create <filename>")
  .option("--migrate <newDir>", "Migrate types to the specified directory")
  .option("--overwrite", "Overwrite existing files")
  .description("Create and migrate TypeScript types")
  .action(async (filename, options) => {
    const { migrate, overwrite = false } = options;

    if (!migrate) {
      console.error(red("Error: Please specify the output directory with --migrate"));
      return;
    }

    const outputDir = path.resolve(migrate);

    try {
      // Check or create the output directory
      if (!(await fs.pathExists(outputDir))) {
        console.log(green(`Creating directory: ${outputDir}`));
        await fs.ensureDir(outputDir);
      }

      // Check existing files and handle overwrite logic
      const existingFiles = await fs.readdir(outputDir);
      const conflicts = existingFiles.filter(file => file.endsWith(".ts"));

      if (conflicts.length > 0 && !overwrite) {
        console.log(red("The following files already exist and will not be overwritten:"));
        conflicts.forEach(file => console.log(red(`- ${file}`)));
        return;
      }

      if (conflicts.length > 0 && overwrite) {
        console.log(green("Overwriting the following files:"));
        conflicts.forEach(file => console.log(green(`- ${file}`)));
      }

      // Proceed with type processing
      const { count, types } = await processTypes(filename, migrate);

      console.log(green(`Processed ${count} items (types, enums, interfaces).`));
      Object.entries(types).forEach(([name, file]) => {
        console.log(blue(`- ${name}: ${file}`));
      });
    } catch (err) {
      console.error(red(`Error: ${err.message}`));
    }
  });

program.parse(process.argv);
