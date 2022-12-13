import React from 'react';
import { Form, FormInput, FormGroup, FormCheckbox, Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "shards-react";
import MenuBar from '../components/MenuBar';
import { Table, Row, Col, Divider } from 'antd';
import { getPlayersBattingBS } from '../fetcher'

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
    key: 'Season'
  },
  {
    title: 'Age(s)',
    dataIndex: 'Age(s)',
    key: 'Age'
    
  },
  {
    title: 'Team(s)',
    dataIndex: 'Team(s)',
    key: 'Team'
  },
  {
    title: 'PA',
    dataIndex: 'PA',
    key: 'PA',
    sorter: (a, b) => Math.sign(a.PA - b.PA),
    sortDirections: ['descend', 'ascend']
  },
  {
    title: 'BBE',
    dataIndex: 'BBE',
    key: 'BBE',
    sorter: (a, b) => Math.sign(a.BBE - b.BBE),
    sortDirections: ['descend', 'ascend']
    
  },
  {
    title: 'BB%',
    dataIndex: 'BB%',
    key: 'BB%',
    sorter: (a, b) => Math.sign(a['BB%'].split('%')[0] - b['BB%'].split('%')[0]),
    sortDirections: ['descend', 'ascend']
  },
  {
    title: 'K%',
    dataIndex: 'K%',
    key: 'y',
    sorter: (a, b) => Math.sign(a['y'] - b['y']),
    sortDirections: ['descend', 'ascend']
  },
  {
    title: 'EV',
    dataIndex: 'EV',
    key: 'EV',
    sorter: (a, b) => Math.sign(a.EV - b.EV),
    sortDirections: ['descend', 'ascend']
  },
  {
    title: 'maxEV',
    dataIndex: 'maxEV',
    key: 'maxEV',
    sorter: (a, b) => Math.sign(a.maxEV - b.maxEV),
    sortDirections: ['descend', 'ascend']
  },
  {
    title: 'Barrels/PA',
    dataIndex: 'Barrels/PA',
    key: 'Barrels/PA',
    sorter: (a, b) => Math.sign(a['Barrels/PA'] - b['Barrels/PA']),
    sortDirections: ['descend', 'ascend']
  },
  {
    title: 'BA',
    dataIndex: 'BA',
    key: 'BA',
    sorter: (a, b) => Math.sign(a.BA - b.BA),
    sortDirections: ['descend', 'ascend']
  },
  {
    title: 'xBA',
    dataIndex: 'xBA',
    key: 'xBA',
    sorter: (a, b) => Math.sign(a.xBA - b.xBA),
    sortDirections: ['descend', 'ascend']
  },
  {
    title: 'BABIP',
    dataIndex: 'BABIP',
    key: 'BABIP',
    sorter: (a, b) => Math.sign(a.BABIP - b.BABIP),
    sortDirections: ['descend', 'ascend']
  },
  {
    title: 'xBABIP',
    dataIndex: 'xBABIP',
    key: 'xBABIP',
    sorter: (a, b) => Math.sign(a.xBABIP - b.xBABIP),
    sortDirections: ['descend', 'ascend']
  },
  {
    title: 'OBP',
    dataIndex: 'OBP',
    key: 'OBP',
    sorter: (a, b) => Math.sign(a.OBP - b.OBP),
    sortDirections: ['descend', 'ascend']
  },
  {
    title: 'xOBP',
    dataIndex: 'xOBP',
    key: 'xOBP',
    sorter: (a, b) => Math.sign(a.xOBP - b.xOBP),
    sortDirections: ['descend', 'ascend']
  },
  {
    title: 'SLG',
    dataIndex: 'SLG',
    key: 'SLG',
    sorter: (a, b) => Math.sign(a.SLG - b.SLG),
    sortDirections: ['descend', 'ascend']
  },
  {
    title: 'xSLG',
    dataIndex: 'xSLG',
    key: 'xSLG',
    sorter: (a, b) => Math.sign(a.xSLG - b.xSLG),
    sortDirections: ['descend', 'ascend']
  },
  {
    title: 'ISO',
    dataIndex: 'ISO',
    key: 'ISO',
    sorter: (a, b) => Math.sign(a.ISO - b.ISO),
    sortDirections: ['descend', 'ascend']
  },
  {
    title: 'xISO',
    dataIndex: 'xISO',
    key: 'xISO',
    sorter: (a, b) => Math.sign(a.xISO - b.xISO),
    sortDirections: ['descend', 'ascend']
  },
  {
    title: 'wOBA',
    dataIndex: 'wOBA',
    key: 'wOBA',
    sorter: (a, b) => Math.sign(a.wOBA - b.wOBA),
    sortDirections: ['descend', 'ascend']
  },
  {
    title: 'xwOBA',
    dataIndex: 'xwOBA',
    key: 'xwOBA',
    sorter: (a, b) => Math.sign(a.xwOBA - b.xwOBA),
    sortDirections: ['descend', 'ascend']
  },
  {
    title: 'wOBAcon',
    dataIndex: 'wOBAcon',
    key: 'wOBAcon',
    sorter: (a, b) => Math.sign(a.wOBAcon - b.wOBAcon),
    sortDirections: ['descend', 'ascend']
  },
  {
    title: 'xwOBAcon',
    dataIndex: 'xwOBAcon',
    key: 'xwOBAcon',
    sorter: (a, b) => Math.sign(a.xwOBAcon - b.xwOBAcon),
    sortDirections: ['descend', 'ascend']
  },
  {
    title: 'wRC+',
    dataIndex: 'wRC+',
    key: 'wRC+',
    sorter: (a, b) => Math.sign(a['wRC+'] - b['wRC+']),
    sortDirections: ['descend', 'ascend']
  },
  {
    title: 'WAR',
    dataIndex: 'WAR',
    key: 'WAR',
    sorter: (a, b) => Math.sign(a.WAR - b.WAR),
    sortDirections: ['descend', 'ascend']
  }
];

