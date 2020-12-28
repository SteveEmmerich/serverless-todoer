import { Context, APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import middy from '@middy/core';
import cors from '@middy/http-cors';
import jsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import validator from '@middy/validator';

import { updateTodo, init, Todo } from './common';
import serverlessMysql from 'serverless-mysql';

const mysql = serverlessMysql({
  config: {
    host: process.env.ENDPOINT,
    database: process.env.DATABASE,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
  },
});

const schema = {
  required: ['body'],
  properties: {
    body: {
      id: 'string',
      title: 'string',
      task: 'string',
      done: 'boolean',
      shouldAlert: 'boolean',
      dueDate: 'string',
      imageUrl: 'string',
    },
  },
};
export const update = middy(
  async (
    event: APIGatewayEvent,
    context: Context,
  ): Promise<APIGatewayProxyResult> => {
    const userId = event.requestContext.identity?.cognitoIdentityId as string;
    const uid = context.identity;
    console.log(`userId: ${userId} \n uid: ${uid}`);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const {
      id,
      uuid,
      title,
      task,
      done,
      shouldAlert,
      dueDate,
      imageUrl,
      created,
    } = event.body;
    await init(mysql);
    console.log(`todo: ${id}`);
    const todos = await updateTodo(mysql, {
      id,
      uuid,
      title,
      task,
      done,
      shouldAlert,
      dueDate,
      imageUrl,
      created,
      userId,
    });
    await mysql.end();
    return {
      statusCode: 200,
      body: JSON.stringify(todos),
    };
  },
)
  .use(cors())
  .use(jsonBodyParser())
  .use(validator({ inputSchema: schema }))
  .use(httpErrorHandler());
