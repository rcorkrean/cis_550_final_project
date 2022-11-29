const config = require('./config.json')
const mysql = require('mysql');
const e = require('express');

// TODO: fill in your connection details here
const connection = mysql.createConnection({
    host: 'bsgraphs.chez00e9c8f2.us-east-2.rds.amazonaws.com',
    user: 'rcorkrean',
    password: 'Clone0701!',
    port: '3306',
    database: 'BSGRAPHS'
});
connection.connect();


// ********************************************
//            SIMPLE ROUTE EXAMPLE
// ********************************************

// Route 1 (handler)
async function players_batting_bs(req, res) {
    const page = req.query.page && !isNaN(req.query.page) ? req.query.page : 1;
    const pagesize = req.query.pagesize && !isNaN(req.query.pagesize) ? req.query.pagesize : 50000;
    const splitseasons = req.query.splitseasons && req.query.splitseasons == 'true' ? true : req.query.splitseasons && req.query.splitseasons == 'false' ? false: true;
    const splitteams = req.query.splitteams && req.query.splitteams == 'true' ? true : req.query.splitteams && req.query.splitteams == 'false' ? false: false;
    const seasons = req.query.seasons ? req.query.seasons : Array.from({length: 8}, (_, i) => i + 2015);
    const teams = req.query.teams ? req.query.teams : ['ARI', 'ATL', 'BAL', 'BOS', 'CHC', 'CIN', 'CLE', 'COL', 'CWS', 'DET', 'HOU', 'KC', 'LAA', 'LAD', 'MIA', 'MIL', 'MIN', 'NYM', 'NYY', 'OAK', 'PHI', 'PIT', 'SD', 'SEA', 'SF', 'STL', 'TB', 'TEX', 'TOR', 'WSH'];
    const pa_threshold = req.query.pa_threshold ? req.query.pa_threshold : 423;
    if (splitseasons) {
        if (splitteams) {
        connection.query(`SELECT bs.PlayerID, p.Name, bs.Season AS \`Season(s)\`, bs.Age AS \`Age(s)\`, bs.Team AS \`Team(s)\`, bs.G, bs.PA, bs.BBE, CONCAT(ROUND(bs.\`BB%\`* 100, 1), '%') AS \`BB%\`, CONCAT(ROUND(bs.\`K%\` * 100, 1), '%') AS \`K%\`, ROUND(bs.EV, 1) AS EV, ROUND(bs.maxEV, 1) AS maxEV, CONCAT(ROUND(bs.\`Barrels/PA\` * 100, 1), '%') AS \`Barrels/PA\`, ROUND(bs.BA, 3) AS BA, ROUND(bs.xBA, 3) AS xBA, ROUND(bs.BABIP, 3) AS BABIP, ROUND((bs.xBA * bs.AB - bs.HR) / (bs.AB - bs.HR - bs.K + bs.SF), 3) AS xBABIP, ROUND(bs.OBP, 3) AS OBP, ROUND((bs.xBA * bs.AB + bs.BB + bs.HBP) / bs.PA, 3) AS xOBP, ROUND(bs.SLG, 3) AS SLG, ROUND(bs.xSLG, 3) AS xSLG, ROUND(bs.ISO, 3) AS ISO, ROUND(bs.xSLG - bs.xBA, 3) AS xISO, ROUND(bs.wOBA, 3) AS wOBA, ROUND(bs.xwOBA, 3) AS xwOBA, ROUND(bs.wOBA * bs.PA - CASE WHEN bs.Season = 2015 THEN 0.687 WHEN bs.Season = 2016 THEN 0.691 WHEN bs.Season = 2017 THEN 0.693 WHEN bs.Season IN (2018, 2019) THEN 0.690 WHEN bs.Season = 2020 THEN 0.699 WHEN bs.Season = 2021 THEN 0.692 WHEN bs.Season = 2022 THEN 0.689 END * (bs.BB - bs.IBB) - CASE WHEN bs.Season = 2015 THEN 0.718 WHEN bs.Season = 2016 THEN 0.721 WHEN bs.Season = 2017 THEN 0.723 WHEN bs.Season IN (2018, 2022) THEN 0.72 WHEN bs.Season = 2019 THEN 0.719 WHEN bs.Season = 2020 THEN 0.728 WHEN bs.Season = 2021 THEN 0.722 END * bs.HBP, 3) as wOBAcon, ROUND(bs.xwOBAcon, 3) AS xwOBAcon, ROUND(bs.\`wRC+\`) AS \`wRC+\`, bs.WAR
                          FROM (SELECT PlayerID, Season, Age, Team, G, AB, PA, BBE, HR, K, BB, IBB, HBP, SF, \`BB%\`, \`K%\`, EV, maxEV, \`Barrels/PA\`, BA, xBA, BABIP, OBP, SLG, xSLG, ISO, wOBA, xwOBA, xwOBAcon, \`wRC+\`, WAR
                                FROM BattingStats
                                WHERE Season IN (${seasons.join(', ')}) AND Team IN ('${teams.join("', '")}') AND PA >= ${pa_threshold}) AS bs
                          JOIN Players AS p
                          ON bs.PlayerID = p.ID
                          ORDER BY bs.WAR DESC, SUBSTRING_INDEX(p.Name, ' ', -1), SUBSTRING_INDEX(p.Name, ' ', 1)
                          LIMIT ${pagesize} OFFSET ${(page - 1) * pagesize};`,
                         function (error, results, fields) {
                            if (error) {
                                console.log(error)
                                res.json({ error: error })
                            } else if (results) {
                                res.json({ results: results })
                            }
                         });
        } else {
            connection.query(`SELECT bs2.PlayerID, p.Name, bs2.\`Season(s)\`, bs2.\`Age(s)\`, COALESCE(bs3.Team, bs2.\`Team(s)\`) AS \`Team(s)\`, bs2.G, bs2.PA, bs2.BBE, CONCAT(ROUND(bs2.\`BB%\`* 100, 1), '%') AS \`BB%\`, CONCAT(ROUND(bs2.\`K%\` * 100, 1), '%') AS \`K%\`, ROUND(bs2.EV, 1) AS EV, ROUND(bs2.maxEV, 1) AS maxEV, CONCAT(ROUND(bs2.\`Barrels/PA\` * 100, 1), '%') AS \`Barrels/PA\`, ROUND(bs2.BA, 3) AS BA, ROUND(bs2.xBA, 3) AS xBA, ROUND(bs2.BABIP, 3) AS BABIP, ROUND(bs2.xBABIP, 3) AS xBABIP, ROUND(bs2.OBP, 3) AS OBP, ROUND(bs2.xOBP, 3) AS xOBP, ROUND(bs2.SLG, 3) AS SLG, ROUND(bs2.xSLG, 3) AS xSLG, ROUND(bs2.ISO, 3) AS ISO, ROUND(bs2.xISO, 3) AS xISO, ROUND(bs2.wOBA, 3) AS wOBA, ROUND(bs2.xwOBA, 3) AS xwOBA, ROUND(bs2.woBACon, 3) as wOBAcon, ROUND(bs2.xwOBAcon, 3) AS xwOBAcon, ROUND(bs2.\`wRC+\`) AS \`wRC+\`, bs2.WAR
                              FROM (SELECT bs1.PlayerID, bs1.Season AS \`Season(s)\`, bs1.Age AS \`Age(s)\`, c.NumTeams AS \`Team(s)\`, SUM(bs1.G) AS G, SUM(bs1.PA) AS PA, SUM(bs1.BBE) AS BBE, SUM(bs1.\`BB%\` * bs1.PA) / SUM(bs1.PA) AS \`BB%\`, SUM(bs1.\`K%\` * bs1.PA) / SUM(bs1.PA) AS \`K%\`, SUM(bs1.EV * bs1.BBE) / SUM(bs1.BBE) AS EV, MAX(bs1.maxEV) AS maxEV, SUM(bs1.\`Barrels/PA\` * bs1.PA) / SUM(bs1.PA) AS \`Barrels/PA\`, SUM(bs1.BA * bs1.AB) / SUM(bs1.AB) AS BA, SUM(bs1.xBA * bs1.AB) / SUM(bs1.AB) AS xBA, SUM(bs1.BABIP * bs1.BBE) / SUM(bs1.BBE) AS BABIP, SUM((bs1.xBA * bs1.AB - bs1.HR) / (bs1.AB - bs1.HR - bs1.K + bs1.SF) * bs1.BBE) / SUM(bs1.BBE) AS xBABIP, SUM(bs1.OBP * bs1.PA) / SUM(bs1.PA) AS OBP, SUM(bs1.xBA * bs1.AB + bs1.BB + bs1.HBP) / SUM(bs1.PA) AS xOBP, SUM(bs1.SLG * bs1.AB) / SUM(bs1.AB) AS SLG, SUM(bs1.xSLG * bs1.AB) / SUM(bs1.AB) AS xSLG, SUM(bs1.ISO * bs1.AB) / SUM(bs1.AB) AS ISO, SUM((bs1.xSLG - bs1.xBA) * bs1.AB) / SUM(bs1.AB) AS xISO, SUM(bs1.wOBA * bs1.PA) / SUM(bs1.PA) AS wOBA, SUM(bs1.xwOBA * bs1.PA) / SUM(bs1.PA) AS xwOBA, SUM((bs1.wOBA * bs1.PA - CASE WHEN bs1.Season = 2015 THEN 0.687 WHEN bs1.Season = 2016 THEN 0.691 WHEN bs1.Season = 2017 THEN 0.693 WHEN bs1.Season IN (2018, 2019) THEN 0.690 WHEN bs1.Season = 2020 THEN 0.699 WHEN bs1.Season = 2021 THEN 0.692 WHEN bs1.Season = 2022 THEN 0.689 END * (bs1.BB - bs1.IBB) - CASE WHEN bs1.Season = 2015 THEN 0.718 WHEN bs1.Season = 2016 THEN 0.721 WHEN bs1.Season = 2017 THEN 0.723 WHEN bs1.Season IN (2018, 2022) THEN 0.72 WHEN bs1.Season = 2019 THEN 0.719 WHEN bs1.Season = 2020 THEN 0.728 WHEN bs1.Season = 2021 THEN 0.722 END * bs1.HBP) * bs1.BBE) / SUM(bs1.BBE) as wOBAcon, SUM(bs1.xwOBAcon * bs1.BBE) / SUM(bs1.BBE) AS xwOBACon, SUM(bs1.\`wRC+\` * bs1.PA) / SUM(bs1.PA) AS \`wRC+\`, SUM(bs1.WAR) AS WAR
                                    FROM (SELECT PlayerID, Season, Age, G, AB, PA, BBE, HR, K, BB, IBB, HBP, SF, \`BB%\`, \`K%\`, EV, maxEV, \`Barrels/PA\`, BA, xBA, BABIP, OBP, SLG, xSLG, ISO, wOBA, xwOBA, xwOBAcon, \`wRC+\`, WAR
                                          FROM BattingStats
                                          WHERE Season IN (${seasons.join(', ')}) AND Team IN ('${teams.join("', '")}')) AS bs1
                                    JOIN (SELECT PlayerID, Season, COUNT(*) AS NumTeams
                                          FROM BattingStats
                                          WHERE Season IN (${seasons.join(', ')}) AND Team IN ('${teams.join("', '")}')
                                          GROUP BY PlayerID, Season) AS c
                                    ON bs1.PlayerID = c.PlayerID AND bs1.Season = c.Season
                                    GROUP BY bs1.PlayerID, bs1.Season, bs1.Age) AS bs2
                              JOIN Players AS p
                              ON bs2.PlayerID = p.ID
                              LEFT JOIN (SELECT PlayerID, Season, Team
                                         FROM BattingStats
                                         WHERE Season IN (${seasons.join(', ')}) AND Team IN ('${teams.join("', '")}')) AS bs3
                              ON bs2.PlayerID = bs3.PlayerID AND bs2.\`Season(s)\` = bs3.Season AND bs2.\`Team(s)\` = 1
                              WHERE bs2.PA >= ${pa_threshold}
                              ORDER BY bs2.WAR DESC, SUBSTRING_INDEX(p.Name, ' ', -1), SUBSTRING_INDEX(p.Name, ' ', 1)
                              LIMIT ${pagesize} OFFSET ${(page - 1) * pagesize};`,
                             function (error, results, fields) {
                                if (error) {
                                    console.log(error)
                                    res.json({ error: error })
                                } else if (results) {
                                    res.json({ results: results })
                                }
                             });
        }
    } else {
        if (splitteams) {
        connection.query(`SELECT bs2.PlayerID, p.Name, COALESCE(bs3.Season, bs2.\`Season(s)\`) AS \`Season(s)\`, COALESCE(bs3.Age, bs2.\`Season(s)\`) AS \`Age(s)\`, bs2.\`Team(s)\`, bs2.G, bs2.PA, bs2.BBE, CONCAT(ROUND(bs2.\`BB%\`* 100, 1), '%') AS \`BB%\`, CONCAT(ROUND(bs2.\`K%\` * 100, 1), '%') AS \`K%\`, ROUND(bs2.EV, 1) AS EV, ROUND(bs2.maxEV, 1) AS maxEV, CONCAT(ROUND(bs2.\`Barrels/PA\` * 100, 1), '%') AS \`Barrels/PA\`, ROUND(bs2.BA, 3) AS BA, ROUND(bs2.xBA, 3) AS xBA, ROUND(bs2.BABIP, 3) AS BABIP, ROUND(bs2.xBABIP, 3) AS xBABIP, ROUND(bs2.OBP, 3) AS OBP, ROUND(bs2.xOBP, 3) AS xOBP, ROUND(bs2.SLG, 3) AS SLG, ROUND(bs2.xSLG, 3) AS xSLG, ROUND(bs2.ISO, 3) AS ISO, ROUND(bs2.xISO, 3) AS xISO, ROUND(bs2.wOBA, 3) AS wOBA, ROUND(bs2.xwOBA, 3) AS xwOBA, ROUND(bs2.woBACon, 3) as wOBAcon, ROUND(bs2.xwOBAcon, 3) AS xwOBAcon, ROUND(bs2.\`wRC+\`) AS \`wRC+\`, bs2.WAR
                          FROM (SELECT bs1.PlayerID, c.NumSeasons AS \`Season(s)\`, bs1.Team AS \`Team(s)\`, SUM(bs1.G) AS G, SUM(bs1.PA) AS PA, SUM(bs1.BBE) AS BBE, SUM(bs1.\`BB%\` * bs1.PA) / SUM(bs1.PA) AS \`BB%\`, SUM(bs1.\`K%\` * bs1.PA) / SUM(bs1.PA) AS \`K%\`, SUM(bs1.EV * bs1.BBE) / SUM(bs1.BBE) AS EV, MAX(bs1.maxEV) AS maxEV, SUM(bs1.\`Barrels/PA\` * bs1.PA) / SUM(bs1.PA) AS \`Barrels/PA\`, SUM(bs1.BA * bs1.AB) / SUM(bs1.AB) AS BA, SUM(bs1.xBA * bs1.AB) / SUM(bs1.AB) AS xBA, SUM(bs1.BABIP * bs1.BBE) / SUM(bs1.BBE) AS BABIP, SUM((bs1.xBA * bs1.AB - bs1.HR) / (bs1.AB - bs1.HR - bs1.K + bs1.SF) * bs1.BBE) / SUM(bs1.BBE) AS xBABIP, SUM(bs1.OBP * bs1.PA) / SUM(bs1.PA) AS OBP, SUM(bs1.xBA * bs1.AB + bs1.BB + bs1.HBP) / SUM(bs1.PA) AS xOBP, SUM(bs1.SLG * bs1.AB) / SUM(bs1.AB) AS SLG, SUM(bs1.xSLG * bs1.AB) / SUM(bs1.AB) AS xSLG, SUM(bs1.ISO * bs1.AB) / SUM(bs1.AB) AS ISO, SUM((bs1.xSLG - bs1.xBA) * bs1.AB) / SUM(bs1.AB) AS xISO, SUM(bs1.wOBA * bs1.PA) / SUM(bs1.PA) AS wOBA, SUM(bs1.xwOBA * bs1.PA) / SUM(bs1.PA) AS xwOBA, SUM((bs1.wOBA * bs1.PA - CASE WHEN bs1.Season = 2015 THEN 0.687 WHEN bs1.Season = 2016 THEN 0.691 WHEN bs1.Season = 2017 THEN 0.693 WHEN bs1.Season IN (2018, 2019) THEN 0.690 WHEN bs1.Season = 2020 THEN 0.699 WHEN bs1.Season = 2021 THEN 0.692 WHEN bs1.Season = 2022 THEN 0.689 END * (bs1.BB - bs1.IBB) - CASE WHEN bs1.Season = 2015 THEN 0.718 WHEN bs1.Season = 2016 THEN 0.721 WHEN bs1.Season = 2017 THEN 0.723 WHEN bs1.Season IN (2018, 2022) THEN 0.72 WHEN bs1.Season = 2019 THEN 0.719 WHEN bs1.Season = 2020 THEN 0.728 WHEN bs1.Season = 2021 THEN 0.722 END * bs1.HBP) * bs1.BBE) / SUM(bs1.BBE) as wOBAcon, SUM(bs1.xwOBAcon * bs1.BBE) / SUM(bs1.BBE) AS xwOBACon, SUM(bs1.\`wRC+\` * bs1.PA) / SUM(bs1.PA) AS \`wRC+\`, SUM(bs1.WAR) AS WAR
                                FROM (SELECT PlayerID, Season, Team, G, AB, PA, BBE, HR, K, BB, IBB, HBP, SF, \`BB%\`, \`K%\`, EV, maxEV, \`Barrels/PA\`, BA, xBA, BABIP, OBP, SLG, xSLG, ISO, wOBA, xwOBA, xwOBAcon, \`wRC+\`, WAR
                                      FROM BattingStats
                                      WHERE Season IN (${seasons.join(', ')}) AND Team IN ('${teams.join("', '")}')) AS bs1
                                JOIN (SELECT PlayerID, Team, COUNT(DISTINCT Season) AS NumSeasons
                                      FROM BattingStats
                                      WHERE Season IN (${seasons.join(', ')}) AND Team IN ('${teams.join("', '")}')
                                      GROUP BY PlayerID, Team) AS c
                                ON bs1.PlayerID = c.PlayerID AND bs1.Team = c.Team
                                GROUP BY bs1.PlayerID, bs1.Team) AS bs2
                          JOIN Players AS p
                          ON bs2.PlayerID = p.ID
                          LEFT JOIN (SELECT PlayerID, Season, Age, Team
                                     FROM BattingStats
                                     WHERE Season IN (${seasons.join(', ')}) AND Team IN ('${teams.join("', '")}')) AS bs3
                          ON bs2.PlayerID = bs3.PlayerID AND bs2.\`Team(s)\` = bs3.Team AND bs2.\`Season(s)\` = 1
                          WHERE bs2.PA >= ${pa_threshold}
                          ORDER BY bs2.WAR DESC, SUBSTRING_INDEX(p.Name, ' ', -1), SUBSTRING_INDEX(p.Name, ' ', 1)
                          LIMIT ${pagesize} OFFSET ${(req.query.page - 1) * pagesize};`,
                         function (error, results, fields) {
                            if (error) {
                                console.log(error)
                                res.json({ error: error })
                            } else if (results) {
                                res.json({ results: results })
                            }
                         });
        } else {
            connection.query(`SELECT bs2.PlayerID p.Name, COALESCE(bs3.Season, bs2.\`Season(s)\`) AS \`Season(s)\`, COALESCE(bs3.Age, bs2.\`Season(s)\`) AS \`Age(s)\`, COALESCE(bs4.Team, bs2.\`Team(s)\`) AS \`Team(s)\`, bs2.G, bs2.PA, bs2.BBE, CONCAT(ROUND(bs2.\`BB%\`* 100, 1), '%') AS \`BB%\`, CONCAT(ROUND(bs2.\`K%\` * 100, 1), '%') AS \`K%\`, ROUND(bs2.EV, 1) AS EV, ROUND(bs2.maxEV, 1) AS maxEV, CONCAT(ROUND(bs2.\`Barrels/PA\` * 100, 1), '%') AS \`Barrels/PA\`, ROUND(bs2.BA, 3) AS BA, ROUND(bs2.xBA, 3) AS xBA, ROUND(bs2.BABIP, 3) AS BABIP, ROUND(bs2.xBABIP, 3) AS xBABIP, ROUND(bs2.OBP, 3) AS OBP, ROUND(bs2.xOBP, 3) AS xOBP, ROUND(bs2.SLG, 3) AS SLG, ROUND(bs2.xSLG, 3) AS xSLG, ROUND(bs2.ISO, 3) AS ISO, ROUND(bs2.xISO, 3) AS xISO, ROUND(bs2.wOBA, 3) AS wOBA, ROUND(bs2.xwOBA, 3) AS xwOBA, ROUND(bs2.woBACon, 3) as wOBAcon, ROUND(bs2.xwOBAcon, 3) AS xwOBAcon, ROUND(bs2.\`wRC+\`) AS \`wRC+\`, bs2.WAR
                              FROM (SELECT bs1.PlayerID, c.NumSeasons AS \`Season(s)\`, c.NumTeams AS \`Team(s)\`, SUM(bs1.G) AS G, SUM(bs1.PA) AS PA, SUM(bs1.BBE) AS BBE, SUM(bs1.\`BB%\` * bs1.PA) / SUM(bs1.PA) AS \`BB%\`, SUM(bs1.\`K%\` * bs1.PA) / SUM(bs1.PA) AS \`K%\`, SUM(bs1.EV * bs1.BBE) / SUM(bs1.BBE) AS EV, MAX(bs1.maxEV) AS maxEV, SUM(bs1.\`Barrels/PA\` * bs1.PA) / SUM(bs1.PA) AS \`Barrels/PA\`, SUM(bs1.BA * bs1.AB) / SUM(bs1.AB) AS BA, SUM(bs1.xBA * bs1.AB) / SUM(bs1.AB) AS xBA, SUM(bs1.BABIP * bs1.BBE) / SUM(bs1.BBE) AS BABIP, SUM((bs1.xBA * bs1.AB - bs1.HR) / (bs1.AB - bs1.HR - bs1.K + bs1.SF) * bs1.BBE) / SUM(bs1.BBE) AS xBABIP, SUM(bs1.OBP * bs1.PA) / SUM(bs1.PA) AS OBP, SUM(bs1.xBA * bs1.AB + bs1.BB + bs1.HBP) / SUM(bs1.PA) AS xOBP, SUM(bs1.SLG * bs1.AB) / SUM(bs1.AB) AS SLG, SUM(bs1.xSLG * bs1.AB) / SUM(bs1.AB) AS xSLG, SUM(bs1.ISO * bs1.AB) / SUM(bs1.AB) AS ISO, SUM((bs1.xSLG - bs1.xBA) * bs1.AB) / SUM(bs1.AB) AS xISO, SUM(bs1.wOBA * bs1.PA) / SUM(bs1.PA) AS wOBA, SUM(bs1.xwOBA * bs1.PA) / SUM(bs1.PA) AS xwOBA, SUM((bs1.wOBA * bs1.PA - CASE WHEN bs1.Season = 2015 THEN 0.687 WHEN bs1.Season = 2016 THEN 0.691 WHEN bs1.Season = 2017 THEN 0.693 WHEN bs1.Season IN (2018, 2019) THEN 0.690 WHEN bs1.Season = 2020 THEN 0.699 WHEN bs1.Season = 2021 THEN 0.692 WHEN bs1.Season = 2022 THEN 0.689 END * (bs1.BB - bs1.IBB) - CASE WHEN bs1.Season = 2015 THEN 0.718 WHEN bs1.Season = 2016 THEN 0.721 WHEN bs1.Season = 2017 THEN 0.723 WHEN bs1.Season IN (2018, 2022) THEN 0.72 WHEN bs1.Season = 2019 THEN 0.719 WHEN bs1.Season = 2020 THEN 0.728 WHEN bs1.Season = 2021 THEN 0.722 END * bs1.HBP) * bs1.BBE) / SUM(bs1.BBE) as wOBAcon, SUM(bs1.xwOBAcon * bs1.BBE) / SUM(bs1.BBE) AS xwOBACon, SUM(bs1.\`wRC+\` * bs1.PA) / SUM(bs1.PA) AS \`wRC+\`, SUM(bs1.WAR) AS WAR
                                    FROM (SELECT PlayerID, Season, G, AB, PA, BBE, HR, K, BB, IBB, HBP, SF, \`BB%\`, \`K%\`, EV, maxEV, \`Barrels/PA\`, BA, xBA, BABIP, OBP, SLG, xSLG, ISO, wOBA, xwOBA, xwOBAcon, \`wRC+\`, WAR
                                          FROM BattingStats
                                          WHERE Season IN (${seasons.join(', ')}) AND Team IN ('${teams.join("', '")}')) AS bs1
                                    JOIN (SELECT PlayerID, COUNT(DISTINCT Season) AS NumSeasons, COUNT(DISTINCT Team) AS NumTeams
                                          FROM BattingStats
                                          WHERE Season IN (${seasons.join(', ')}) AND Team IN ('${teams.join("', '")}')
                                          GROUP BY PlayerID) AS c
                                    ON bs1.PlayerID = c.PlayerID
                                    GROUP BY bs1.PlayerID) AS bs2
                              JOIN Players AS p
                              ON bs2.PlayerID = p.ID
                              LEFT JOIN (SELECT DISTINCT PlayerID, Season, Age
                                         FROM BattingStats
                                         WHERE Season IN (${seasons.join(', ')}) AND Team IN ('${teams.join("', '")}')) AS bs3
                              ON bs2.PlayerID = bs3.PlayerID AND bs2.\`Season(s)\` = 1
                              LEFT JOIN (SELECT DISTINCT PlayerID, Team
                                         FROM BattingStats
                                         WHERE Season IN (${seasons.join(', ')}) AND Team IN ('${teams.join("', '")}')) AS bs4
                              ON bs2.PlayerID = bs4.PlayerID AND bs2.\`Team(s)\` = 1
                              WHERE bs2.PA >= ${pa_threshold}
                              ORDER BY bs2.WAR DESC, SUBSTRING_INDEX(p.Name, ' ', -1), SUBSTRING_INDEX(p.Name, ' ', 1)
                              LIMIT ${pagesize} OFFSET ${(req.query.page - 1) * pagesize};`,
                             function (error, results, fields) {
                                if (error) {
                                    console.log(error)
                                    res.json({ error: error })
                                } else if (results) {
                                    res.json({ results: results })
                                }
                             });
        }
    }
}


