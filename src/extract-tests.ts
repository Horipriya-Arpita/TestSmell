// import { parse } from '@babel/parser';
// import { promises as fs } from 'fs';

// interface TestMethodMetadata {
//     file: string;
//     methods: string[];
// }

// function extractTestMethods(fileContent: string): string[] {
//     const ast = parse(fileContent, {
//         sourceType: 'module',
//         plugins: ['typescript'], // Add as needed
//     });

//     const methods: string[] = [];
//     function traverse(node: any) {
//         if (node.type === 'FunctionDeclaration' && node.id?.name.includes('Test')) {
//             methods.push(node.id.name);
//         }
//         if (node.body) {
//             const body = Array.isArray(node.body) ? node.body : [node.body];
//             body.forEach(traverse);
//         }
//     }

//     traverse(ast.program);
//     return methods;
// }

// async function processTestFiles(repo: string) {
//     const testFiles: { name: string; path: string; download_url: string }[] = JSON.parse(
//         await fs.readFile(`${repo}-test-files.json`, 'utf-8')
//     );

//     const testMethodsMetadata: TestMethodMetadata[] = [];
//     for (const file of testFiles) {
//         const fileContent = await fs.readFile(`./temp/${file.name}`, 'utf-8');
//         const methods = extractTestMethods(fileContent);
//         testMethodsMetadata.push({ file: file.name, methods });
//     }

//     await fs.writeFile(
//         `${repo}-test-methods.json`,
//         JSON.stringify(testMethodsMetadata, null, 2)
//     );
//     console.log(`Extracted test methods for ${repo}`);
// }

// // Example usage
// (async () => {
//     const repositories: { repo: string }[] = JSON.parse(
//         await fs.readFile('repositories.json', 'utf-8')
//     );

//     for (const { repo } of repositories) {
//         await processTestFiles(repo);
//     }
// })();

// import fs from 'fs/promises';
// import Parser from 'tree-sitter';
// import CSharp from 'tree-sitter-c-sharp';

// interface TestMethodMetadata {
//     file: string;
//     methods: string[];
// }

// function extractTestMethods(fileContent: string): string[] {
//     const parser = new Parser();
//     parser.setLanguage(CSharp);

//     const tree = parser.parse(fileContent);
//     const methods: string[] = [];

//     function traverse(node: any) {
//         if (node.type === 'method_declaration') {
//             const attributes = node.children.filter((child: any) => child.type === 'attribute');
//             const hasTestAttribute = attributes.some((attr: any) =>
//                 attr.text.toLowerCase().includes('test') || attr.text.toLowerCase().includes('fact')
//             );

//             if (hasTestAttribute) {
//                 const methodNameNode = node.children.find((child: any) => child.type === 'identifier');
//                 if (methodNameNode) methods.push(methodNameNode.text);
//             }
//         }

//         for (const child of node.children) {
//             traverse(child);
//         }
//     }

//     traverse(tree.rootNode);
//     return methods;
// }

// async function processTestFiles(repo: string) {
//     const testFiles: { name: string; path: string; download_url: string }[] = JSON.parse(
//         await fs.readFile(`${repo}-test-files.json`, 'utf-8')
//     );

//     const testMethodsMetadata: TestMethodMetadata[] = [];
//     for (const file of testFiles) {
//         const fileContent = await fs.readFile(`./temp/${file.name}`, 'utf-8');
//         const methods = extractTestMethods(fileContent);
//         testMethodsMetadata.push({ file: file.name, methods });
//     }

//     await fs.writeFile(
//         `subfolder/${repo}-test-methods.json`,
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

// import fs from 'fs/promises';
// import path from 'path';
// import axios from 'axios';
// import Parser from 'tree-sitter';
// import CSharp from 'tree-sitter-c-sharp';

// interface TestMethodMetadata {
//     file: string;
//     methods: string[];
// }

// function extractTestMethods(fileContent: string): string[] {
//     const parser = new Parser();
//     parser.setLanguage(CSharp);

//     const tree = parser.parse(fileContent);
//     const methods: string[] = [];

//     function traverse(node: any) {
//         if (node.type === 'method_declaration') {
//             const attributes = node.children.filter((child: any) => child.type === 'attribute');
//             const hasTestAttribute = attributes.some((attr: any) =>
//                 attr.text.toLowerCase().includes('test') || attr.text.toLowerCase().includes('fact')
//             );

