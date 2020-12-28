import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import middy from '@middy/core';
import cors from '@middy/http-cors';
import { getTodo, init } from './common';
import serverlessMysql from 'serverless-mysql';

const mysql = serverlessMysql({
  config: {
    host: process.env.ENDPOINT,
    database: process.env.DATABASE,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
  },
});

export const get = middy(
  async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    const id = event?.pathParameters?.id as string;
    console.log('todo id: ', id);
    await init(mysql);
    const todos = await getTodo(mysql, id);
    await mysql.end();
    return {
      statusCode: 200,
      body: JSON.stringify(todos),
    };
  },
).use(cors());
