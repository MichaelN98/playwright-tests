import { test, expect } from '@playwright/test';
import { STORAGE_STATE } from '../auth.setup.js';

/**
 * Task 2 — API tests using APIRequestContext
 * Endpoint: POST /api/cars
 * Docs: https://qauto.forstudy.space/api-docs/#/
 *
 * Test suite:
 *   1 positive scenario  — valid car creation → 201 Created
 *   2 negative scenarios — missing mileage → 400 Bad Request
 *                        — non-existent carBrandId → 404 Not Found
 */
test.describe('Task 2 - POST /api/cars using APIRequestContext', () => {
  // Reuse the authenticated session saved by auth.setup.js
  test.use({ storageState: STORAGE_STATE });

  test('positive: should create a car with valid data and return 201', async ({ request }) => {
    const response = await request.post('/api/cars', {
      data: {
        carBrandId: 1,  // Audi
        carModelId: 1,  // TT
        mileage: 100,
      },
    });

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.status).toBe('ok');
    expect(body.data).toMatchObject({
      carBrandId: 1,
      carModelId: 1,
      mileage: 100,
    });
    expect(body.data.id).toEqual(expect.any(Number));
  });

  test('negative: should return 400 when mileage is missing', async ({ request }) => {
    const response = await request.post('/api/cars', {
      data: {
        carBrandId: 1,  // Audi
        carModelId: 1,  // TT
        // mileage is intentionally omitted
      },
    });

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.status).toBe('error');
    expect(body.message).toBeTruthy();
  });

  test('negative: should return 404 when carBrandId does not exist', async ({ request }) => {
    const response = await request.post('/api/cars', {
      data: {
        carBrandId: 99999,  // non-existent brand
        carModelId: 1,
        mileage: 100,
      },
    });

    expect(response.status()).toBe(404);

    const body = await response.json();
    expect(body.status).toBe('error');
  });
});
