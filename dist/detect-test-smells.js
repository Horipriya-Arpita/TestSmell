"use strict";
// import fs from 'fs/promises';
// import path from 'path';
// import { OpenAI } from 'openai';
// import dotenv from 'dotenv';
// import { encoding_for_model } from 'tiktoken';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// // Initialize tokenizer for GPT-4
// const tokenizer = encoding_for_model('gpt-4');
// // Function to estimate token count
// const estimateTokens = (text: string): number => tokenizer.encode(text).length;
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
// async function processBatch(batch: TestFile[], includeExamples: boolean): Promise<TestFileAnalysis[]> {
//     const fileDetails = batch.map(testFile => ({
//         file: testFile.file,
//         methods: testFile.methods.map(method => ({
//             name: method.name,
//             body: method.body, // Include the method body for context
//         })),
//     }));
//     const examples = `
// Example C# Test Smells:
// - Assertion Roulette: Unexplained assertions.
// - Conditional: Logic in tests.
// - Empty Test: No meaningful logic/assertions.
// - Obscure Setup: Confusing setup.
// - Duplicate Assert: Repeated assertions.
// - Lack of Cohesion: Irrelevant logic in tests.
// - Redundant Print: Unnecessary prints.
// - Sensitive Equality: Fragile equality checks.
// - Sleepy Test: Inefficiently slow tests.
// - Unknown: Uncategorized smells.
// - Constructor Initialization: Logic in the constructor.
// - Inappropriate Assertion: Misaligned assertions.
// - Eager Test: Premature checks.
// - Magic Number: Hard-coded values.
//     `;
//     const prompt = `
// You are a software testing expert. Analyze the following C# test methods and detect whether any of the following test smells are present:
// - ${TEST_SMELLS.join('\n- ')}
// ${includeExamples ? examples : ''}
// Provide the results for each method in this JSON format without any further explanation:
// [
//     "file": "IndexTest.cs",
//     "methods": [
//         {
//             "name": "Task",
//             "Smells": [
//                 { "Name": "Smell Name", "Status": "Found/Not Found" }
//             ]
//         }
//     ]
// ]
// # Test Files:
// ${JSON.stringify(fileDetails, null, 2)}`;
//     try {
//         const response = await openai.chat.completions.create({
//             model: 'gpt-4',
//             messages: [{ role: 'user', content: prompt }],
//         });
//         const content = response.choices[0].message?.content;
//         console.log(`Raw API response:`, content);
//         return JSON.parse(content || '[]');
//     } catch (error) {
//         console.error('Error detecting smells in batch:', error);
//         // Fallback response for the batch
//         return batch.map(testFile => ({
//             file: testFile.file,
//             methods: testFile.methods.map(method => ({
//                 name: method.name,
//                 body: method.body,
//                 Smells: TEST_SMELLS.map(smell => ({ Name: smell, Status: 'Not Found' })),
//             })),
//         }));
//     }
// }
// async function detectSmellsInBatches(testFiles: TestFile[]): Promise<TestFileAnalysis[]> {
//     const BATCH_SIZE = 6000; // Safe token threshold for batching
//     const analyses: TestFileAnalysis[] = [];
//     let currentBatch: TestFile[] = [];
//     let currentBatchTokenCount = 0;
//     let firstBatch = true; // Flag to include examples in the first batch
//     try {
//         for (const testFile of testFiles) {
//             const fileTokens = estimateTokens(JSON.stringify(testFile));
//             if (currentBatchTokenCount + fileTokens > BATCH_SIZE) {
//                 analyses.push(...(await processBatch(currentBatch, firstBatch)));
//                 currentBatch = [];
//                 currentBatchTokenCount = 0;
//                 firstBatch = false;
//             }
//             currentBatch.push(testFile);
//             currentBatchTokenCount += fileTokens;
//         }
//         if (currentBatch.length > 0) {
//             analyses.push(...(await processBatch(currentBatch, firstBatch)));
//         }
//     } finally {
//         // Ensure tokenizer resources are freed even in case of errors
//         tokenizer.free();
//     }
//     return analyses;
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
//     // Analyze files in batches
//     const analyses = await detectSmellsInBatches(testFiles);
//     const outputFilePath = path.join(outputFolder, `${path.basename(fileName, '.json')}-test-smells.json`);
//     await fs.writeFile(outputFilePath, JSON.stringify(analyses, null, 2), 'utf-8');
//     console.log(`Generated test smells report: ${outputFilePath}`);
// }
// main().catch(error => {
//     console.error('Error in test smells detection:', error);
// });
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const openai_1 = require("openai");
const dotenv_1 = __importDefault(require("dotenv"));
const tiktoken_1 = require("tiktoken");
// Initialize tokenizer for GPT-4
const tokenizer = (0, tiktoken_1.encoding_for_model)('gpt-4');
// Function to estimate token count
const estimateTokens = (text) => tokenizer.encode(text).length;
dotenv_1.default.config();
if (!process.env.OPENAI_API_KEYY) {
    console.error("Error: Missing OPENAI_API_KEY environment variable.");
    process.exit(1);
}
const openai = new openai_1.OpenAI({ apiKey: process.env.OPENAI_API_KEYY });
const TEST_SMELLS = [
    'Assertion Roulette Test Smell',
    'Conditional Test Smell',
    'Constructor Initialization Test Smell',
    'Duplicate Assert Test Smell',
    'Empty Test Smell',
    'Eager Test Smell',
    'Ignored Test Smell',
    'Lack of Cohesion Test Smell',
    'Magic Number Test Smell',
    'Obscure In-Line Setup Test Smell',
    'Redundant Assertion Test Smell',
    'Redundant Print Test Smell',
    'Sleepy Test Smell',
    'Sensitive Equality Test Smell',
    'Unknown Test Smell',
    'Inappropriate Assertion Test Smell',
];
function preprocessInput(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const rawData = yield promises_1.default.readFile(filePath, 'utf-8');
        const testFiles = JSON.parse(rawData);
        // Trim method bodies to a maximum length to save tokens
        return testFiles.map(file => ({
            file: file.file,
            methods: file.methods.map(method => ({
                name: method.name,
                body: method.body.slice(0, 300), // Limit body to 300 characters
            })),
        }));
    });
}
function processBatch(batch, includeExamples) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const fileDetails = batch.map(testFile => ({
            file: testFile.file,
            methods: testFile.methods.map(method => ({
                name: method.name,
            })),
        }));
        const examples = `Example C# Test Smells:
- Assertion Roulette: Unexplained assertions.
- Conditional: Logic in tests.
- Empty Test: No meaningful logic/assertions.
- Obscure Setup: Confusing setup.
- Duplicate Assert: Repeated assertions.
- Lack of Cohesion: Irrelevant logic in tests.
- Redundant Print: Unnecessary prints.
- Sensitive Equality: Fragile equality checks.
- Sleepy Test: Inefficiently slow tests.
- Unknown: Uncategorized smells.
- Constructor Initialization: Logic in the constructor.
- Inappropriate Assertion: Misaligned assertions.
- Eager Test: Premature checks.
- Magic Number: Hard-coded values.`;
        const prompt = `
You are a software testing expert. Analyze the following C# test methods and detect whether any of the following test smells are present:
- ${TEST_SMELLS.join('\n- ')}

${includeExamples ? examples : ''}

Output STRICTLY in the following JSON format:
[
    {
        "file": "filename.cs",
        "methods": [
            {
                "name": "methodName",
                "Smells": [
                    { "Name": "Smell Name", "Status": "Found/Not Found" }
                ]
            }
        ]
    }
]
Do not include any explanations, prefaces, or additional text. Output ONLY valid JSON.
# Test Files:
${JSON.stringify(fileDetails)}`;
        try {
            const response = yield openai.chat.completions.create({
                model: 'gpt-4',
                messages: [{ role: 'user', content: prompt }],
            });
            const content = (_a = response.choices[0].message) === null || _a === void 0 ? void 0 : _a.content;
            return JSON.parse(content || '[]');
        }
        catch (error) {
            console.error('Error detecting smells in batch:', error);
            // Retry on rate limits
            if (((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) === 429) {
                console.warn('Rate limit exceeded. Retrying...');
                yield delay(2000); // Wait 2 seconds before retrying
                return processBatch(batch, includeExamples);
            }
            // Fallback response for the batch
            return batch.map(testFile => ({
                file: testFile.file,
                methods: testFile.methods.map(method => ({
                    name: method.name,
                    Smells: TEST_SMELLS.map(smell => ({ Name: smell, Status: 'Not Found' })),
                })),
            }));
        }
    });
}
function detectSmellsInBatches(testFiles) {
    return __awaiter(this, void 0, void 0, function* () {
        const BATCH_SIZE = 3000; // Token limit per batch
        const analyses = [];
        let currentBatch = [];
        let currentBatchTokenCount = 0;
        let firstBatch = true;
        for (const testFile of testFiles) {
            const fileTokens = estimateTokens(JSON.stringify(testFile));
            if (currentBatchTokenCount + fileTokens > BATCH_SIZE) {
                analyses.push(...(yield processBatch(currentBatch, firstBatch)));
                currentBatch = [];
                currentBatchTokenCount = 0;
                firstBatch = false; // Include examples only in the first batch
            }
            currentBatch.push(testFile);
            currentBatchTokenCount += fileTokens;
        }
        if (currentBatch.length > 0) {
            analyses.push(...(yield processBatch(currentBatch, firstBatch)));
        }
        tokenizer.free(); // Free tokenizer resources
        return analyses;
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const inputFolder = path_1.default.join('output', 'test-methods-final');
        const outputFolder = path_1.default.join('output', 'test-smells');
        yield promises_1.default.mkdir(outputFolder, { recursive: true });
        const fileName = process.argv[2];
        if (!fileName) {
            console.error("Error: Please provide the name of the input JSON file.");
            process.exit(1);
        }
        const inputFilePath = path_1.default.join(inputFolder, fileName);
        if (!(yield promises_1.default.stat(inputFilePath).catch(() => false))) {
            console.error(`Error: Input file "${fileName}" not found in folder "${inputFolder}".`);
            process.exit(1);
        }
        const testFiles = yield preprocessInput(inputFilePath);
        console.log(`Processing test file: ${fileName}`);
        const analyses = yield detectSmellsInBatches(testFiles);
        const outputFilePath = path_1.default.join(outputFolder, `${path_1.default.basename(fileName, '.json')}-test-smells.json`);
        yield promises_1.default.writeFile(outputFilePath, JSON.stringify(analyses, null, 2), 'utf-8');
        console.log(`Generated test smells report: ${outputFilePath}`);
    });
}
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
main().catch(error => {
    console.error('Error in test smells detection:', error);
});
