import { APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import middy from '@middy/core';
import cors from '@middy/http-cors';
import { init, listTodo } from './common';
import serverlessMysql from 'serverless-mysql';

const mysql = serverlessMysql({
  config: {
    host: process.env.ENDPOINT,
    database: process.env.DATABASE,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
  },
  onError: (e: unknown) => {
    console.log(`mysql connection error: ${e}`);
  },
});

export const list = middy(
  async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    const userId = event.requestContext.identity?.cognitoIdentityId as string;
    console.log('we have been called user: ' + userId);
    await init(mysql);
    console.log('init called');
    const todos = await listTodo(mysql, userId);
    console.log('list called');
    await mysql.end();
    console.log('end called');
    return {
      statusCode: 200,
      body: JSON.stringify(todos),
    };
  },
).use(cors());
