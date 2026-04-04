import express from 'express';
const hostname = '127.0.0.1';
const app = express();
const port = 3000;

app.get('/api/v1/cats', (req, res) => {
  res.json({
    cat_id: 1,
    name: 'Little one',
    birthdate: '2016-09-16',
    weight: 4.2,
    owner: 'Grigorii',
    image: 'http://localhost:3000/public/test.jpg',
  });
});

app.use('/public', express.static('public'));
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});