// ********************************************
//                  WARM UP 
// ********************************************

// Route 2 (handler)
async function jersey(req, res) {
    const colors = ['red', 'blue', 'white']
    const jersey_number = Math.floor(Math.random() * 20) + 1
    const name = req.query.name ? req.query.name : 'player'

    if (req.params.choice === 'number') {
        // TODO: TASK 1: inspect for issues and correct 
        res.json({ message: `Hello, ${name}!`, jersey_number: jersey_number })
    } else if (req.params.choice === 'color') {
        var lucky_color_index = Math.floor(Math.random() * 2);
        // TODO: TASK 2: change this or any variables above to return only 'red' or 'blue' at random (go Quakers!)
        res.json({ message: `Hello, ${name}!`, jersey_color: colors[lucky_color_index] })
    } else {
        // TODO: TASK 3: inspect for issues and correct
        res.json({ message: `Hello, ${name}, we like your jersey!` })
    }
}

// ********************************************
//               GENERAL ROUTES
// ********************************************

async function all_players(req, res) {
    const season = req.params.season ? req.params.season : 2022;
    const splitteams = req.query.splitteams ? req.query.splitteams : False;

    if (splitteams) {
        connection.query(`SELECT *
                          FROM BattingStats
                          WHERE Season = ${season}
                          LIMIT 1`,
                        function (error, results, fields) {
                            if (error) {
                                console.log(error)
                                res.json({ error: error })
                            } else if (results) {
                                res.json({ results: results })
                            }
                        });
    } else {
        connection.query(`SELECT *
                          FROM PitchingStats
                          WHERE Season = ${season}
                          LIMIT 1`,
                        function (error, results, fields) {
                            if (error) {
                                console.log(error)
                                res.json({ error: error })
                            } else if (results) {
                                res.json({ results: results })
                            }
                        });
    }
}

