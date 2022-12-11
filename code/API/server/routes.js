const config = require('./config.json')
const mysql = require('mysql');
const e = require('express');

const connection = mysql.createConnection({
    host: 'bsgraphs.chez00e9c8f2.us-east-2.rds.amazonaws.com',
    user: 'rcorkrean',
    password: 'Clone0701!',
    port: '3306',
    database: 'BSGRAPHS'
});
connection.connect();

async function players_batting_bs(req, res) {
    const page = req.query.page && !isNaN(req.query.page) ? req.query.page : 1;
    const pagesize = req.query.pagesize && !isNaN(req.query.pagesize) ? req.query.pagesize : 50000;
    const splitseasons = req.query.splitseasons && req.query.splitseasons == 'true' ? true : req.query.splitseasons && req.query.splitseasons == 'false' ? false: true;
    const splitteams = req.query.splitteams && req.query.splitteams == 'true' ? true : req.query.splitteams && req.query.splitteams == 'false' ? false: false;
    const percentiles = req.query.percentiles && req.query.percentiles == 'true' ? true : req.query.percentiles && req.query.percentiles == 'false' ? false: false;
    const seasons = req.query.seasons ? req.query.seasons : Array.from({length: 8}, (_, i) => i + 2015);
    const teams = req.query.teams ? req.query.teams : ['ARI', 'ATL', 'BAL', 'BOS', 'CHC', 'CIN', 'CLE', 'COL', 'CWS', 'DET', 'HOU', 'KC', 'LAA', 'LAD', 'MIA', 'MIL', 'MIN', 'NYM', 'NYY', 'OAK', 'PHI', 'PIT', 'SD', 'SEA', 'SF', 'STL', 'TB', 'TEX', 'TOR', 'WSH'];
    const pa_threshold = req.query.pa_threshold ? req.query.pa_threshold : 423;
    if (splitseasons) {
        if (splitteams) {
            if (percentiles) {
                connection.query(`WITH bs1 AS (SELECT PlayerID, Season, Age, Team, G, AB, PA, BBE, Barrels, HR, K, BB, IBB, HBP, SF, EV, maxEV, BA, xBA,
                                                        BABIP, OBP, SLG, xSLG, ISO, wOBA, xwOBA, xwOBAcon, \`wRC+\`, WAR
                                                FROM BattingStats
                                                WHERE Season IN (${seasons.join(', ')}) AND Team IN ('${teams.join("', '")}') AND PA >= ${pa_threshold})

                                    SELECT p.Name, bs2.\`Season(s)\`, bs2.\`Age(s)\`, bs2.\`Team(s)\`,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.G) * 100, 1), '%') AS G,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.PA) * 100, 1), '%') AS PA,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.BBE) * 100, 1), '%') AS BBE,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.\`BB%\`) * 100, 1), '%') AS \`BB%\`,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.\`K%\`) * 100, 1), '%') AS \`K%\`,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.EV) * 100, 1), '%') AS EV,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.\`Barrels/PA\`) * 100, 1),
                                                '%') AS \`Barrels/PA\`,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.BA) * 100, 1), '%') AS BA,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.xBA) * 100, 1), '%') AS xBA,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.BABIP) * 100, 1), '%') AS BABIP,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.xBABIP) * 100, 1), '%') AS xBABIP,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.OBP) * 100, 1), '%') AS OBP,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.xOBP) * 100, 1), '%') AS xOBP,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.SLG) * 100, 1), '%') AS SLG,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.xSLG) * 100, 1), '%') AS xSLG,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.ISO) * 100, 1), '%') AS ISO,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.xISO) * 100, 1), '%') AS xISO,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.wOBA) * 100, 1), '%') AS wOBA,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.xwOBA) * 100, 1), '%') AS xwOBA,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.wOBA) * 100, 1), '%') AS wOBA,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.xwOBAcon) * 100, 1),
                                                '%') AS xwOBAcon,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.\`wRC+\`) * 100, 1), '%') AS \`wRC+\`,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.WAR) * 100, 1), '%') AS WAR
                                    FROM (SELECT bs1.PlayerID, bs1.Season AS \`Season(s)\`, bs1.Age AS \`Age(s)\`, bs1.Team AS \`Team(s)\`, bs1.G, bs1.PA,
                                                bs1.BBE, bs1.BB / bs1.PA AS \`BB%\`, bs1.K / bs1.PA AS \`K%\`, bs1.EV, bs1.maxEV,
                                                bs1.Barrels / bs1.PA AS \`Barrels/PA\`, bs1.BA, bs1.xBA, bs1.BABIP,
                                                (bs1.xBA * bs1.AB - bs1.HR) / (bs1.AB - bs1.HR - bs1.K + bs1.SF) AS xBABIP, bs1.OBP,
                                                (bs1.xBA * bs1.AB + bs1.BB + bs1.HBP) / bs1.PA AS xOBP, bs1.SLG, bs1.xSLG, bs1.ISO,
                                                bs1.xSLG - bs1.xBA AS xISO, bs1.wOBA, bs1.xwOBA,
                                                (bs1.wOBA * bs1.PA - CASE WHEN bs1.Season = 2015 THEN 0.687
                                                                        WHEN bs1.Season = 2016 THEN 0.691
                                                                        WHEN bs1.Season = 2017 THEN 0.693
                                                                        WHEN bs1.Season IN (2018, 2019) THEN 0.690
                                                                        WHEN bs1.Season = 2020 THEN 0.699
                                                                        WHEN bs1.Season = 2021 THEN 0.692
                                                                        WHEN bs1.Season = 2022 THEN 0.689 END * (bs1.BB - bs1.IBB) -
                                                CASE WHEN bs1.Season = 2015 THEN 0.718
                                                    WHEN bs1.Season = 2016 THEN 0.721
                                                    WHEN bs1.Season = 2017 THEN 0.723
                                                    WHEN bs1.Season IN (2018, 2022) THEN 0.72
                                                    WHEN bs1.Season = 2019 THEN 0.719
                                                    WHEN bs1.Season = 2020 THEN 0.728
                                                    WHEN bs1.Season = 2021 THEN 0.722 END * bs1.HBP) AS wOBAcon, bs1.xwOBAcon, bs1.\`wRC+\`, bs1.WAR
                                        FROM bs1) AS bs2
                                    JOIN Players AS p
                                    ON bs2.PlayerID = p.ID
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
            } else {
                connection.query(`WITH bs1 AS (SELECT PlayerID, Season, Team, G, AB, PA, BBE, HR, K, BB, IBB, HBP, SF, EV, maxEV, Barrels, BA, xBA, BABIP,
                                                        OBP, SLG, xSLG, ISO, wOBA, xwOBA, xwOBAcon, \`wRC+\`, WAR
                                                FROM BattingStats
                                                WHERE Season IN (${seasons.join(', ')}) AND Team IN ('${teams.join("', '")}')),
                                        cnt AS (SELECT PlayerID, Team, COUNT(DISTINCT Season) AS NumSeasons
                                                FROM BattingStats
                                                WHERE Season IN (${seasons.join(', ')}) AND Team IN ('${teams.join("', '")}')
                                                GROUP BY PlayerID, Team),
                                        bs3 AS (SELECT PlayerID, Season, Age, Team
                                                FROM BattingStats
                                                WHERE Season IN (${seasons.join(', ')}) AND Team IN ('${teams.join("', '")}'))

                                    SELECT p.Name, COALESCE(bs3.Season, bs2.\`Season(s)\`) AS \`Season(s)\`, COALESCE(bs3.Age, bs2.\`Season(s)\`) AS \`Age(s)\`,
                                        bs2.\`Team(s)\`, bs2.G, bs2.PA, bs2.BBE, CONCAT(ROUND(bs2.\`BB%\` * 100, 1), '%') AS \`BB%\`,
                                        CONCAT(ROUND(bs2.\`K%\` * 100, 1), '%') AS \`K%\`, ROUND(bs2.EV, 1) AS EV, ROUND(bs2.maxEV, 1) AS maxEV,
                                        CONCAT(ROUND(bs2.\`Barrels/PA\` * 100, 1), '%') AS \`Barrels/PA\`, ROUND(bs2.BA, 3) AS BA, ROUND(bs2.xBA, 3) AS xBA,
                                        ROUND(bs2.BABIP, 3) AS BABIP, ROUND(bs2.xBABIP, 3) AS xBABIP, ROUND(bs2.OBP, 3) AS OBP,
                                        ROUND(bs2.xOBP, 3) AS xOBP, ROUND(bs2.SLG, 3) AS SLG, ROUND(bs2.xSLG, 3) AS xSLG, ROUND(bs2.ISO, 3) AS ISO,
                                        ROUND(bs2.xISO, 3) AS xISO, ROUND(bs2.wOBA, 3) AS wOBA, ROUND(bs2.xwOBA, 3) AS xwOBA,
                                        ROUND(bs2.woBACon, 3) AS wOBAcon, ROUND(bs2.xwOBAcon, 3) AS xwOBAcon, ROUND(bs2.\`wRC+\`) AS \`wRC+\`, bs2.WAR
                                    FROM (SELECT bs1.PlayerID, cnt.NumSeasons AS \`Season(s)\`, bs1.Team AS \`Team(s)\`, SUM(bs1.G) AS G, SUM(bs1.PA) AS PA,
                                                SUM(bs1.BBE) AS BBE, SUM(bs1.BB) / SUM(bs1.PA) AS \`BB%\`, SUM(bs1.K) / SUM(bs1.PA) AS \`K%\`,
                                                SUM(bs1.EV * bs1.BBE) / SUM(bs1.BBE) AS EV, MAX(bs1.maxEV) AS maxEV,
                                                SUM(bs1.Barrels) / SUM(bs1.PA) AS \`Barrels/PA\`, SUM(bs1.BA * bs1.AB) / SUM(bs1.AB) AS BA,
                                                SUM(bs1.xBA * bs1.AB) / SUM(bs1.AB) AS xBA, SUM(bs1.BABIP * bs1.BBE) / SUM(bs1.BBE) AS BABIP,
                                                SUM((bs1.xBA * bs1.AB - bs1.HR) / (bs1.AB - bs1.HR - bs1.K + bs1.SF) * bs1.BBE) / SUM(bs1.BBE) AS xBABIP,
                                                SUM(bs1.OBP * bs1.PA) / SUM(bs1.PA) AS OBP, SUM(bs1.xBA * bs1.AB + bs1.BB + bs1.HBP) / SUM(bs1.PA) AS xOBP,
                                                SUM(bs1.SLG * bs1.AB) / SUM(bs1.AB) AS SLG, SUM(bs1.xSLG * bs1.AB) / SUM(bs1.AB) AS xSLG,
                                                SUM(bs1.ISO * bs1.AB) / SUM(bs1.AB) AS ISO, SUM((bs1.xSLG - bs1.xBA) * bs1.AB) / SUM(bs1.AB) AS xISO,
                                                SUM(bs1.wOBA * bs1.PA) / SUM(bs1.PA) AS wOBA, SUM(bs1.xwOBA * bs1.PA) / SUM(bs1.PA) AS xwOBA,
                                                SUM((bs1.wOBA * bs1.PA - CASE WHEN bs1.Season = 2015 THEN 0.687
                                                                            WHEN bs1.Season = 2016 THEN 0.691
                                                                            WHEN bs1.Season = 2017 THEN 0.693
                                                                            WHEN bs1.Season IN (2018, 2019) THEN 0.690
                                                                            WHEN bs1.Season = 2020 THEN 0.699
                                                                            WHEN bs1.Season = 2021 THEN 0.692
                                                                            WHEN bs1.Season = 2022 THEN 0.689 END * (bs1.BB - bs1.IBB) -
                                                    CASE WHEN bs1.Season = 2015 THEN 0.718
                                                        WHEN bs1.Season = 2016 THEN 0.721
                                                        WHEN bs1.Season = 2017 THEN 0.723
                                                        WHEN bs1.Season IN (2018, 2022) THEN 0.72
                                                        WHEN bs1.Season = 2019 THEN 0.719
                                                        WHEN bs1.Season = 2020 THEN 0.728
                                                        WHEN bs1.Season = 2021 THEN 0.722 END * bs1.HBP) * bs1.BBE) / SUM(bs1.BBE) AS wOBAcon,
                                                SUM(bs1.xwOBAcon * bs1.BBE) / SUM(bs1.BBE) AS xwOBACon, SUM(bs1.\`wRC+\` * bs1.PA) / SUM(bs1.PA) AS \`wRC+\`,
                                                SUM(bs1.WAR) AS WAR
                                        FROM bs1
                                        JOIN cnt
                                        ON bs1.PlayerID = cnt.PlayerID AND bs1.Team = cnt.Team
                                        GROUP BY bs1.PlayerID, bs1.Team) AS bs2
                                    JOIN Players AS p
                                    ON bs2.PlayerID = p.ID
                                    LEFT JOIN bs3
                                    ON bs2.PlayerID = bs3.PlayerID AND bs2.\`Team(s)\` = bs3.Team AND bs2.\`Season(s)\` = 1
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
            if (percentiles) {
                connection.query(`WITH bs1 AS (SELECT PlayerID, Season, Age, G, AB, PA, BBE, HR, K, BB, IBB, HBP, SF, EV, maxEV, Barrels, BA, xBA, BABIP,
                                                        OBP, SLG, xSLG, ISO, wOBA, xwOBA, xwOBAcon, \`wRC+\`, WAR
                                                FROM BattingStats
                                                WHERE Season IN (${seasons.join(', ')}) AND Team IN ('${teams.join("', '")}')),
                                        cnt AS (SELECT PlayerID, Season, COUNT(*) AS NumTeams
                                                FROM BattingStats
                                                WHERE Season IN (${seasons.join(', ')}) AND Team IN ('${teams.join("', '")}')
                                                GROUP BY PlayerID, Season),
                                        bs3 AS (SELECT PlayerID, Season, Team
                                                FROM BattingStats
                                                WHERE Season IN (${seasons.join(', ')}) AND Team IN ('${teams.join("', '")}'))

                                    SELECT p.Name, bs2.\`Season(s)\`, bs2.\`Age(s)\`, COALESCE(bs3.Team, bs2.\`Team(s)\`) AS \`Team(s)\`,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.G) * 100, 1), '%') AS G,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.PA) * 100, 1), '%') AS PA,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.BBE) * 100, 1), '%') AS BBE,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.\`BB%\`) * 100, 1), '%') AS \`BB%\`,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.\`K%\`) * 100, 1), '%') AS \`K%\`,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.EV) * 100, 1), '%') AS EV,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.\`Barrels/PA\`) * 100, 1),
                                                '%') AS \`Barrels/PA\`,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.BA) * 100, 1), '%') AS BA,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.xBA) * 100, 1), '%') AS xBA,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.BABIP) * 100, 1), '%') AS BABIP,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.xBABIP) * 100, 1), '%') AS xBABIP,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.OBP) * 100, 1), '%') AS OBP,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.xOBP) * 100, 1), '%') AS xOBP,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.SLG) * 100, 1), '%') AS SLG,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.xSLG) * 100, 1), '%') AS xSLG,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.ISO) * 100, 1), '%') AS ISO,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.xISO) * 100, 1), '%') AS xISO,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.wOBA) * 100, 1), '%') AS wOBA,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.xwOBA) * 100, 1), '%') AS xwOBA,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.wOBA) * 100, 1), '%') AS wOBA,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.xwOBAcon) * 100, 1),
                                                '%') AS xwOBAcon,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.\`wRC+\`) * 100, 1), '%') AS \`wRC+\`,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.WAR) * 100, 1), '%') AS WAR
                                    FROM (SELECT bs1.PlayerID, bs1.Season AS \`Season(s)\`, bs1.Age AS \`Age(s)\`, cnt.NumTeams AS \`Team(s)\`, SUM(bs1.G) AS G,
                                                SUM(bs1.PA) AS PA, SUM(bs1.BBE) AS BBE, SUM(bs1.BB) / SUM(bs1.PA) AS \`BB%\`,
                                                SUM(bs1.K) / SUM(bs1.PA) AS \`K%\`, SUM(bs1.EV * bs1.BBE) / SUM(bs1.BBE) AS EV, MAX(bs1.maxEV) AS maxEV,
                                                SUM(bs1.Barrels) / SUM(bs1.PA) AS \`Barrels/PA\`, SUM(bs1.BA * bs1.AB) / SUM(bs1.AB) AS BA,
                                                SUM(bs1.xBA * bs1.AB) / SUM(bs1.AB) AS xBA, SUM(bs1.BABIP * bs1.BBE) / SUM(bs1.BBE) AS BABIP,
                                                SUM((bs1.xBA * bs1.AB - bs1.HR) / (bs1.AB - bs1.HR - bs1.K + bs1.SF) * bs1.BBE) / SUM(bs1.BBE) AS xBABIP,
                                                SUM(bs1.OBP * bs1.PA) / SUM(bs1.PA) AS OBP, SUM(bs1.xBA * bs1.AB + bs1.BB + bs1.HBP) / SUM(bs1.PA) AS xOBP,
                                                SUM(bs1.SLG * bs1.AB) / SUM(bs1.AB) AS SLG, SUM(bs1.xSLG * bs1.AB) / SUM(bs1.AB) AS xSLG,
                                                SUM(bs1.ISO * bs1.AB) / SUM(bs1.AB) AS ISO, SUM((bs1.xSLG - bs1.xBA) * bs1.AB) / SUM(bs1.AB) AS xISO,
                                                SUM(bs1.wOBA * bs1.PA) / SUM(bs1.PA) AS wOBA, SUM(bs1.xwOBA * bs1.PA) / SUM(bs1.PA) AS xwOBA,
                                                SUM((bs1.wOBA * bs1.PA - CASE WHEN bs1.Season = 2015 THEN 0.687
                                                                            WHEN bs1.Season = 2016 THEN 0.691
                                                                            WHEN bs1.Season = 2017 THEN 0.693
                                                                            WHEN bs1.Season IN (2018, 2019) THEN 0.690
                                                                            WHEN bs1.Season = 2020 THEN 0.699
                                                                            WHEN bs1.Season = 2021 THEN 0.692
                                                                            WHEN bs1.Season = 2022 THEN 0.689 END * (bs1.BB - bs1.IBB) -
                                                    CASE WHEN bs1.Season = 2015 THEN 0.718
                                                        WHEN bs1.Season = 2016 THEN 0.721
                                                        WHEN bs1.Season = 2017 THEN 0.723
                                                        WHEN bs1.Season IN (2018, 2022) THEN 0.72
                                                        WHEN bs1.Season = 2019 THEN 0.719
                                                        WHEN bs1.Season = 2020 THEN 0.728
                                                        WHEN bs1.Season = 2021 THEN 0.722 END * bs1.HBP) * bs1.BBE) / SUM(bs1.BBE) AS wOBAcon,
                                                SUM(bs1.xwOBAcon * bs1.BBE) / SUM(bs1.BBE) AS xwOBACon, SUM(bs1.\`wRC+\` * bs1.PA) / SUM(bs1.PA) AS \`wRC+\`,
                                                SUM(bs1.WAR) AS WAR
                                        FROM bs1
                                        JOIN cnt
                                        ON bs1.PlayerID = cnt.PlayerID AND bs1.Season = cnt.Season
                                        GROUP BY bs1.PlayerID, bs1.Season, bs1.Age) AS bs2
                                    JOIN Players AS p
                                    ON bs2.PlayerID = p.ID
                                    LEFT JOIN bs3
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
            } else {
                connection.query(`WITH bs1 AS (SELECT PlayerID, Season, Age, G, AB, PA, BBE, HR, K, BB, IBB, HBP, SF, EV, maxEV, Barrels, BA, xBA, BABIP,
                                                        OBP, SLG, xSLG, ISO, wOBA, xwOBA, xwOBAcon, \`wRC+\`, WAR
                                                FROM BattingStats
                                                WHERE Season IN (${seasons.join(', ')}) AND Team IN ('${teams.join("', '")}')),
                                        cnt AS (SELECT PlayerID, Season, COUNT(*) AS NumTeams
                                                FROM BattingStats
                                                WHERE Season IN (${seasons.join(', ')}) AND Team IN ('${teams.join("', '")}')
                                                GROUP BY PlayerID, Season),
                                        bs3 AS (SELECT PlayerID, Season, Team
                                                FROM BattingStats
                                                WHERE Season IN (${seasons.join(', ')}) AND Team IN ('${teams.join("', '")}'))

                                                    SELECT p.Name, bs2.\`Season(s)\`, bs2.\`Age(s)\`, COALESCE(bs3.Team, bs2.\`Team(s)\`) AS \`Team(s)\`, bs2.G, bs2.PA, bs2.BBE,
                                        CONCAT(ROUND(bs2.\`BB%\` * 100, 1), '%') AS \`BB%\`, CONCAT(ROUND(bs2.\`K%\` * 100, 1), '%') AS \`K%\`,
                                        ROUND(bs2.EV, 1) AS EV, ROUND(bs2.maxEV, 1) AS maxEV,
                                        CONCAT(ROUND(bs2.\`Barrels/PA\` * 100, 1), '%') AS \`Barrels/PA\`, ROUND(bs2.BA, 3) AS BA, ROUND(bs2.xBA, 3) AS xBA,
                                        ROUND(bs2.BABIP, 3) AS BABIP, ROUND(bs2.xBABIP, 3) AS xBABIP, ROUND(bs2.OBP, 3) AS OBP,
                                        ROUND(bs2.xOBP, 3) AS xOBP, ROUND(bs2.SLG, 3) AS SLG, ROUND(bs2.xSLG, 3) AS xSLG, ROUND(bs2.ISO, 3) AS ISO,
                                        ROUND(bs2.xISO, 3) AS xISO, ROUND(bs2.wOBA, 3) AS wOBA, ROUND(bs2.xwOBA, 3) AS xwOBA,
                                        ROUND(bs2.woBACon, 3) AS wOBAcon, ROUND(bs2.xwOBAcon, 3) AS xwOBAcon, ROUND(bs2.\`wRC+\`) AS \`wRC+\`, bs2.WAR
                                    FROM (SELECT bs1.PlayerID, bs1.Season AS \`Season(s)\`, bs1.Age AS \`Age(s)\`, cnt.NumTeams AS \`Team(s)\`, SUM(bs1.G) AS G,
                                                SUM(bs1.PA) AS PA, SUM(bs1.BBE) AS BBE, SUM(bs1.BB) / SUM(bs1.PA) AS \`BB%\`,
                                                SUM(bs1.K) / SUM(bs1.PA) AS \`K%\`, SUM(bs1.EV * bs1.BBE) / SUM(bs1.BBE) AS EV, MAX(bs1.maxEV) AS maxEV,
                                                SUM(bs1.Barrels) / SUM(bs1.PA) AS \`Barrels/PA\`, SUM(bs1.BA * bs1.AB) / SUM(bs1.AB) AS BA,
                                                SUM(bs1.xBA * bs1.AB) / SUM(bs1.AB) AS xBA, SUM(bs1.BABIP * bs1.BBE) / SUM(bs1.BBE) AS BABIP,
                                                SUM((bs1.xBA * bs1.AB - bs1.HR) / (bs1.AB - bs1.HR - bs1.K + bs1.SF) * bs1.BBE) / SUM(bs1.BBE) AS xBABIP,
                                                SUM(bs1.OBP * bs1.PA) / SUM(bs1.PA) AS OBP, SUM(bs1.xBA * bs1.AB + bs1.BB + bs1.HBP) / SUM(bs1.PA) AS xOBP,
                                                SUM(bs1.SLG * bs1.AB) / SUM(bs1.AB) AS SLG, SUM(bs1.xSLG * bs1.AB) / SUM(bs1.AB) AS xSLG,
                                                SUM(bs1.ISO * bs1.AB) / SUM(bs1.AB) AS ISO, SUM((bs1.xSLG - bs1.xBA) * bs1.AB) / SUM(bs1.AB) AS xISO,
                                                SUM(bs1.wOBA * bs1.PA) / SUM(bs1.PA) AS wOBA, SUM(bs1.xwOBA * bs1.PA) / SUM(bs1.PA) AS xwOBA,
                                                SUM((bs1.wOBA * bs1.PA - CASE WHEN bs1.Season = 2015 THEN 0.687
                                                                            WHEN bs1.Season = 2016 THEN 0.691
                                                                            WHEN bs1.Season = 2017 THEN 0.693
                                                                            WHEN bs1.Season IN (2018, 2019) THEN 0.690
                                                                            WHEN bs1.Season = 2020 THEN 0.699
                                                                            WHEN bs1.Season = 2021 THEN 0.692
                                                                            WHEN bs1.Season = 2022 THEN 0.689 END * (bs1.BB - bs1.IBB) -
                                                    CASE WHEN bs1.Season = 2015 THEN 0.718
                                                        WHEN bs1.Season = 2016 THEN 0.721
                                                        WHEN bs1.Season = 2017 THEN 0.723
                                                        WHEN bs1.Season IN (2018, 2022) THEN 0.72
                                                        WHEN bs1.Season = 2019 THEN 0.719
                                                        WHEN bs1.Season = 2020 THEN 0.728
                                                        WHEN bs1.Season = 2021 THEN 0.722 END * bs1.HBP) * bs1.BBE) / SUM(bs1.BBE) AS wOBAcon,
                                                SUM(bs1.xwOBAcon * bs1.BBE) / SUM(bs1.BBE) AS xwOBACon, SUM(bs1.\`wRC+\` * bs1.PA) / SUM(bs1.PA) AS \`wRC+\`,
                                                SUM(bs1.WAR) AS WAR
                                        FROM bs1
                                        JOIN cnt
                                        ON bs1.PlayerID = cnt.PlayerID AND bs1.Season = cnt.Season
                                        GROUP BY bs1.PlayerID, bs1.Season, bs1.Age) AS bs2
                                    JOIN Players AS p
                                    ON bs2.PlayerID = p.ID
                                    LEFT JOIN bs3
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
        }
    } else {
        if (splitteams) {
            if (percentiles) {
                connection.query(`WITH bs1 AS (SELECT PlayerID, Season, Team, G, AB, PA, BBE, HR, K, BB, IBB, HBP, SF, EV, maxEV, Barrels, BA, xBA, BABIP,
                                                        OBP, SLG, xSLG, ISO, wOBA, xwOBA, xwOBAcon, \`wRC+\`, WAR
                                                FROM BattingStats
                                                WHERE Season IN (${seasons.join(', ')}) AND Team IN ('${teams.join("', '")}')),
                                        cnt AS (SELECT PlayerID, Team, COUNT(DISTINCT Season) AS NumSeasons
                                                FROM BattingStats
                                                WHERE Season IN (${seasons.join(', ')}) AND Team IN ('${teams.join("', '")}')
                                                GROUP BY PlayerID, Team),
                                        bs3 AS (SELECT PlayerID, Season, Age, Team
                                                FROM BattingStats
                                                WHERE Season IN (${seasons.join(', ')}) AND Team IN ('${teams.join("', '")}'))

                                    SELECT p.Name, COALESCE(bs3.Season, bs2.\`Season(s)\`) AS \`Season(s)\`, COALESCE(bs3.Age, bs2.\`Season(s)\`) AS \`Age(s)\`,
                                        bs2.\`Team(s)\`,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.G) * 100, 1), '%') AS G,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.PA) * 100, 1), '%') AS PA,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.BBE) * 100, 1), '%') AS BBE,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.\`BB%\`) * 100, 1), '%') AS \`BB%\`,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.\`K%\`) * 100, 1), '%') AS \`K%\`,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.EV) * 100, 1), '%') AS EV,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.\`Barrels/PA\`) * 100, 1),
                                                '%') AS \`Barrels/PA\`,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.BA) * 100, 1), '%') AS BA,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.xBA) * 100, 1), '%') AS xBA,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.BABIP) * 100, 1), '%') AS BABIP,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.xBABIP) * 100, 1), '%') AS xBABIP,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.OBP) * 100, 1), '%') AS OBP,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.xOBP) * 100, 1), '%') AS xOBP,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.SLG) * 100, 1), '%') AS SLG,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.xSLG) * 100, 1), '%') AS xSLG,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.ISO) * 100, 1), '%') AS ISO,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.xISO) * 100, 1), '%') AS xISO,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.wOBA) * 100, 1), '%') AS wOBA,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.xwOBA) * 100, 1), '%') AS xwOBA,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.wOBA) * 100, 1), '%') AS wOBA,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.xwOBAcon) * 100, 1),
                                                '%') AS xwOBAcon,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.\`wRC+\`) * 100, 1), '%') AS \`wRC+\`,
                                        CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.WAR) * 100, 1), '%') AS WAR
                                    FROM (SELECT bs1.PlayerID, cnt.NumSeasons AS \`Season(s)\`, bs1.Team AS \`Team(s)\`, SUM(bs1.G) AS G, SUM(bs1.PA) AS PA,
                                                SUM(bs1.BBE) AS BBE, SUM(bs1.BB) / SUM(bs1.PA) AS \`BB%\`, SUM(bs1.K) / SUM(bs1.PA) AS \`K%\`,
                                                SUM(bs1.EV * bs1.BBE) / SUM(bs1.BBE) AS EV, MAX(bs1.maxEV) AS maxEV,
                                                SUM(bs1.Barrels) / SUM(bs1.PA) AS \`Barrels/PA\`, SUM(bs1.BA * bs1.AB) / SUM(bs1.AB) AS BA,
                                                SUM(bs1.xBA * bs1.AB) / SUM(bs1.AB) AS xBA, SUM(bs1.BABIP * bs1.BBE) / SUM(bs1.BBE) AS BABIP,
                                                SUM((bs1.xBA * bs1.AB - bs1.HR) / (bs1.AB - bs1.HR - bs1.K + bs1.SF) * bs1.BBE) / SUM(bs1.BBE) AS xBABIP,
                                                SUM(bs1.OBP * bs1.PA) / SUM(bs1.PA) AS OBP, SUM(bs1.xBA * bs1.AB + bs1.BB + bs1.HBP) / SUM(bs1.PA) AS xOBP,
                                                SUM(bs1.SLG * bs1.AB) / SUM(bs1.AB) AS SLG, SUM(bs1.xSLG * bs1.AB) / SUM(bs1.AB) AS xSLG,
                                                SUM(bs1.ISO * bs1.AB) / SUM(bs1.AB) AS ISO, SUM((bs1.xSLG - bs1.xBA) * bs1.AB) / SUM(bs1.AB) AS xISO,
                                                SUM(bs1.wOBA * bs1.PA) / SUM(bs1.PA) AS wOBA, SUM(bs1.xwOBA * bs1.PA) / SUM(bs1.PA) AS xwOBA,
                                                SUM((bs1.wOBA * bs1.PA - CASE WHEN bs1.Season = 2015 THEN 0.687
                                                                            WHEN bs1.Season = 2016 THEN 0.691
                                                                            WHEN bs1.Season = 2017 THEN 0.693
                                                                            WHEN bs1.Season IN (2018, 2019) THEN 0.690
                                                                            WHEN bs1.Season = 2020 THEN 0.699
                                                                            WHEN bs1.Season = 2021 THEN 0.692
                                                                            WHEN bs1.Season = 2022 THEN 0.689 END * (bs1.BB - bs1.IBB) -
                                                    CASE WHEN bs1.Season = 2015 THEN 0.718
                                                        WHEN bs1.Season = 2016 THEN 0.721
                                                        WHEN bs1.Season = 2017 THEN 0.723
                                                        WHEN bs1.Season IN (2018, 2022) THEN 0.72
                                                        WHEN bs1.Season = 2019 THEN 0.719
                                                        WHEN bs1.Season = 2020 THEN 0.728
                                                        WHEN bs1.Season = 2021 THEN 0.722 END * bs1.HBP) * bs1.BBE) / SUM(bs1.BBE) AS wOBAcon,
                                                SUM(bs1.xwOBAcon * bs1.BBE) / SUM(bs1.BBE) AS xwOBACon, SUM(bs1.\`wRC+\` * bs1.PA) / SUM(bs1.PA) AS \`wRC+\`,
                                                SUM(bs1.WAR) AS WAR
                                        FROM bs1
                                        JOIN cnt
                                        ON bs1.PlayerID = cnt.PlayerID AND bs1.Team = cnt.Team
                                        GROUP BY bs1.PlayerID, bs1.Team) AS bs2
                                    JOIN Players AS p
                                    ON bs2.PlayerID = p.ID
                                    LEFT JOIN bs3
                                    ON bs2.PlayerID = bs3.PlayerID AND bs2.\`Team(s)\` = bs3.Team AND bs2.\`Season(s)\` = 1
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
            } else {
                connection.query(`WITH bs1 AS (SELECT PlayerID, Season, Team, G, AB, PA, BBE, HR, K, BB, IBB, HBP, SF, EV, maxEV, Barrels, BA, xBA, BABIP,
                                                        OBP, SLG, xSLG, ISO, wOBA, xwOBA, xwOBAcon, \`wRC+\`, WAR
                                                FROM BattingStats
                                                WHERE Season IN (${seasons.join(', ')}) AND Team IN ('${teams.join("', '")}')),
                                        cnt AS (SELECT PlayerID, Team, COUNT(DISTINCT Season) AS NumSeasons
                                                FROM BattingStats
                                                WHERE Season IN (${seasons.join(', ')}) AND Team IN ('${teams.join("', '")}')
                                                GROUP BY PlayerID, Team),
                                        bs3 AS (SELECT PlayerID, Season, Age, Team
                                                FROM BattingStats
                                                WHERE Season IN (${seasons.join(', ')}) AND Team IN ('${teams.join("', '")}'))
                                    
                                    SELECT p.Name, COALESCE(bs3.Season, bs2.\`Season(s)\`) AS \`Season(s)\`, COALESCE(bs3.Age, bs2.\`Season(s)\`) AS \`Age(s)\`,
                                        bs2.\`Team(s)\`, bs2.G, bs2.PA, bs2.BBE, CONCAT(ROUND(bs2.\`BB%\` * 100, 1), '%') AS \`BB%\`,
                                        CONCAT(ROUND(bs2.\`K%\` * 100, 1), '%') AS \`K%\`, ROUND(bs2.EV, 1) AS EV, ROUND(bs2.maxEV, 1) AS maxEV,
                                        CONCAT(ROUND(bs2.\`Barrels/PA\` * 100, 1), '%') AS \`Barrels/PA\`, ROUND(bs2.BA, 3) AS BA, ROUND(bs2.xBA, 3) AS xBA,
                                        ROUND(bs2.BABIP, 3) AS BABIP, ROUND(bs2.xBABIP, 3) AS xBABIP, ROUND(bs2.OBP, 3) AS OBP,
                                        ROUND(bs2.xOBP, 3) AS xOBP, ROUND(bs2.SLG, 3) AS SLG, ROUND(bs2.xSLG, 3) AS xSLG, ROUND(bs2.ISO, 3) AS ISO,
                                        ROUND(bs2.xISO, 3) AS xISO, ROUND(bs2.wOBA, 3) AS wOBA, ROUND(bs2.xwOBA, 3) AS xwOBA,
                                        ROUND(bs2.woBACon, 3) AS wOBAcon, ROUND(bs2.xwOBAcon, 3) AS xwOBAcon, ROUND(bs2.\`wRC+\`) AS \`wRC+\`, bs2.WAR
                                    FROM (SELECT bs1.PlayerID, cnt.NumSeasons AS \`Season(s)\`, bs1.Team AS \`Team(s)\`, SUM(bs1.G) AS G, SUM(bs1.PA) AS PA,
                                                SUM(bs1.BBE) AS BBE, SUM(bs1.BB) / SUM(bs1.PA) AS \`BB%\`, SUM(bs1.K) / SUM(bs1.PA) AS \`K%\`,
                                                SUM(bs1.EV * bs1.BBE) / SUM(bs1.BBE) AS EV, MAX(bs1.maxEV) AS maxEV,
                                                SUM(bs1.Barrels) / SUM(bs1.PA) AS \`Barrels/PA\`, SUM(bs1.BA * bs1.AB) / SUM(bs1.AB) AS BA,
                                                SUM(bs1.xBA * bs1.AB) / SUM(bs1.AB) AS xBA, SUM(bs1.BABIP * bs1.BBE) / SUM(bs1.BBE) AS BABIP,
                                                SUM((bs1.xBA * bs1.AB - bs1.HR) / (bs1.AB - bs1.HR - bs1.K + bs1.SF) * bs1.BBE) / SUM(bs1.BBE) AS xBABIP,
                                                SUM(bs1.OBP * bs1.PA) / SUM(bs1.PA) AS OBP, SUM(bs1.xBA * bs1.AB + bs1.BB + bs1.HBP) / SUM(bs1.PA) AS xOBP,
                                                SUM(bs1.SLG * bs1.AB) / SUM(bs1.AB) AS SLG, SUM(bs1.xSLG * bs1.AB) / SUM(bs1.AB) AS xSLG,
                                                SUM(bs1.ISO * bs1.AB) / SUM(bs1.AB) AS ISO, SUM((bs1.xSLG - bs1.xBA) * bs1.AB) / SUM(bs1.AB) AS xISO,
                                                SUM(bs1.wOBA * bs1.PA) / SUM(bs1.PA) AS wOBA, SUM(bs1.xwOBA * bs1.PA) / SUM(bs1.PA) AS xwOBA,
                                                SUM((bs1.wOBA * bs1.PA - CASE WHEN bs1.Season = 2015 THEN 0.687
                                                                            WHEN bs1.Season = 2016 THEN 0.691
                                                                            WHEN bs1.Season = 2017 THEN 0.693
                                                                            WHEN bs1.Season IN (2018, 2019) THEN 0.690
                                                                            WHEN bs1.Season = 2020 THEN 0.699
                                                                            WHEN bs1.Season = 2021 THEN 0.692
                                                                            WHEN bs1.Season = 2022 THEN 0.689 END * (bs1.BB - bs1.IBB) -
                                                    CASE WHEN bs1.Season = 2015 THEN 0.718
                                                        WHEN bs1.Season = 2016 THEN 0.721
                                                        WHEN bs1.Season = 2017 THEN 0.723
                                                        WHEN bs1.Season IN (2018, 2022) THEN 0.72
                                                        WHEN bs1.Season = 2019 THEN 0.719
                                                        WHEN bs1.Season = 2020 THEN 0.728
                                                        WHEN bs1.Season = 2021 THEN 0.722 END * bs1.HBP) * bs1.BBE) / SUM(bs1.BBE) AS wOBAcon,
                                                SUM(bs1.xwOBAcon * bs1.BBE) / SUM(bs1.BBE) AS xwOBACon, SUM(bs1.\`wRC+\` * bs1.PA) / SUM(bs1.PA) AS \`wRC+\`,
                                                SUM(bs1.WAR) AS WAR
                                        FROM bs1
                                        JOIN cnt
                                        ON bs1.PlayerID = cnt.PlayerID AND bs1.Team = cnt.Team
                                        GROUP BY bs1.PlayerID, bs1.Team) AS bs2
                                JOIN Players AS p
                                ON bs2.PlayerID = p.ID
                                LEFT JOIN bs3
                                ON bs2.PlayerID = bs3.PlayerID AND bs2.\`Team(s)\` = bs3.Team AND bs2.\`Season(s)\` = 1
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
            if (percentiles) {
                connection.query(`WITH bs1 AS (SELECT PlayerID, Season, G, AB, PA, BBE, HR, K, BB, IBB, HBP, SF, EV, maxEV, Barrels, BA, xBA, BABIP, OBP,
                                                        SLG, xSLG, ISO, wOBA, xwOBA, xwOBAcon, \`wRC+\`, WAR
                                                FROM BattingStats
                                                WHERE Season IN (${seasons.join(', ')}) AND Team IN ('${teams.join("', '")}')),
                                        cnt AS (SELECT PlayerID, COUNT(DISTINCT Season) AS NumSeasons, COUNT(DISTINCT Team) AS NumTeams
                                                FROM BattingStats
                                                WHERE Season IN (${seasons.join(', ')}) AND Team IN ('${teams.join("', '")}')
                                                GROUP BY PlayerID),
                                        bs3 AS (SELECT DISTINCT PlayerID, Season, Age
                                                FROM BattingStats
                                                WHERE Season IN (${seasons.join(', ')}) AND Team IN ('${teams.join("', '")}')),
                                        bs4 AS (SELECT DISTINCT PlayerID, Team
                                                FROM BattingStats
                                                WHERE Season IN (${seasons.join(', ')}) AND Team IN ('${teams.join("', '")}'))

                                    SELECT p.Name, COALESCE(bs3.Season, bs2.\`Season(s)\`) AS \`Season(s)\`, COALESCE(bs3.Age, bs2.\`Season(s)\`) AS \`Age(s)\`,
                                                COALESCE(bs4.Team, bs2.\`Team(s)\`) AS \`Team(s)\`,
                                                CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.G) * 100, 1), '%') AS G,
                                                CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.PA) * 100, 1), '%') AS PA,
                                                CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.BBE) * 100, 1), '%') AS BBE,
                                                CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.\`BB%\`) * 100, 1), '%') AS \`BB%\`,
                                                CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.\`K%\`) * 100, 1), '%') AS \`K%\`,
                                                CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.EV) * 100, 1), '%') AS EV,
                                                CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.\`Barrels/PA\`) * 100, 1),
                                                        '%') AS \`Barrels/PA\`,
                                                CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.BA) * 100, 1), '%') AS BA,
                                                CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.xBA) * 100, 1), '%') AS xBA,
                                                CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.BABIP) * 100, 1), '%') AS BABIP,
                                                CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.xBABIP) * 100, 1), '%') AS xBABIP,
                                                CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.OBP) * 100, 1), '%') AS OBP,
                                                CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.xOBP) * 100, 1), '%') AS xOBP,
                                                CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.SLG) * 100, 1), '%') AS SLG,
                                                CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.xSLG) * 100, 1), '%') AS xSLG,
                                                CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.ISO) * 100, 1), '%') AS ISO,
                                                CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.xISO) * 100, 1), '%') AS xISO,
                                                CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.wOBA) * 100, 1), '%') AS wOBA,
                                                CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.xwOBA) * 100, 1), '%') AS xwOBA,
                                                CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.wOBA) * 100, 1), '%') AS wOBA,
                                                CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.xwOBAcon) * 100, 1),
                                                        '%') AS xwOBAcon,
                                                CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.\`wRC+\`) * 100, 1), '%') AS \`wRC+\`,
                                                CONCAT(ROUND(PERCENT_RANK() OVER (PARTITION BY bs2.\`Season(s)\` ORDER BY bs2.WAR) * 100, 1), '%') AS WAR
                                        FROM (SELECT bs1.PlayerID, cnt.NumSeasons AS \`Season(s)\`, cnt.NumTeams AS \`Team(s)\`, SUM(bs1.G) AS G, SUM(bs1.PA) AS PA,
                                                    SUM(bs1.BBE) AS BBE, SUM(bs1.BB) / SUM(bs1.PA) AS \`BB%\`, SUM(bs1.K) / SUM(bs1.PA) AS \`K%\`,
                                                    SUM(bs1.EV * bs1.BBE) / SUM(bs1.BBE) AS EV, MAX(bs1.maxEV) AS maxEV,
                                                    SUM(bs1.Barrels) / SUM(bs1.PA) AS \`Barrels/PA\`, SUM(bs1.BA * bs1.AB) / SUM(bs1.AB) AS BA,
                                                    SUM(bs1.xBA * bs1.AB) / SUM(bs1.AB) AS xBA, SUM(bs1.BABIP * bs1.BBE) / SUM(bs1.BBE) AS BABIP,
                                                    SUM((bs1.xBA * bs1.AB - bs1.HR) / (bs1.AB - bs1.HR - bs1.K + bs1.SF) * bs1.BBE) / SUM(bs1.BBE) AS xBABIP,
                                                    SUM(bs1.OBP * bs1.PA) / SUM(bs1.PA) AS OBP, SUM(bs1.xBA * bs1.AB + bs1.BB + bs1.HBP) / SUM(bs1.PA) AS xOBP,
                                                    SUM(bs1.SLG * bs1.AB) / SUM(bs1.AB) AS SLG, SUM(bs1.xSLG * bs1.AB) / SUM(bs1.AB) AS xSLG,
                                                    SUM(bs1.ISO * bs1.AB) / SUM(bs1.AB) AS ISO, SUM((bs1.xSLG - bs1.xBA) * bs1.AB) / SUM(bs1.AB) AS xISO,
                                                    SUM(bs1.wOBA * bs1.PA) / SUM(bs1.PA) AS wOBA, SUM(bs1.xwOBA * bs1.PA) / SUM(bs1.PA) AS xwOBA,
                                                    SUM((bs1.wOBA * bs1.PA - CASE WHEN bs1.Season = 2015 THEN 0.687
                                                                                    WHEN bs1.Season = 2016 THEN 0.691
                                                                                    WHEN bs1.Season = 2017 THEN 0.693
                                                                                    WHEN bs1.Season IN (2018, 2019) THEN 0.690
                                                                                    WHEN bs1.Season = 2020 THEN 0.699
                                                                                    WHEN bs1.Season = 2021 THEN 0.692
                                                                                    WHEN bs1.Season = 2022 THEN 0.689 END * (bs1.BB - bs1.IBB) -
                                                            CASE WHEN bs1.Season = 2015 THEN 0.718
                                                                WHEN bs1.Season = 2016 THEN 0.721
                                                                WHEN bs1.Season = 2017 THEN 0.723
                                                                WHEN bs1.Season IN (2018, 2022) THEN 0.72
                                                                WHEN bs1.Season = 2019 THEN 0.719
                                                                WHEN bs1.Season = 2020 THEN 0.728
                                                                WHEN bs1.Season = 2021 THEN 0.722 END * bs1.HBP) * bs1.BBE) / SUM(bs1.BBE) AS wOBAcon,
                                                    SUM(bs1.xwOBAcon * bs1.BBE) / SUM(bs1.BBE) AS xwOBACon, SUM(bs1.\`wRC+\` * bs1.PA) / SUM(bs1.PA) AS \`wRC+\`,
                                                    SUM(bs1.WAR) AS WAR
                                                FROM bs1
                                                JOIN cnt
                                                ON bs1.PlayerID = cnt.PlayerID
                                                GROUP BY bs1.PlayerID) AS bs2
                                        JOIN Players AS p
                                        ON bs2.PlayerID = p.ID
                                        LEFT JOIN bs3
                                        ON bs2.PlayerID = bs3.PlayerID AND bs2.\`Season(s)\` = 1
                                        LEFT JOIN bs4
                                        ON bs2.PlayerID = bs4.PlayerID AND bs2.\`Team(s)\` = 1
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
            } else {
                connection.query(`WITH bs1 AS (SELECT PlayerID, Season, G, AB, PA, BBE, HR, K, BB, IBB, HBP, SF, EV, maxEV, Barrels, BA, xBA, BABIP, OBP,
                                                        SLG, xSLG, ISO, wOBA, xwOBA, xwOBAcon, \`wRC+\`, WAR
                                                FROM BattingStats
                                                WHERE Season IN (${seasons.join(', ')}) AND Team IN ('${teams.join("', '")}')),
                                        cnt AS (SELECT PlayerID, COUNT(DISTINCT Season) AS NumSeasons, COUNT(DISTINCT Team) AS NumTeams
                                                FROM BattingStats
                                                WHERE Season IN (${seasons.join(', ')}) AND Team IN ('${teams.join("', '")}')
                                                GROUP BY PlayerID),
                                        bs3 AS (SELECT DISTINCT PlayerID, Season, Age
                                                FROM BattingStats
                                                WHERE Season IN (${seasons.join(', ')}) AND Team IN ('${teams.join("', '")}')),
                                        bs4 AS (SELECT DISTINCT PlayerID, Team
                                                FROM BattingStats
                                                WHERE Season IN (${seasons.join(', ')}) AND Team IN ('${teams.join("', '")}'))

                                    SELECT p.Name, COALESCE(bs3.Season, bs2.\`Season(s)\`) AS \`Season(s)\`, COALESCE(bs3.Age, bs2.\`Season(s)\`) AS \`Age(s)\`,
                                        COALESCE(bs4.Team, bs2.\`Team(s)\`) AS \`Team(s)\`, bs2.G, bs2.PA, bs2.BBE,
                                        CONCAT(ROUND(bs2.\`BB%\` * 100, 1), '%') AS \`BB%\`, CONCAT(ROUND(bs2.\`K%\` * 100, 1), '%') AS \`K%\`,
                                        ROUND(bs2.EV, 1) AS EV, ROUND(bs2.maxEV, 1) AS maxEV,
                                        CONCAT(ROUND(bs2.\`Barrels/PA\` * 100, 1), '%') AS \`Barrels/PA\`, ROUND(bs2.BA, 3) AS BA, ROUND(bs2.xBA, 3) AS xBA,
                                        ROUND(bs2.BABIP, 3) AS BABIP, ROUND(bs2.xBABIP, 3) AS xBABIP, ROUND(bs2.OBP, 3) AS OBP,
                                        ROUND(bs2.xOBP, 3) AS xOBP, ROUND(bs2.SLG, 3) AS SLG, ROUND(bs2.xSLG, 3) AS xSLG, ROUND(bs2.ISO, 3) AS ISO,
                                        ROUND(bs2.xISO, 3) AS xISO, ROUND(bs2.wOBA, 3) AS wOBA, ROUND(bs2.xwOBA, 3) AS xwOBA,
                                        ROUND(bs2.woBACon, 3) AS wOBAcon, ROUND(bs2.xwOBAcon, 3) AS xwOBAcon, ROUND(bs2.\`wRC+\`) AS \`wRC+\`, bs2.WAR
                                    FROM (SELECT bs1.PlayerID, cnt.NumSeasons AS \`Season(s)\`, cnt.NumTeams AS \`Team(s)\`, SUM(bs1.G) AS G, SUM(bs1.PA) AS PA,
                                                SUM(bs1.BBE) AS BBE, SUM(bs1.BB) / SUM(bs1.PA) AS \`BB%\`, SUM(bs1.K) / SUM(bs1.PA) AS \`K%\`,
                                                SUM(bs1.EV * bs1.BBE) / SUM(bs1.BBE) AS EV, MAX(bs1.maxEV) AS maxEV,
                                                SUM(bs1.Barrels) / SUM(bs1.PA) AS \`Barrels/PA\`, SUM(bs1.BA * bs1.AB) / SUM(bs1.AB) AS BA,
                                                SUM(bs1.xBA * bs1.AB) / SUM(bs1.AB) AS xBA, SUM(bs1.BABIP * bs1.BBE) / SUM(bs1.BBE) AS BABIP,
                                                SUM((bs1.xBA * bs1.AB - bs1.HR) / (bs1.AB - bs1.HR - bs1.K + bs1.SF) * bs1.BBE) / SUM(bs1.BBE) AS xBABIP,
                                                SUM(bs1.OBP * bs1.PA) / SUM(bs1.PA) AS OBP, SUM(bs1.xBA * bs1.AB + bs1.BB + bs1.HBP) / SUM(bs1.PA) AS xOBP,
                                                SUM(bs1.SLG * bs1.AB) / SUM(bs1.AB) AS SLG, SUM(bs1.xSLG * bs1.AB) / SUM(bs1.AB) AS xSLG,
                                                SUM(bs1.ISO * bs1.AB) / SUM(bs1.AB) AS ISO, SUM((bs1.xSLG - bs1.xBA) * bs1.AB) / SUM(bs1.AB) AS xISO,
                                                SUM(bs1.wOBA * bs1.PA) / SUM(bs1.PA) AS wOBA, SUM(bs1.xwOBA * bs1.PA) / SUM(bs1.PA) AS xwOBA,
                                                SUM((bs1.wOBA * bs1.PA - CASE WHEN bs1.Season = 2015 THEN 0.687
                                                                            WHEN bs1.Season = 2016 THEN 0.691
                                                                            WHEN bs1.Season = 2017 THEN 0.693
                                                                            WHEN bs1.Season IN (2018, 2019) THEN 0.690
                                                                            WHEN bs1.Season = 2020 THEN 0.699
                                                                            WHEN bs1.Season = 2021 THEN 0.692
                                                                            WHEN bs1.Season = 2022 THEN 0.689 END * (bs1.BB - bs1.IBB) -
                                                    CASE WHEN bs1.Season = 2015 THEN 0.718
                                                        WHEN bs1.Season = 2016 THEN 0.721
                                                        WHEN bs1.Season = 2017 THEN 0.723
                                                        WHEN bs1.Season IN (2018, 2022) THEN 0.72
                                                        WHEN bs1.Season = 2019 THEN 0.719
                                                        WHEN bs1.Season = 2020 THEN 0.728
                                                        WHEN bs1.Season = 2021 THEN 0.722 END * bs1.HBP) * bs1.BBE) / SUM(bs1.BBE) AS wOBAcon,
                                                SUM(bs1.xwOBAcon * bs1.BBE) / SUM(bs1.BBE) AS xwOBACon, SUM(bs1.\`wRC+\` * bs1.PA) / SUM(bs1.PA) AS \`wRC+\`,
                                                SUM(bs1.WAR) AS WAR
                                        FROM bs1
                                        JOIN cnt
                                        ON bs1.PlayerID = cnt.PlayerID
                                        GROUP BY bs1.PlayerID) AS bs2
                                    JOIN Players AS p
                                    ON bs2.PlayerID = p.ID
                                    LEFT JOIN bs3
                                    ON bs2.PlayerID = bs3.PlayerID AND bs2.\`Season(s)\` = 1
                                    LEFT JOIN bs4
                                    ON bs2.PlayerID = bs4.PlayerID AND bs2.\`Team(s)\` = 1
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
        }
    }
}

async function players_pitching_bs(req, res) {
    const page = req.query.page && !isNaN(req.query.page) ? req.query.page : 1;
    const pagesize = req.query.pagesize && !isNaN(req.query.pagesize) ? req.query.pagesize : 50000;
    const splitseasons = req.query.splitseasons && req.query.splitseasons == 'true' ? true : req.query.splitseasons && req.query.splitseasons == 'false' ? false: true;
    const splitteams = req.query.splitteams && req.query.splitteams == 'true' ? true : req.query.splitteams && req.query.splitteams == 'false' ? false: false;
    const seasons = req.query.seasons ? req.query.seasons : Array.from({length: 8}, (_, i) => i + 2015);
    const teams = req.query.teams ? req.query.teams : ['ARI', 'ATL', 'BAL', 'BOS', 'CHC', 'CIN', 'CLE', 'COL', 'CWS', 'DET', 'HOU', 'KC', 'LAA', 'LAD', 'MIA', 'MIL', 'MIN', 'NYM', 'NYY', 'OAK', 'PHI', 'PIT', 'SD', 'SEA', 'SF', 'STL', 'TB', 'TEX', 'TOR', 'WSH'];
    const pa_threshold = req.query.pa_threshold ? req.query.pa_threshold : 423;
    if (splitseasons) {
        if (splitteams) {
        connection.query(`SELECT p.Name, ps.Season AS \`Season(s)\`, ps.Age AS \`Age(s)\`, ps.Team AS \`Team(s)\`, ps.G, FLOOR(ROUND(ps.IP, 1)) + ROUND((ps.IP - FLOOR(ROUND(ps.IP, 1))) * 3 /10, 1) AS IP, ps.TBF, ps.BBE, CONCAT(ROUND(ps.K / ps.TBF * 100, 1), '%') AS \`K%\`, CONCAT(ROUND((ps.BB + ps.HBP) / ps.TBF * 100, 1), '%') AS \`tBB%\`, CONCAT(ROUND((ps.K - (ps.BB + ps.HBP)) / ps.TBF * 100, 1), '%') AS \`K-tBB%\`, ROUND((ps.H + ps.BB + ps.HBP) / ps.IP, 2) AS tWHIP, ROUND(ps.EV, 1) AS EV, ROUND(ps.LA, 1) AS LA, CONCAT(ROUND(ps.Barrels / ps.TBF * 100, 1), '%') AS \`Barrels/PA\`, ROUND(9 * ps.R / ps.IP, 2) AS \`RA/9\`, ROUND(9 * ps.ER / ps.IP, 2) AS ERA, ROUND(ps.FIP, 2) AS FIP, ROUND(ps.xFIP, 2) AS xFIP, ROUND(ps.SIERA, 2) AS SIERA, ROUND(ps.tERA, 2) AS tERA, ROUND(ps.kwERA, 2) AS kwERA, ROUND(ps.xERA, 2) AS xERA, ROUND(ps.FRA, 2) AS FRA, ROUND(ps.bsERA, 2) AS bsERA, ps.WAR
                          FROM (SELECT PlayerID, Season, Age, Team, G, IP, TBF, BBE, ER, R, K, BB, HBP, H, EV, LA, Barrels, FIP, xFIP, SIERA, tERA, kwERA, xERA, -3.44548 - 8.33919 * (\`K%\` - (BB + HBP) / TBF) + 0.01894 * LA + 0.0984 * EV AS FRA, (0.0478 * ERA + 0.0899 * FIP + 0.1271 * xFIP + 0.1429 * SIERA) / (0.0478 + 0.0899 + 0.1271 + 0.1429) AS bsERA, WAR
                                FROM PitchingStats
                                WHERE Season IN (${seasons.join(', ')}) AND Team IN ('${teams.join("', '")}') AND TBF >= ${pa_threshold}) AS ps
                          JOIN Players AS p
                          ON ps.PlayerID = p.ID
                          ORDER BY ps.WAR DESC, SUBSTRING_INDEX(p.Name, ' ', -1), SUBSTRING_INDEX(p.Name, ' ', 1)
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
            connection.query(`SELECT ps2.PlayerID, p.Name, ps2.\`Season(s)\`, ps2.\`Age(s)\`, COALESCE(ps3.Team, ps2.\`Team(s)\`) AS \`Team(s)\`, ps2.G, FLOOR(ROUND(ps2.IP, 1)) + ROUND((IP - FLOOR(ROUND(ps2.IP, 1))) * 3 /10, 1) AS IP, ps2.TBF, ps2.BBE, CONCAT(ROUND(ps2.\`K%\`* 100, 1), '%') AS \`K%\`, CONCAT(ROUND(ps2.\`tBB%\` * 100, 1), '%') AS \`tBB%\`, CONCAT(ROUND(ps2.\`K%-tBB%\` * 100, 1), '%') AS \`K-tBB%\`, ROUND(ps2.tWHIP, 2) AS tWHIP, ROUND(ps2.EV, 1) AS EV, ROUND(ps2.LA, 1) AS LA, CONCAT(ROUND(ps2.\`Barrels/PA\` * 100, 1), '%') AS \`Barrels/PA\`, ROUND(ps2.\`RA/9\`, 2) AS \`RS/9\`, ROUND(ps2.ERA, 2) AS ERA, ROUND(ps2.FIP, 2) AS FIP, ROUND(ps2.xFIP, 2) AS xFIP, ROUND(ps2.SIERA, 2) AS SIERA, ROUND(ps2.tERA, 2) AS tERA, ROUND(ps2.kwERA, 2) AS kwERA, ROUND(ps2.xERA, 2) AS xERA, ROUND(ps2.FRA, 2) AS FRA, ROUND(ps2.bsERA, 2) AS bsERA, ps2.WAR
                              FROM (SELECT ps1.PlayerID, ps1.Season AS \`Season(s)\`, ps1.Age AS \`Age(s)\`, c.NumTeams AS \`Team(s)\`, SUM(ps1.G) AS G, SUM(ps1.IP) AS IP, SUM(ps1.TBF) AS TBF, SUM(ps1.BBE) AS BBE, SUM(ps1.K) / SUM(ps1.TBF) AS \`K%\`, SUM(ps1.BB + ps1.HBP) / SUM(ps1.TBF) AS \`tBB%\`, SUM(ps1.K - (ps1.BB + ps1.HBP)) / SUM(ps1.TBF) AS \`K%-tBB%\`, SUM(ps1.H + ps1.BB + ps1.HBP) / SUM(ps1.IP) AS tWHIP, SUM(ps1.EV * ps1.BBE) / SUM(ps1.BBE) AS EV, SUM(ps1.LA * ps1.BBE) / SUM(ps1.BBE) AS LA, SUM(ps1.Barrels) / SUM(ps1.TBF) AS \`Barrels/PA\`, 9 * SUM(ps1.R) / SUM(ps1.IP) AS \`RA/9\`, 9 * SUM(ps1.ER) / SUM(ps1.IP) AS ERA, SUM(ps1.FIP * ps1.TBF) / SUM(ps1.TBF) AS FIP, SUM(ps1.xFIP * ps1.TBF) / SUM(ps1.TBF) AS xFIP, SUM(ps1.SIERA * ps1.TBF) / SUM(ps1.TBF) AS SIERA, SUM(ps1.tERA * ps1.TBF) / SUM(ps1.TBF) AS tERA, SUM(ps1.kwERA * ps1.TBF) / SUM(ps1.TBF) AS kwERA, SUM(ps1.xERA * ps1.TBF) / SUM(ps1.TBF) AS xERA, -3.44548 - 8.33919 * SUM(ps1.K - (ps1.BB + ps1.HBP)) / SUM(ps1.TBF) + 0.01894 * SUM(ps1.LA * ps1.BBE) / SUM(ps1.BBE) + 0.0984 * SUM(ps1.EV * ps1.BBE) / SUM(ps1.BBE) AS FRA, (0.0478 * 9 * SUM(ps1.ER) / SUM(ps1.IP) + 0.0899 * SUM(ps1.FIP * ps1.TBF) / SUM(ps1.TBF) + 0.1271 * SUM(ps1.xFIP * ps1.TBF) / SUM(ps1.TBF) + 0.1429 * SUM(ps1.SIERA * ps1.TBF) / SUM(ps1.TBF)) / (0.0478 + 0.0899 + 0.1271 + 0.1429) AS bsERA, ps1.WAR
                                     FROM (SELECT PlayerID, Season, Age, G, IP, TBF, BBE, ER, R, K, BB, HBP, H, EV, LA, Barrels, FIP, xFIP, SIERA, tERA, kwERA, xERA, -3.44548 - 8.33919 * (\`K%\` - (BB + HBP) / TBF) + 0.01894 * LA + 0.0984 * EV AS FRA, (0.0478 * ERA + 0.0899 * FIP + 0.1271 * xFIP + 0.1429 * SIERA) / (0.0478 + 0.0899 + 0.1271 + 0.1429) AS bsERA, WAR
                                           FROM PitchingStats
                                           WHERE Season IN (${seasons.join(', ')}) AND Team IN ('${teams.join("', '")}')) AS ps1
                                     JOIN (SELECT PlayerID, COUNT(*) AS NumTeams
                                           FROM PitchingStats
                                           WHERE Season IN (${seasons.join(', ')}) AND Team IN ('${teams.join("', '")}')
                                           GROUP BY PlayerID, Season) AS c
                                     ON ps1.PlayerID = c.PlayerID
                                     GROUP BY ps1.PlayerID) AS ps2
                              JOIN Players AS p
                              ON ps2.PlayerID = p.ID
                              LEFT JOIN (SELECT PlayerID, Season, Team
                                         FROM PitchingStats
                                         WHERE Season IN (${seasons.join(', ')}) AND Team IN ('${teams.join("', '")}')) AS ps3
                              ON ps2.PlayerID = ps3.PlayerID AND ps2.\`Season(s)\` = ps3.Season AND ps2.\`Team(s)\` = 1
                              WHERE ps2.TBF >= ${pa_threshold}
                              ORDER BY ps2.WAR DESC, SUBSTRING_INDEX(p.Name, ' ', -1), SUBSTRING_INDEX(p.Name, ' ', 1)
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
        connection.query(`SELECT ps2.PlayerID, p.Name, COALESCE(ps3.Season, ps2.\`Season(s)\`) AS \`Season(s)\`, COALESCE(ps3.Age, ps2.\`Season(s)\`) AS \`Age(s)\`, ps2.\`Team(s)\`, ps2.G, FLOOR(ROUND(ps2.IP, 1)) + ROUND((IP - FLOOR(ROUND(ps2.IP, 1))) * 3 /10, 1) AS IP, ps2.TBF, ps2.BBE, CONCAT(ROUND(ps2.\`K%\`* 100, 1), '%') AS \`K%\`, CONCAT(ROUND(ps2.\`tBB%\` * 100, 1), '%') AS \`tBB%\`, CONCAT(ROUND(ps2.\`K%-tBB%\` * 100, 1), '%') AS \`K-tBB%\`, ROUND(ps2.tWHIP, 2) AS tWHIP, ROUND(ps2.EV, 1) AS EV, ROUND(ps2.LA, 1) AS LA, CONCAT(ROUND(ps2.\`Barrels/PA\` * 100, 1), '%') AS \`Barrels/PA\`, ROUND(ps2.\`RA/9\`, 2) AS \`RS/9\`, ROUND(ps2.ERA, 2) AS ERA, ROUND(ps2.FIP, 2) AS FIP, ROUND(ps2.xFIP, 2) AS xFIP, ROUND(ps2.SIERA, 2) AS SIERA, ROUND(ps2.tERA, 2) AS tERA, ROUND(ps2.kwERA, 2) AS kwERA, ROUND(ps2.xERA, 2) AS xERA, ROUND(ps2.FRA, 2) AS FRA, ROUND(ps2.bsERA, 2) AS bsERA, ps2.WAR
                          FROM (SELECT ps1.PlayerID, c.NumSeasons AS \`Season(s)\`, ps1.Team AS \`Team(s)\`, SUM(ps1.G) AS G, SUM(ps1.IP) AS IP, SUM(ps1.TBF) AS TBF, SUM(ps1.BBE) AS BBE, SUM(ps1.K) / SUM(ps1.TBF) AS \`K%\`, SUM(ps1.BB + ps1.HBP) / SUM(ps1.TBF) AS \`tBB%\`, SUM(ps1.K - (ps1.BB + ps1.HBP)) / SUM(ps1.TBF) AS \`K%-tBB%\`, SUM(ps1.H + ps1.BB + ps1.HBP) / SUM(ps1.IP) AS tWHIP, SUM(ps1.EV * ps1.BBE) / SUM(ps1.BBE) AS EV, SUM(ps1.LA * ps1.BBE) / SUM(ps1.BBE) AS LA, SUM(ps1.Barrels) / SUM(ps1.TBF) AS \`Barrels/PA\`, 9 * SUM(ps1.R) / SUM(ps1.IP) AS \`RA/9\`, 9 * SUM(ps1.ER) / SUM(ps1.IP) AS ERA, SUM(ps1.FIP * ps1.TBF) / SUM(ps1.TBF) AS FIP, SUM(ps1.xFIP * ps1.TBF) / SUM(ps1.TBF) AS xFIP, SUM(ps1.SIERA * ps1.TBF) / SUM(ps1.TBF) AS SIERA, SUM(ps1.tERA * ps1.TBF) / SUM(ps1.TBF) AS tERA, SUM(ps1.kwERA * ps1.TBF) / SUM(ps1.TBF) AS kwERA, SUM(ps1.xERA * ps1.TBF) / SUM(ps1.TBF) AS xERA, -3.44548 - 8.33919 * SUM(ps1.K - (ps1.BB + ps1.HBP)) / SUM(ps1.TBF) + 0.01894 * SUM(ps1.LA * ps1.BBE) / SUM(ps1.BBE) + 0.0984 * SUM(ps1.EV * ps1.BBE) / SUM(ps1.BBE) AS FRA, (0.0478 * 9 * SUM(ps1.ER) / SUM(ps1.IP) + 0.0899 * SUM(ps1.FIP * ps1.TBF) / SUM(ps1.TBF) + 0.1271 * SUM(ps1.xFIP * ps1.TBF) / SUM(ps1.TBF) + 0.1429 * SUM(ps1.SIERA * ps1.TBF) / SUM(ps1.TBF)) / (0.0478 + 0.0899 + 0.1271 + 0.1429) AS bsERA, ps1.WAR
                                FROM (SELECT PlayerID, Team, G, IP, TBF, BBE, ER, R, K, BB, HBP, H, EV, LA, Barrels, FIP, xFIP, SIERA, tERA, kwERA, xERA, -3.44548 - 8.33919 * (\`K%\` - (BB + HBP) / TBF) + 0.01894 * LA + 0.0984 * EV AS FRA, (0.0478 * ERA + 0.0899 * FIP + 0.1271 * xFIP + 0.1429 * SIERA) / (0.0478 + 0.0899 + 0.1271 + 0.1429) AS bsERA, WAR
                                      FROM PitchingStats
                                      WHERE Season IN (${seasons.join(', ')}) AND Team IN ('${teams.join("', '")}')) AS ps1
                                JOIN (SELECT PlayerID, Team, COUNT(DISTINCT Season) AS NumSeasons
                                      FROM PitchingStats
                                      WHERE Season IN (${seasons.join(', ')}) AND Team IN ('${teams.join("', '")}')
                                      GROUP BY PlayerID, Team) AS c
                                ON ps1.PlayerID = c.PlayerID
                                GROUP BY ps1.PlayerID) AS ps2
                          JOIN Players AS p
                          ON ps2.PlayerID = p.ID
                          LEFT JOIN (SELECT PlayerID, Season, Age, Team
                                     FROM PitchingStats
                                     WHERE Season IN (${seasons.join(', ')}) AND Team IN ('${teams.join("', '")}')) AS ps3
                          ON ps2.PlayerID = ps3.PlayerID AND ps2.\`Team(s)\` = ps3.Team AND ps2.\`Season(s)\` = 1
                          WHERE ps2.TBF >= ${pa_threshold}
                          ORDER BY ps2.WAR DESC, SUBSTRING_INDEX(p.Name, ' ', -1), SUBSTRING_INDEX(p.Name, ' ', 1)
                          LIMIT ${pagesize} OFFSET ${(page - 1) * pagesize};;`,
                         function (error, results, fields) {
                            if (error) {
                                console.log(error)
                                res.json({ error: error })
                            } else if (results) {
                                res.json({ results: results })
                            }
                         });
        } else {
            connection.query(`SELECT ps2.PlayerID, p.Name, COALESCE(ps3.Season, ps2.\`Season(s)\`) AS \`Season(s)\`, COALESCE(ps3.Age, ps2.\`Season(s)\`) AS \`Age(s)\`, COALESCE(ps4.Team, ps2.\`Team(s)\`) AS \`Team(s)\`, ps2.G, FLOOR(ROUND(ps2.IP, 1)) + ROUND((IP - FLOOR(ROUND(ps2.IP, 1))) * 3 /10, 1) AS IP, ps2.TBF, ps2.BBE, CONCAT(ROUND(ps2.\`K%\`* 100, 1), '%') AS \`K%\`, CONCAT(ROUND(ps2.\`tBB%\` * 100, 1), '%') AS \`tBB%\`, CONCAT(ROUND(ps2.\`K%-tBB%\` * 100, 1), '%') AS \`K-tBB%\`, ROUND(ps2.tWHIP, 2) AS tWHIP, ROUND(ps2.EV, 1) AS EV, ROUND(ps2.LA, 1) AS LA, CONCAT(ROUND(ps2.\`Barrels/PA\` * 100, 1), '%') AS \`Barrels/PA\`, ROUND(ps2.\`RA/9\`, 2) AS \`RS/9\`, ROUND(ps2.ERA, 2) AS ERA, ROUND(ps2.FIP, 2) AS FIP, ROUND(ps2.xFIP, 2) AS xFIP, ROUND(ps2.SIERA, 2) AS SIERA, ROUND(ps2.tERA, 2) AS tERA, ROUND(ps2.kwERA, 2) AS kwERA, ROUND(ps2.xERA, 2) AS xERA, ROUND(ps2.FRA, 2) AS FRA, ROUND(ps2.bsERA, 2) AS bsERA, ps2.WAR
                              FROM (SELECT ps1.PlayerID, c.NumSeasons AS \`Season(s)\`, c.NumTeams AS \`Team(s)\`, SUM(ps1.G) AS G, SUM(ps1.IP) AS IP, SUM(ps1.TBF) AS TBF, SUM(ps1.BBE) AS BBE, SUM(ps1.K) / SUM(ps1.TBF) AS \`K%\`, SUM(ps1.BB + ps1.HBP) / SUM(ps1.TBF) AS \`tBB%\`, SUM(ps1.K - (ps1.BB + ps1.HBP)) / SUM(ps1.TBF) AS \`K%-tBB%\`, SUM(ps1.H + ps1.BB + ps1.HBP) / SUM(ps1.IP) AS tWHIP, SUM(ps1.EV * ps1.BBE) / SUM(ps1.BBE) AS EV, SUM(ps1.LA * ps1.BBE) / SUM(ps1.BBE) AS LA, SUM(ps1.Barrels) / SUM(ps1.TBF) AS \`Barrels/PA\`, 9 * SUM(ps1.R) / SUM(ps1.IP) AS \`RA/9\`, 9 * SUM(ps1.ER) / SUM(ps1.IP) AS ERA, SUM(ps1.FIP * ps1.TBF) / SUM(ps1.TBF) AS FIP, SUM(ps1.xFIP * ps1.TBF) / SUM(ps1.TBF) AS xFIP, SUM(ps1.SIERA * ps1.TBF) / SUM(ps1.TBF) AS SIERA, SUM(ps1.tERA * ps1.TBF) / SUM(ps1.TBF) AS tERA, SUM(ps1.kwERA * ps1.TBF) / SUM(ps1.TBF) AS kwERA, SUM(ps1.xERA * ps1.TBF) / SUM(ps1.TBF) AS xERA, -3.44548 - 8.33919 * SUM(ps1.K - (ps1.BB + ps1.HBP)) / SUM(ps1.TBF) + 0.01894 * SUM(ps1.LA * ps1.BBE) / SUM(ps1.BBE) + 0.0984 * SUM(ps1.EV * ps1.BBE) / SUM(ps1.BBE) AS FRA, (0.0478 * 9 * SUM(ps1.ER) / SUM(ps1.IP) + 0.0899 * SUM(ps1.FIP * ps1.TBF) / SUM(ps1.TBF) + 0.1271 * SUM(ps1.xFIP * ps1.TBF) / SUM(ps1.TBF) + 0.1429 * SUM(ps1.SIERA * ps1.TBF) / SUM(ps1.TBF)) / (0.0478 + 0.0899 + 0.1271 + 0.1429) AS bsERA, ps1.WAR
                                    FROM (SELECT PlayerID, G, IP, TBF, BBE, ER, R, K, BB, HBP, H, EV, LA, Barrels, FIP, xFIP, SIERA, tERA, kwERA, xERA, -3.44548 - 8.33919 * (\`K%\` - (BB + HBP) / TBF) + 0.01894 * LA + 0.0984 * EV AS FRA, (0.0478 * ERA + 0.0899 * FIP + 0.1271 * xFIP + 0.1429 * SIERA) / (0.0478 + 0.0899 + 0.1271 + 0.1429) AS bsERA, WAR
                                          FROM PitchingStats
                                          WHERE Season IN (${seasons.join(', ')}) AND Team IN ('${teams.join("', '")}')) AS ps1
                                    JOIN (SELECT PlayerID, COUNT(DISTINCT Season) AS NumSeasons, COUNT(DISTINCT Team) AS NumTeams
                                          FROM PitchingStats
                                          WHERE Season IN (${seasons.join(', ')}) AND Team IN ('${teams.join("', '")}')
                                          GROUP BY PlayerID) AS c
                                  ON ps1.PlayerID = c.PlayerID
                                  GROUP BY ps1.PlayerID) AS ps2
                              JOIN Players AS p
                              ON ps2.PlayerID = p.ID
                              LEFT JOIN (SELECT DISTINCT PlayerID, Season, Age
                                         FROM PitchingStats
                                         WHERE Season IN (${seasons.join(', ')}) AND Team IN ('${teams.join("', '")}')) AS ps3
                              ON ps2.PlayerID = ps3.PlayerID AND ps2.\`Season(s)\` = 1
                              LEFT JOIN (SELECT DISTINCT PlayerID, Team
                                         FROM PitchingStats
                                         WHERE Season IN (${seasons.join(', ')}) AND Team IN ('${teams.join("', '")}')) AS ps4
                              ON ps2.PlayerID = ps4.PlayerID AND ps2.\`Team(s)\` = 1
                              WHERE ps2.TBF >= ${pa_threshold}
                              ORDER BY ps2.WAR DESC, SUBSTRING_INDEX(p.Name, ' ', -1), SUBSTRING_INDEX(p.Name, ' ', 1)
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
    }
}

module.exports = {
    players_batting_bs,
    players_pitching_bs
}