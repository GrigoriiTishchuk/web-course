import {
  addCat,
  findCatById,
  findCatsByUserId,
  listAllCats,
  modifyCat,
  deleteCatMod,
} from '../models/cat-model.js';

const getCat = async (req, res) => {
  res.json(await listAllCats());
};

const getCatById = async (req, res) => {
  const cat = await findCatById(req.params.id);
  if (cat) {
    res.json(cat);
  } else {
    res.sendStatus(404);
  }
};

const getCatsByUserId = async (req, res) => {
  const cats = await findCatsByUserId(req.params.id);
  res.json(cats);
};


const postCat = async (req, res) => {
  const result = await addCat({
    ...req.body,
    filename: req.file?.filename,
  });
  if (result.cat_id) {
    res.status(201);
    res.json({message: 'New cat added.', result});
    console.log('FORM DATA:', req.body);
    console.log('FILE DATA:', req.file);
  } else {
    res.sendStatus(400);
  }
};

const putCat = async (req, res) => {
  const user = res.locals.user;
  const catId = req.params.id;
  if (user.role !== 'admin') {
    const cat = await getCatById(catId);
    if (!cat) {
      return res.status(404).json({message: 'Cat not found'});
    }
    if (cat.owner !== user.user_id) {
      return res.status(403).json({message: 'Not allowed'});
    }
  }

  const updated = await modifyCat(req.body, catId, res.locals.user);
  res.json(updated);
};

const deleteCat = async (req, res) => {
  const user = res.locals.user;
  const catId = req.params.id;
  if (user.role !== 'admin') {
    const cat = await getCatById(catId);
    if (!cat) {
      return res.status(404).json({message: 'Cat not found'});
    }
    if (cat.owner !== user.user_id) {
      return res.status(403).json({message: 'Not allowed'});
    }
  }
  const result = await deleteCatMod(catId, res.locals.user);
  res.json({message: 'Cat deleted', result});
};

export {getCat, getCatById, getCatsByUserId, postCat, putCat, deleteCat};