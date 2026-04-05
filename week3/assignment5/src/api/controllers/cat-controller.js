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
  const updated = await modifyCat(req.params.id, req.body);

  if (updated) {
    res.json({
      message: 'Cat updated successfully',
      updated,
    });
  } else {
    res.sendStatus(404);
  }

  res.sendStatus(200);
};

const deleteCat = async (req, res) => {
  const ok = await deleteCatMod(req.params.id);
  if (ok) {
    res.json({message: 'Cat deleted'});
  } else {
    res.sendStatus(404);
  }
  res.sendStatus(200);
};

export {getCat, getCatById, getCatsByUserId, postCat, putCat, deleteCat};