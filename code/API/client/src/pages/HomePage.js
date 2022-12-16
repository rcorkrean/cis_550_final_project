import React from 'react';
import MenuBar from '../components/MenuBar';
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from 'shards-react';

class HomePage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <MenuBar />
        <div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
          <h3>Welcome to BSGraphs, your premier source for statistical BS!</h3>
          <p>Our platform aggregates and expands upon various advanced baseball metrics provided by Baseball Savant and FanGraphs to provide users with a comprehensive search tool for baseball inquiry and analysis. </p>
        </div>
        <div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
          <h3>Facets and Features</h3>
          <h6>
            Filtering Results on Plate Appearances or Total Batters Faced
          </h6>
          <p>
          Above the Players Batting leaderboard, you will see a plate appearance (PA) threshold form, which allows you to filter leaderboard results on PA count. A player is credited with a PA each time he completes a turn batting. In a typical, nine-inning game, a batter will record between three and five PAs, and around 500 PAs in a full, 162-game season. If you enter 500 as the PA threshold,
          only results with at least 500 PAs will be shown in the batting results table. The pitching equivalent of PA is total batters faced (TBF); starting pitchers usually face around 650 batters in a full season. The TBF threshold form at the top of the pitching leaderboard provides the same functionality as the PA threshold form.
          </p>
          <h6>
            Splitting Results on Season or Team
          </h6>
          <p>
            By default, each result displayed in the leaderboard corresponds to a player's single-season statistics. Unchecking the `Split Seasons` checkbox aggregates player records into a single, inter-season result. Similarly, you can aggregate players statistics by team by checking/unchecking the `Split Teams` checkbox.
          </p>
        </div>
        <div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
          <h3>Baseball Terminologies</h3>
          <h6>BBE</h6>
          <p>
            BBE(Batted Ball Event) represents any batted ball that produces a result, including outs, hits, and errors.
          </p>
          <h6>BB%</h6>
          <p>
            BB% represents the percentage of walks that occurs (when a pitcher throws four balls out of the strike zone).
          </p>
          <h6>K%</h6>
          <p>
            K% represents the strikeout rate.
          </p>
          <h6>EV & maxEV</h6>
          <p>
            EV represents the speed of the baseball as it comes off the bat, immediately after a batter makes contact. maxEV is the maximum value recorded.
          </p>
          <h6>Barrels/PA & BA & xBA</h6>
          <p>
            BA (barrels) is a ball that is hit with an EV of at least 98 mph. Barrels/PA is the number of barrels divided by the number of plate appearances. xBA is the expected value of BA.
          </p>
          <h6>BABIP & xBABIP</h6>
          <p>
            BABIP is the batting average on balls in play, which measures a player's battinng average exculsively on balls hit into the field of play, removing outcomes not affected by the opposing defense(namely home runs and strikeouts). xBABIP is the expected value of BABIP.
          </p>
          <h6>OBP</h6>
          <p>
            OBP(On Base Percentage) refers to how frequently a batter reaches base per plate apperance.
          </p>
          <h6>SLG</h6>
          <p>
            SLG(Slugging Percentage) is the number of total bases dived by the number of bats.
          </p>
          <h6>ISO</h6>
          <p>
            ISO measures the raw power of hitter by taking only extra-base hits, and the type of extra base hit into accounnt. For example a player who goes 1/6 with a double has an ISO of 0.200.
          </p>
          <h6>wRC+</h6>
          <p>
            wRC+ is a statistic that measures the runs created by a player, taking into account different league factors.
          </p>
          <h6>WAR</h6>
          <p>
            WAR(Wins Above Replacement) is a statistic that summarize a player's total contributions to their team.
          </p>
        </div>
        <div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
          <h3>Enjoy!</h3>
        </div>
      </div>
    )
  }
}

export default HomePage
