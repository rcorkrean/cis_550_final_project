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
          <h3>Welcome!</h3>
          <h3>This is the platform for looking up baseball players stats!</h3>
        </div>
        <div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
          <h3>Guide</h3>
          <h6>
            Searching up PA Threshold
          </h6>
          <p>
          You will see a PA Threshold search bar in Players Batting page. PA stands for Plate Appearance for batting. Normally,
          starter players would gain 3 ~ 5 PA per game. If you enter 100 as the PA Threshold,
          it would return players who have at least 100 batting appearance.
          </p>
          <h6>
            Searching up TBF Threshold
          </h6>
          <p>
          You will see a TBF Threshold search bar in Players Pitching page. TBF stands for Total Batters Faced, which is the number of Batters
          who made a plate appearance before the pitcher in a season. 
          </p>
          <h6>
            Split Seasons & Teams
          </h6>
          <p>
            Many players play for different teams at different seasons. You can search players by either
            combining all seasons together (unchecking `Split Seasons` checkbox), or by splitting players'
            stat by seasons. Similarly, you can search players stats by each team, or by combining all of the player's
            stat by checking/unchecking `Split Teams` checkbox.
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
