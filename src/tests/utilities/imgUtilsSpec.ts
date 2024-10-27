import imgUtils from '../../utilities/imgUtils';
import path from 'path';

describe('Test image utilities', () => {
  const { filePath, resizedFilePath } = imgUtils.generateFilePaths(
    'fjord',
    100,
    100,
  );

  // test validateQueryParams
  describe('Test validation of query params', () => {
    it('answers that all parameters are missing', () => {
      const missingParameters = imgUtils.validateQueryParams('', NaN, NaN);
      expect(missingParameters.length).toBe(3);
    });
    it('answers that width is parameters missing', () => {
      const missingParameters = imgUtils.validateQueryParams('fjord', NaN, 300);
      expect(missingParameters).toEqual(['width (as number in px only)']);
    });
    it('answers that no parameters are missing', () => {
      const missingParameters = imgUtils.validateQueryParams('fjord', 200, 300);
      expect(missingParameters).toEqual([]);
    });
  });

  // test generation of file paths
  describe('Test generation of file paths', () => {
    it('returns the correct file path of the original image', () => {
      expect(filePath).toEqual(path.resolve('./assets/full/fjord.jpg'));
    });
    it('returns the correct file path of a transformed image', () => {
      expect(resizedFilePath).toEqual(
        path.resolve('./assets/thumb/fjord_100x100.jpg'),
      );
    });
  });

  // test accessing files
  describe('Test accessing files', () => {
    it('answers that the file exists', () => {
      const existsBool = imgUtils.fileExists(filePath);
      expect(existsBool).toBeTrue;
    });
    it('answers that the file does not exists', () => {
      const existsBool = imgUtils.fileExists('false');
      expect(existsBool).toBeFalse;
    });
  });

  // test image transform function
  describe('Test image transform function', () => {
    const width = 100;
    const height = 100;
    it('should not throw an error', async () => {
      expect(
        await imgUtils.resizeAndCacheImage(
          filePath,
          width,
          height,
          resizedFilePath,
        ),
      ).not.toThrowError;
    });
    it('should throw specific error (input file missing)', async () => {
      await expectAsync(
        imgUtils.resizeAndCacheImage(
          'filePath',
          width,
          height,
          resizedFilePath,
        ),
      ).toBeRejectedWithError(
        'Could not transform image: Input file is missing: filePath',
      );
    });
    it('should throw specific error (width missing)', async () => {
      await expectAsync(
        imgUtils.resizeAndCacheImage(filePath, NaN, height, resizedFilePath),
      ).toBeRejectedWithError(
        'Could not transform image: Expected positive integer for width but received NaN of type number',
      );
    });
  });
});
