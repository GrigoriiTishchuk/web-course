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
];

const listAllUsers = () => {
  return userItems;
};

const findUserById = (id) => {
  return userItems.find((item) => item.user_id == id);
};

const addUser = (user) => {
  const {name, username, email, role, password} = user;
  const newId = userItems[userItems.length - 1].user_id + 1;
  userItems.push({
    user_id: newId,
    name,
    username,
    email,
    role,
    password,
  });
  return {user_id: newId};
};

const updateUser = (id, data) => {
  const index = userItems.findIndex((user) => user.user_id == id);
  if (index === -1) return null;

  userItems[index] = {
    ...userItems[index],
    ...data,
  };

  return userItems[index];
};

const deleteUserModel = (id) => {
  const index = userItems.findIndex((user) => user.user_id == id);
  if (index === -1) return false;

  userItems.splice(index, 1);
  return true;
};

export {listAllUsers, findUserById, addUser, updateUser, deleteUserModel};