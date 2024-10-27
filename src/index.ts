import express from 'express';
import imgUtils from './utilities/imgUtils';

const app = express();
const port: number = 3000;

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});

app.get('/api/images', async (req: express.Request, res: express.Response) => {
  try {
    const filename: string = String(req.query.filename);
    const width: number = Number(req.query.width);
    const height: number = Number(req.query.height);

    // validate query parameters
    const missingParameters: (string | number)[] = imgUtils.validateQueryParams(
      filename,
      width,
      height,
    );
    if (missingParameters.length > 0) {
      res.send(`Parameters missing: ${missingParameters.join(', ')}`);
      return;
    }

    // generate file paths
    const { filePath, resizedFilePath } = imgUtils.generateFilePaths(
      filename,
      width,
      height,
    );

    // ensure thumb directory exists
    await imgUtils.cacheDirectoryExists();

    // serve cached image if available
    if (await imgUtils.fileExists(resizedFilePath)) {
      res.type('jpeg').sendFile(resizedFilePath);
      return;
    }

    // check if original file exists
    if (!(await imgUtils.fileExists(filePath))) {
      res.send(
        'File does not exist. Check filename and if file is in the folder "full".',
      );
      return;
    }

    // resize and cache image, then serve it
    const transformedImage: Buffer = await imgUtils.resizeAndCacheImage(
      filePath,
      width,
      height,
      resizedFilePath,
    );
    res.type('jpeg').send(transformedImage);
  } catch (error) {
    res.status(500).send(`Could not reach API endpoint: ${error}`);
  }
});

export default {
  app,
};