// Route 3 (handler)
async function all_matches(req, res) {
    // TODO: TASK 4: implement and test, potentially writing your own (ungraded) tests
    // We have partially implemented this function for you to 
    // parse in the league encoding - this is how you would use the ternary operator to set a variable to a default value
    // we didn't specify this default value for league, and you could change it if you want! 
    // in reality, league will never be undefined since URLs will need to match matches/:league for the request to be routed here... 
    const league = req.params.league ? req.params.league : 'D1';
    // use this league encoding in your query to furnish the correct results
    // const page = req.params.page ? req.params.page : 1
    const pagesize = req.query.pagesize ? req.query.pagesize : 50;

    if (req.query.page && !isNaN(req.query.page)) {
        // This is the case where page is defined.
        // The SQL schema has the attribute OverallRating, but modify it to match spec! 
        // TODO: query and return results here:
        connection.query(`SELECT MatchId, Date, Time, HomeTeam AS Home, AwayTeam AS Away, FullTimeGoalsH AS HomeGoals, FullTimeGoalsA AS AwayGoals  
                          FROM Matches 
                          WHERE Division = '${league}'
                          ORDER BY HomeTeam, AwayTeam
                          LIMIT ${pagesize} OFFSET ${(req.query.page - 1) * pagesize}`,
                         function (error, results, fields) {
                            if (error) {
                                console.log(error)
                                res.json({ error: error })
                            } else if (results) {
                                res.json({ results: results })
                            }
        });
    } else {
        // we have implemented this for you to see how to return results by querying the database
        connection.query(`SELECT MatchId, Date, Time, HomeTeam AS Home, AwayTeam AS Away, FullTimeGoalsH AS HomeGoals, FullTimeGoalsA AS AwayGoals  
                          FROM Matches 
                          WHERE Division = '${league}'
                          ORDER BY HomeTeam, AwayTeam`,
                         function (error, results, fields) {
                            if (error) {
                                console.log(error)
                                res.json({ error: error })
                            } else if (results) {
                                res.json({ results: results })
                            }
        });
    }
}

