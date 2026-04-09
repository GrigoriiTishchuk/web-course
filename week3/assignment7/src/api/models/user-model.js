import promisePool from '../../utils/database.js';

// mock data
const userItems = [
  {
    user_id: 3609,
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@metropolia.fi',
    role: 'user',
    password: 'password',
  },
  {
    user_id: 3602,
    name: 'Jane Smith',
    username: 'janesmith',
    email: 'jane@metropolia.fi',
    role: 'admin',
    password: 'password',
  },
  {
  "name": "Alice Smith",
  "username": "alice_dev",
  "email": "alice.smith@techmail.com",
  "role": "user",
  "password": "password"
}
];

const listAllUsers = async () => {
  const [rows] = await promisePool.query('SELECT * FROM wsk_users');
  console.log('rows', rows);
  return rows;
};

const findUserById = async (id) => {
  const [rows] = await promisePool.execute(
    'SELECT * FROM wsk_users WHERE user_id = ?',
    [id]
  );
  console.log('rows', rows);
  if (rows.length === 0) {
    return false;
  }
  return rows[0];
};

const findUserByUsername = async (username) => {
  const sql = `SELECT * FROM wsk_users WHERE username = ?`;
  const [rows] = await promisePool.execute(sql, [username]);
  if (rows.length === 0) {
    return false;
  }
  return rows[0];
};

const addUser = async (user) => {
  const {name, username, email, role, password} = user;
  const sql = `INSERT INTO wsk_users (name, username, email, role, password)
               VALUES (?, ?, ?, ?, ?)`;
  const params = [name, username, email, role, password];
  const [rows] = await promisePool.execute(sql, params);
  console.log('rows', rows);
  if (rows.affectedRows === 0) {
    return false;
  }
  return {user_id: rows.insertId};
};

const updateUser = async (id, data) => {
  const sql = promisePool.format(`UPDATE wsk_users SET ? WHERE user_id = ?`, [
    data,
    id,
  ]);
  const [rows] = await promisePool.execute(sql);
  console.log('rows', rows);
  if (rows.affectedRows === 0) {
    return false;
  }
  return {message: 'success'};
};

const deleteUserModel = async (id) => {
  const conn = await promisePool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.execute('DELETE FROM wsk_cats WHERE owner = ?', [id]);
    const [result] = await conn.execute(
      'DELETE FROM wsk_users WHERE user_id = ?',
      [id]
    );

    await conn.commit();
    if (result.affectedRows === 0) {
      return false;
    }

    return {message: 'success'};
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

export {listAllUsers, findUserById, findUserByUsername, addUser, updateUser, deleteUserModel};