"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
function transformJson(inputFolder, outputFolder) {
    return __awaiter(this, void 0, void 0, function* () {
        const inputFiles = yield fs.readdir(inputFolder);
        let totalMethodsWithBodies = 0;
        // Ensure the output folder exists
        yield fs.mkdir(outputFolder, { recursive: true });
        for (const inputFile of inputFiles) {
            const inputFilePath = path.join(inputFolder, inputFile);
            // Append `-final` to the file name
            const outputFileName = inputFile.replace(/\.json$/, '-final.json');
            const outputFilePath = path.join(outputFolder, outputFileName);
            // Read and parse the JSON file
            const data = JSON.parse(yield fs.readFile(inputFilePath, 'utf-8'));
            // Process and transform the data
            const transformedData = data
                .map(file => {
                const filteredMethods = file.methods
                    .filter(method => method.body && method.body.trim().length > 0)
                    .map(method => (Object.assign(Object.assign({}, method), { 
                    // Replace newline and tab characters with '|'
                    body: method.body.replace(/[\n\t]+/g, '|').replace(/\s+/g, ' ') })));
                return Object.assign(Object.assign({}, file), { methods: filteredMethods });
            })
                // Remove files with no methods
                .filter(file => file.methods.length > 0);
            // Count methods with valid bodies for this file
            const fileMethodCount = transformedData.reduce((count, file) => count + file.methods.length, 0);
            totalMethodsWithBodies += fileMethodCount;
            // Log the count for this file
            console.log(`File: ${inputFile} - Valid Methods: ${fileMethodCount}`);
            // Write the transformed JSON to the output folder
            yield fs.writeFile(outputFilePath, JSON.stringify(transformedData, null, 2));
            console.log(`Transformed JSON saved to ${outputFilePath}`);
        }
        console.log(`Total methods with valid bodies across all files: ${totalMethodsWithBodies}`);
    });
}
// Input and output folder paths
const inputFolder = path.join('output', 'test-methods');
const outputFolder = path.join('output', 'test-methods-final');
// Transform the JSON files
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield transformJson(inputFolder, outputFolder);
    }
    catch (error) {
        console.error('An error occurred during the transformation process:', error);
    }
}))();
