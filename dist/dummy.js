"use strict";
// import fs from 'fs/promises';
// import path from 'path';
// import { OpenAI } from "openai";
// import dotenv from 'dotenv';
// dotenv.config();
// if (!process.env.OPENAI_API_KEYY) {
//     console.error("Error: Missing OPENAI_API_KEYY environment variable.");
//     process.exit(1);
// }
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEYY });
// interface TestMethod {
//     name: string;
//     body: string;
// }
// interface TestFile {
//     file: string;
//     methods: TestMethod[];
// }
// interface SmellDetection {
//     Name: string;
//     Status: string;
// }
// interface TestMethodAnalysis {
//     name: string;
//     body: string;
//     Smells: SmellDetection[];
// }
// interface TestFileAnalysis {
//     file: string;
//     methods: TestMethodAnalysis[];
// }
// const TEST_SMELLS = [
//     'Assertion Roulette Test Smell',
//     'Conditional Test Smell',
//     'Constructor Initialization Test Smell',
//     'Duplicate Assert Test Smell',
//     'Empty Test Smell',
//     'Eager Test Smell',
//     'Ignored Test Smell',
//     'Lack of Cohesion Test Smell',
//     'Magic Number Test Smell',
//     'Obscure In-Line Setup Test Smell',
//     'Redundant Assertion Test Smell',
//     'Redundant Print Test Smell',
//     'Sleepy Test Smell',
//     'Sensitive Equality Test Smell',
//     'Unknown Test Smell',
//     'Inappropriate Assertion Test Smell',
// ];
// async function detectSmellsInMethod(method: TestMethod): Promise<SmellDetection[]> {
//     if (!method.body || method.body.trim() === "") {
//         //console.warn(`Skipping method "${method.Name}" due to empty or undefined body.`);
//         return TEST_SMELLS.map(smell => ({ Name: smell, Status: 'Not Found' }));
//     }
//     const prompt = `
//     You are a software testing expert. Analyze the following C# test method and detect whether any of the following test smells are present:
//     - ${TEST_SMELLS.join('\n- ')}
//     Provide the results in this JSON format without any further explanation:
//     [
//     {
//         "Method": "Method Name",
//         "Smells": [
//             { "Name": "Smell Name", "Status": "Found/Not Found" }
//         ]
//     }
//     ]
//     Example C# Test Smells:
//     - Assertion Roulette: Multiple unexplained assertions.
//     - Conditional: Conditional logic in tests.
//     - Empty Test: Tests without meaningful logic or assertions.
//     - Obscure Setup: Confusing setup logic.
//     - Duplicate Assert: Multiple assertions in a single test.
//     - Lack of Cohesion: Irrelevant logic in tests.
//     - Redundant Print: Unnecessary print statements.
//     - Sensitive Equality: Fragile equality checks.
//     - Sleepy Test: Inefficiently slow tests.
//     - Unknown: Unclear or uncategorized smells.
//     - Constructor Initialization: Initialization in the constructor.
//     - Inappropriate Assertion: Assertions that don't align with objectives.
//     - Eager Test: Premature or unnecessary checks.
//     - Magic Number: Hard-coded unexplained values.
//     #Test Method:
//     \`\`\`csharp
//     ${method.body}
//     \`\`\``;
//     try {
//         const response = await openai.chat.completions.create({
//             model: 'gpt-4',
//             messages: [{ role: 'user', content: prompt }],
//         });
//         const content = response.choices[0].message?.content;
//         console.log(`Raw API response for method ${method.name}:`, content);
//         const smells: SmellDetection[] = JSON.parse(content || '[]');
//         return smells.map(smell => ({
//             Name: smell.Name,
//             Status: smell.Status === "Found" ? "Found" : "Not Found",
//         }));
//     } catch (error) {
//         console.error(`Error detecting smells in method ${method.name}:`, error);
//         return TEST_SMELLS.map(smell => ({ Name: smell, Status: 'Not Found' }));
//     }
// }
// async function processTestFile(testFile: TestFile): Promise<TestFileAnalysis> {
//     const methodsAnalysis: TestMethodAnalysis[] = [];
//     for (const methods of testFile.methods) {
//         console.log("Method name:", methods.name); // Use bracket notation if `Name` is a key
//         const smells = await detectSmellsInMethod(methods);
//         methodsAnalysis.push({
//             name: methods.name,
//             body: methods.body,
//             Smells: smells,
//         });
//     }
//     return {
//         file: testFile.file,
//         methods: methodsAnalysis,
//     };
// }
// async function main() {
//     const inputFolder = path.join('output', 'test-methods-final');
//     const outputFolder = path.join('output', 'test-smells');
//     await fs.mkdir(outputFolder, { recursive: true });
//     const files = await fs.readdir(inputFolder);
//     for (const file of files) {
//         if (!file.endsWith('.json')) continue;
//         const testFiles: TestFile[] = JSON.parse(await fs.readFile(path.join(inputFolder, file), 'utf-8'));
//         console.log(`Processing test file: ${file}`);
//         const analyses: TestFileAnalysis[] = [];
//         for (const testFile of testFiles) {
//             const analysis = await processTestFile(testFile);
//             analyses.push(analysis);
//         }
//         const outputFilePath = path.join(outputFolder, `${path.basename(file, '.json')}-test-smells.json`);
//         await fs.writeFile(outputFilePath, JSON.stringify(analyses, null, 2), 'utf-8');
//         console.log(`Generated test smells report: ${outputFilePath}`);
//     }
// }
// main().catch(error => {
//     console.error('Error in test smells detection:', error);
// });
// import fs from 'fs/promises';
// import path from 'path';
// import { OpenAI } from 'openai';
// import dotenv from 'dotenv';
// dotenv.config();
// if (!process.env.OPENAI_API_KEY) {
//     console.error("Error: Missing OPENAI_API_KEY environment variable.");
//     process.exit(1);
// }
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// interface TestMethod {
//     name: string;
//     body: string;
// }
// interface TestFile {
//     file: string;
//     methods: TestMethod[];
// }
// interface SmellDetection {
//     Name: string;
//     Status: string;
// }
// interface TestMethodAnalysis {
//     name: string;
//     body: string;
//     Smells: SmellDetection[];
// }
// interface TestFileAnalysis {
//     file: string;
//     methods: TestMethodAnalysis[];
// }
// const TEST_SMELLS = [
//     'Assertion Roulette Test Smell',
//     'Conditional Test Smell',
//     'Constructor Initialization Test Smell',
//     'Duplicate Assert Test Smell',
//     'Empty Test Smell',
//     'Eager Test Smell',
//     'Ignored Test Smell',
//     'Lack of Cohesion Test Smell',
//     'Magic Number Test Smell',
//     'Obscure In-Line Setup Test Smell',
//     'Redundant Assertion Test Smell',
//     'Redundant Print Test Smell',
//     'Sleepy Test Smell',
//     'Sensitive Equality Test Smell',
//     'Unknown Test Smell',
//     'Inappropriate Assertion Test Smell',
// ];
// async function detectSmellsInFile(testFile: TestFile): Promise<TestFileAnalysis> {
//     const methodsDetails = testFile.methods.map(method => ({
//         name: method.name,
//         body: method.body
//     }));
//     const fileDetail = {
//         file: testFile.file,
//         methods: methodsDetails
//     };
//     console.log(fileDetail);
//     const prompt = `
// You are a software testing expert. Analyze the following C# test methods and detect whether any of the following test smells are present:
// - ${TEST_SMELLS.join('\n- ')}
// Provide the results for each method in this JSON format without any further explanation::
// [
//     "file": "IndexTest.cs",
//     "methods": [
//       {
//         "name": "Task",
//         "Smells": [
//             { "Name": "Smell Name", "Status": "Found/Not Found" }
//         ]
//     }
// ]
// Example C# Test Smells:
// - Assertion Roulette: Multiple unexplained assertions.
// - Conditional: Conditional logic in tests.
// - Empty Test: Tests without meaningful logic or assertions.
// - Obscure Setup: Confusing setup logic.
// - Duplicate Assert: Multiple assertions in a single test.
// - Lack of Cohesion: Irrelevant logic in tests.
// - Redundant Print: Unnecessary print statements.
// - Sensitive Equality: Fragile equality checks.
// - Sleepy Test: Inefficiently slow tests.
// - Unknown: Unclear or uncategorized smells.
// - Constructor Initialization: Initialization in the constructor.
// - Inappropriate Assertion: Assertions that don't align with objectives.
// - Eager Test: Premature or unnecessary checks.
// - Magic Number: Hard-coded unexplained values.
// # Test Methods:
// ${fileDetail}`;
//     try {
//         const response = await openai.chat.completions.create({
//             model: 'gpt-4',
//             messages: [{ role: 'user', content: prompt }],
//         });
//         const content = response.choices[0].message?.content;
//         console.log(`Raw API response for file ${testFile.file}:`, content);
//         const methodsAnalysis: TestMethodAnalysis[] = JSON.parse(content || '[]').map((methodResult: any) => ({
//             name: methodResult.Method,
//             body: testFile.methods.find(method => method.name === methodResult.Method)?.body || '',
//             Smells: methodResult.Smells.map((smell: any) => ({
//                 Name: smell.Name,
//                 Status: smell.Status,
//             })),
//         }));
//         return { file: testFile.file, methods: methodsAnalysis };
//     } catch (error) {
//         console.error(`Error detecting smells in file ${testFile.file}:`, error);
//         return {
//             file: testFile.file,
//             methods: testFile.methods.map(method => ({
//                 name: method.name,
//                 body: method.body,
//                 Smells: TEST_SMELLS.map(smell => ({ Name: smell, Status: 'Not Found' })),
//             })),
//         };
//     }
// }
// async function main() {
//     const inputFolder = path.join('output', 'test-methods-final');
//     const outputFolder = path.join('output', 'test-smells');
//     await fs.mkdir(outputFolder, { recursive: true });
//     const fileName = process.argv[2];
//     if (!fileName) {
//         console.error("Error: Please provide the name of the input JSON file.");
//         process.exit(1);
//     }
//     const inputFilePath = path.join(inputFolder, fileName);
//     if (!(await fs.stat(inputFilePath).catch(() => false))) {
//         console.error(`Error: Input file "${fileName}" not found in folder "${inputFolder}".`);
//         process.exit(1);
//     }
//     const testFiles: TestFile[] = JSON.parse(await fs.readFile(inputFilePath, 'utf-8'));
//     console.log(`Processing test file: ${fileName}`);
//     const analyses: TestFileAnalysis[] = [];
//     for (const testFile of testFiles) {
//         const analysis = await detectSmellsInFile(testFile);
//         //analyses.push(analysis);
//     }
//     // Optionally log all file details
//     //console.log(JSON.stringify(fileDetails, null, 2));
//     const outputFilePath = path.join(outputFolder, `${path.basename(fileName, '.json')}-test-smells.json`);
//     await fs.writeFile(outputFilePath, JSON.stringify(analyses, null, 2), 'utf-8');
//     console.log(`Generated test smells report: ${outputFilePath}`);
// }
// main().catch(error => {
//     console.error('Error in test smells detection:', error);
// });
// import fs from 'fs/promises';
// import path from 'path';
// import { OpenAI } from 'openai';
// import dotenv from 'dotenv';
// dotenv.config();
// if (!process.env.OPENAI_API_KEYY) {
//     console.error("Error: Missing OPENAI_API_KEY environment variable.");
//     process.exit(1);
// }
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEYY });
// interface TestMethod {
//     name: string;
//     body: string;
// }
// interface TestFile {
//     file: string;
//     methods: TestMethod[];
// }
// interface SmellDetection {
//     Name: string;
//     Status: string;
// }
// interface TestMethodAnalysis {
//     name: string;
//     body: string;
//     Smells: SmellDetection[];
// }
// interface TestFileAnalysis {
//     file: string;
//     methods: TestMethodAnalysis[];
// }
// const TEST_SMELLS = [
//     'Assertion Roulette Test Smell',
//     'Conditional Test Smell',
//     'Constructor Initialization Test Smell',
//     'Duplicate Assert Test Smell',
//     'Empty Test Smell',
//     'Eager Test Smell',
//     'Ignored Test Smell',
//     'Lack of Cohesion Test Smell',
//     'Magic Number Test Smell',
//     'Obscure In-Line Setup Test Smell',
//     'Redundant Assertion Test Smell',
//     'Redundant Print Test Smell',
//     'Sleepy Test Smell',
//     'Sensitive Equality Test Smell',
//     'Unknown Test Smell',
//     'Inappropriate Assertion Test Smell',
// ];
// async function detectSmellsInFiles(testFiles: TestFile[]): Promise<TestFileAnalysis[]> {
//     // Create a JSON object to pass to the prompt
//     const fileDetails = testFiles.map(testFile => ({
//         file: testFile.file,
//         methods: testFile.methods.map(method => ({
//             name: method.name,
//             body: method.body, // Include the method body for context
//         })),
//     }));
//     const prompt = `
// You are a software testing expert. Analyze the following C# test methods and detect whether any of the following test smells are present:
// - ${TEST_SMELLS.join('\n- ')}
// Provide the results for each method in this JSON format without any further explanation:
// [
//   {
//     "file": "FileName.cs",
//     "methods": [
//       {
//         "name": "MethodName",
//         "Smells": [
//           { "Name": "Smell Name", "Status": "Found/Not Found" }
//         ]
//       }
//     ]
//   }
// ]
// Example C# Test Smells:
// - Assertion Roulette: Multiple unexplained assertions.
// - Conditional: Conditional logic in tests.
// - Empty Test: Tests without meaningful logic or assertions.
// - Obscure Setup: Confusing setup logic.
// - Duplicate Assert: Multiple assertions in a single test.
// - Lack of Cohesion: Irrelevant logic in tests.
// - Redundant Print: Unnecessary print statements.
// - Sensitive Equality: Fragile equality checks.
// - Sleepy Test: Inefficiently slow tests.
// - Unknown: Unclear or uncategorized smells.
// - Constructor Initialization: Initialization in the constructor.
// - Inappropriate Assertion: Assertions that don't align with objectives.
// - Eager Test: Premature or unnecessary checks.
// - Magic Number: Hard-coded unexplained values.
// # Test Files:
// ${JSON.stringify(fileDetails, null, 2)}`;
//     try {
//         const response = await openai.chat.completions.create({
//             model: 'gpt-4',
//             messages: [{ role: 'user', content: prompt }],
//         });
//         const content = response.choices[0].message?.content;
//         console.log(`Raw API response:`, content);
//         // Parse the response to extract the results
//         const analyses: TestFileAnalysis[] = JSON.parse(content || '[]');
//         return analyses;
//     } catch (error) {
//         console.error('Error detecting smells:', error);
//         // Default response in case of an error
//         return testFiles.map(testFile => ({
//             file: testFile.file,
//             methods: testFile.methods.map(method => ({
//                 name: method.name,
//                 body: method.body,
//                 Smells: TEST_SMELLS.map(smell => ({ Name: smell, Status: 'Not Found' })),
//             })),
//         }));
//     }
// }
// async function main() {
//     const inputFolder = path.join('output', 'test-methods-final');
//     const outputFolder = path.join('output', 'test-smells');
//     await fs.mkdir(outputFolder, { recursive: true });
//     const fileName = process.argv[2];
//     if (!fileName) {
//         console.error("Error: Please provide the name of the input JSON file.");
//         process.exit(1);
//     }
//     const inputFilePath = path.join(inputFolder, fileName);
//     if (!(await fs.stat(inputFilePath).catch(() => false))) {
//         console.error(`Error: Input file "${fileName}" not found in folder "${inputFolder}".`);
//         process.exit(1);
//     }
//     const testFiles: TestFile[] = JSON.parse(await fs.readFile(inputFilePath, 'utf-8'));
//     console.log(`Processing test file: ${fileName}`);
//     // Analyze all files in one API call
//     const analyses = await detectSmellsInFiles(testFiles);
//     const outputFilePath = path.join(outputFolder, `${path.basename(fileName, '.json')}-test-smells.json`);
//     await fs.writeFile(outputFilePath, JSON.stringify(analyses, null, 2), 'utf-8');
//     console.log(`Generated test smells report: ${outputFilePath}`);
// }
// main().catch(error => {
//     console.error('Error in test smells detection:', error);
// });
