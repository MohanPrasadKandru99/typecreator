import fsExtra from "fs-extra";
import { join } from "path";
import ts from "typescript";  // Import TypeScript for AST parsing

const { readFile, ensureDir, writeFile } = fsExtra;

/**
 * Extracts, categorizes, and migrates types from a given file using TypeScript parser.
 * @param {string} filename - Path to the input TypeScript file.
 * @param {string} newDir - Directory to migrate the types into.
 * @returns {Promise<{ count: number, types: { name: string, file: string }[] }>}
 */
export async function processTypes(filename, newDir) {
  try {
    // Read the input file content
    const fileContent = await readFile(filename, "utf-8");

    // Use TypeScript compiler API to parse the TypeScript code
    const sourceFile = ts.createSourceFile(filename, fileContent, ts.ScriptTarget.Latest, true);
    
    // Arrays to store types and enums
    const types = [];
    const enums = [];

    // Walk through the AST to extract types and enums
    ts.forEachChild(sourceFile, (node) => {
      if (ts.isTypeAliasDeclaration(node)) {
        const typeName = node.name.text;
        const typeContent = fileContent.substring(node.getStart(), node.getEnd());
        types.push({ name: typeName, content: typeContent });
      }
      if (ts.isEnumDeclaration(node)) {
        const enumName = node.name.text;
        const enumContent = fileContent.substring(node.getStart(), node.getEnd());
        enums.push({ name: enumName, content: enumContent });
      }
    });

    if (types.length === 0 && enums.length === 0) {
      throw new Error("No types or enums found in the provided file.");
    }

    const typeFiles = {};

    if (newDir) {
      // Ensure the directory exists
      await ensureDir(newDir);

      // Migrate enums into separate files with export statements
      for (const en of enums) {
        const filePath = join(newDir, `${en.name}.ts`);
        const enumContent = `export ${en.content}`;
        console.log(`Writing enum to: ${filePath}`);
        await writeFile(filePath, enumContent, "utf-8");
        typeFiles[en.name] = filePath;
      }

      // Migrate types into separate files with export statements
      for (const type of types) {
        const filePath = join(newDir, `${type.name}.ts`);
        let typeContent = `export ${type.content}`;

        // Add import statements for dependencies
        const dependencies = findDependencies(type.content, enums, types, type.name);
        if (dependencies.length > 0) {
          let importStatements = `import { ${dependencies.join(", ")} } from './${dependencies.join(".ts")}';\n`;
          typeContent = importStatements + typeContent;
        }

        // Debugging: Log the full content that is being written to the file
        console.log(`Writing type to: ${filePath}`);
        console.log(`Full type content for ${type.name}: \n${typeContent}`);

        // Write the file with the necessary imports and type content
        await writeFile(filePath, typeContent, "utf-8");
        typeFiles[type.name] = filePath;
      }
    }

    return { count: types.length + enums.length, types: typeFiles };
  } catch (error) {
    console.error(`Error during type processing: ${error.message}`);
    throw error;  // Rethrow the error to be caught by the caller
  }
}

/**
 * Finds dependencies for a given type content.
 * @param {string} content - Type content to find dependencies in.
 * @param {Array} allEnums - List of all available enums.
 * @param {Array} allTypes - List of all available types.
 * @param {string} currentType - The type we're currently processing (to avoid self-import).
 * @returns {Array} - List of dependency type names.
 */
function findDependencies(content, allEnums, allTypes, currentType) {
  const dependencies = [];

  // Check for references to types
  allTypes.forEach(type => {
    // Avoid self-import by checking the current type name
    if (content.includes(type.name) && type.name !== currentType) {
      dependencies.push(type.name);
    }
  });

  // Check for references to enums
  allEnums.forEach(en => {
    if (content.includes(en.name)) {
      dependencies.push(en.name);
    }
  });

  return dependencies;
}

export default { processTypes };


