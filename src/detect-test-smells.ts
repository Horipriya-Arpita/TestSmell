// import fs from 'fs/promises';
// import path from 'path';
// import { OpenAI } from "openai";
// import dotenv from 'dotenv';

// dotenv.config();

// console.log('API Key:', process.env.OPENAI_API_KEYY); // Remove this after debugging

// // const openai = new OpenAI({ apiKey: "sk-proj-AiBkfKRAhFWGx4cMB5KqT3BlbkFJrWTSYP0jyCO4HXKuhFUW" });
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEYY });


// interface TestMethod {
//     Name: string;
//     Body: string;
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
//     Name: string;
//     Body: string;
//     Smells: SmellDetection[];
// }

// interface TestFileAnalysis {
//     Name: string;
//     Message: string | null;
//     ProjectName: string;
//     Methods: TestMethodAnalysis[];
// }

// const TEST_SMELLS = [
//     'Assertion Roulette',
//     'Conditional Test Logic',
//     'Constructor Initialization',
//     'Duplicate Assert',
//     'Empty Test',
//     'Eager Test',
//     'Ignored Test',
//     'Lack of Cohesion',
//     'Magic Numbers',
//     'Obscure Setup',
//     'Redundant Assertions',
//     'Redundant Prints',
//     'Sleepy Test',
//     'Sensitive Equality',
//     'Dependent Tests',
//     'Mystery Guest',
//     'Inappropriate Assertion',
// ];

// async function detectSmellsInMethod(method: TestMethod): Promise<SmellDetection[]> {
//     const prompt = `
// Analyze the following C# test method for potential test smells. Identify whether any of the following smells are present: ${TEST_SMELLS.join(', ')}.

// ### Test Method:
// \`\`\`csharp
// ${method.Body}
// \`\`\`

// Respond in the following JSON format:
// [
//     { "Name": "Smell Name", "Status": "Found/Not Found" },
//     ...
// ]`;

//     try {
//         const response = await openai.chat.completions.create({
//             model: 'gpt-4',
//             messages: [{ role: 'user', content: prompt }],
//         });

//         const smells = JSON.parse(response.choices[0].message?.content || '[]');
//         return smells;
//     } catch (error) {
//         console.error(`Error detecting smells in method ${method.Name}:`, error);
//         return TEST_SMELLS.map(smell => ({ Name: smell, Status: 'Unknown' }));
//     }
// }

// async function processTestFile(testFile: TestFile, projectName: string): Promise<TestFileAnalysis> {
//     const methodsAnalysis: TestMethodAnalysis[] = [];

//     for (const method of testFile.methods) {
//         const smells = await detectSmellsInMethod(method);
//         methodsAnalysis.push({
//             Name: method.Name,
//             Body: method.Body,
//             Smells: smells,
//         });
//     }

//     return {
//         Name: path.basename(testFile.file, '.cs'),
//         Message: null,
//         ProjectName: projectName,
//         Methods: methodsAnalysis,
//     };
// }

// async function main() {
//     const inputFolder = path.join('output', 'test-methods');
//     const outputFolder = path.join('output', 'test-smells');
//     await fs.mkdir(outputFolder, { recursive: true });

//     const files = await fs.readdir(inputFolder);
//     for (const file of files) {
//         if (!file.endsWith('.json')) continue;

//         const projectName = path.basename(file, '-test-methods.json');
//         const testFiles: TestFile[] = JSON.parse(await fs.readFile(path.join(inputFolder, file), 'utf-8'));

//         const analyses: TestFileAnalysis[] = [];
//         for (const testFile of testFiles) {
//             const analysis = await processTestFile(testFile, projectName);
//             analyses.push(analysis);
//         }

//         const outputFilePath = path.join(outputFolder, `${projectName}-test-smells.json`);
//         await fs.writeFile(outputFilePath, JSON.stringify(analyses, null, 2), 'utf-8');
//         console.log(`Generated test smells report: ${outputFilePath}`);
//     }
// }

// main().catch(error => {
//     console.error('Error in test smells detection:', error);
// });
// import fs from 'fs/promises';
// import path from 'path';
// import { OpenAI } from "openai";
// import dotenv from 'dotenv';

