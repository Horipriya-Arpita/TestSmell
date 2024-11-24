// import fs from 'fs/promises';
// import path from 'path';
// import { OpenAI } from 'openai';
// import dotenv from 'dotenv';
// import { encoding_for_model } from 'tiktoken';

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

import fs from 'fs/promises';
import path from 'path';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import { encoding_for_model } from 'tiktoken';

// Initialize tokenizer for GPT-4
const tokenizer = encoding_for_model('gpt-4');

// Function to estimate token count
const estimateTokens = (text: string): number => tokenizer.encode(text).length;

dotenv.config();

if (!process.env.OPENAI_API_KEYY) {
    console.error("Error: Missing OPENAI_API_KEY environment variable.");
    process.exit(1);
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEYY });

interface TestMethod {
    name: string;
    body: string;
}

interface TestFile {
    file: string;
    methods: TestMethod[];
}

interface SmellDetection {
    Name: string;
    Status: string;
}

interface TestMethodAnalysis {
    name: string;
    Smells: SmellDetection[];
}

interface TestFileAnalysis {
    file: string;
    methods: TestMethodAnalysis[];
}

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

async function preprocessInput(filePath: string): Promise<TestFile[]> {
    const rawData = await fs.readFile(filePath, 'utf-8');
    const testFiles: TestFile[] = JSON.parse(rawData);

    // Trim method bodies to a maximum length to save tokens
    return testFiles.map(file => ({
        file: file.file,
        methods: file.methods.map(method => ({
            name: method.name,
            body: method.body.slice(0, 300), // Limit body to 300 characters
        })),
    }));
}

async function processBatch(batch: TestFile[], includeExamples: boolean): Promise<TestFileAnalysis[]> {
    const fileDetails = batch.map(testFile => ({
        file: testFile.file,
        methods: testFile.methods.map(method => ({
            name: method.name,
            body: method.body, // Include method body in the prompt
        })),
    }));

    // Examples of test smells
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

    // Construct the prompt
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
        console.log('Sending prompt to OpenAI:', prompt.slice(0, 1000), '...'); // Log a preview of the prompt
        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [{ role: 'user', content: prompt }],
        });

        const content = response.choices[0].message?.content;

        // Validate JSON response
        if (!content || !isValidJson(content)) {
            throw new Error('Invalid JSON received from OpenAI');
        }

        const parsedResponse: any[] = JSON.parse(content);

        // Map the response to include method bodies and smells
    return parsedResponse.map(fileResult => ({
        file: fileResult.file,
        methods: fileResult.methods.map((methodResult: { name: string; Smells: any[]; }) => ({
            name: methodResult.name,
            body: batch
                .find(file => file.file === fileResult.file)
                ?.methods.find(method => method.name === methodResult.name)?.body || '',
            Smells: Array.isArray(methodResult.Smells)
                ? methodResult.Smells.map(smell => ({
                    Name: smell.Name,
                    Status: smell.Status,
                }))
                : [], // Fallback to empty array if Smells is missing
        })),
    }));
    } catch (error: any) {
        console.error('Error detecting smells in batch:', error);

        // Provide a fallback result with all smells marked as "Not Found"
        return batch.map(testFile => ({
            file: testFile.file,
            methods: testFile.methods.map(method => ({
                name: method.name,
                body: method.body,
                Smells: TEST_SMELLS.map(smell => ({ Name: smell, Status: 'Not Found' })),
            })),
        }));
    }
}

// Utility to check if a string is valid JSON
function isValidJson(content: string): boolean {
    try {
        JSON.parse(content);
        return true;
    } catch {
        return false;
    }
}


async function detectSmellsInBatches(testFiles: TestFile[]): Promise<TestFileAnalysis[]> {
    const BATCH_SIZE = 3000; // Token limit per batch
    const analyses: TestFileAnalysis[] = [];

    let currentBatch: TestFile[] = [];
    let currentBatchTokenCount = 0;
    let firstBatch = true;

    for (const testFile of testFiles) {

        const fileBatch: TestFile = { file: testFile.file, methods: [] };

        //console.log(JSON.stringify(fileBatch,null,2));
        //console.log("Initialized fileBatch:", JSON.stringify(fileBatch, null, 2));


        for (const method of testFile.methods) {
            const methodTokens = estimateTokens(JSON.stringify(method));

            // Check if adding this method exceeds the batch size
            if (currentBatchTokenCount + methodTokens > BATCH_SIZE) {

                // console.log("___________________Current Batch JSON:", JSON.stringify(currentBatch, null, 2));
                // console.log("___________________Current Batch Token Count:", currentBatchTokenCount);
                // console.log("___________________Current Method Tokens:", methodTokens);

                // Process the current batch
                analyses.push(...(await processBatch(currentBatch, firstBatch)));
                currentBatch = [];
                currentBatchTokenCount = 0;
                firstBatch = false; // Include examples only in the first batch
            }

            // Add the method to the file batch and increment the token count

            //console.log("___________________________Adding Method to FileBatch:", JSON.stringify(method, null, 2));
            
            fileBatch.methods.push(method);
            currentBatchTokenCount += methodTokens;
        }

        // Push the accumulated methods for the current file into the batch
        if (fileBatch.methods.length > 0) {
            currentBatch.push(fileBatch);
        }
    }

    // Process any remaining methods in the batch
    if (currentBatch.length > 0) {
        analyses.push(...(await processBatch(currentBatch, firstBatch)));
    }

    tokenizer.free(); // Free tokenizer resources
    return analyses;
    
}


async function main() {
    const inputFolder = path.join('output', 'test-methods-final');
    const outputFolder = path.join('output', 'test-smells');
    await fs.mkdir(outputFolder, { recursive: true });

    const fileName = process.argv[2];
    if (!fileName) {
        console.error("Error: Please provide the name of the input JSON file.");
        process.exit(1);
    }

    const inputFilePath = path.join(inputFolder, fileName);
    if (!(await fs.stat(inputFilePath).catch(() => false))) {
        console.error(`Error: Input file "${fileName}" not found in folder "${inputFolder}".`);
        process.exit(1);
    }

    const testFiles = await preprocessInput(inputFilePath);
    console.log(`Processing test file: ${fileName}`);

    //console.log(JSON.stringify(testFiles,null,2)); //____________
    
    const analyses = await detectSmellsInBatches(testFiles);

    const outputFilePath = path.join(outputFolder, `${path.basename(fileName, '.json')}-test-smells.json`);
    await fs.writeFile(outputFilePath, JSON.stringify(analyses, null, 2), 'utf-8');
    console.log(`Generated test smells report: ${outputFilePath}`);
}

function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

main().catch(error => {
    console.error('Error in test smells detection:', error);
});
