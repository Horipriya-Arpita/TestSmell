// import axios from 'axios';
// import fs from 'fs/promises';
// import path from 'path';

// interface Repository {
//     owner: string;
//     repo: string;
// }

// interface FileMetadata {
//     name: string;
//     path: string;
//     download_url: string;
// }

// const GITHUB_API_URL = 'https://api.github.com';
// const TOKEN = "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"; // Replace with process.env.GITHUB_TOKEN in production

// // Fetch file structure from the GitHub repository
// async function getRepoFileStructure(owner: string, repo: string, dirPath: string = ''): Promise<any[]> {
//     const url = `${GITHUB_API_URL}/repos/${owner}/${repo}/contents/${dirPath}`;
//     try {
//         const response = await axios.get(url, {
//             headers: { Authorization: `Bearer ${TOKEN}` },
//         });
//         return response.data;
//     } catch (error: any) {
//         console.error(`Error fetching file structure for ${repo}/${dirPath}:`, error.message);
//         return [];
//     }
// }

// // Recursively find test files by checking their names
// async function findTestFiles(owner: string, repo: string, fileList: any[], parentPath: string = ''): Promise<FileMetadata[]> {
//     const testFiles: FileMetadata[] = [];
//     for (const file of fileList) {
//         const fullPath = path.join(parentPath, file.name);
//         if (file.type === 'file' && file.name.toLowerCase().includes('test')) {
//             testFiles.push({
//                 name: file.name,
//                 path: fullPath,
//                 download_url: file.download_url,
//             });
//         } else if (file.type === 'dir') {
//             // Recursively search the subdirectory
//             const nestedFiles = await getRepoFileStructure(owner, repo, fullPath);
//             const nestedTestFiles = await findTestFiles(owner, repo, nestedFiles, fullPath);
//             testFiles.push(...nestedTestFiles);
//         }
//     }
//     return testFiles;
// }

// // Main function to process repositories and save test files metadata
// async function processRepositories() {
//     const repositories: Repository[] = JSON.parse(
//         await fs.readFile('repositories.json', 'utf-8')
//     );

//     for (const { owner, repo } of repositories) {
//         console.log(`Processing repository: ${repo}`);
//         const fileList = await getRepoFileStructure(owner, repo);
//         const testFiles = await findTestFiles(owner, repo, fileList);
//         await fs.writeFile(
//             `${repo}-test-files.json`,
//             JSON.stringify(testFiles, null, 2)
//         );
//         console.log(`Saved metadata for ${repo}`);
//     }
// }

// processRepositories().catch((err) => {
//     console.error('Error processing repositories:', err);
// });

// import axios from 'axios';
// import fs from 'fs/promises';
// import path from 'path';

// interface Repository {
//     owner: string;
//     repo: string;
// }

// interface FileMetadata {
//     name: string;
//     path: string;
//     download_url: string;
// }

// const GITHUB_API_URL = 'https://api.github.com';
// const TOKEN = "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"; // Replace with process.env.GITHUB_TOKEN in production

// // Fetch file structure from the GitHub repository
// async function getRepoFileStructure(owner: string, repo: string, dirPath: string = ''): Promise<any[]> {
//     const url = `${GITHUB_API_URL}/repos/${owner}/${repo}/contents/${dirPath}`;
//     try {
//         const response = await axios.get(url, {
//             headers: { Authorization: `Bearer ${TOKEN}` },
//         });
//         return response.data;
//     } catch (error: any) {
//         console.error(`Error fetching file structure for ${repo}/${dirPath}:`, error.message);
//         return [];
//     }
// }

// // Recursively find test files by checking their names
// async function findTestFiles(owner: string, repo: string, fileList: any[], parentPath: string = ''): Promise<FileMetadata[]> {
//     const testFiles: FileMetadata[] = [];
//     for (const file of fileList) {
//         const fullPath = path.join(parentPath, file.name);
//         if (file.type === 'file' && file.name.toLowerCase().includes('test')) {
//             testFiles.push({
//                 name: file.name,
//                 path: fullPath,
//                 download_url: file.download_url,
//             });
//         } else if (file.type === 'dir') {
//             // Recursively search the subdirectory
//             const nestedFiles = await getRepoFileStructure(owner, repo, fullPath);
//             const nestedTestFiles = await findTestFiles(owner, repo, nestedFiles, fullPath);
//             testFiles.push(...nestedTestFiles);
//         }
//     }
//     return testFiles;
// }