// dotenv.config();

// // Validate API key
// if (!process.env.OPENAI_API_KEYY) {
//     console.error("Error: Missing OPENAI_API_KEYY environment variable.");
//     process.exit(1);
// }

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEYY });

// interface TestMethod {
//     Name: string;
//     Body: string;
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
//     Name: string;
//     Body: string;
//     Smells?: SmellDetection[];
// }

// interface TestFileAnalysis {
//     Name: string;
//     Message: string | null;
//     ProjectName: string;
//     Methods: TestMethodAnalysis[];
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
//     if (!method.Body || method.Body.trim() === "") {
//         console.warn(`Skipping method "${method.Name}" due to empty or undefined body.`);
//         return [];  // Return empty smells list if no body
//     }

//     const prompt = `
// You are a software testing expert. Analyze the following C# test method and detect whether any of the following test smells are present:
// - ${TEST_SMELLS.join('\n- ')}

// Provide the results in this JSON format:
// [
//     { "Name": "Smell Name", "Status": "Found/Not Found" }
// ]

// ### Example C# Test Smells:
// 1. **Assertion Roulette Test Smell**: Occurs when a test contains many assertions without any explanation of what each one checks.
// 2. **Conditional Test Smell**: Conditional statements in test cases that can lead to skipped parts of the test.
// 3. **Empty Test Smell**: A test method without any assertions or logic.
// 4. **Obscure In-Line Setup Test Smell**: Complex or unclear setup logic directly in the test body.
// 5. **Duplicate Assert Test Smell**: More than one assertion within a single test.
// 6. **Lack of Cohesion Test Smell**: A test method that contains logic unrelated to the overall system behavior.
// 7. **Redundant Print Test Smell**: Use of print statements that don’t provide relevant information or are not checked within the test.
// 8. **Sensitive Equality Test Smell**: Using equality checks that could be sensitive to data types or precision issues.
// 9. **Sleepy Test Smell**: A test that runs unnecessarily slowly due to inefficient setup or checks.
// 10. **Unknown Test Smell**: A smell that is not easily categorized or understood within the system.
// 11. **Constructor Initialization Test Smell**: Dependencies or data being initialized directly in the constructor rather than the test setup.
// 12. **Empty Test Smell**: No meaningful assertions or verification within the test.
// 13. **Inappropriate Assertion Test Smell**: Assertions that don't logically fit with the test or the method's objective.
// 14. **Eager Test Smell**: A test that verifies operations that are premature or not significant to the system behavior.
// 15. **Magic Number Test Smell**: Hard-coded values or constants used without explanation or context.
// 16. **Obscure Setup Test Smell**: Confusing or overly complex setup logic that doesn’t enhance test clarity.

// ### Test Method:
// \`\`\`csharp
// ${method.Body}
// \`\`\``;

//     try {
//         const response = await openai.chat.completions.create({
//             model: 'gpt-4',
//             messages: [{ role: 'user', content: prompt }],
//         });

//         const content = response.choices[0].message?.content;

//         // Debug: Log raw response content
//         console.log(`Raw API response for method ${method.Name}:`, content);

//         // Attempt to parse the response content as JSON
//         const smells: SmellDetection[] = JSON.parse(content || '[]');

//         // Ensure proper status values
//         return smells.map(smell => ({
//             Name: smell.Name,
//             Status: smell.Status === "Found" ? "Found" : "Not Found",
//         }));
//     } catch (error) {
//         console.error(`Error detecting smells in method ${method.Name}:`, error);

//         // Return an empty list of smells if an error occurs
//         return [];
//     }
// }

// async function processTestFile(testFile: TestFile, projectName: string): Promise<TestFileAnalysis> {
//     const methodsAnalysis: TestMethodAnalysis[] = [];

//     for (const method of testFile.methods) {
//         console.log(`Analyzing method: ${method.Name}`);

//         const smells = await detectSmellsInMethod(method);

//         // Only include Smells if the method has a body
//         const methodAnalysis: TestMethodAnalysis = {
//             Name: method.Name,
//             Body: method.Body,
//         };

