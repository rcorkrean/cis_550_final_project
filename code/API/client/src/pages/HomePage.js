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
          <h3>Our platform aggregates and expands upon various advanced baseball metrics provided by Baseball Savant and FanGraphs to provide users with a comprehensive search tool for baseball inquiry and analysis. </h3>
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
