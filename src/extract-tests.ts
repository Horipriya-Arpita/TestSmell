// import fs from 'fs/promises';
// import path from 'path';
// import axios from 'axios';
// import Parser from 'tree-sitter';
// import CSharp from 'tree-sitter-c-sharp';

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

    const tempFolder = path.join('./temp', `${repo}-test-files`);
    await fs.mkdir(tempFolder, { recursive: true });

    const testMethodsMetadata: TestMethodMetadata[] = [];
    for (const file of testFiles) {
        try {
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
                console.warn(`Skipping problematic file: ${file.name}`);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(`Error processing file ${file.name}:`, error.message);
            } else {
                console.error(`An unexpected error occurred while processing file ${file.name}:`, error);
            }
            console.warn(`Skipping problematic file: ${file.name}`);
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
        try {
            await processTestFiles(repo);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(`Error processing repository ${repo}:`, error.message);
            } else {
                console.error(`An unexpected error occurred while processing repository ${repo}:`, error);
            }
        }
    }
})();
