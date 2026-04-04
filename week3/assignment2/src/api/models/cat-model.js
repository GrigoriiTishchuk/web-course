const catItems = [
  {
    cat_id: 9592,
    cat_name: 'Mors',
    weight: 11,
    owner: 'Grigorii',
    filename: 'f3dbafakjsdfhg4',
    birthdate: '2025-10-12',
  },
  {
    cat_id: 9590,
    cat_name: 'Miso-soup',
    weight: 8,
    owner: 'Grigorii',
    filename: 'f3dasdfkjsdfhgasdf',
    birthdate: '2010-10-12',
  },
];

const listAllCats = () => catItems;

const findCatById = (id) => catItems.find((item) => item.cat_id == id);

const addCat = (cat) => {
  const { cat_name, weight, owner, filename, birthdate } = cat;
  const newId = catItems.length > 0 ? catItems[0].cat_id + 1 : 1000;
  catItems.unshift({
    cat_id: newId,
    cat_name,
    weight,
    owner,
    filename,
    birthdate,
  });
  return { cat_id: newId };
};

const updateCat = (id, updates) => {
  const index = catItems.findIndex((item) => item.cat_id == id);
  if (index !== -1) {
    catItems[index] = { ...catItems[index], ...updates };
    return true;
  }
  return false;
};

const deleteCat = (id) => {
  const index = catItems.findIndex((item) => item.cat_id == id);
  if (index !== -1) {
    catItems.splice(index, 1);
    return true;
  }
  return false;
};

export { listAllCats, findCatById, addCat, updateCat, deleteCat };