
import { test, expect } from '../fixtures';

test.describe('Search API', () => {
  test('[ind a product when the search query contains a typo', async ({ shopApi }) => {

    const response = await shopApi.search('hammet');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.results).toContainEqual(

      expect.objectContaining({
        name: 'Claw Hammer',
      })
    );
  });

  test('Reject an empty search query', async ({ shopApi }) => {
    const response = await shopApi.search('');
    expect(response.status()).toBe(400);

    const body = await response.json();
    
  });

  test('Return no results for a non-existing product', async ({ shopApi }) => {
    const response = await shopApi.search('banana');

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.results).toEqual([]);
  });

  test('Handle a very long search query', async ({ shopApi }) => {
    const query = 'hammer' + ' '.repeat(50) + 'unicorn';

    const response = await shopApi.search(query);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.query).toBe(query.slice(0, 50));

    expect(body.results).toContainEqual(

      expect.objectContaining({
        name: 'Claw Hammer',
      })
    );
  });
});
