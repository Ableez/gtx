// Generated by CodiumAI

import { fileToArrayBuffer } from "../utils/fileConverter";

jest.mock("fs");
describe("fileToArrayBuffer", () => {
  // Returns a Promise that resolves to an ArrayBuffer when given a valid File object.
  it("should resolve to an ArrayBuffer when given a valid File object", async () => {
    const file = new File(["test"], "test.txt");
    const result = await fileToArrayBuffer(file);
    expect(result).toBeInstanceOf(ArrayBuffer);
  });

  // Handles files of various sizes and types.
  it("should handle files of various sizes and types", async () => {
    const file1 = new File(["test"], "test.txt");
    const file2 = new File(["test"], "test.jpg");
    const file3 = new File(["test"], "test.pdf");
    const result1 = await fileToArrayBuffer(file1);
    const result2 = await fileToArrayBuffer(file2);
    const result3 = await fileToArrayBuffer(file3);
    expect(result1).toBeInstanceOf(ArrayBuffer);
    expect(result2).toBeInstanceOf(ArrayBuffer);
    expect(result3).toBeInstanceOf(ArrayBuffer);
  });

  // Handles files with non-ASCII characters in their names.
  it("should handle files with non-ASCII characters in their names", async () => {
    const file = new File(["test"], "テスト.txt");
    const result = await fileToArrayBuffer(file);
    expect(result).toBeInstanceOf(ArrayBuffer);
  });

  // Returns a rejected Promise when given an invalid File object.
  it("should return a rejected Promise when given an invalid File object", async () => {
    const file = null;
    await expect(fileToArrayBuffer(file!)).rejects.toThrow(
      new Error("Error converting file to ArrayBuffer")
    );
  });

  // Returns a rejected Promise when FileReader API is not supported.
  it("should return a rejected Promise when FileReader API is not supported", async () => {
    const originalFileReader = global.FileReader;
    global.FileReader = undefined!;
    const file = new File(["test"], "test.txt");
    await expect(fileToArrayBuffer(file)).rejects.toThrow(
      new Error("Error converting file to ArrayBuffer")
    );
    global.FileReader = originalFileReader;
  });
});
