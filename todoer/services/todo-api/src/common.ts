import { ServerlessMysql } from 'serverless-mysql';
interface Todo {
  id?: number;
  created?: string;
  uuid: string;
  title: string;
  task: string;
  userId: string;
  done: boolean;
  dueDate?: string;
  shouldAlert: string;
  imageUrl?: string;
}
export const init = async (client: ServerlessMysql): Promise<unknown> => {
  console.log('Starting init with client: ', client);
  try {
    const result = await client.query(`Create Table if NOT EXISTS todos (
      id MEDIUMINT UNSIGNED not null AUTO_INCREMENT, 
      created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      uuid char(36) not null, 
      title varchar(100) not null,
      task varchar(150) not null,
      user_id varchar(100) not null,
      done boolean not null,
      due_date TIMESTAMP NULL DEFAULT null,
      should_alert boolean DEFAULT FALSE,
      image_url varchar(100),
      PRIMARY KEY (id)
    )`);
    console.log('finished table create');
    return result;
  } catch (e) {
    console.log(`failed to create table: ${e}`);
  }
};
export const createTodo = async (
  client: ServerlessMysql,
  todo: Todo,
): Promise<unknown> => {
  const result = await client.query(
    `INSERT INTO todos (uuid, title, task, user_id, done, due_date, should_alert, image_url) VALUES( ?, ?,?,?,?,?,?,?)`,
    [
      todo.uuid,
      todo.title,
      todo.task,
      todo.userId,
      todo.done,
      todo.dueDate,
      todo.shouldAlert,
      todo.imageUrl,
    ],
  );
  console.log('result of create: ', result);
  return result;
};
export const getTodo = async (
  client: ServerlessMysql,
  id: string,
): Promise<Todo> => {
  const todosFromDB = await client.query<Todo>(
    `SELECT * FROM todos WHERE id = ?`,
    [id],
  );

  return todosFromDB;
};

export const listTodo = async (
  client: ServerlessMysql,
  userId: string,
): Promise<Todo[]> => {
  const todosFromDB = await client.query<Todo[]>(
    `SELECT * FROM todos WHERE user_id = ?`,
    [userId],
  );

  return todosFromDB;
};

export const updateTodo = async (
  client: ServerlessMysql,
  todo: Todo,
): Promise<Todo[]> => {
  const todoFromDb = await client
    .transaction()
    .query(
      `UPDATE todos SET title = ?, task = ?, done = ?, due_date = ?, should_alert = ?, image_url = ? WHERE id = ?`,
      [
        todo.title,
        todo.task,
        todo.done,
        todo.dueDate,
        todo.shouldAlert,
        todo.imageUrl,
        todo.id,
      ],
    )
    .query((r: { affectedRows: number }) => {
      if (r.affectedRows > 0) {
        return [`SELECT * FROM todos WHERE id = ?`, [todo.id]];
      } else {
        return null;
      }
    })
    .commit<Todo>();
  return todoFromDb;
};
export const deleteTodo = async (
  client: ServerlessMysql,
  id: string,
): Promise<unknown> => {
  const result = await client.query(`DELETE FROM todos WHERE id = ?`, [id]);
  return result;
};

export type { Todo };
