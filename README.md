
# **typecreator**  
[@official](https://github.com/MohanPrasadKandru99/typecreator)  

_A new dynamic type creator tool that processes and organizes TypeScript types seamlessly._  

`typecreator` is a Node.js command-line utility designed to simplify TypeScript type management. It reads a provided file, processes its contents, splits or migrates types into separate files, and reports the results—streamlining your workflow and enhancing code organization.

---

## **Why typecreator?**

Tired of cluttered TypeScript files? Want a structured and automated way to manage your types? `typecreator` is here to help. Whether you're managing a small project or a large-scale TypeScript codebase, this tool automates the tedious task of separating and migrating types, making your code cleaner and easier to maintain.

---

## **Features**

- 📂 **Dynamic Type Extraction**: Automatically identifies and extracts all types from a specified TypeScript file.
- 🚀 **Effortless Migration**: Moves each type into its own file under a directory of your choice using the `--migrate` option.
- 🔍 **Detailed Summaries**: Provides clear output, including:
  - Count of processed types.
  - Names and file paths of the migrated types.
- 🛡️ **Safe Operations**: Ensures existing files are not accidentally overwritten unless explicitly allowed.
- 🌟 **Simple and Intuitive**: Designed for developers to get started quickly and easily.

---

## **Installation**

Install `typecreator` globally via npm:  
```bash
npm install -g typecreator
```

---

## **Usage**

### **Basic Command**
```bash
typecreator create <filename> [options]
```

### **Example**
```bash
typecreator create types.ts --migrate ./output
```

### **Options**
- `--migrate <directory>`: Specify the directory where extracted types will be migrated.
- `--overwrite`: Allow overwriting of existing files if they already exist in the migration directory.

---

## **Example Workflow**

### Input File (`types.ts`):
```typescript
type Employee = {
  id: number;
  name: string;
  position: string;
};

type Department = {
  id: number;
  name: string;
  employees: Employee[];
};
```

### Command:
```bash
typecreator create types.ts --migrate ./output
```

### Output in Terminal:
```plaintext
Processed 2 types.
- Employee: ./output/Employee.ts
- Department: ./output/Department.ts
```

### Files in `./output` Directory:
- **`Employee.ts`**:
  ```typescript
  type Employee = {
    id: number;
    name: string;
    position: string;
  };
  ```
- **`Department.ts`**:
  ```typescript
  type Department = {
    id: number;
    name: string;
    employees: Employee[];
  };
  ```

---

## **Planned Features**
- Add support for **interfaces**.
- Enhanced regex to cover more TypeScript constructs.
- Introduce custom templates for generated files.
- Improved error handling and validations.
- Add automated testing for robust functionality.
- **Overwrite Option**: Ability to allow overwriting of existing files with the `--overwrite` flag to force migration even when files already exist in the target directory.

---

## **Contributing**

We welcome contributions! If you'd like to improve `typecreator`, feel free to fork the repo, submit pull requests, or open issues for bugs and feature suggestions.

---

## **Feedback**

Your feedback is crucial for us to improve. If you encounter any issues or have feature requests, please [open an issue](https://github.com/MohanPrasadKandru99/typecreator/issues).

---

## **License**

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## **Stay Updated**

Follow [@official](https://github.com/MohanPrasadKandru99/typecreator) for updates, new releases, and feature announcements.

---

## **Overwrite and Without Overwrite Scenarios**

### **1. Without Overwrite (Default Behavior)**
By default, `typecreator` prevents overwriting existing files in the destination directory to avoid accidental data loss.

#### Example:
```bash
typecreator create types.ts --migrate ./output
```
If the `Employee.ts` or `Department.ts` files already exist in the `./output` directory, the tool will not overwrite them. Instead, it will skip migrating those types and provide a warning.

---

### **2. With Overwrite Option**
If you want `typecreator` to overwrite existing files in the destination directory, you can use the `--overwrite` flag.

#### Example:
```bash
typecreator create types.ts --migrate ./output --overwrite
```
This will allow the tool to overwrite any existing `Employee.ts` or `Department.ts` files in the `./output` directory, ensuring the most recent type definitions are stored.
---

## **Use Cases**

### **1. Organizing a Large TypeScript Codebase**
When working on large projects, it's common to have multiple types in a single file, making it hard to manage and navigate. With `typecreator`, you can split these types into separate files effortlessly, improving readability and maintainability.  

**Scenario:**  
A file `types.ts` contains 50+ type definitions. Instead of manually copying and pasting each type into its file, you run:
```bash
typecreator create types.ts --migrate ./output
```
**Result:**  
Each type is moved to its own file in the `./output` directory.

---

### **2. Migrating Types for Modular Development**
When refactoring a project into a modular structure, separating types into domain-specific directories is crucial. `typecreator` simplifies this process by automating type migration.  

**Scenario:**  
You’re working on a `User Management` module and need to extract types into `src/modules/user/types`.  
```bash
typecreator create userTypes.ts --migrate src/modules/user/types
```
**Result:**  
All types from `userTypes.ts` are moved into the `src/modules/user/types` directory, keeping the module self-contained.

---

### **3. Cleaning Up Legacy Code**
Legacy projects often have TypeScript types scattered across multiple files without a consistent structure. `typecreator` helps you consolidate these types and restructure them for better organization.  

**Scenario:**  
You discover that several large files in your legacy project (`models.ts`, `entities.ts`) are difficult to maintain. By running:
```bash
typecreator create models.ts --migrate ./refactored/models
typecreator create entities.ts --migrate ./refactored/entities
```
**Result:**  
The tool extracts all types into the respective `./refactored` directories, leaving behind cleaner and more maintainable code.

---

### **4. Accelerating Onboarding for New Developers**
New developers often struggle to locate and understand TypeScript types in a cluttered codebase. By using `typecreator`, you can structure types into individual files, making it easier for new team members to find what they need quickly.  

**Scenario:**  
After organizing types using `typecreator`, you can point new hires to well-structured type directories, significantly reducing onboarding time.

---

### **5. Enforcing Consistency in File Structure**
In collaborative projects, ensuring consistent file organization is crucial. `typecreator` standardizes type definitions by extracting them into a single, consistent format and file structure.  

**Scenario:**  
Your team decides to enforce a rule where each type resides in its own file. Instead of manually refactoring, run:
```bash
typecreator create sharedTypes.ts --migrate ./types
```
**Result:**  
All types are separated into individual files in the `./types` directory, ensuring adherence to your team’s standards.

---

### **6. Preparing Types for Shared Libraries**
When creating a shared TypeScript library or package, having properly separated and modular type definitions is critical. `typecreator` makes it simple to extract and organize types for publishing.  

**Scenario:**  
You’re building a reusable package for a design system and need to extract types like `ButtonProps`, `Theme`, etc., into individual files:
```bash
typecreator create designTypes.ts --migrate ./lib/types
```
**Result:**  
All types are extracted and ready for packaging in the `./lib/types` directory.

---

### **7. Bulk Refactoring During Code Reviews**
During a code review, you notice a file overloaded with type definitions. Instead of manually separating them, use `typecreator` to automate the task, saving time and ensuring correctness.  

**Scenario:**  
While reviewing a file with 20+ types, run:
```bash
typecreator create reviewTypes.ts --migrate ./types
```
**Result:**  
You save hours of manual effort by quickly separating the types into manageable files.

---

### **8. Experimenting with New TypeScript Features**
`typecreator` can help you isolate type definitions for testing new TypeScript features without affecting your main project files.  

**Scenario:**  
You’re testing advanced TypeScript features like conditional types or mapped types. Extract existing types into a separate directory for experimentation:
```bash
typecreator create experimentalTypes.ts --migrate ./experiment
```
**Result:**  
Your experimental work remains isolated from the production codebase.

---

### **9. Managing Open Source Contributions**
In open source projects, maintaining a clean and consistent structure is key to encouraging contributions. `typecreator` helps organize types into a structure that contributors can easily understand and navigate.  

**Scenario:**  
You maintain an open-source project where types are getting unwieldy. Run:
```bash
typecreator create src/types/index.ts --migrate src/types
```
**Result:**  
Contributors can now focus on specific files instead of sifting through a monolithic file.

---

### **10. Automating Type Management in CI/CD**
Integrate `typecreator` into your CI/CD pipeline to enforce type structure automatically during builds or pre-merge checks.  

**Scenario:**  
Add a script to your `package.json`:
```json
"scripts": {
  "organize-types": "typecreator create src/types.ts --migrate src/types"
}
```
**Result:**  
Every build ensures that types are properly organized before deployment or merge.

---

Let me know if you'd like to refine or add more to these use cases!
