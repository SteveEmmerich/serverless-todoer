import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { list } from '../list';

test('list', async () => {
  const event = { body: 'Test Body' } as APIGatewayEvent;
  const context = {
    identity: {
      cognitoIdentityId: 'USER-SUB-1234',
    },
  } as Context;

  await list(
    event,
    context,
    (error: unknown, response: APIGatewayProxyResult | undefined) => {
      expect(response?.statusCode).toEqual(200);
      expect(typeof response?.body).toBe('string');
      console.log('callback', error);
    },
  );
});
