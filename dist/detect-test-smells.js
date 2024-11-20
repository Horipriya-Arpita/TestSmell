"use strict";
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
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const openai_1 = require("openai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
if (!process.env.OPENAI_API_KEYY) {
    console.error("Error: Missing OPENAI_API_KEYY environment variable.");
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
function detectSmellsInMethod(method) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!method.body || method.body.trim() === "") {
            //console.warn(`Skipping method "${method.Name}" due to empty or undefined body.`);
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
${method.body}
\`\`\``;
        try {
            const response = yield openai.chat.completions.create({
                model: 'gpt-4',
                messages: [{ role: 'user', content: prompt }],
            });
            const content = (_a = response.choices[0].message) === null || _a === void 0 ? void 0 : _a.content;
            console.log(`Raw API response for method ${method.name}:`, content);
            const smells = JSON.parse(content || '[]');
            return smells.map(smell => ({
                Name: smell.Name,
                Status: smell.Status === "Found" ? "Found" : "Not Found",
            }));
        }
        catch (error) {
            console.error(`Error detecting smells in method ${method.name}:`, error);
            return TEST_SMELLS.map(smell => ({ Name: smell, Status: 'Not Found' }));
        }
    });
}
function processTestFile(testFile) {
    return __awaiter(this, void 0, void 0, function* () {
        const methodsAnalysis = [];
        //console.log("mmmmm-----" + JSON.stringify(testFile, null, 2));
        // console.log("Full test file object:", JSON.stringify(testFile, null, 2));
        // console.log("Methods array:", testFile.methods);
        for (const methods of testFile.methods) {
            //console.log("........................."+method.Name);
            //console.log(`Analyzing method: ${method.Name}`);
            // console.log("mmmmm-----" + JSON.stringify(methods, null, 2));
            // //console.log("mmmmm-----" + JSON.stringify(methods.name));
            console.log("Method name:", methods.name); // Use bracket notation if `Name` is a key
            // console.log("Method object:", methods);
            // console.log("Method keys:", Object.keys(methods));
            const smells = yield detectSmellsInMethod(methods);
            methodsAnalysis.push({
                name: methods.name,
                body: methods.body,
                Smells: smells,
            });
        }
        return {
            file: testFile.file,
            methods: methodsAnalysis,
        };
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const inputFolder = path_1.default.join('output', 'test-methods');
        const outputFolder = path_1.default.join('output', 'test-smells');
        yield promises_1.default.mkdir(outputFolder, { recursive: true });
        console.log("hiiiiiiiiiiiiiiiiii");
        const files = yield promises_1.default.readdir(inputFolder);
        for (const file of files) {
            if (!file.endsWith('.json'))
                continue;
            const testFiles = JSON.parse(yield promises_1.default.readFile(path_1.default.join(inputFolder, file), 'utf-8'));
            console.log(`Processing test file: ${file}`);
            const analyses = [];
            for (const testFile of testFiles) {
                //console.log("mmmmm-----" + JSON.stringify(testFile, null, 2));
                const analysis = yield processTestFile(testFile);
                analyses.push(analysis);
            }
            const outputFilePath = path_1.default.join(outputFolder, `${path_1.default.basename(file, '.json')}-test-smells.json`);
            yield promises_1.default.writeFile(outputFilePath, JSON.stringify(analyses, null, 2), 'utf-8');
            console.log(`Generated test smells report: ${outputFilePath}`);
        }
    });
}
main().catch(error => {
    console.error('Error in test smells detection:', error);
});