// Route 4 (handler)
// async function all_players(req, res) {
//     // TODO: TASK 5: implement and test, potentially writing your own (ungraded) tests
//     const pagesize = req.query.pagesize ? req.query.pagesize : 10;

//     if (req.query.page && !isNaN(req.query.page)) {
//         connection.query(`SELECT PlayerId, Name, Nationality, OverallRating AS Rating, Potential, Club, Value
//                           FROM Players
//                           ORDER BY Name
//                           LIMIT ${pagesize} OFFSET ${(req.query.page - 1) * pagesize}`,
//                          function (error, results, fields) {
//                             if (error) {
//                                 console.log(error)
//                                 res.json({ error: error })
//                             } else if (results) {
//                                 res.json({ results: results })
//                             }
//         });
//     } else {
//         connection.query(`SELECT PlayerId, Name, Nationality, OverallRating AS Rating, Potential, Club, Value
//                           FROM Players
//                           ORDER BY Name`,
//                           function (error, results, fields) {
//                             if (error) {
//                                 console.log(error)
//                                 res.json({ error: error })
//                             } else if (results) {
//                                 res.json({ results: results })
//                             }
//         });
//     }
// }


// ********************************************
//             MATCH-SPECIFIC ROUTES
// ********************************************

// Route 5 (handler)
async function match(req, res) {
    // TODO: TASK 6: implement and test, potentially writing your own (ungraded) tests
    if (!isNaN(req.query.id)) {
        connection.query(`SELECT MatchId, Date, Time, HomeTeam AS Home, AwayTeam AS Away, FullTimeGoalsH AS HomeGoals, FullTimeGoalsA AS AwayGoals, HalfTimeGoalsH AS HTHomeGoals, HalfTimeGoalsA AS HTAwayGoals, ShotsH AS ShotsHome, ShotsA AS ShotsAway, ShotsOnTargetH AS ShotsOnTargetHome, ShotsOnTargetA AS ShotsOnTargetAway, FoulsH AS FoulsHome, FoulsA AS FoulsAway, CornersH AS CornersHome, CornersA AS CornersAway, YellowCardsH AS YCHome, YellowCardsA AS YCAway, RedCardsH AS RCHome, RedCardsA AS RCAway
                          FROM Matches
                          WHERE MatchId = ${req.query.id}`,
                        function (error, results, fields) {
                            if (error) {
                                console.log(error)
                                res.json({ error: error })
                            } else if (results) {
                                return res.json({ results: results })
                            }
                        });
    } else {
        console.log('Not a valid MatchId.')
        res.json( {error: 'Not a valid PlayerId.'} )
    }
}