//         if (smells.length > 0) {
//             methodAnalysis.Smells = smells;  // Include Smells only if detected
//         }

//         methodsAnalysis.push(methodAnalysis);
//     }

//     return {
//         Name: path.basename(testFile.file, '.cs'),
//         Message: null,
//         ProjectName: projectName,
//         Methods: methodsAnalysis,
//     };
// }

// async function main() {
//     const inputFolder = path.join('output', 'test-methods');
//     const outputFolder = path.join('output', 'test-smells');
//     await fs.mkdir(outputFolder, { recursive: true });

//     const files = await fs.readdir(inputFolder);
//     for (const file of files) {
//         if (!file.endsWith('.json')) continue;

//         const projectName = path.basename(file, '-test-methods.json');
//         const testFiles: TestFile[] = JSON.parse(await fs.readFile(path.join(inputFolder, file), 'utf-8'));

//         console.log(`Processing project "${projectName}" with ${testFiles.length} test files.`);

//         const analyses: TestFileAnalysis[] = [];
//         for (const testFile of testFiles) {
//             console.log(`Processing test file: ${testFile.file}`);
//             const analysis = await processTestFile(testFile, projectName);
//             analyses.push(analysis);
//         }

//         const outputFilePath = path.join(outputFolder, `${projectName}-test-smells.json`);
//         await fs.writeFile(outputFilePath, JSON.stringify(analyses, null, 2), 'utf-8');
//         console.log(`Generated test smells report: ${outputFilePath}`);
//     }
// }

// main().catch(error => {
//     console.error('Error in test smells detection:', error);
// });


// import fs from 'fs/promises';
// import path from 'path';
// import { OpenAI } from "openai";
// import dotenv from 'dotenv';

// dotenv.config();

// // Validate API key
// if (!process.env.OPENAI_API_KEYY) {
//     console.error("Error: Missing OPENAI_API_KEYY environment variable.");
//     process.exit(1);
// }

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEYY });

// interface TestMethod {
//     Name: string;
//     Body: string;
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
//     Name: string;
//     Body: string;
//     Smells: SmellDetection[];
// }

// interface TestFileAnalysis {
//     Name: string;
//     Message: string | null;
//     ProjectName: string;
//     Methods: TestMethodAnalysis[];
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
//     if (!method.Body || method.Body.trim() === "") {
//         console.warn(`Skipping method "${method.Name}" due to empty or undefined body.`);
//         return TEST_SMELLS.map(smell => ({ Name: smell, Status: 'Not Found' }));
//     }

//     const prompt = `
// You are a software testing expert. Analyze the following C# test method and detect whether any of the following test smells are present:
// - ${TEST_SMELLS.join('\n- ')}

// Provide the results in this JSON format:
// [
//     { "Name": "Smell Name", "Status": "Found/Not Found" }
// ]

// ### Example C# Test Smells:
// 1. **Assertion Roulette Test Smell**: Occurs when a test contains many assertions without any explanation of what each one checks.
// 2. **Conditional Test Smell**: Conditional statements in test cases that can lead to skipped parts of the test.
// 3. **Empty Test Smell**: A test method without any assertions or logic.
// 4. **Obscure In-Line Setup Test Smell**: Complex or unclear setup logic directly in the test body.
// 5. **Duplicate Assert Test Smell**: More than one assertion within a single test.
// 6. **Lack of Cohesion Test Smell**: A test method that contains logic unrelated to the overall system behavior.
// 7. **Redundant Print Test Smell**: Use of print statements that don’t provide relevant information or are not checked within the test.
// 8. **Sensitive Equality Test Smell**: Using equality checks that could be sensitive to data types or precision issues.
// 9. **Sleepy Test Smell**: A test that runs unnecessarily slowly due to inefficient setup or checks.
// 10. **Unknown Test Smell**: A smell that is not easily categorized or understood within the system.
// 11. **Constructor Initialization Test Smell**: Dependencies or data being initialized directly in the constructor rather than the test setup.
// 12. **Empty Test Smell**: No meaningful assertions or verification within the test.
// 13. **Inappropriate Assertion Test Smell**: Assertions that don't logically fit with the test or the method's objective.
// 14. **Eager Test Smell**: A test that verifies operations that are premature or not significant to the system behavior.
// 15. **Magic Number Test Smell**: Hard-coded values or constants used without explanation or context.
// 16. **Obscure Setup Test Smell**: Confusing or overly complex setup logic that doesn’t enhance test clarity.

