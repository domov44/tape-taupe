const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());


app.listen(8081, () => {
    console.log("le serveur back tourne correctement")
})