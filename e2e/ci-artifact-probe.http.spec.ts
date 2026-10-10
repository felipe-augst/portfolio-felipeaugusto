import { expect, test } from './fixtures'

// Temporário: força uma falha para verificar o upload do relatório no CI.
test('sonda de falha do CI', async ({ request }) => {
  const response = await request.get('/')

  expect(response.status()).toBe(418)
})
