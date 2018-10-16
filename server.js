const express = require('express');
const path = require('path');
// const app = express();

const app = require("./app");


const port = process.env.PORT || 5000;


if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, 'client/build')));

    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}
try {
    app.listen(port, () => console.log(`Listening on port ${port}`));
} catch(error) {
    console.log("error", error,"port", port);
}