//             if (hasTestAttribute) {
//                 const methodNameNode = node.children.find((child: any) => child.type === 'identifier');
//                 if (methodNameNode) methods.push(methodNameNode.text);
//             }
//         }

//         for (const child of node.children) {
//             traverse(child);
//         }
//     }

//     traverse(tree.rootNode);
//     return methods;
// }

// async function processTestFiles(repo: string) {
//     const testFiles: { name: string; path: string; download_url: string }[] = JSON.parse(
//         await fs.readFile(`output/test-files/${repo}-test-files.json`, 'utf-8') // Correct path.
//     );

//     const tempFolder = './temp';
//     await fs.mkdir(tempFolder, { recursive: true });

//     const testMethodsMetadata: TestMethodMetadata[] = [];
//     for (const file of testFiles) {
//         const filePath = `${tempFolder}/${file.name}`;

//         // Download file if it doesn't already exist
//         try {
//             await fs.access(filePath); // Check if file exists
//         } catch {
//             const response = await axios.get(file.download_url); // Download from GitHub
//             await fs.writeFile(filePath, response.data);
//         }

//         const fileContent = await fs.readFile(filePath, 'utf-8');
//         const methods = extractTestMethods(fileContent);
//         testMethodsMetadata.push({ file: file.name, methods });
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
import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import Parser from 'tree-sitter';
import CSharp from 'tree-sitter-c-sharp';

interface TestMethod {
    name: string;
    body: string;
}

interface TestMethodMetadata {
    file: string;
    methods: TestMethod[];
}

function extractTestMethods(fileContent: string): TestMethod[] {
    const parser = new Parser();
    parser.setLanguage(CSharp);

    if (!fileContent || fileContent.trim().length === 0) {
        console.warn("File content is empty. Skipping parsing.");
        return [];
    }

    const tree = parser.parse(fileContent);
    const methods: TestMethod[] = [];

    function traverse(node: any) {
        if (node.type === 'method_declaration') {
            // Check if the method has an attribute list
            const attributeList = node.children.find((child: any) => child.type === 'attribute_list');
            if (attributeList) {
                const attributes = attributeList.children.filter((child: any) => child.type === 'attribute');
                const hasTestAttribute = attributes.some((attr: any) => {
                    const attributeNameNode = attr.children.find((child: any) => child.type === 'identifier');
                    const attributeName = attributeNameNode?.text?.toLowerCase();
                    return attributeName === 'test' || attributeName === 'fact' || attributeName === 'testmethod';
                });

                if (hasTestAttribute) {
                    const methodNameNode = node.children.find((child: any) => child.type === 'identifier');
                    const methodBodyNode = node.children.find((child: any) => child.type === 'block');

                    if (methodNameNode) {
                        methods.push({
                            name: methodNameNode.text,
                            body: methodBodyNode?.text || 'No body available',
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

async function processTestFiles(repo: string) {
    const testFiles: { name: string; path: string; download_url: string }[] = JSON.parse(
        await fs.readFile(`output/test-files/${repo}-test-files.json`, 'utf-8')
    );

    const tempFolder = './temp';
    await fs.mkdir(tempFolder, { recursive: true });

    const testMethodsMetadata: TestMethodMetadata[] = [];
    for (const file of testFiles) {
        const filePath = `${tempFolder}/${file.name}`;

        // Download file if it doesn't already exist
        try {
            await fs.access(filePath);
        } catch {
            const response = await axios.get(file.download_url);
            await fs.writeFile(filePath, response.data, 'utf-8');
        }

        const fileContent = await fs.readFile(filePath, 'utf-8');

        if (!fileContent || fileContent.trim().length === 0) {
            console.warn(`File ${file.name} is empty. Skipping.`);
            continue;
        }

        try {
            const methods = extractTestMethods(fileContent);
            testMethodsMetadata.push({ file: file.name, methods });
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(`Error extracting methods from file ${file.name}:`, error.message);
            } else {
                console.error(`An unexpected error occurred while processing file ${file.name}:`, error);
            }
        }
    }

    const outputFolder = path.join('output', 'test-methods');
    await fs.mkdir(outputFolder, { recursive: true });

    await fs.writeFile(
        `${outputFolder}/${repo}-test-methods.json`,
        JSON.stringify(testMethodsMetadata, null, 2)
    );
    console.log(`Extracted test methods for ${repo}`);
}

(async () => {
    const repositories: { repo: string }[] = JSON.parse(
        await fs.readFile('repositories.json', 'utf-8')
    );

    for (const { repo } of repositories) {
        await processTestFiles(repo);
    }
})();
