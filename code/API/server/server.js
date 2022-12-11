const express = require('express');
var cors = require('cors')

const routes = require('./routes')
const config = require('./config.json')

const app = express();

app.use(cors({ credentials: true, origin: ['http://localhost:3000'] }));

app.get('/players_batting_bs', routes.players_batting_bs);

app.get('/players_pitching_bs', routes.players_pitching_bs);


app.listen(config.server_port, () => {
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`);
});

module.exports = app;
