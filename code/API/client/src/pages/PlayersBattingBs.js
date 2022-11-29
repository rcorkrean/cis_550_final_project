import React from 'react';
import { Form, FormInput, FormGroup, FormCheckbox, Button, Card, CardBody, CardTitle, Progress } from "shards-react";
import MenuBar from '../components/MenuBar';
import { Table,
  Pagination,
  Select,
  Row,
  Col,
  Divider,
  Slider,
  Rate } from 'antd';
import { getPlayersBattingBS, getPlayersBattingBSSearch } from '../fetcher'

const playerColumns = [
  {
    title: 'Name',
    dataIndex: 'Name',
    key: 'Name',
    sorter: (a, b) => Math.abs(a.Name.split(' ')[1].localeCompare(b.Name.split(' ')[1])) ? a.Name.split(' ')[1].localeCompare(b.Name.split(' ')[1]) : a.Name.split(' ')[0].localeCompare(b.Name.split(' ')[0])
  },
  {
    title: 'Season(s)',
    dataIndex: 'Season(s)',
    key: 'Season',
    // sorter: (a, b) => Math.sign(a.Season - b.Season)
  },
  {
    title: 'Age(s)',
    dataIndex: 'Age(s)',
    key: 'Age',
    // sorter: (a, b) => Math.sign(a.Age - b.Age)
    
  },
  {
    title: 'Team(s)',
    dataIndex: 'Team(s)',
    key: 'Team',
    // sorter: (a, b) => a.Team.localeCompare(b.Team)
  },
  {
    title: 'WAR',
    dataIndex: 'WAR',
    key: 'WAR',
    sorter: (a, b) => Math.sign(a.WAR - b.WAR)
  }
];

class PlayersBattingBS extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playersBattingBSResults: [],
      playersBattingBSPageNumber: 1,
      playersBattingBSPageSize: 10,
      pagination: null,
      splitseasons: true,
      splitteams: false,
      pa_threshold: 0
    };

    this.handleSplitChange = this.handleSplitChange.bind(this);
    this.handlePATThresholdChange = this.handlePATThresholdChange.bind(this);
  }

  handleSplitChange(event, split) {
    const newState = {};
    newState[split] = !this.state[split];
    this.setState({ ...this.state, ...newState });
  }

  handleSplitTeamsChange(event) {
    this.setState({ splitteams: event.target.value });
  }

  handlePATThresholdChange(event) {
    this.setState({ pa_threshold: event.target.value });
  }

  updateSearchResults() {
    getPlayersBattingBSSearch(null, null, this.state.splitseasons, this.state.splitteams, this.state.pa_threshold).then(res => {
        this.setState({ playersBattingBSResults: res.results });
    });
  }

  componentDidMount() {
    getPlayersBattingBS(null, null).then(res => {
      console.log(res.results);
      this.setState({ playersBattingBSResults: res.results });
    });
  }

  render() {
    return (
      <div>
        <MenuBar />
        <Form style={{ width: '80vw', margin: '0 auto', marginTop: '5vh' }}>
        <h3>Player Batting</h3>
            <Row>
              <Col flex={2}>
                <FormCheckbox checked={this.state.splitseasons} onChange={e => this.handleSplitChange(e, 'splitseasons')}>
                  <label>Split Seasons</label>
                </FormCheckbox></Col>
              <Col flex={2}>
                <FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                  <label>PA Threshold</label>
                    <FormInput placeholder="Qualified" value={this.state.pa_threshold} onChange={this.handlePATThresholdChange}/>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col flex={2}>
                <FormCheckbox checked={this.state.splitteams} onChange={e => this.handleSplitChange(e, 'splitteams')}>
                  <label>Split Teams</label>
                </FormCheckbox>
              </Col>
            </Row>
        </Form>
        <Divider />
      <div>
        <div style={{ width: '70vw', margin: '0 auto', marginTop: '0 auto' }}>
          <Table dataSource={this.state.playersBattingBSResults} columns={playerColumns} pagination={{ pageSizeOptions: [5, 10, 50, 100, 500, Infinity], defaultPageSize: 50, showQuickJumper: true }}/>
        </div>
      </div>
    </div>
    )
  }
}

export default PlayersBattingBS