// ********************************************
//            PLAYER-SPECIFIC ROUTES
// ********************************************

// Route 6 (handler)
async function player(req, res) {
    // TODO: TASK 7: implement and test, potentially writing your own (ungraded) tests
    if (!isNaN(req.query.id)) {
        connection.query(`SELECT PlayerId, Name, Age, Photo, Nationality, Flag, OverallRating AS Rating, Potential, Club, ClubLogo, Value, Wage, InternationalReputation, Skill, JerseyNumber, ContractValidUntil, Height, Weight, BestPosition, BestOverallRating, ReleaseClause, GKPenalties, GKDiving, GKHandling, GKKicking, GKPositioning, GKReflexes, NPassing, NBallControl, NAdjustedAgility, NStamina, NStrength, NPositioning
                          FROM Players
                          WHERE PlayerId = ${req.query.id}`,
                        function (error, results, fields) {
                            if (error) {
                                console.log(error)
                                res.json({ error: error })
                            } else if (results[0]) {
                                const best_position = results[0].BestPosition;
                                if (best_position == 'GK') {
                                    delete results[0].NPassing;
                                    delete results[0].NBallControl;
                                    delete results[0].NAdjustedAgility;
                                    delete results[0].NStamina;
                                    delete results[0].NStrength;
                                    delete results[0].NPositioning;
                                } else {
                                    delete results[0].GKPenalties;
                                    delete results[0].GKDiving;
                                    delete results[0].GKHandling;
                                    delete results[0].GKKicking;
                                    delete results[0].GKPositioning;
                                    delete results[0].GKReflexes;
                                }
                            }
                            res.json({ results: results })
                        });
    } else {
        console.log('Not a valid PlayerId.')
        res.json( {error: 'Not a valid PlayerId.'} )
    }
}