// ### Test Method:
// \`\`\`csharp
// ${method.Body}
// \`\`\``;

//     try {
//         const response = await openai.chat.completions.create({
//             model: 'gpt-4',
//             messages: [{ role: 'user', content: prompt }],
//         });

//         const content = response.choices[0].message?.content;

//         // Debug: Log raw response content
//         console.log(`Raw API response for method ${method.Name}:`, content);

//         // Attempt to parse the response content as JSON
//         const smells: SmellDetection[] = JSON.parse(content || '[]');

//         // Ensure proper status values
//         return smells.map(smell => ({
//             Name: smell.Name,
//             Status: smell.Status === "Found" ? "Found" : "Not Found",
//         }));
//     } catch (error) {
//         console.error(`Error detecting smells in method ${method.Name}:`, error);

//         // Return "Not Found" for all smells in case of an error
//         return TEST_SMELLS.map(smell => ({ Name: smell, Status: 'Not Found' }));
//     }
// }

// async function processTestFile(testFile: TestFile, projectName: string): Promise<TestFileAnalysis> {
//     const methodsAnalysis: TestMethodAnalysis[] = [];

//     for (const method of testFile.methods) {
//         console.log(`Analyzing method: ${method.Name}`);

//         const smells = await detectSmellsInMethod(method);

//         methodsAnalysis.push({
//             Name: method.Name,
//             Body: method.Body,
//             Smells: smells,
//         });
//     }

//     return {
//         Name: path.basename(testFile.file, '.cs'),
//         Message: null,
//         ProjectName: projectName,
//         Methods: methodsAnalysis,
//     };
// }

// async function main() {
//     const inputFolder = path.join('output', 'test-methods');
//     const outputFolder = path.join('output', 'test-smells');
//     await fs.mkdir(outputFolder, { recursive: true });

//     const files = await fs.readdir(inputFolder);
//     for (const file of files) {
//         if (!file.endsWith('.json')) continue;

//         const projectName = path.basename(file, '-test-methods.json');
//         const testFiles: TestFile[] = JSON.parse(await fs.readFile(path.join(inputFolder, file), 'utf-8'));

//         console.log(`Processing project "${projectName}" with ${testFiles.length} test files.`);

//         const analyses: TestFileAnalysis[] = [];
//         for (const testFile of testFiles) {
//             console.log(`Processing test file: ${testFile.file}`);
//             const analysis = await processTestFile(testFile, projectName);
//             analyses.push(analysis);
//         }

//         const outputFilePath = path.join(outputFolder, `${projectName}-test-smells.json`);
//         await fs.writeFile(outputFilePath, JSON.stringify(analyses, null, 2), 'utf-8');
//         console.log(`Generated test smells report: ${outputFilePath}`);
//     }
// }

// main().catch(error => {
//     console.error('Error in test smells detection:', error);
// });
import fs from 'fs/promises';
import path from 'path';
import { OpenAI } from "openai";
import dotenv from 'dotenv';

dotenv.config();

// Validate API key
if (!process.env.OPENAI_API_KEYY) {
    console.error("Error: Missing OPENAI_API_KEYY environment variable.");
    process.exit(1);
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEYY });

