import imageAPI from '../index';
import request from 'supertest'; // found request for testing of express-apps with the help of ChatGPT
import imgUtils from '../utilities/imgUtils';

describe('Test API Endpoint', () => {
  describe('Test Accessibility of API Endpoint', () => {
    it('should successfully reach the /api/images endpoint', async () => {
      const res = await request(imageAPI.app).get(
        '/api/images?filename=test.jpg&width=200&height=200',
      );
      expect(res.status).toBe(200);
    });
    it('should return 404 for non-existent endpoint', async () => {
      const res = await request(imageAPI.app).get('/api/nonexistent');
      expect(res.status).toBe(404);
    });
  });

  describe('Test responses of API to missing parameters', () => {
    it('returns an error if parameters are missing (filename)', async () => {
      const res = await request(imageAPI.app).get(
        '/api/images?width=200&height=200',
      );
      expect(res.text).toContain('Parameters missing: filename');
    });
    it('returns an error if parameters are missing (width)', async () => {
      const res = await request(imageAPI.app).get(
        '/api/images?filename=test.jpg&height=200',
      );
      expect(res.status).toBe(200);
      expect(res.text).toContain('Parameters missing: width');
    });

    it('returns an error if parameters are missing (height)', async () => {
      const res = await request(imageAPI.app).get(
        '/api/images?filename=test.jpg&width=200',
      );
      expect(res.status).toBe(200);
      expect(res.text).toContain('Parameters missing: height');
    });
  });

  describe('Test for internal server errors', () => {
    it('should return 500 error if an internal error occurs', async () => {
      // implemented spyOn-function with the help of ChatGPT
      spyOn(imgUtils, 'validateQueryParams').and.throwError('Internal Error');
      const res = await request(imageAPI.app).get(
        '/api/images?filename=test.jpg&width=200&height=200',
      );
      expect(res.status).toBe(500);
      expect(res.text).toContain('Could not reach API endpoint');
    });
  });
});