class PlayersBattingBS extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      results: [],
      page: 1,
      pagesize: 50,
      pagination: null,
      splitseasons: true,
      splitteams: false,
      percentiles: false,
      pa_threshold: 423,
      teamsdropdown: false,
      seasonsdropdown: false,
      ARI: true,
      ATL: true,
      BAL: true,
      BOS: true,
      CHC: true,
      CIN: true,
      CLE: true,
      COL: true,
      CWS: true,
      DET: true,
      HOU: true,
      KC: true,
      LAA: true,
      LAD: true,
      MIA: true,
      MIL: true,
      MIN: true,
      NYM: true,
      NYY: true,
      OAK: true,
      PHI: true,
      PIT: true,
      SD: true,
      SEA: true,
      SF: true,
      STL: true,
      TB: true,
      TEX: true,
      TOR: true,
      WSH: true,
      2015: true,
      2016: true,
      2017: true,
      2018: true,
      2019: true,
      2020: true,
      2021: true,
      2022: true,
    };

    this.handleSplitSeasonsChange = this.handleSplitSeasonsChange.bind(this);
    this.handleSplitTeamsChange = this.handleSplitTeamsChange.bind(this);
    this.handlePercentilesChange = this.handlePercentilesChange.bind(this);
    this.handlePATThresholdChange = this.handlePATThresholdChange.bind(this);
    this.toggleTeamsDropdown = this.toggleTeamsDropdown.bind(this);
    this.toggleSeasonsDropdown = this.toggleSeasonsDropdown.bind(this);
    this.handleARIChange = this.handleARIChange.bind(this);
    this.handleATLChange = this.handleATLChange.bind(this);
    this.handleBALChange = this.handleBALChange.bind(this);
    this.handleBOSChange = this.handleBOSChange.bind(this);
    this.handleCHCChange = this.handleCHCChange.bind(this);
    this.handleCINChange = this.handleCINChange.bind(this);
    this.handleCLEChange = this.handleCLEChange.bind(this);
    this.handleCOLChange = this.handleCOLChange.bind(this);
    this.handleCWSChange = this.handleCWSChange.bind(this);
    this.handleDETChange = this.handleDETChange.bind(this);
    this.handleHOUChange = this.handleHOUChange.bind(this);
    this.handleKCChange = this.handleKCChange.bind(this);
    this.handleLAAChange = this.handleLAAChange.bind(this);
    this.handleLADChange = this.handleLADChange.bind(this);
    this.handleMIAChange = this.handleMIAChange.bind(this);
    this.handleMILChange = this.handleMILChange.bind(this);
    this.handleMINChange = this.handleMINChange.bind(this);
    this.handleNYMChange = this.handleNYMChange.bind(this);
    this.handleNYYChange = this.handleNYYChange.bind(this);
    this.handleOAKChange = this.handleOAKChange.bind(this);
    this.handlePHIChange = this.handlePHIChange.bind(this);
    this.handlePITChange = this.handlePITChange.bind(this);
    this.handleSDChange = this.handleSDChange.bind(this);
    this.handleSEAChange = this.handleSEAChange.bind(this);
    this.handleSFChange = this.handleSFChange.bind(this);
    this.handleSTLChange = this.handleSTLChange.bind(this);
    this.handleTBChange = this.handleTBChange.bind(this);
    this.handleTEXChange = this.handleTEXChange.bind(this);
    this.handleTORChange = this.handleTORChange.bind(this);
    this.handleWSHChange = this.handleWSHChange.bind(this);
    this.handle2015Change = this.handle2015Change.bind(this);
    this.handle2016Change = this.handle2016Change.bind(this);
    this.handle2017Change = this.handle2017Change.bind(this);
    this.handle2018Change = this.handle2018Change.bind(this);
    this.handle2019Change = this.handle2019Change.bind(this);
    this.handle2020Change = this.handle2020Change.bind(this);
    this.handle2021Change = this.handle2021Change.bind(this);
    this.handle2022Change = this.handle2022Change.bind(this);
  }

  handleSplitSeasonsChange = () => {
    this.setState({ splitseasons: !this.state.splitseasons });
    getPlayersBattingBS(this.state.page, this.state.pagesize, !this.state.splitseasons, this.state.splitteams, this.state.percentiles, this.state.pa_threshold, this.state.ARI, this.state.ATL, this.state.BAL, this.state.BOS, this.state.CHC, this.state.CIN, this.state.CLE, this.state.COL, this.state.CWS, this.state.DET, this.state.HOU, this.state.KC, this.state.LAA, this.state.LAD, this.state.MIA, this.state.MIL, this.state.MIN, this.state.NYM, this.state.NYY, this.state.OAK, this.state.PHI, this.state.PIT, this.state.SD, this.state.SEA, this.state.SF, this.state.STL, this.state.TB, this.state.TEX, this.state.TOR, this.state.WSH, this.state[2015], this.state[2016], this.state[2017], this.state[2018], this.state[2019], this.state[2020], this.state[2021], this.state[2022]).then(res => {
      this.setState({ results: res.results, page: 1 });
    });
  }

  handleSplitTeamsChange = () => {
    this.setState({ splitteams: !this.state.splitteams });
    getPlayersBattingBS(this.state.page, this.state.pagesize, this.state.splitseasons, !this.state.splitteams, this.state.percentiles, this.state.pa_threshold, this.state.ARI, this.state.ATL, this.state.BAL, this.state.BOS, this.state.CHC, this.state.CIN, this.state.CLE, this.state.COL, this.state.CWS, this.state.DET, this.state.HOU, this.state.KC, this.state.LAA, this.state.LAD, this.state.MIA, this.state.MIL, this.state.MIN, this.state.NYM, this.state.NYY, this.state.OAK, this.state.PHI, this.state.PIT, this.state.SD, this.state.SEA, this.state.SF, this.state.STL, this.state.TB, this.state.TEX, this.state.TOR, this.state.WSH, this.state[2015], this.state[2016], this.state[2017], this.state[2018], this.state[2019], this.state[2020], this.state[2021], this.state[2022]).then(res => {
      this.setState({ results: res.results, page: 1 });
    });
  }

  handlePercentilesChange = () => {
    this.setState({ percentiles: !this.state.percentiles });
    getPlayersBattingBS(this.state.page, this.state.pagesize, this.state.splitseasons, this.state.splitteams, !this.state.percentiles, this.state.pa_threshold, this.state.ARI, this.state.ATL, this.state.BAL, this.state.BOS, this.state.CHC, this.state.CIN, this.state.CLE, this.state.COL, this.state.CWS, this.state.DET, this.state.HOU, this.state.KC, this.state.LAA, this.state.LAD, this.state.MIA, this.state.MIL, this.state.MIN, this.state.NYM, this.state.NYY, this.state.OAK, this.state.PHI, this.state.PIT, this.state.SD, this.state.SEA, this.state.SF, this.state.STL, this.state.TB, this.state.TEX, this.state.TOR, this.state.WSH, this.state[2015], this.state[2016], this.state[2017], this.state[2018], this.state[2019], this.state[2020], this.state[2021], this.state[2022]).then(res => {
      this.setState({ results: res.results, page: 1 });
    });
  }

  handleARIChange = () => {
    this.setState({ ARI: !this.state.ARI });
    getPlayersBattingBS(this.state.page, this.state.pagesize, this.state.splitseasons, this.state.splitteams, this.state.percentiles, this.state.pa_threshold, !this.state.ARI, this.state.ATL, this.state.BAL, this.state.BOS, this.state.CHC, this.state.CIN, this.state.CLE, this.state.COL, this.state.CWS, this.state.DET, this.state.HOU, this.state.KC, this.state.LAA, this.state.LAD, this.state.MIA, this.state.MIL, this.state.MIN, this.state.NYM, this.state.NYY, this.state.OAK, this.state.PHI, this.state.PIT, this.state.SD, this.state.SEA, this.state.SF, this.state.STL, this.state.TB, this.state.TEX, this.state.TOR, this.state.WSH, this.state[2015], this.state[2016], this.state[2017], this.state[2018], this.state[2019], this.state[2020], this.state[2021], this.state[2022]).then(res => {
      this.setState({ results: res.results, page: 1 });
    });
  }

  handleATLChange = () => {
    this.setState({ ATL: !this.state.ATL });
    getPlayersBattingBS(this.state.page, this.state.pagesize, this.state.splitseasons, this.state.splitteams, this.state.percentiles, this.state.pa_threshold, this.state.ARI, !this.state.ATL, this.state.BAL, this.state.BOS, this.state.CHC, this.state.CIN, this.state.CLE, this.state.COL, this.state.CWS, this.state.DET, this.state.HOU, this.state.KC, this.state.LAA, this.state.LAD, this.state.MIA, this.state.MIL, this.state.MIN, this.state.NYM, this.state.NYY, this.state.OAK, this.state.PHI, this.state.PIT, this.state.SD, this.state.SEA, this.state.SF, this.state.STL, this.state.TB, this.state.TEX, this.state.TOR, this.state.WSH, this.state[2015], this.state[2016], this.state[2017], this.state[2018], this.state[2019], this.state[2020], this.state[2021], this.state[2022]).then(res => {
      this.setState({ results: res.results, page: 1 });
    });
  }

  handleBALChange = () => {
    this.setState({ BAL: !this.state.BAL });
    getPlayersBattingBS(this.state.page, this.state.pagesize, this.state.splitseasons, this.state.splitteams, this.state.percentiles, this.state.pa_threshold, this.state.ARI, this.state.ATL, !this.state.BAL, this.state.BOS, this.state.CHC, this.state.CIN, this.state.CLE, this.state.COL, this.state.CWS, this.state.DET, this.state.HOU, this.state.KC, this.state.LAA, this.state.LAD, this.state.MIA, this.state.MIL, this.state.MIN, this.state.NYM, this.state.NYY, this.state.OAK, this.state.PHI, this.state.PIT, this.state.SD, this.state.SEA, this.state.SF, this.state.STL, this.state.TB, this.state.TEX, this.state.TOR, this.state.WSH, this.state[2015], this.state[2016], this.state[2017], this.state[2018], this.state[2019], this.state[2020], this.state[2021], this.state[2022]).then(res => {
      this.setState({ results: res.results, page: 1 });
    });
  }

  handleBOSChange = () => {
    this.setState({ BOS: !this.state.BOS });
    getPlayersBattingBS(this.state.page, this.state.pagesize, this.state.splitseasons, this.state.splitteams, this.state.percentiles, this.state.pa_threshold, this.state.ARI, this.state.ATL, this.state.BAL, !this.state.BOS, this.state.CHC, this.state.CIN, this.state.CLE, this.state.COL, this.state.CWS, this.state.DET, this.state.HOU, this.state.KC, this.state.LAA, this.state.LAD, this.state.MIA, this.state.MIL, this.state.MIN, this.state.NYM, this.state.NYY, this.state.OAK, this.state.PHI, this.state.PIT, this.state.SD, this.state.SEA, this.state.SF, this.state.STL, this.state.TB, this.state.TEX, this.state.TOR, this.state.WSH, this.state[2015], this.state[2016], this.state[2017], this.state[2018], this.state[2019], this.state[2020], this.state[2021], this.state[2022]).then(res => {
      this.setState({ results: res.results, page: 1 });
    });
  }

  handleCHCChange = () => {
    this.setState({ CHC: !this.state.CHC });
    getPlayersBattingBS(this.state.page, this.state.pagesize, this.state.splitseasons, this.state.splitteams, this.state.percentiles, this.state.pa_threshold, this.state.ARI, this.state.ATL, this.state.BAL, this.state.BOS, !this.state.CHC, this.state.CIN, this.state.CLE, this.state.COL, this.state.CWS, this.state.DET, this.state.HOU, this.state.KC, this.state.LAA, this.state.LAD, this.state.MIA, this.state.MIL, this.state.MIN, this.state.NYM, this.state.NYY, this.state.OAK, this.state.PHI, this.state.PIT, this.state.SD, this.state.SEA, this.state.SF, this.state.STL, this.state.TB, this.state.TEX, this.state.TOR, this.state.WSH, this.state[2015], this.state[2016], this.state[2017], this.state[2018], this.state[2019], this.state[2020], this.state[2021], this.state[2022]).then(res => {
      this.setState({ results: res.results, page: 1 });
    });
  }

  handleCINChange = () => {
    this.setState({ CIN: !this.state.CIN });
    getPlayersBattingBS(this.state.page, this.state.pagesize, this.state.splitseasons, this.state.splitteams, this.state.percentiles, this.state.pa_threshold, this.state.ARI, this.state.ATL, this.state.BAL, this.state.BOS, this.state.CHC, !this.state.CIN, this.state.CLE, this.state.COL, this.state.CWS, this.state.DET, this.state.HOU, this.state.KC, this.state.LAA, this.state.LAD, this.state.MIA, this.state.MIL, this.state.MIN, this.state.NYM, this.state.NYY, this.state.OAK, this.state.PHI, this.state.PIT, this.state.SD, this.state.SEA, this.state.SF, this.state.STL, this.state.TB, this.state.TEX, this.state.TOR, this.state.WSH, this.state[2015], this.state[2016], this.state[2017], this.state[2018], this.state[2019], this.state[2020], this.state[2021], this.state[2022]).then(res => {
      this.setState({ results: res.results, page: 1 });
    });
  }

  handleCLEChange = () => {
    this.setState({ CLE: !this.state.CLE });
    getPlayersBattingBS(this.state.page, this.state.pagesize, this.state.splitseasons, this.state.splitteams, this.state.percentiles, this.state.pa_threshold, this.state.ARI, this.state.ATL, this.state.BAL, this.state.BOS, this.state.CHC, this.state.CIN, !this.state.CLE, this.state.COL, this.state.CWS, this.state.DET, this.state.HOU, this.state.KC, this.state.LAA, this.state.LAD, this.state.MIA, this.state.MIL, this.state.MIN, this.state.NYM, this.state.NYY, this.state.OAK, this.state.PHI, this.state.PIT, this.state.SD, this.state.SEA, this.state.SF, this.state.STL, this.state.TB, this.state.TEX, this.state.TOR, this.state.WSH, this.state[2015], this.state[2016], this.state[2017], this.state[2018], this.state[2019], this.state[2020], this.state[2021], this.state[2022]).then(res => {
      this.setState({ results: res.results, page: 1 });
    });
  }

  handleCOLChange = () => {
    this.setState({ COL: !this.state.COL });
    getPlayersBattingBS(this.state.page, this.state.pagesize, this.state.splitseasons, this.state.splitteams, this.state.percentiles, this.state.pa_threshold, this.state.ARI, this.state.ATL, this.state.BAL, this.state.BOS, this.state.CHC, this.state.CIN, this.state.CLE, !this.state.COL, this.state.CWS, this.state.DET, this.state.HOU, this.state.KC, this.state.LAA, this.state.LAD, this.state.MIA, this.state.MIL, this.state.MIN, this.state.NYM, this.state.NYY, this.state.OAK, this.state.PHI, this.state.PIT, this.state.SD, this.state.SEA, this.state.SF, this.state.STL, this.state.TB, this.state.TEX, this.state.TOR, this.state.WSH, this.state[2015], this.state[2016], this.state[2017], this.state[2018], this.state[2019], this.state[2020], this.state[2021], this.state[2022]).then(res => {
      this.setState({ results: res.results, page: 1 });
    });
  }

  handleCWSChange = () => {
    this.setState({ CWS: !this.state.CWS });
    getPlayersBattingBS(this.state.page, this.state.pagesize, this.state.splitseasons, this.state.splitteams, this.state.percentiles, this.state.pa_threshold, this.state.ARI, this.state.ATL, this.state.BAL, this.state.BOS, this.state.CHC, this.state.CIN, this.state.CLE, this.state.COL, !this.state.CWS, this.state.DET, this.state.HOU, this.state.KC, this.state.LAA, this.state.LAD, this.state.MIA, this.state.MIL, this.state.MIN, this.state.NYM, this.state.NYY, this.state.OAK, this.state.PHI, this.state.PIT, this.state.SD, this.state.SEA, this.state.SF, this.state.STL, this.state.TB, this.state.TEX, this.state.TOR, this.state.WSH, this.state[2015], this.state[2016], this.state[2017], this.state[2018], this.state[2019], this.state[2020], this.state[2021], this.state[2022]).then(res => {
      this.setState({ results: res.results, page: 1 });
    });
  }

  handleDETChange = () => {
    this.setState({ DET: !this.state.DET });
    getPlayersBattingBS(this.state.page, this.state.pagesize, this.state.splitseasons, this.state.splitteams, this.state.percentiles, this.state.pa_threshold, this.state.ARI, this.state.ATL, this.state.BAL, this.state.BOS, this.state.CHC, this.state.CIN, this.state.CLE, this.state.COL, this.state.CWS, !this.state.DET, this.state.HOU, this.state.KC, this.state.LAA, this.state.LAD, this.state.MIA, this.state.MIL, this.state.MIN, this.state.NYM, this.state.NYY, this.state.OAK, this.state.PHI, this.state.PIT, this.state.SD, this.state.SEA, this.state.SF, this.state.STL, this.state.TB, this.state.TEX, this.state.TOR, this.state.WSH, this.state[2015], this.state[2016], this.state[2017], this.state[2018], this.state[2019], this.state[2020], this.state[2021], this.state[2022]).then(res => {
      this.setState({ results: res.results, page: 1 });
    });
  }

  handleHOUChange = () => {
    this.setState({ HOU: !this.state.HOU });
    getPlayersBattingBS(this.state.page, this.state.pagesize, this.state.splitseasons, this.state.splitteams, this.state.percentiles, this.state.pa_threshold, this.state.ARI, this.state.ATL, this.state.BAL, this.state.BOS, this.state.CHC, this.state.CIN, this.state.CLE, this.state.COL, this.state.CWS, this.state.DET, !this.state.HOU, this.state.KC, this.state.LAA, this.state.LAD, this.state.MIA, this.state.MIL, this.state.MIN, this.state.NYM, this.state.NYY, this.state.OAK, this.state.PHI, this.state.PIT, this.state.SD, this.state.SEA, this.state.SF, this.state.STL, this.state.TB, this.state.TEX, this.state.TOR, this.state.WSH, this.state[2015], this.state[2016], this.state[2017], this.state[2018], this.state[2019], this.state[2020], this.state[2021], this.state[2022]).then(res => {
      this.setState({ results: res.results, page: 1 });
    });
  }

  handleKCChange = () => {
    this.setState({ KC: !this.state.KC });
    getPlayersBattingBS(this.state.page, this.state.pagesize, this.state.splitseasons, this.state.splitteams, this.state.percentiles, this.state.pa_threshold, this.state.ARI, this.state.ATL, this.state.BAL, this.state.BOS, this.state.CHC, this.state.CIN, this.state.CLE, this.state.COL, this.state.CWS, this.state.DET, this.state.HOU, !this.state.KC, this.state.LAA, this.state.LAD, this.state.MIA, this.state.MIL, this.state.MIN, this.state.NYM, this.state.NYY, this.state.OAK, this.state.PHI, this.state.PIT, this.state.SD, this.state.SEA, this.state.SF, this.state.STL, this.state.TB, this.state.TEX, this.state.TOR, this.state.WSH, this.state[2015], this.state[2016], this.state[2017], this.state[2018], this.state[2019], this.state[2020], this.state[2021], this.state[2022]).then(res => {
      this.setState({ results: res.results, page: 1 });
    });
  }

  handleLAAChange = () => {
    this.setState({ LAA: !this.state.LAA });
    getPlayersBattingBS(this.state.page, this.state.pagesize, this.state.splitseasons, this.state.splitteams, this.state.percentiles, this.state.pa_threshold, this.state.ARI, this.state.ATL, this.state.BAL, this.state.BOS, this.state.CHC, this.state.CIN, this.state.CLE, this.state.COL, this.state.CWS, this.state.DET, this.state.HOU, this.state.KC, !this.state.LAA, this.state.LAD, this.state.MIA, this.state.MIL, this.state.MIN, this.state.NYM, this.state.NYY, this.state.OAK, this.state.PHI, this.state.PIT, this.state.SD, this.state.SEA, this.state.SF, this.state.STL, this.state.TB, this.state.TEX, this.state.TOR, this.state.WSH, this.state[2015], this.state[2016], this.state[2017], this.state[2018], this.state[2019], this.state[2020], this.state[2021], this.state[2022]).then(res => {
      this.setState({ results: res.results, page: 1 });
    });
  }

  handleLADChange = () => {
    this.setState({ LAD: !this.state.LAD });
    getPlayersBattingBS(this.state.page, this.state.pagesize, this.state.splitseasons, this.state.splitteams, this.state.percentiles, this.state.pa_threshold, this.state.ARI, this.state.ATL, this.state.BAL, this.state.BOS, this.state.CHC, this.state.CIN, this.state.CLE, this.state.COL, this.state.CWS, this.state.DET, this.state.HOU, this.state.KC, this.state.LAA, !this.state.LAD, this.state.MIA, this.state.MIL, this.state.MIN, this.state.NYM, this.state.NYY, this.state.OAK, this.state.PHI, this.state.PIT, this.state.SD, this.state.SEA, this.state.SF, this.state.STL, this.state.TB, this.state.TEX, this.state.TOR, this.state.WSH, this.state[2015], this.state[2016], this.state[2017], this.state[2018], this.state[2019], this.state[2020], this.state[2021], this.state[2022]).then(res => {
      this.setState({ results: res.results, page: 1 });
    });
  }

  handleMIAChange = () => {
    this.setState({ MIA: !this.state.MIA });
    getPlayersBattingBS(this.state.page, this.state.pagesize, this.state.splitseasons, this.state.splitteams, this.state.percentiles, this.state.pa_threshold, this.state.ARI, this.state.ATL, this.state.BAL, this.state.BOS, this.state.CHC, this.state.CIN, this.state.CLE, this.state.COL, this.state.CWS, this.state.DET, this.state.HOU, this.state.KC, this.state.LAA, this.state.LAD, !this.state.MIA, this.state.MIL, this.state.MIN, this.state.NYM, this.state.NYY, this.state.OAK, this.state.PHI, this.state.PIT, this.state.SD, this.state.SEA, this.state.SF, this.state.STL, this.state.TB, this.state.TEX, this.state.TOR, this.state.WSH, this.state[2015], this.state[2016], this.state[2017], this.state[2018], this.state[2019], this.state[2020], this.state[2021], this.state[2022]).then(res => {
      this.setState({ results: res.results, page: 1 });
    });
  }

  handleMILChange = () => {
    this.setState({ MIL: !this.state.MIL });
    getPlayersBattingBS(this.state.page, this.state.pagesize, this.state.splitseasons, this.state.splitteams, this.state.percentiles, this.state.pa_threshold, this.state.ARI, this.state.ATL, this.state.BAL, this.state.BOS, this.state.CHC, this.state.CIN, this.state.CLE, this.state.COL, this.state.CWS, this.state.DET, this.state.HOU, this.state.KC, this.state.LAA, this.state.LAD, this.state.MIA, !this.state.MIL, this.state.MIN, this.state.NYM, this.state.NYY, this.state.OAK, this.state.PHI, this.state.PIT, this.state.SD, this.state.SEA, this.state.SF, this.state.STL, this.state.TB, this.state.TEX, this.state.TOR, this.state.WSH, this.state[2015], this.state[2016], this.state[2017], this.state[2018], this.state[2019], this.state[2020], this.state[2021], this.state[2022]).then(res => {
      this.setState({ results: res.results, page: 1 });
    });
  }

  handleMINChange = () => {
    this.setState({ MIN: !this.state.MIN });
    getPlayersBattingBS(this.state.page, this.state.pagesize, this.state.splitseasons, this.state.splitteams, this.state.percentiles, this.state.pa_threshold, this.state.ARI, this.state.ATL, this.state.BAL, this.state.BOS, this.state.CHC, this.state.CIN, this.state.CLE, this.state.COL, this.state.CWS, this.state.DET, this.state.HOU, this.state.KC, this.state.LAA, this.state.LAD, this.state.MIA, this.state.MIL, !this.state.MIN, this.state.NYM, this.state.NYY, this.state.OAK, this.state.PHI, this.state.PIT, this.state.SD, this.state.SEA, this.state.SF, this.state.STL, this.state.TB, this.state.TEX, this.state.TOR, this.state.WSH, this.state[2015], this.state[2016], this.state[2017], this.state[2018], this.state[2019], this.state[2020], this.state[2021], this.state[2022]).then(res => {
      this.setState({ results: res.results, page: 1 });
    });
  }

  handleNYMChange = () => {
    this.setState({ NYM: !this.state.NYM });
    getPlayersBattingBS(this.state.page, this.state.pagesize, this.state.splitseasons, this.state.splitteams, this.state.percentiles, this.state.pa_threshold, this.state.ARI, this.state.ATL, this.state.BAL, this.state.BOS, this.state.CHC, this.state.CIN, this.state.CLE, this.state.COL, this.state.CWS, this.state.DET, this.state.HOU, this.state.KC, this.state.LAA, this.state.LAD, this.state.MIA, this.state.MIL, this.state.MIN, !this.state.NYM, this.state.NYY, this.state.OAK, this.state.PHI, this.state.PIT, this.state.SD, this.state.SEA, this.state.SF, this.state.STL, this.state.TB, this.state.TEX, this.state.TOR, this.state.WSH, this.state[2015], this.state[2016], this.state[2017], this.state[2018], this.state[2019], this.state[2020], this.state[2021], this.state[2022]).then(res => {
      this.setState({ results: res.results, page: 1 });
    });
  }

  handleNYYChange = () => {
    this.setState({ NYY: !this.state.NYY });
    getPlayersBattingBS(this.state.page, this.state.pagesize, this.state.splitseasons, this.state.splitteams, this.state.percentiles, this.state.pa_threshold, this.state.ARI, this.state.ATL, this.state.BAL, this.state.BOS, this.state.CHC, this.state.CIN, this.state.CLE, this.state.COL, this.state.CWS, this.state.DET, this.state.HOU, this.state.KC, this.state.LAA, this.state.LAD, this.state.MIA, this.state.MIL, this.state.MIN, this.state.NYM, !this.state.NYY, this.state.OAK, this.state.PHI, this.state.PIT, this.state.SD, this.state.SEA, this.state.SF, this.state.STL, this.state.TB, this.state.TEX, this.state.TOR, this.state.WSH, this.state[2015], this.state[2016], this.state[2017], this.state[2018], this.state[2019], this.state[2020], this.state[2021], this.state[2022]).then(res => {
      this.setState({ results: res.results, page: 1 });
    });
  }

  handleOAKChange = () => {
    this.setState({ OAK: !this.state.OAK });
    getPlayersBattingBS(this.state.page, this.state.pagesize, this.state.splitseasons, this.state.splitteams, this.state.percentiles, this.state.pa_threshold, this.state.ARI, this.state.ATL, this.state.BAL, this.state.BOS, this.state.CHC, this.state.CIN, this.state.CLE, this.state.COL, this.state.CWS, this.state.DET, this.state.HOU, this.state.KC, this.state.LAA, this.state.LAD, this.state.MIA, this.state.MIL, this.state.MIN, this.state.NYM, this.state.NYY, !this.state.OAK, this.state.PHI, this.state.PIT, this.state.SD, this.state.SEA, this.state.SF, this.state.STL, this.state.TB, this.state.TEX, this.state.TOR, this.state.WSH, this.state[2015], this.state[2016], this.state[2017], this.state[2018], this.state[2019], this.state[2020], this.state[2021], this.state[2022]).then(res => {
      this.setState({ results: res.results, page: 1 });
    });
  }

  handlePHIChange = () => {
    this.setState({ PHI: !this.state.PHI });
    getPlayersBattingBS(this.state.page, this.state.pagesize, this.state.splitseasons, this.state.splitteams, this.state.percentiles, this.state.pa_threshold, this.state.ARI, this.state.ATL, this.state.BAL, this.state.BOS, this.state.CHC, this.state.CIN, this.state.CLE, this.state.COL, this.state.CWS, this.state.DET, this.state.HOU, this.state.KC, this.state.LAA, this.state.LAD, this.state.MIA, this.state.MIL, this.state.MIN, this.state.NYM, this.state.NYY, this.state.OAK, !this.state.PHI, this.state.PIT, this.state.SD, this.state.SEA, this.state.SF, this.state.STL, this.state.TB, this.state.TEX, this.state.TOR, this.state.WSH, this.state[2015], this.state[2016], this.state[2017], this.state[2018], this.state[2019], this.state[2020], this.state[2021], this.state[2022]).then(res => {
      this.setState({ results: res.results, page: 1 });
    });
  }

  handlePITChange = () => {
    this.setState({ PIT: !this.state.PIT });
    getPlayersBattingBS(this.state.page, this.state.pagesize, this.state.splitseasons, this.state.splitteams, this.state.percentiles, this.state.pa_threshold, this.state.ARI, this.state.ATL, this.state.BAL, this.state.BOS, this.state.CHC, this.state.CIN, this.state.CLE, this.state.COL, this.state.CWS, this.state.DET, this.state.HOU, this.state.KC, this.state.LAA, this.state.LAD, this.state.MIA, this.state.MIL, this.state.MIN, this.state.NYM, this.state.NYY, this.state.OAK, this.state.PHI, !this.state.PIT, this.state.SD, this.state.SEA, this.state.SF, this.state.STL, this.state.TB, this.state.TEX, this.state.TOR, this.state.WSH, this.state[2015], this.state[2016], this.state[2017], this.state[2018], this.state[2019], this.state[2020], this.state[2021], this.state[2022]).then(res => {
      this.setState({ results: res.results, page: 1 });
    });
  }

  handleSDChange = () => {
    this.setState({ SD: !this.state.SD });
    getPlayersBattingBS(this.state.page, this.state.pagesize, this.state.splitseasons, this.state.splitteams, this.state.percentiles, this.state.pa_threshold, this.state.ARI, this.state.ATL, this.state.BAL, this.state.BOS, this.state.CHC, this.state.CIN, this.state.CLE, this.state.COL, this.state.CWS, this.state.DET, this.state.HOU, this.state.KC, this.state.LAA, this.state.LAD, this.state.MIA, this.state.MIL, this.state.MIN, this.state.NYM, this.state.NYY, this.state.OAK, this.state.PHI, this.state.PIT, !this.state.SD, this.state.SEA, this.state.SF, this.state.STL, this.state.TB, this.state.TEX, this.state.TOR, this.state.WSH, this.state[2015], this.state[2016], this.state[2017], this.state[2018], this.state[2019], this.state[2020], this.state[2021], this.state[2022]).then(res => {
      this.setState({ results: res.results, page: 1 });
    });
  }

  handleSEAChange = () => {
    this.setState({ SEA: !this.state.SEA });
    getPlayersBattingBS(this.state.page, this.state.pagesize, this.state.splitseasons, this.state.splitteams, this.state.percentiles, this.state.pa_threshold, this.state.ARI, this.state.ATL, this.state.BAL, this.state.BOS, this.state.CHC, this.state.CIN, this.state.CLE, this.state.COL, this.state.CWS, this.state.DET, this.state.HOU, this.state.KC, this.state.LAA, this.state.LAD, this.state.MIA, this.state.MIL, this.state.MIN, this.state.NYM, this.state.NYY, this.state.OAK, this.state.PHI, this.state.PIT, this.state.SD, !this.state.SEA, this.state.SF, this.state.STL, this.state.TB, this.state.TEX, this.state.TOR, this.state.WSH, this.state[2015], this.state[2016], this.state[2017], this.state[2018], this.state[2019], this.state[2020], this.state[2021], this.state[2022]).then(res => {
      this.setState({ results: res.results, page: 1 });
    });
  }

  handleSFChange = () => {
    this.setState({ SF: !this.state.SF });
    getPlayersBattingBS(this.state.page, this.state.pagesize, this.state.splitseasons, this.state.splitteams, this.state.percentiles, this.state.pa_threshold, this.state.ARI, this.state.ATL, this.state.BAL, this.state.BOS, this.state.CHC, this.state.CIN, this.state.CLE, this.state.COL, this.state.CWS, this.state.DET, this.state.HOU, this.state.KC, this.state.LAA, this.state.LAD, this.state.MIA, this.state.MIL, this.state.MIN, this.state.NYM, this.state.NYY, this.state.OAK, this.state.PHI, this.state.PIT, this.state.SD, this.state.SEA, !this.state.SF, this.state.STL, this.state.TB, this.state.TEX, this.state.TOR, this.state.WSH, this.state[2015], this.state[2016], this.state[2017], this.state[2018], this.state[2019], this.state[2020], this.state[2021], this.state[2022]).then(res => {
      this.setState({ results: res.results, page: 1 });
    });
  }

  handleSTLChange = () => {
    this.setState({ STL: !this.state.STL });
    getPlayersBattingBS(this.state.page, this.state.pagesize, this.state.splitseasons, this.state.splitteams, this.state.percentiles, this.state.pa_threshold, this.state.ARI, this.state.ATL, this.state.BAL, this.state.BOS, this.state.CHC, this.state.CIN, this.state.CLE, this.state.COL, this.state.CWS, this.state.DET, this.state.HOU, this.state.KC, this.state.LAA, this.state.LAD, this.state.MIA, this.state.MIL, this.state.MIN, this.state.NYM, this.state.NYY, this.state.OAK, this.state.PHI, this.state.PIT, this.state.SD, this.state.SEA, this.state.SF, !this.state.STL, this.state.TB, this.state.TEX, this.state.TOR, this.state.WSH, this.state[2015], this.state[2016], this.state[2017], this.state[2018], this.state[2019], this.state[2020], this.state[2021], this.state[2022]).then(res => {
      this.setState({ results: res.results, page: 1 });
    });
  }

  handleTBChange = () => {
    this.setState({ TB: !this.state.TB });
    getPlayersBattingBS(this.state.page, this.state.pagesize, this.state.splitseasons, this.state.splitteams, this.state.percentiles, this.state.pa_threshold, this.state.ARI, this.state.ATL, this.state.BAL, this.state.BOS, this.state.CHC, this.state.CIN, this.state.CLE, this.state.COL, this.state.CWS, this.state.DET, this.state.HOU, this.state.KC, this.state.LAA, this.state.LAD, this.state.MIA, this.state.MIL, this.state.MIN, this.state.NYM, this.state.NYY, this.state.OAK, this.state.PHI, this.state.PIT, this.state.SD, this.state.SEA, this.state.SF, this.state.STL, !this.state.TB, this.state.TEX, this.state.TOR, this.state.WSH, this.state[2015], this.state[2016], this.state[2017], this.state[2018], this.state[2019], this.state[2020], this.state[2021], this.state[2022]).then(res => {
      this.setState({ results: res.results, page: 1 });
    });
  }

  handleTEXChange = () => {
    this.setState({ TEX: !this.state.TEX });
    getPlayersBattingBS(this.state.page, this.state.pagesize, this.state.splitseasons, this.state.splitteams, this.state.percentiles, this.state.pa_threshold, this.state.ARI, this.state.ATL, this.state.BAL, this.state.BOS, this.state.CHC, this.state.CIN, this.state.CLE, this.state.COL, this.state.CWS, this.state.DET, this.state.HOU, this.state.KC, this.state.LAA, this.state.LAD, this.state.MIA, this.state.MIL, this.state.MIN, this.state.NYM, this.state.NYY, this.state.OAK, this.state.PHI, this.state.PIT, this.state.SD, this.state.SEA, this.state.SF, this.state.STL, this.state.TB, !this.state.TEX, this.state.TOR, this.state.WSH, this.state[2015], this.state[2016], this.state[2017], this.state[2018], this.state[2019], this.state[2020], this.state[2021], this.state[2022]).then(res => {
      this.setState({ results: res.results, page: 1 });
    });
  }

  handleTORChange = () => {
    this.setState({ TOR: !this.state.TOR });
    getPlayersBattingBS(this.state.page, this.state.pagesize, this.state.splitseasons, this.state.splitteams, this.state.percentiles, this.state.pa_threshold, this.state.ARI, this.state.ATL, this.state.BAL, this.state.BOS, this.state.CHC, this.state.CIN, this.state.CLE, this.state.COL, this.state.CWS, this.state.DET, this.state.HOU, this.state.KC, this.state.LAA, this.state.LAD, this.state.MIA, this.state.MIL, this.state.MIN, this.state.NYM, this.state.NYY, this.state.OAK, this.state.PHI, this.state.PIT, this.state.SD, this.state.SEA, this.state.SF, this.state.STL, this.state.TB, this.state.TEX, !this.state.TOR, this.state.WSH, this.state[2015], this.state[2016], this.state[2017], this.state[2018], this.state[2019], this.state[2020], this.state[2021], this.state[2022]).then(res => {
      this.setState({ results: res.results, page: 1 });
    });
  }

  handleWSHChange = () => {
    this.setState({ WSH: !this.state.WSH });
    getPlayersBattingBS(this.state.page, this.state.pagesize, this.state.splitseasons, this.state.splitteams, this.state.percentiles, this.state.pa_threshold, this.state.ARI, this.state.ATL, this.state.BAL, this.state.BOS, this.state.CHC, this.state.CIN, this.state.CLE, this.state.COL, this.state.CWS, this.state.DET, this.state.HOU, this.state.KC, this.state.LAA, this.state.LAD, this.state.MIA, this.state.MIL, this.state.MIN, this.state.NYM, this.state.NYY, this.state.OAK, this.state.PHI, this.state.PIT, this.state.SD, this.state.SEA, this.state.SF, this.state.STL, this.state.TB, this.state.TEX, this.state.TOR, !this.state.WSH, this.state[2015], this.state[2016], this.state[2017], this.state[2018], this.state[2019], this.state[2020], this.state[2021], this.state[2022]).then(res => {
      this.setState({ results: res.results, page: 1 });
    });
  }

  handle2015Change = () => {
    this.setState({ 2015: !this.state[2015] });
    getPlayersBattingBS(this.state.page, this.state.pagesize, this.state.splitseasons, this.state.splitteams, this.state.percentiles, this.state.pa_threshold, this.state.ARI, this.state.ATL, this.state.BAL, this.state.BOS, this.state.CHC, this.state.CIN, this.state.CLE, this.state.COL, this.state.CWS, this.state.DET, this.state.HOU, this.state.KC, this.state.LAA, this.state.LAD, this.state.MIA, this.state.MIL, this.state.MIN, this.state.NYM, this.state.NYY, this.state.OAK, this.state.PHI, this.state.PIT, this.state.SD, this.state.SEA, this.state.SF, this.state.STL, this.state.TB, this.state.TEX, this.state.TOR, this.state.WSH, !this.state[2015], this.state[2016], this.state[2017], this.state[2018], this.state[2019], this.state[2020], this.state[2021], this.state[2022]).then(res => {
      this.setState({ results: res.results, page: 1 });
    });
  }

  handle2016Change = () => {
    this.setState({ 2016: !this.state[2016] });
    getPlayersBattingBS(this.state.page, this.state.pagesize, this.state.splitseasons, this.state.splitteams, this.state.percentiles, this.state.pa_threshold, this.state.ARI, this.state.ATL, this.state.BAL, this.state.BOS, this.state.CHC, this.state.CIN, this.state.CLE, this.state.COL, this.state.CWS, this.state.DET, this.state.HOU, this.state.KC, this.state.LAA, this.state.LAD, this.state.MIA, this.state.MIL, this.state.MIN, this.state.NYM, this.state.NYY, this.state.OAK, this.state.PHI, this.state.PIT, this.state.SD, this.state.SEA, this.state.SF, this.state.STL, this.state.TB, this.state.TEX, this.state.TOR, this.state.WSH, this.state[2015], !this.state[2016], this.state[2017], this.state[2018], this.state[2019], this.state[2020], this.state[2021], this.state[2022]).then(res => {
      this.setState({ results: res.results, page: 1 });
    });
  }

  handle2017Change = () => {
    this.setState({ 2017: !this.state[2017] });
    getPlayersBattingBS(this.state.page, this.state.pagesize, this.state.splitseasons, this.state.splitteams, this.state.percentiles, this.state.pa_threshold, this.state.ARI, this.state.ATL, this.state.BAL, this.state.BOS, this.state.CHC, this.state.CIN, this.state.CLE, this.state.COL, this.state.CWS, this.state.DET, this.state.HOU, this.state.KC, this.state.LAA, this.state.LAD, this.state.MIA, this.state.MIL, this.state.MIN, this.state.NYM, this.state.NYY, this.state.OAK, this.state.PHI, this.state.PIT, this.state.SD, this.state.SEA, this.state.SF, this.state.STL, this.state.TB, this.state.TEX, this.state.TOR, this.state.WSH, this.state[2015], this.state[2016], !this.state[2017], this.state[2018], this.state[2019], this.state[2020], this.state[2021], this.state[2022]).then(res => {
      this.setState({ results: res.results, page: 1 });
    });
  }

  handle2018Change = () => {
    this.setState({ 2018: !this.state[2018] });
    getPlayersBattingBS(this.state.page, this.state.pagesize, this.state.splitseasons, this.state.splitteams, this.state.percentiles, this.state.pa_threshold, this.state.ARI, this.state.ATL, this.state.BAL, this.state.BOS, this.state.CHC, this.state.CIN, this.state.CLE, this.state.COL, this.state.CWS, this.state.DET, this.state.HOU, this.state.KC, this.state.LAA, this.state.LAD, this.state.MIA, this.state.MIL, this.state.MIN, this.state.NYM, this.state.NYY, this.state.OAK, this.state.PHI, this.state.PIT, this.state.SD, this.state.SEA, this.state.SF, this.state.STL, this.state.TB, this.state.TEX, this.state.TOR, this.state.WSH, this.state[2015], this.state[2016], this.state[2017], !this.state[2018], this.state[2019], this.state[2020], this.state[2021], this.state[2022]).then(res => {
      this.setState({ results: res.results, page: 1 });
    });
  }

  handle2019Change = () => {
    this.setState({ 2019: !this.state[2019] });
    getPlayersBattingBS(this.state.page, this.state.pagesize, this.state.splitseasons, this.state.splitteams, this.state.percentiles, this.state.pa_threshold, this.state.ARI, this.state.ATL, this.state.BAL, this.state.BOS, this.state.CHC, this.state.CIN, this.state.CLE, this.state.COL, this.state.CWS, this.state.DET, this.state.HOU, this.state.KC, this.state.LAA, this.state.LAD, this.state.MIA, this.state.MIL, this.state.MIN, this.state.NYM, this.state.NYY, this.state.OAK, this.state.PHI, this.state.PIT, this.state.SD, this.state.SEA, this.state.SF, this.state.STL, this.state.TB, this.state.TEX, this.state.TOR, this.state.WSH, this.state[2015], this.state[2016], this.state[2017], this.state[2018], !this.state[2019], this.state[2020], this.state[2021], this.state[2022]).then(res => {
      this.setState({ results: res.results, page: 1 });
    });
  }

  handle2020Change = () => {
    this.setState({ 2020: !this.state[2020] });
    getPlayersBattingBS(this.state.page, this.state.pagesize, this.state.splitseasons, this.state.splitteams, this.state.percentiles, this.state.pa_threshold, this.state.ARI, this.state.ATL, this.state.BAL, this.state.BOS, this.state.CHC, this.state.CIN, this.state.CLE, this.state.COL, this.state.CWS, this.state.DET, this.state.HOU, this.state.KC, this.state.LAA, this.state.LAD, this.state.MIA, this.state.MIL, this.state.MIN, this.state.NYM, this.state.NYY, this.state.OAK, this.state.PHI, this.state.PIT, this.state.SD, this.state.SEA, this.state.SF, this.state.STL, this.state.TB, this.state.TEX, this.state.TOR, this.state.WSH, this.state[2015], this.state[2016], this.state[2017], this.state[2018], this.state[2019], !this.state[2020], this.state[2021], this.state[2022]).then(res => {
      this.setState({ results: res.results, page: 1 });
    });
  }

  handle2021Change = () => {
    this.setState({ 2021: !this.state[2021] });
    getPlayersBattingBS(this.state.page, this.state.pagesize, this.state.splitseasons, this.state.splitteams, this.state.percentiles, this.state.pa_threshold, this.state.ARI, this.state.ATL, this.state.BAL, this.state.BOS, this.state.CHC, this.state.CIN, this.state.CLE, this.state.COL, this.state.CWS, this.state.DET, this.state.HOU, this.state.KC, this.state.LAA, this.state.LAD, this.state.MIA, this.state.MIL, this.state.MIN, this.state.NYM, this.state.NYY, this.state.OAK, this.state.PHI, this.state.PIT, this.state.SD, this.state.SEA, this.state.SF, this.state.STL, this.state.TB, this.state.TEX, this.state.TOR, this.state.WSH, this.state[2015], this.state[2016], this.state[2017], this.state[2018], this.state[2019], this.state[2020], !this.state[2021], this.state[2022]).then(res => {
      this.setState({ results: res.results, page: 1 });
    });
  }

  handle2022Change = () => {
    this.setState({ 2022: !this.state[2022] });
    getPlayersBattingBS(this.state.page, this.state.pagesize, this.state.splitseasons, this.state.splitteams, this.state.percentiles, this.state.pa_threshold, this.state.ARI, this.state.ATL, this.state.BAL, this.state.BOS, this.state.CHC, this.state.CIN, this.state.CLE, this.state.COL, this.state.CWS, this.state.DET, this.state.HOU, this.state.KC, this.state.LAA, this.state.LAD, this.state.MIA, this.state.MIL, this.state.MIN, this.state.NYM, this.state.NYY, this.state.OAK, this.state.PHI, this.state.PIT, this.state.SD, this.state.SEA, this.state.SF, this.state.STL, this.state.TB, this.state.TEX, this.state.TOR, this.state.WSH, this.state[2015], this.state[2016], this.state[2017], this.state[2018], this.state[2019], this.state[2020], this.state[2021], !this.state[2022]).then(res => {
      this.setState({ results: res.results, page: 1 });
    });
  }

  handlePATThresholdChange = (event) => {
    console.log(this.state.pa_threshold);
    this.setState({ pa_threshold: event.target.value });
    console.log(this.state.pa_threshold);
  }

  updateSearchResults = () => {
    getPlayersBattingBS(this.state.page, this.state.pagesize, this.state.splitseasons, this.state.splitteams, this.state.percentiles, this.state.pa_threshold, this.state.ARI, this.state.ATL, this.state.BAL, this.state.BOS, this.state.CHC, this.state.CIN, this.state.CLE, this.state.COL, this.state.CWS, this.state.DET, this.state.HOU, this.state.KC, this.state.LAA, this.state.LAD, this.state.MIA, this.state.MIL, this.state.MIN, this.state.NYM, this.state.NYY, this.state.OAK, this.state.PHI, this.state.PIT, this.state.SD, this.state.SEA, this.state.SF, this.state.STL, this.state.TB, this.state.TEX, this.state.TOR, this.state.WSH, this.state[2015], this.state[2016], this.state[2017], this.state[2018], this.state[2019], this.state[2020], this.state[2021], this.state[2022]).then(res => {
      this.setState({ results: res.results, page: 1 });
    });
  }

  componentDidMount = () => {
    getPlayersBattingBS(this.state.page, this.state.pagesize, this.state.splitseasons, this.state.splitteams, this.state.percentiles, this.state.pa_threshold, this.state.ARI, this.state.ATL, this.state.BAL, this.state.BOS, this.state.CHC, this.state.CIN, this.state.CLE, this.state.COL, this.state.CWS, this.state.DET, this.state.HOU, this.state.KC, this.state.LAA, this.state.LAD, this.state.MIA, this.state.MIL, this.state.MIN, this.state.NYM, this.state.NYY, this.state.OAK, this.state.PHI, this.state.PIT, this.state.SD, this.state.SEA, this.state.SF, this.state.STL, this.state.TB, this.state.TEX, this.state.TOR, this.state.WSH, this.state[2015], this.state[2016], this.state[2017], this.state[2018], this.state[2019], this.state[2020], this.state[2021], this.state[2022]).then(res => {
      this.setState({ results: res.results });
    });
  }

  toggleTeamsDropdown = () => {
    this.setState(prevState => {
      return { teamsdropdown: !prevState.teamsdropdown };
    });
  }

  toggleSeasonsDropdown = () => {
    this.setState(prevState => {
      return { seasonsdropdown: !prevState.seasonsdropdown };
    });
  }

  render() {
    // console.log('splitseasons:', this.state.splitseasons, ', splitteams:', this.state.splitteams);
    return (
      <div>
        <MenuBar />
        <Form style={{ width: '80vw', margin: '0 auto', marginTop: '5vh' }}>
        <h3>Player Batting</h3>
            <Row>
              <Col flex={5}>
                <FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                  <label>PA Threshold</label>
                    <FormInput placeholder="Qualified" value={this.state.pa_threshold} onChange={this.handlePATThresholdChange}/>
                </FormGroup>
              </Col>
                <Col flex={5}><FormGroup style={{ width: '10vw' }}>
                    <Button style={{ marginTop: '4vh' }} onClick={this.updateSearchResults}>Update</Button>
                </FormGroup></Col>
            </Row>
            <Row>
              <Col flex={2}>
                <FormCheckbox checked={this.state.splitseasons} onChange={this.handleSplitSeasonsChange}>
                  <label>Split Seasons</label>
                </FormCheckbox>
              </Col>
              <Col flex={2}>
                <FormCheckbox checked={this.state.splitteams} onChange={this.handleSplitTeamsChange}>
                  <label>Split Teams</label>
                </FormCheckbox>
              </Col>
              <Col flex={2}>
                <FormCheckbox checked={this.state.percentiles} onChange={this.handlePercentilesChange}>
                  <label>Show Percentiles</label>
                </FormCheckbox>
              </Col>
            </Row>
            <Row>
              <Col flex={5}>
                <Dropdown open={this.state.teamsdropdown} toggle={this.toggleTeamsDropdown} group>
                  <Button>Teams</Button>
                    <DropdownToggle split/>
                      <DropdownMenu>
                        <FormCheckbox checked={this.state.ARI} onChange={this.handleARIChange}>
                          <label>ARI</label>
                        </FormCheckbox>
                        <FormCheckbox checked={this.state.ATL} onChange={this.handleATLChange}>
                          <label>ATL</label>
                        </FormCheckbox>
                        <FormCheckbox checked={this.state.BAL} onChange={this.handleBALChange}>
                          <label>BAL</label>
                        </FormCheckbox>
                        <FormCheckbox checked={this.state.BOS} onChange={this.handleBOSChange}>
                          <label>BOS</label>
                        </FormCheckbox>
                        <FormCheckbox checked={this.state.CHC} onChange={this.handleCHCChange}>
                          <label>CHC</label>
                        </FormCheckbox>
                        <FormCheckbox checked={this.state.CIN} onChange={this.handleCINChange}>
                          <label>CIN</label>
                        </FormCheckbox>
                        <FormCheckbox checked={this.state.CLE} onChange={this.handleCLEChange}>
                          <label>CLE</label>
                        </FormCheckbox>
                        <FormCheckbox checked={this.state.COL} onChange={this.handleCOLChange}>
                          <label>COL</label>
                        </FormCheckbox>
                        <FormCheckbox checked={this.state.CWS} onChange={this.handleCWSChange}>
                          <label>CWS</label>
                        </FormCheckbox>
                        <FormCheckbox checked={this.state.DET} onChange={this.handleDETChange}>
                          <label>DET</label>
                        </FormCheckbox>
                        <FormCheckbox checked={this.state.HOU} onChange={this.handleHOUChange}>
                          <label>HOU</label>
                        </FormCheckbox>
                        <FormCheckbox checked={this.state.KC} onChange={this.handleKCChange}>
                          <label>KC</label>
                        </FormCheckbox>
                        <FormCheckbox checked={this.state.LAA} onChange={this.handleLAAChange}>
                          <label>LAA</label>
                        </FormCheckbox>
                        <FormCheckbox checked={this.state.LAD} onChange={this.handleLADChange}>
                          <label>LAD</label>
                        </FormCheckbox>
                        <FormCheckbox checked={this.state.MIA} onChange={this.handleMIAChange}>
                          <label>MIA</label>
                        </FormCheckbox>
                        <FormCheckbox checked={this.state.MIL} onChange={this.handleMILChange}>
                          <label>MIL</label>
                        </FormCheckbox>
                        <FormCheckbox checked={this.state.MIN} onChange={this.handleMINChange}>
                          <label>MIN</label>
                        </FormCheckbox>
                        <FormCheckbox checked={this.state.NYM} onChange={this.handleNYMChange}>
                          <label>NYM</label>
                        </FormCheckbox>
                        <FormCheckbox checked={this.state.NYY} onChange={this.handleNYYChange}>
                          <label>NYY</label>
                        </FormCheckbox>
                        <FormCheckbox checked={this.state.OAK} onChange={this.handleOAKChange}>
                          <label>OAK</label>
                        </FormCheckbox>
                        <FormCheckbox checked={this.state.PHI} onChange={this.handlePHIChange}>
                          <label>PHI</label>
                        </FormCheckbox>
                        <FormCheckbox checked={this.state.PIT} onChange={this.handlePITChange}>
                          <label>PIT</label>
                        </FormCheckbox>
                        <FormCheckbox checked={this.state.SD} onChange={this.handleSDChange}>
                          <label>SD</label>
                        </FormCheckbox>
                        <FormCheckbox checked={this.state.SEA} onChange={this.handleSEAChange}>
                          <label>SEA</label>
                        </FormCheckbox>
                        <FormCheckbox checked={this.state.SF} onChange={this.handleSFChange}>
                          <label>SF</label>
                        </FormCheckbox>
                        <FormCheckbox checked={this.state.STL} onChange={this.handleSTLChange}>
                          <label>STL</label>
                        </FormCheckbox>
                        <FormCheckbox checked={this.state.TB} onChange={this.handleTBChange}>
                          <label>TB</label>
                        </FormCheckbox>
                        <FormCheckbox checked={this.state.TEX} onChange={this.handleTEXChange}>
                          <label>TEX</label>
                        </FormCheckbox>
                        <FormCheckbox checked={this.state.TOR} onChange={this.handleTORChange}>
                          <label>TOR</label>
                        </FormCheckbox>
                        <FormCheckbox checked={this.state.WSH} onChange={this.handleWSHChange}>
                          <label>WSH</label>
                        </FormCheckbox>
                      </DropdownMenu>
                </Dropdown>
              </Col>
              <Col flex={5}>
                <Dropdown open={this.state.seasonsdropdown} toggle={this.toggleSeasonsDropdown} group>
                  <Button>Seasons</Button>
                    <DropdownToggle split/>
                      <DropdownMenu>
                        <FormCheckbox checked={this.state[2015]} onChange={this.handle2015Change}>
                            <label>2015</label>
                          </FormCheckbox>
                          <FormCheckbox checked={this.state[2016]} onChange={this.handle2016Change}>
                            <label>2016</label>
                          </FormCheckbox>
                          <FormCheckbox checked={this.state[2017]} onChange={this.handle2017Change}>
                            <label>2017</label>
                          </FormCheckbox>
                          <FormCheckbox checked={this.state[2018]} onChange={this.handle2018Change}>
                            <label>2018</label>
                          </FormCheckbox>
                          <FormCheckbox checked={this.state[2019]} onChange={this.handle2019Change}>
                            <label>2019</label>
                          </FormCheckbox>
                          <FormCheckbox checked={this.state[2020]} onChange={this.handle2020Change}>
                            <label>2020</label>
                          </FormCheckbox>
                          <FormCheckbox checked={this.state[2021]} onChange={this.handle2021Change}>
                            <label>2021</label>
                          </FormCheckbox>
                          <FormCheckbox checked={this.state[2022]} onChange={this.handle2022Change}>
                            <label>2022</label>
                          </FormCheckbox>
                        </DropdownMenu>
                </Dropdown>
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

export default PlayersBattingBS;