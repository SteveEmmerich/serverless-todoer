import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import middy from '@middy/core';
import cors from '@middy/http-cors';
import jsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import validator from '@middy/validator';
import { createTodo, init } from './common';
import { v4 as uuidv4 } from 'uuid';
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
      title: 'string',
      task: 'string',
      done: 'boolean',
    },
  },
};
export const create = middy(
  async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    const userId = event.requestContext.identity.cognitoIdentityId as string;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { title, task, done, shouldAlert, dueDate, imageUrl } = event.body;
    const uuid = uuidv4();
    await init(mysql);
    const todo = await createTodo(mysql, {
      title,
      task,
      done,
      shouldAlert,
      dueDate,
      imageUrl,
      uuid,
      userId,
    });
    await mysql.end();
    return {
      statusCode: 200,
      body: JSON.stringify(todo),
    };
  },
)
  .use(cors())
  .use(jsonBodyParser())
  .use(validator({ inputSchema: schema }))
  .use(httpErrorHandler());
