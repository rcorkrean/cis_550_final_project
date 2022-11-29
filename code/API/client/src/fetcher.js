import config from './config.json'

const getPlayersBattingBS = async (page, pagesize, splitseasons, splitteams) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/players_batting_bs?page=${page}&pagesize=${pagesize}&splitseasons=${splitseasons}&splitteams=${splitseasons}`, {
        method: 'GET',
    })
    return res.json()
}

const getPlayersBattingBSSearch = async (page, pagesize, splitseasons, splitteams, pa_threshold) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/search/players?Name=$page=${page}&pagesize=${pagesize}&splitseasons=${splitseasons}&splitteams=${splitseasons}&pa_threshold=${pa_threshold}`, {
        method: 'GET',
    })
    return res.json()
}

const getAllMatches = async (page, pagesize, league) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/matches/${league}?page=${page}&pagesize=${pagesize}`, {
        method: 'GET',
    })
    return res.json()
}

const getAllPlayers = async (page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/players?page=${page}&pagesize=${pagesize}`, {
        method: 'GET',
    })
    return res.json()
}

const getMatch = async (id) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/match?id=${id}`, {
        method: 'GET',
    })
    return res.json()
}

const getPlayer = async (id) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/player?id=${id}`, {
        method: 'GET',
    })
    return res.json()
}

const getMatchSearch = async (home, away, page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/search/matches?Home=${home}&Away=${away}&page=${page}&pagesize=${pagesize}`, {
        method: 'GET',
    })
    return res.json()
}

const getPlayerSearch = async (name, nationality, club, rating_high, rating_low, pot_high, pot_low, page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/search/players?Name=${name}&Nationality=${nationality}&Club=${club}&RatingLow=${rating_low}&RatingHigh=${rating_high}&PotentialHigh=${pot_high}&PotentialLow=${pot_low}&page=${page}&pagesize=${pagesize}`, {
        method: 'GET',
    })
    return res.json()
}

export {
    getPlayersBattingBS,
    getPlayersBattingBSSearch,
    getAllMatches,
    getAllPlayers,
    getMatch,
    getPlayer,
    getMatchSearch,
    getPlayerSearch
}