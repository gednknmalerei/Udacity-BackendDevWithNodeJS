import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

// Validate query parameters
function validateQueryParams(filename: string, width: number, height: number) {
  const missingParameters = [];
  if (filename == 'undefined' || filename === '')
    missingParameters.push('filename');
  if (!width || isNaN(width))
    missingParameters.push('width (as number in px only)');
  if (!height || isNaN(height))
    missingParameters.push('height (as number in px only)');
  return missingParameters;
}

// Generate file paths
function generateFilePaths(filename: string, width: number, height: number) {
  const filePath = path.resolve('./assets/full', `${filename}.jpg`);
  const resizedFileName = `${filename}_${width}x${height}.jpg`;
  const resizedFilePath = path.resolve('./assets/thumb/', resizedFileName);
  return { filePath, resizedFilePath };
}

// Ensure cache directory exists
async function cacheDirectoryExists() {
  try {
    await fs.access('./assets/thumb');
  } catch {
    await fs.mkdir('./assets/thumb', { recursive: true });
  }
}

// Check if file exists
async function fileExists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// Resize image and cache it
async function resizeAndCacheImage(
  filePath: string,
  width: number,
  height: number,
  resizedFilePath: string,
) {
  try {
    const transformedImage = await sharp(filePath)
      .resize(width, height)
      .jpeg()
      .toBuffer();
    await fs.writeFile(resizedFilePath, transformedImage);
    return transformedImage;
  } catch (error) {
    throw new Error(`Could not transform image: ${(error as Error).message}`);
  }
}

export default {
  validateQueryParams,
  generateFilePaths,
  cacheDirectoryExists,
  fileExists,
  resizeAndCacheImage,
};