// ********************************************
//             SEARCH ROUTES
// ********************************************

// Route 7 (handler)
async function search_matches(req, res) {
    // TODO: TASK 8: implement and test, potentially writing your own (ungraded) tests
    // IMPORTANT: in your SQL LIKE matching, use the %query% format to match the search query to substrings, not just the entire string
    const pagesize = req.query.pagesize ? req.query.pagesize : 10;
    const Home = req.query.Home ? req.query.Home : '%';
    const Away = req.query.Away ? req.query.Away : '%';

    if (req.query.page && !isNaN(req.query.page)) {
        connection.query(`SELECT MatchId, Date, Time, HomeTeam AS Home, AwayTeam AS Away, FullTimeGoalsH AS HomeGoals, FullTimeGoalsA AS AwayGoals
                          FROM Matches
                          WHERE HomeTeam LIKE '%${Home}%' AND AwayTeam LIKE '%${Away}%'
                          ORDER BY HomeTeam, AwayTeam
                          LIMIT ${pagesize} OFFSET ${(req.query.page - 1) * pagesize}`,
                         function (error, results, fields) {
                            if (error) {
                                console.log(error)
                                res.json({ error: error })
                            } else if (results) {
                                res.json({ results: results })
                            }
        });
    } else {
        connection.query(`SELECT MatchId, Date, Time, HomeTeam AS Home, AwayTeam AS Away, FullTimeGoalsH AS HomeGoals, FullTimeGoalsA AS AwayGoals
                          FROM Matches
                          WHERE HomeTeam LIKE '%${Home}%' AND AwayTeam LIKE '%${Away}%'
                          ORDER BY HomeTeam, AwayTeam`,
                        function (error, results, fields) {
                            if (error) {
                                console.log(error)
                                res.json({ error: error })
                            } else if (results) {
                                res.json({ results: results })
                            }
        });
    }
}

