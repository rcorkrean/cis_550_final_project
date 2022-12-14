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
import { getPlayersPitchingBS } from '../fetcher'

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
    title: 'TBF',
    dataIndex: 'TBF',
    key: 'TBF',
    sorter: (a, b) => Math.sign(a.TBF - b.TBF)
  },
  {
    title: 'WAR',
    dataIndex: 'WAR',
    key: 'WAR',
    sorter: (a, b) => Math.sign(a.WAR - b.WAR)
  }
];

class PlayersPitchingBS extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      results: [],
      page: 1,
      pagesize: 50,
      pagination: null,
      splitseasons: true,
      splitteams: false,
      tbf_threshold: 423
    };

    this.handleSplitSeasonsChange = this.handleSplitSeasonsChange.bind(this);
    this.handleSplitTeamsChange = this.handleSplitTeamsChange.bind(this);
    this.handlePATThresholdChange = this.handlePATThresholdChange.bind(this);
  }

  handleSplitSeasonsChange = () => {
    console.log(this.state.splitseasons);
    this.setState({ splitseasons: !this.state.splitseasons });
    getPlayersPitchingBS(null, null, !this.state.splitseasons, this.state.splitteams, this.state.tbf_threshold).then(res => {
      this.setState({ results: res.results, page: 1 });
    });
  }

  handleSplitTeamsChange = () => {
    console.log(this.state.splitteams);
    this.setState({ splitteams: !this.state.splitteams });
    getPlayersPitchingBS(null, null, this.state.splitseasons, !this.state.splitteams, this.state.tbf_threshold).then(res => {
      this.setState({ results: res.results, page: 1 });
    });
  }

  handlePATThresholdChange(event) {
    console.log(this.state.tbf_threshold);
    this.setState({ tbf_threshold: event.target.value });
    console.log(this.state.tbf_threshold);
  }

  updateSearchResults = () => {
    getPlayersPitchingBS(null, null, this.state.splitseasons, this.state.splitteams, this.state.tbf_threshold).then(res => {
        this.setState({ results: res.results, page: 1 });
    });
  }

  componentDidMount() {
    getPlayersPitchingBS(null, null, this.state.splitseasons, this.state.splitteams, this.state.tbf_threshold).then(res => {
      this.setState({ results: res.results });
    });
  }

  render() {
    return (
      <div>
        <MenuBar />
        <Form style={{ width: '80vw', margin: '0 auto', marginTop: '5vh' }}>
        <h3>Player Pitching</h3>
            <Row>
              <Col flex={2}>
                <FormCheckbox checked={this.state.splitseasons} onChange={this.handleSplitSeasonsChange}>
                  <label>Split Seasons</label>
                </FormCheckbox></Col>
              <Col flex={2}>
                <FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                  <label>TBF Threshold</label>
                    <FormInput placeholder="Qualified" value={this.state.tbf_threshold} onChange={this.handlePATThresholdChange}/>
                </FormGroup>
              </Col>
                <Col flex={2}><FormGroup style={{ width: '10vw' }}>
                    <Button style={{ marginTop: '4vh' }} onClick={this.updateSearchResults}>Update</Button>
                </FormGroup></Col>
            </Row>
            <Row>
              <Col flex={2}>
                <FormCheckbox checked={this.state.splitteams} onChange={this.handleSplitTeamsChange}>
                  <label>Split Teams</label>
                </FormCheckbox>
              </Col>
            </Row>
        </Form>
        <Divider />
      <div>
        <div style={{ width: '70vw', margin: '0 auto', marginTop: '0 auto' }}>
          <Table dataSource={this.state.results} columns={playerColumns} pagination={{ pageSizeOptions: [5, 10, 50, 100, 500, Infinity], defaultPageSize: 50, showQuickJumper: true }}/>
        </div>
      </div>
    </div>
    )
  }
}

export default PlayersPitchingBS;