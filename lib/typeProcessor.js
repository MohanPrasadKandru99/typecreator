import fsExtra from "fs-extra";
import { join } from "path";
import ts from "typescript";

const { readFile, ensureDir, writeFile } = fsExtra;

/**
 * Process and migrate types from a TypeScript file to another directory.
 * @param {string} filename - Path to the input TypeScript file.
 * @param {string} newDir - Directory to migrate the types into.
 * @returns {Promise<{ count: number, types: { name: string, file: string }[] }>} 
 */
export async function processTypes(filename, newDir) {
  try {
    const fileContent = await readFile(filename, "utf-8");
    const sourceFile = ts.createSourceFile(filename, fileContent, ts.ScriptTarget.Latest, true);

    const types = [];
    const enums = [];
    const interfaces = [];

    ts.forEachChild(sourceFile, (node) => {
      const start = node.getStart();
      const end = node.getEnd();
      const content = fileContent.substring(start, end);

      if (ts.isTypeAliasDeclaration(node)) {
        const typeName = node.name.text;
        types.push({ name: typeName, content, isExported: isExported(node) });
      }
      if (ts.isEnumDeclaration(node)) {
        const enumName = node.name.text;
        enums.push({ name: enumName, content, isExported: isExported(node) });
      }
      if (ts.isInterfaceDeclaration(node)) {
        const interfaceName = node.name.text;
        interfaces.push({ name: interfaceName, content, isExported: isExported(node) });
      }
    });

    if (types.length === 0 && enums.length === 0 && interfaces.length === 0) {
      throw new Error("No types, enums, or interfaces found.");
    }

    const typeFiles = {};

    if (newDir) {
      await ensureDir(newDir);

      // Migrate enums
      for (const en of enums) {
        const filePath = join(newDir, `${en.name}.ts`);
        const enumContent = formatExport(en.content, en.isExported);
        await writeFile(filePath, enumContent, "utf-8");
        typeFiles[en.name] = filePath;
      }

      // Migrate types
      for (const type of types) {
        const filePath = join(newDir, `${type.name}.ts`);
        const dependencies = findDependencies(type.content, enums, types, interfaces, type.name);
        const importStatements = generateImportStatements(dependencies);
        const typeContent = `${importStatements}${formatExport(type.content, type.isExported)}`;
        await writeFile(filePath, typeContent, "utf-8");
        typeFiles[type.name] = filePath;
      }

      // Migrate interfaces
      for (const iface of interfaces) {
        const filePath = join(newDir, `${iface.name}.ts`);
        const dependencies = findDependencies(iface.content, enums, types, interfaces, iface.name);
        const importStatements = generateImportStatements(dependencies);
        const interfaceContent = `${importStatements}${formatExport(iface.content, iface.isExported)}`;
        await writeFile(filePath, interfaceContent, "utf-8");
        typeFiles[iface.name] = filePath;
      }
    }

    return { count: types.length + enums.length + interfaces.length, types: typeFiles };
  } catch (error) {
    console.error(`Error during type processing: ${error.message}`);
    throw error;
  }
}

/**
 * Checks if a node has an export modifier.
 * @param {ts.Node} node - TypeScript AST node.
 * @returns {boolean} - True if the node is exported.
 */
function isExported(node) {
  return (
    node.modifiers?.some(
      (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword
    ) ?? false
  );
}

/**
 * Formats content with an export statement if not already exported.
 * @param {string} content - Content to format.
 * @param {boolean} isExported - Whether the content is already exported.
 * @returns {string} - Properly formatted content.
 */
function formatExport(content, isExported) {
  return isExported ? content : `export ${content}`;
}

/**
 * Finds dependencies for a given content.
 * @param {string} content - Content to find dependencies in.
 * @param {Array} allEnums - List of all enums.
 * @param {Array} allTypes - List of all types.
 * @param {Array} allInterfaces - List of all interfaces.
 * @param {string} currentName - The current item being processed to avoid self-import.
 * @returns {Array} - List of dependency names.
 */
function findDependencies(content, allEnums, allTypes, allInterfaces, currentName) {
  const dependencies = [];

  allTypes.forEach(type => {
    if (content.includes(type.name) && type.name !== currentName) {
      dependencies.push(type.name);
    }
  });

  allEnums.forEach(en => {
    if (content.includes(en.name)) {
      dependencies.push(en.name);
    }
  });

  allInterfaces.forEach(iface => {
    if (content.includes(iface.name) && iface.name !== currentName) {
      dependencies.push(iface.name);
    }
  });

  return dependencies;
}

/**
 * Generates import statements for a list of dependencies.
 * @param {Array} dependencies - List of dependency names.
 * @returns {string} - Import statements.
 */
function generateImportStatements(dependencies) {
  if (dependencies.length === 0) return "";

  let importStatements = "";

  dependencies.forEach((dependency) => {
    // All dependencies are in the same directory, so we import directly
    importStatements += `import { ${dependency} } from './${dependency}';\n`;
  });

  return importStatements;
}

export default { processTypes };