// Route 8 (handler)
async function search_players(req, res) {
    // TODO: TASK 9: implement and test, potentially writing your own (ungraded) tests
    // IMPORTANT: in your SQL LIKE matching, use the %query% format to match the search query to substrings, not just the entire string
    const pagesize = req.query.pagesize ? req.query.pagesize : 10;
    const Name = req.query.Name ? req.query.Name : '%';
    const Nationality = req.query.Nationality ? req.query.Nationality : '%';
    const Club = req.query.Club ? req.query.Club : '%';
    const RatingLow = req.query.RatingLow ? req.query.RatingLow : 1;
    const RatingHigh = req.query.RatingHigh ? req.query.RatingHigh : 100;
    const PotentialLow = req.query.PotentialLow ? req.query.PotentialLow : 1;
    const PotentialHigh = req.query.PotentialHigh ? req.query.PotentialHigh : 100;

    if (req.query.page && !isNaN(req.query.page)) {
        connection.query(`SELECT PlayerId, Name, Nationality, OverallRating AS Rating, Potential, Club, Value
                          FROM Players
                          WHERE Name LIKE '%${Name}%' AND Nationality LIKE '%${Nationality}%' AND Club LIKE '%${Club}%' AND OverallRating BETWEEN ${RatingLow} AND ${RatingHigh} AND Potential BETWEEN ${PotentialLow} AND ${PotentialHigh}
                          ORDER BY Name
                          LIMIT ${pagesize} OFFSET ${(req.query.page - 1) * pagesize}`,
                         function (error, results, fields) {
                            if (error) {
                                console.log(error)
                                res.json({ error: error })
                            } else if (results) {
                                res.json({ results: results })
                            }
        });
    } else {
        connection.query(`SELECT PlayerId, Name, Nationality, OverallRating AS Rating, Potential, Club, Value
                          FROM Players
                          WHERE Name LIKE '%${Name}%' AND Nationality LIKE '%${Nationality}%' AND Club LIKE '%${Club}%' AND OverallRating BETWEEN ${RatingLow} AND ${RatingHigh} AND Potential BETWEEN ${PotentialLow} AND ${PotentialHigh}
                          ORDER BY Name`,
                        function (error, results, fields) {
                            if (error) {
                                console.log(error)
                                res.json({ error: error })
                            } else if (results) {
                                res.json({ results: results })
                            }
        });
    }
}

module.exports = {
    players_batting_bs,
    jersey,
    all_matches,
    all_players,
    match,
    player,
    search_matches,
    search_players
}