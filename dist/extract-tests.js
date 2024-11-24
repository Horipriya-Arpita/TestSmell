"use strict";
// import fs from 'fs/promises';
// import path from 'path';
// import axios from 'axios';
// import Parser from 'tree-sitter';
// import CSharp from 'tree-sitter-c-sharp';
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
// interface TestMethod {
//     name: string;
//     body: string;
// }
// interface TestMethodMetadata {
//     file: string;
//     methods: TestMethod[];
// }
// function extractTestMethods(fileContent: string): TestMethod[] {
//     const parser = new Parser();
//     parser.setLanguage(CSharp);
//     if (!fileContent || fileContent.trim().length === 0) {
//         console.warn("File content is empty. Skipping parsing.");
//         return [];
//     }
//     const tree = parser.parse(fileContent);
//     const methods: TestMethod[] = [];
//     function traverse(node: any) {
//         if (node.type === 'method_declaration') {
//             // Check if the method has an attribute list
//             const attributeList = node.children.find((child: any) => child.type === 'attribute_list');
//             if (attributeList) {
//                 const attributes = attributeList.children.filter((child: any) => child.type === 'attribute');
//                 const hasTestAttribute = attributes.some((attr: any) => {
//                     const attributeNameNode = attr.children.find((child: any) => child.type === 'identifier');
//                     const attributeName = attributeNameNode?.text?.toLowerCase();
//                     return attributeName === 'test' || attributeName === 'fact' || attributeName === 'testmethod';
//                 });
//                 if (hasTestAttribute) {
//                     const methodNameNode = node.children.find((child: any) => child.type === 'identifier');
//                     const methodBodyNode = node.children.find((child: any) => child.type === 'block');
//                     if (methodNameNode) {
//                         methods.push({
//                             name: methodNameNode.text,
//                             body: methodBodyNode?.text || 'No body available',
//                         });
//                     }
//                 }
//             }
//         }
//         // Recursively traverse child nodes
//         for (const child of node.children) {
//             traverse(child);
//         }
//     }
//     traverse(tree.rootNode);
//     return methods;
// }
// async function processTestFiles(repo: string) {
//     const testFiles: { name: string; path: string; download_url: string }[] = JSON.parse(
//         await fs.readFile(`output/test-files/${repo}-test-files.json`, 'utf-8')
//     );
//     const tempFolder = path.join('./temp', `${repo}-test-files`);
//     await fs.mkdir(tempFolder, { recursive: true });
//     const testMethodsMetadata: TestMethodMetadata[] = [];
//     for (const file of testFiles) {
//         const filePath = `${tempFolder}/${file.name}`;
//         // Download file if it doesn't already exist
//         try {
//             await fs.access(filePath);
//         } catch {
//             const response = await axios.get(file.download_url);
//             await fs.writeFile(filePath, response.data, 'utf-8');
//         }
//         const fileContent = await fs.readFile(filePath, 'utf-8');
//         if (!fileContent || fileContent.trim().length === 0) {
//             console.warn(`File ${file.name} is empty. Skipping.`);
//             continue;
//         }
//         try {
//             const methods = extractTestMethods(fileContent);
//             testMethodsMetadata.push({ file: file.name, methods });
//         } catch (error: unknown) {
//             if (error instanceof Error) {
//                 console.error(`Error extracting methods from file ${file.name}:`, error.message);
//             } else {
//                 console.error(`An unexpected error occurred while processing file ${file.name}:`, error);
//             }
//         }
//     }
//     const outputFolder = path.join('output', 'test-methods');
//     await fs.mkdir(outputFolder, { recursive: true });
//     await fs.writeFile(
//         `${outputFolder}/${repo}-test-methods.json`,
//         JSON.stringify(testMethodsMetadata, null, 2)
//     );
//     console.log(`Extracted test methods for ${repo}`);
// }
// (async () => {
//     const repositories: { repo: string }[] = JSON.parse(
//         await fs.readFile('repositories.json', 'utf-8')
//     );
//     for (const { repo } of repositories) {
//         await processTestFiles(repo);
//     }
// })();
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const axios_1 = __importDefault(require("axios"));
const tree_sitter_1 = __importDefault(require("tree-sitter"));
const tree_sitter_c_sharp_1 = __importDefault(require("tree-sitter-c-sharp"));
function extractTestMethods(fileContent) {
    const parser = new tree_sitter_1.default();
    parser.setLanguage(tree_sitter_c_sharp_1.default);
    if (!fileContent || fileContent.trim().length === 0) {
        console.warn("File content is empty. Skipping parsing.");
        return [];
    }
    const tree = parser.parse(fileContent);
    const methods = [];
    function traverse(node) {
        if (node.type === 'method_declaration') {
            // Check if the method has an attribute list
            const attributeList = node.children.find((child) => child.type === 'attribute_list');
            if (attributeList) {
                const attributes = attributeList.children.filter((child) => child.type === 'attribute');
                const hasTestAttribute = attributes.some((attr) => {
                    var _a;
                    const attributeNameNode = attr.children.find((child) => child.type === 'identifier');
                    const attributeName = (_a = attributeNameNode === null || attributeNameNode === void 0 ? void 0 : attributeNameNode.text) === null || _a === void 0 ? void 0 : _a.toLowerCase();
                    return attributeName === 'test' || attributeName === 'fact' || attributeName === 'testmethod';
                });
                if (hasTestAttribute) {
                    const methodNameNode = node.children.find((child) => child.type === 'identifier');
                    const methodBodyNode = node.children.find((child) => child.type === 'block');
                    if (methodNameNode) {
                        methods.push({
                            name: methodNameNode.text,
                            body: (methodBodyNode === null || methodBodyNode === void 0 ? void 0 : methodBodyNode.text) || 'No body available',
                        });
                    }
                }
            }
        }
        // Recursively traverse child nodes
        for (const child of node.children) {
            traverse(child);
        }
    }
    traverse(tree.rootNode);
    return methods;
}
function processTestFiles(repo) {
    return __awaiter(this, void 0, void 0, function* () {
        const testFiles = JSON.parse(yield promises_1.default.readFile(`output/test-files/${repo}-test-files.json`, 'utf-8'));
        const tempFolder = path_1.default.join('./temp', `${repo}-test-files`);
        yield promises_1.default.mkdir(tempFolder, { recursive: true });
        const testMethodsMetadata = [];
        for (const file of testFiles) {
            try {
                const filePath = `${tempFolder}/${file.name}`;
                // Download file if it doesn't already exist
                try {
                    yield promises_1.default.access(filePath);
                }
                catch (_a) {
                    const response = yield axios_1.default.get(file.download_url);
                    yield promises_1.default.writeFile(filePath, response.data, 'utf-8');
                }
                const fileContent = yield promises_1.default.readFile(filePath, 'utf-8');
                if (!fileContent || fileContent.trim().length === 0) {
                    console.warn(`File ${file.name} is empty. Skipping.`);
                    continue;
                }
                try {
                    const methods = extractTestMethods(fileContent);
                    testMethodsMetadata.push({ file: file.name, methods });
                }
                catch (error) {
                    if (error instanceof Error) {
                        console.error(`Error extracting methods from file ${file.name}:`, error.message);
                    }
                    else {
                        console.error(`An unexpected error occurred while processing file ${file.name}:`, error);
                    }
                    console.warn(`Skipping problematic file: ${file.name}`);
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error(`Error processing file ${file.name}:`, error.message);
                }
                else {
                    console.error(`An unexpected error occurred while processing file ${file.name}:`, error);
                }
                console.warn(`Skipping problematic file: ${file.name}`);
            }
        }
        const outputFolder = path_1.default.join('output', 'test-methods');
        yield promises_1.default.mkdir(outputFolder, { recursive: true });
        yield promises_1.default.writeFile(`${outputFolder}/${repo}-test-methods.json`, JSON.stringify(testMethodsMetadata, null, 2));
        console.log(`Extracted test methods for ${repo}`);
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    const repositories = JSON.parse(yield promises_1.default.readFile('repositories.json', 'utf-8'));
    for (const { repo } of repositories) {
        try {
            yield processTestFiles(repo);
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error processing repository ${repo}:`, error.message);
            }
            else {
                console.error(`An unexpected error occurred while processing repository ${repo}:`, error);
            }
        }
    }
}))();
