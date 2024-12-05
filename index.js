const express = require('express');
const generateGif = require('./routes/generateGif');

const app = express();
const port = process.env.PORT || 3000;

app.get('/generate-gif', generateGif);
    
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});