"use strict";
// import axios from 'axios';
// import fs from 'fs/promises';
// import path from 'path';
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
const axios_1 = __importDefault(require("axios"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const GITHUB_API_URL = 'https://api.github.com';
const TOKEN = "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"; // Replace with process.env.GITHUB_TOKEN in production
// Fetch file structure from the GitHub repository
function getRepoFileStructure(owner_1, repo_1) {
    return __awaiter(this, arguments, void 0, function* (owner, repo, dirPath = '') {
        const url = `${GITHUB_API_URL}/repos/${owner}/${repo}/contents/${dirPath}`;
        try {
            console.log(`Fetching contents from: ${url}`);
            const response = yield axios_1.default.get(url, {
                headers: { Authorization: `Bearer ${TOKEN}` },
            });
            return response.data;
        }
        catch (error) {
            console.error(`Error fetching file structure for ${repo}/${dirPath}:`, error.message);
            return [];
        }
    });
}
// Recursively find test files by checking their names and paths
function findTestFiles(owner_1, repo_1, fileList_1) {
    return __awaiter(this, arguments, void 0, function* (owner, repo, fileList, parentPath = '') {
        const testFiles = [];
        for (const file of fileList) {
            const fullPath = path_1.default.join(parentPath, file.name);
            if (file.type === 'file') {
                if (file.name.toLowerCase().endsWith('.cs') && // Ensure it's a C# file
                    (file.name.toLowerCase().includes('test') ||
                        file.name.toLowerCase().includes('spec'))) {
                    console.log(`Test file found: ${fullPath}`);
                    testFiles.push({
                        name: file.name,
                        path: fullPath,
                        download_url: file.download_url,
                    });
                }
            }
            else if (file.type === 'dir') {
                console.log(`Exploring directory: ${fullPath}`);
                const nestedFiles = yield getRepoFileStructure(owner, repo, fullPath);
                const nestedTestFiles = yield findTestFiles(owner, repo, nestedFiles, fullPath);
                testFiles.push(...nestedTestFiles);
            }
        }
        return testFiles;
    });
}
// Main function to process repositories and save test files metadata
function processRepositories() {
    return __awaiter(this, void 0, void 0, function* () {
        const repositories = JSON.parse(yield promises_1.default.readFile('repositories.json', 'utf-8'));
        const subfolder = path_1.default.join('output', 'test-files');
        yield promises_1.default.mkdir(subfolder, { recursive: true });
        for (const { owner, repo } of repositories) {
            console.log(`Processing repository: ${repo}`);
            const fileList = yield getRepoFileStructure(owner, repo);
            if (!fileList || fileList.length === 0) {
                console.warn(`No files found in repository: ${repo}`);
                continue;
            }
            const testFiles = yield findTestFiles(owner, repo, fileList);
            if (testFiles.length === 0) {
                console.warn(`No test files found in repository: ${repo}`);
            }
            const filePath = path_1.default.join(subfolder, `${repo}-test-files.json`);
            yield promises_1.default.writeFile(filePath, JSON.stringify(testFiles, null, 2));
            console.log(`Saved metadata for ${repo} in ${filePath}`);
        }
    });
}
processRepositories().catch((err) => {
    console.error('Error processing repositories:', err);
});