interface TestMethod {
    Name: string;
    Body: string;
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
    Name: string;
    Body: string;
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

async function detectSmellsInMethod(method: TestMethod): Promise<SmellDetection[]> {
    if (!method.Body || method.Body.trim() === "") {
        console.warn(`Skipping method "${method.Name}" due to empty or undefined body.`);
        return TEST_SMELLS.map(smell => ({ Name: smell, Status: 'Not Found' }));
    }

    const prompt = `
You are a software testing expert. Analyze the following C# test method and detect whether any of the following test smells are present:
- ${TEST_SMELLS.join('\n- ')}

Provide the results in this JSON format:
[
    { "Name": "Smell Name", "Status": "Found/Not Found" }
]


### Example C# Test Smells:
1. **Assertion Roulette Test Smell**: Occurs when a test contains many assertions without any explanation of what each one checks.
2. **Conditional Test Smell**: Conditional statements in test cases that can lead to skipped parts of the test.
3. **Empty Test Smell**: A test method without any assertions or logic.
4. **Obscure In-Line Setup Test Smell**: Complex or unclear setup logic directly in the test body.
5. **Duplicate Assert Test Smell**: More than one assertion within a single test.
6. **Lack of Cohesion Test Smell**: A test method that contains logic unrelated to the overall system behavior.
7. **Redundant Print Test Smell**: Use of print statements that don’t provide relevant information or are not checked within the test.
8. **Sensitive Equality Test Smell**: Using equality checks that could be sensitive to data types or precision issues.
9. **Sleepy Test Smell**: A test that runs unnecessarily slowly due to inefficient setup or checks.
10. **Unknown Test Smell**: A smell that is not easily categorized or understood within the system.
11. **Constructor Initialization Test Smell**: Dependencies or data being initialized directly in the constructor rather than the test setup.
12. **Empty Test Smell**: No meaningful assertions or verification within the test.
13. **Inappropriate Assertion Test Smell**: Assertions that don't logically fit with the test or the method's objective.
14. **Eager Test Smell**: A test that verifies operations that are premature or not significant to the system behavior.
15. **Magic Number Test Smell**: Hard-coded values or constants used without explanation or context.
16. **Obscure Setup Test Smell**: Confusing or overly complex setup logic that doesn’t enhance test clarity.

### Test Method:
\`\`\`csharp
${method.Body}
\`\`\``;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [{ role: 'user', content: prompt }],
        });

        const content = response.choices[0].message?.content;

        // Debug: Log raw response content
        console.log(`Raw API response for method ${method.Name}:`, content);

        // Attempt to parse the response content as JSON
        const smells: SmellDetection[] = JSON.parse(content || '[]');

        // Ensure proper status values
        return smells.map(smell => ({
            Name: smell.Name,
            Status: smell.Status === "Found" ? "Found" : "Not Found",
        }));
    } catch (error) {
        console.error(`Error detecting smells in method ${method.Name}:`, error);

        // Return "Not Found" for all smells in case of an error
        return TEST_SMELLS.map(smell => ({ Name: smell, Status: 'Not Found' }));
    }
}

async function processTestFile(testFile: TestFile): Promise<TestFileAnalysis> {
    const methodsAnalysis: TestMethodAnalysis[] = [];

    for (const method of testFile.methods) {
        console.log(`Analyzing method: ${method.Name}`);

        const smells = await detectSmellsInMethod(method);

        methodsAnalysis.push({
            Name: method.Name,
            Body: method.Body,
            Smells: smells,
        });
    }

    return {
        file: testFile.file,
        methods: methodsAnalysis,
    };
}

async function main() {
    const inputFolder = path.join('output', 'test-methods');
    const outputFolder = path.join('output', 'test-smells');
    await fs.mkdir(outputFolder, { recursive: true });

    const files = await fs.readdir(inputFolder);
    for (const file of files) {
        if (!file.endsWith('.json')) continue;

        const testFiles: TestFile[] = JSON.parse(await fs.readFile(path.join(inputFolder, file), 'utf-8'));

        console.log(`Processing test file: ${file}`);

        const analyses: TestFileAnalysis[] = [];
        for (const testFile of testFiles) {
            console.log(`Processing test file: ${testFile.file}`);
            const analysis = await processTestFile(testFile);
            analyses.push(analysis);
        }

        const outputFilePath = path.join(outputFolder, `${path.basename(file, '.json')}-test-smells.json`);
        
        // Writing the final JSON output with methods' details and their smells
        await fs.writeFile(outputFilePath, JSON.stringify(analyses, null, 2), 'utf-8');
        console.log(`Generated test smells report: ${outputFilePath}`);
    }
}

main().catch(error => {
    console.error('Error in test smells detection:', error);
});
