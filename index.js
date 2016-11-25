const express = require('express');

const app = express();

app.get('/', (req, res) => {
  return res.json({ hello: 'world' });
});


app.listen(3000, () => console.log('listening on port 3000'));
