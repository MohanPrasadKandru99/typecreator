import fs from "fs-extra";
import path from "path";
import { processTypes } from "../lib/typeProcessor.js";

jest.mock("fs-extra");

const mockFileContent = `
export enum Departments { HR, IT, Finance }
export type Employees = {
  id: number;
  name: string;
  department: Departments;
};
`;

describe("processTypes", () => {
  const mockFilename = "input.ts";
  const mockNewDir = "output";
  const mockFilesToSkip = new Set([
    path.join(mockNewDir, "Departments.ts"),
  ]);

  beforeEach(() => {
    jest.clearAllMocks();
    fs.readFile.mockResolvedValue(mockFileContent);
    fs.ensureDir.mockResolvedValue();
    fs.writeFile.mockResolvedValue();
  });

  it("should process types correctly when no files exist", async () => {
    fs.pathExists.mockResolvedValue(false); // No files exist

    const result = await processTypes(mockFilename, mockNewDir);

    expect(fs.ensureDir).toHaveBeenCalledWith(mockNewDir);
    expect(fs.writeFile).toHaveBeenCalledTimes(2); // Both files are written
    expect(fs.writeFile).toHaveBeenCalledWith(
      path.join(mockNewDir, "Departments.ts"),
      expect.any(String),
      "utf-8"
    );
    expect(fs.writeFile).toHaveBeenCalledWith(
      path.join(mockNewDir, "Employees.ts"),
      expect.any(String),
      "utf-8"
    );
    expect(result.count).toBe(2); // Two types processed
  });

  it("should overwrite existing files if --overwrite is passed", async () => {
    fs.pathExists.mockResolvedValue(true); // Files already exist

    const result = await processTypes(mockFilename, mockNewDir, { overwrite: true });

    expect(fs.ensureDir).toHaveBeenCalledWith(mockNewDir);
    expect(fs.writeFile).toHaveBeenCalledTimes(2); // Both files are overwritten
    expect(fs.writeFile).toHaveBeenCalledWith(
      path.join(mockNewDir, "Departments.ts"),
      expect.any(String),
      "utf-8"
    );
    expect(fs.writeFile).toHaveBeenCalledWith(
      path.join(mockNewDir, "Employees.ts"),
      expect.any(String),
      "utf-8"
    );
    expect(result.count).toBe(2); // Two types processed
  });  

  it("should throw an error if no types or enums are found", async () => {
    fs.readFile.mockResolvedValue("");

    await expect(processTypes(mockFilename, mockNewDir)).rejects.toThrow(
      "No types or enums found in the provided file."
    );

    expect(fs.ensureDir).not.toHaveBeenCalled();
    expect(fs.writeFile).not.toHaveBeenCalled();
  });

  it("should correctly handle dependencies between types", async () => {
    const complexContent = `
      export enum Status { Active, Inactive }
      export type User = {
        id: number;
        status: Status;
      };
    `;
    fs.readFile.mockResolvedValue(complexContent);

    const result = await processTypes(mockFilename, mockNewDir);

    expect(fs.ensureDir).toHaveBeenCalledWith(mockNewDir);
    expect(fs.writeFile).toHaveBeenCalledWith(
      path.join(mockNewDir, "Status.ts"),
      expect.stringContaining("export enum Status { Active, Inactive }"),
      "utf-8"
    );
    expect(fs.writeFile).toHaveBeenCalledWith(
      path.join(mockNewDir, "User.ts"),
      expect.stringContaining("import { Status } from './Status';"),
      "utf-8"
    );
    expect(result.count).toBe(2); // Two types processed
  });
});
