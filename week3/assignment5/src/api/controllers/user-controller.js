import {
  addUser,
  findUserById,
  listAllUsers,
  updateUser,
  deleteUserModel,
} from '../models/user-model.js';

const getUser = (req, res) => {
  res.json(listAllUsers());
};

const getUserById = (req, res) => {
  const user = findUserById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.sendStatus(404);
  }
};

const postUser = (req, res) => {
  const result = addUser(req.body);
  if (result.user_id) {
    res.status(201);
    res.json({message: 'New user added.', result});
  } else {
    res.sendStatus(400);
  }
};

const putUser = (req, res) => {
  const updated = updateUser(req.params.id, req.body);

  if (updated) {
    res.json({
      message: 'User updated successfully',
      updated,
    });
  } else {
    res.sendStatus(404);
  }

  res.sendStatus(200);
};

const deleteUser = (req, res) => {
  const ok = deleteUserModel(req.params.id);
  if (ok) {
    res.json({message: 'User deleted'});
  } else {
    res.sendStatus(404);
  }
  res.sendStatus(200);
};

export {getUser, getUserById, postUser, putUser, deleteUser};