// // Main function to process repositories and save test files metadata
// async function processRepositories() {
//     const repositories: Repository[] = JSON.parse(
//         await fs.readFile('repositories.json', 'utf-8')
//     );

//     // Define the subfolder path
//     const subfolder = path.join('output', 'test-files');
    
//     // Ensure the subfolder exists
//     await fs.mkdir(subfolder, { recursive: true });

//     for (const { owner, repo } of repositories) {
//         console.log(`Processing repository: ${repo}`);
//         const fileList = await getRepoFileStructure(owner, repo);
//         const testFiles = await findTestFiles(owner, repo, fileList);

//         // Save the test files JSON in the subfolder
//         const filePath = path.join(subfolder, `${repo}-test-files.json`);
//         await fs.writeFile(filePath, JSON.stringify(testFiles, null, 2));
//         console.log(`Saved metadata for ${repo} in ${filePath}`);
//     }
// }

// processRepositories().catch((err) => {
//     console.error('Error processing repositories:', err);
// });
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

interface Repository {
    owner: string;
    repo: string;
}

interface FileMetadata {
    name: string;
    path: string;
    download_url: string;
}

const GITHUB_API_URL = 'https://api.github.com';
const TOKEN = "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"; // Replace with process.env.GITHUB_TOKEN in production

// Fetch file structure from the GitHub repository
async function getRepoFileStructure(owner: string, repo: string, dirPath: string = ''): Promise<any[]> {
    const url = `${GITHUB_API_URL}/repos/${owner}/${repo}/contents/${dirPath}`;
    try {
        console.log(`Fetching contents from: ${url}`);
        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${TOKEN}` },
        });
        return response.data;
    } catch (error: any) {
        console.error(`Error fetching file structure for ${repo}/${dirPath}:`, error.message);
        return [];
    }
}

// Recursively find test files by checking their names and paths
async function findTestFiles(owner: string, repo: string, fileList: any[], parentPath: string = ''): Promise<FileMetadata[]> {
    const testFiles: FileMetadata[] = [];
    for (const file of fileList) {
        const fullPath = path.join(parentPath, file.name);

        if (file.type === 'file') {
            if (
                file.name.toLowerCase().endsWith('.cs') && // Ensure it's a C# file
                (file.name.toLowerCase().includes('test') || 
                 file.name.toLowerCase().includes('spec'))
            ) {
                console.log(`Test file found: ${fullPath}`);
                testFiles.push({
                    name: file.name,
                    path: fullPath,
                    download_url: file.download_url,
                });
            }
        } else if (file.type === 'dir') {
            console.log(`Exploring directory: ${fullPath}`);
            const nestedFiles = await getRepoFileStructure(owner, repo, fullPath);
            const nestedTestFiles = await findTestFiles(owner, repo, nestedFiles, fullPath);
            testFiles.push(...nestedTestFiles);
        }
    }
    return testFiles;
}

// Main function to process repositories and save test files metadata
async function processRepositories() {
    const repositories: Repository[] = JSON.parse(
        await fs.readFile('repositories.json', 'utf-8')
    );

    const subfolder = path.join('output', 'test-files');
    await fs.mkdir(subfolder, { recursive: true });

    for (const { owner, repo } of repositories) {
        console.log(`Processing repository: ${repo}`);
        const fileList = await getRepoFileStructure(owner, repo);

        if (!fileList || fileList.length === 0) {
            console.warn(`No files found in repository: ${repo}`);
            continue;
        }

        const testFiles = await findTestFiles(owner, repo, fileList);

        if (testFiles.length === 0) {
            console.warn(`No test files found in repository: ${repo}`);
        }

        const filePath = path.join(subfolder, `${repo}-test-files.json`);
        await fs.writeFile(filePath, JSON.stringify(testFiles, null, 2));
        console.log(`Saved metadata for ${repo} in ${filePath}`);
    }
}

processRepositories().catch((err) => {
    console.error('Error processing repositories:', err);
});
