const request = require('supertest');
const app = require('./server');

test('should return Vladislav Petrikey message on /', async () => {
  const response = await request(app).get('/');
  expect(response.statusCode).toBe(200);
  expect(response.text).toBe('Hello world. This lab doing is Vladislav Petrikey');
});