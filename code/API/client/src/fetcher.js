import config from './config.json'

const getPlayersBattingBS = async (page, pagesize, splitseasons, splitteams, pa_threshold) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/players_batting_bs?page=${page}&pagesize=${pagesize}&splitseasons=${splitseasons}&splitteams=${splitteams}&pa_threshold=${pa_threshold}`, {
        method: 'GET',
    })
    return res.json()
}

const getPlayersPitchingBS = async (page, pagesize, splitseasons, splitteams) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/players_pitching_bs?page=${page}&pagesize=${pagesize}&splitseasons=${splitseasons}&splitteams=${splitseasons}`, {
        method: 'GET',
    })
    return res.json()
}

export {
    getPlayersBattingBS,
    getPlayersPitchingBS,
}