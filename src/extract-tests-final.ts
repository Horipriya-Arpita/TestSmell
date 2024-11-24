import * as fs from 'fs/promises';
import * as path from 'path';

interface Method {
    name: string;
    body: string;
}

interface FileData {
    file: string;
    methods: Method[];
}

async function transformJson(inputFolder: string, outputFolder: string) {
    const inputFiles = await fs.readdir(inputFolder);

    let totalMethodsWithBodies = 0;

    // Ensure the output folder exists
    await fs.mkdir(outputFolder, { recursive: true });

    for (const inputFile of inputFiles) {
        const inputFilePath = path.join(inputFolder, inputFile);

        // Append `-final` to the file name
        const outputFileName = inputFile.replace(/\.json$/, '-final.json');
        const outputFilePath = path.join(outputFolder, outputFileName);

        // Read and parse the JSON file
        const data: FileData[] = JSON.parse(await fs.readFile(inputFilePath, 'utf-8'));

        // Process and transform the data
        const transformedData = data
            .map(file => {
                const filteredMethods = file.methods
                    .filter(method => method.body && method.body.trim().length > 0)
                    .map(method => ({
                        ...method,
                        // Replace newline and tab characters with '|'
                        body: method.body.replace(/[\n\t]+/g, '|').replace(/\s+/g, ' '),
                    }));

                return { ...file, methods: filteredMethods };
            })
            // Remove files with no methods
            .filter(file => file.methods.length > 0);

        // Count methods with valid bodies for this file
        const fileMethodCount = transformedData.reduce((count, file) => count + file.methods.length, 0);
        totalMethodsWithBodies += fileMethodCount;

        // Log the count for this file
        console.log(`File: ${inputFile} - Valid Methods: ${fileMethodCount}`);

        // Write the transformed JSON to the output folder
        await fs.writeFile(outputFilePath, JSON.stringify(transformedData, null, 2));
        console.log(`Transformed JSON saved to ${outputFilePath}`);
    }

    console.log(`Total methods with valid bodies across all files: ${totalMethodsWithBodies}`);
}

// Input and output folder paths
const inputFolder = path.join('output', 'test-methods');
const outputFolder = path.join('output', 'test-methods-final');

// Transform the JSON files
(async () => {
    try {
        await transformJson(inputFolder, outputFolder);
    } catch (error) {
        console.error('An error occurred during the transformation process:', error);
    }
})();
