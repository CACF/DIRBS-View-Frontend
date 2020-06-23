/*
Copyright (c) 2018-2019 Qualcomm Technologies, Inc.
All rights reserved.
Redistribution and use in source and binary forms, with or without modification, are permitted (subject to the limitations in the 
disclaimer below) provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer 
      in the documentation and/or other materials provided with the distribution.
    * Neither the name of Qualcomm Technologies, Inc. nor the names of its contributors may be used to endorse or promote 
      products derived from this software without specific prior written permission.
    * The origin of this software must not be misrepresented; you must not claim that you wrote the original software. If you use 
      this software in a product, an acknowledgment is required by displaying the trademark/log as per the details provided 
      here: https://www.qualcomm.com/documents/dirbs-logo-and-brand-guidelines
    * Altered source versions must be plainly marked as such, and must not be misrepresented as being the original software.
    * This notice may not be removed or altered from any source distribution.
NO EXPRESS OR IMPLIED LICENSES TO ANY PARTY'S PATENT RIGHTS ARE GRANTED BY THIS LICENSE. THIS SOFTWARE IS PROVIDED 
BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT 
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO 
EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, 
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; 
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN 
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS 
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/



import React, { PureComponent } from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import DateSearchForm from './../../components/Form/DateSearchForm';
import { unique_437_colors, getAuthHeader, instance, errors, getUniqueKeys, yAxisKeysCleaning, getUserRole, getUserType, removeDevicesLabel, yAxisKeysReplacing, scrollOsetTopPlus, fixFilOsetHeightMinus } from "./../../utilities/helpers";
import Barchart from './../../components/Charts/Commons/Barchart';
import Linechart from './../../components/Charts/Commons/Linechart';
import Areachart from './../../components/Charts/Commons/AreaChart';
import Piechart from './../../components/Charts/Commons/Piechart';
import HorizontalBarSegregateChart from './../../components/Charts/Commons/HorizontalBarSegregateChart';
import SearchFilters from "./../../components/Form/SearchFilters";
import { SearchInfo } from "./../../components/Help/SearchInfo";
import { stackBarTwentyColors, multiColorStack, BoxesColors } from './../../utilities/chart_colors';
import HeaderCards from '../../components/Cards/HeaderCards';
import { stolenTrendofImeis, stolenDeviceTypeBreakup, stolenBreakUpByTechnology2G3G4G, stolenBreakUpByTechnology2G3G4GOverTIME } from './../../utilities/reportsInfo';
import svgSymbol from './../../images/svg_symbol.svg';
import { Responsive, WidthProvider } from "react-grid-layout";
import _ from 'lodash';
const ResponsiveReactGridLayout = WidthProvider(Responsive);

class Trends extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      fading: false,
      isShowingFilters: true,
      disableSaveButton: true,
      lsdsTrendInImeisData: null,
      lsdsTrendInImeisLoading: false,
      lsdsTypeBreakData: null,
      uniqueTypeBreakData: [],
      lsdsTypeBreakLoading: false,
      lsdsByTechnologyData: null,
      lsdsByTechnologyLoading: false,
      lsdsByTechnologyOverTimeData: null,
      lsdsByTechnologyOverTimeLoading: false,
      uniquelsdsByTechnologyOverTimeData: [],
      apiFetched: false,
      searchQuery: {},
      granularity: "",
      totalImies: '',
      totalDrsImies: '',
      totalPairedImies: '',
      totalStolenImies: '',
      totalDvsImies: '',
      totalBlocking: '',
      subSystem: 'lsds',
      currentBreakpoint: "lg",
      compactType: "vertical",
      mounted: false,
      layouts: { lg: props.initialLayout },
      layout: [],
      rowHeight: window.innerWidth < 1300 ? 3.7 : 10.6,
      deletedObj: { lsdsTrendInImeisKey: false, lsdsTypeBreakKey: false, lsdsByTechnologyKey: false, lsdsByTechnologyOverTimeKey: false }
    }
    this.getGraphDataFromServer = this.getGraphDataFromServer.bind(this);
    this.saveSearchQuery = this.saveSearchQuery.bind(this);
    this.updateTokenHOC = this.updateTokenHOC.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.onBreakpointChange = this.onBreakpointChange.bind(this);
    this.onLayoutChange = this.onLayoutChange.bind(this);
    this.onRemoveItem = this.onRemoveItem.bind(this);
    this.resetChartConfig = this.resetChartConfig.bind(this);
  }

  componentDidMount() {
    const el = document.getElementById('fixFilter');
    this.setState({ top: el.offsetTop + scrollOsetTopPlus, height: el.offsetHeight - fixFilOsetHeightMinus });
    window.addEventListener('scroll', this.handleScroll);
    this.setState({ mounted: true });
    this.getChartConfigFromServer();
  }

  componentDidUpdate() {
    const paddDiv = document.getElementById('filterData');
    this.state.scroll > this.state.top ?
      paddDiv.style.paddingTop = `${this.state.height}px` :
      paddDiv.style.paddingTop = 0;
  }

  _onClick = () => {
    this.setState({
      active: !this.state.active
    });
  }

  //Here we are getting parameters for get APi calls.

  getCallParamsGetMethods = () => {
    let searchQueryString = "";
    const searchQuery = this.state.searchQuery;
    let type = getUserType(this.props.resources);
    let role = getUserRole(this.props.resources);
    searchQueryString = `?role=${role}&type=${type}&start_date=${searchQuery.start_date}&end_date=${searchQuery.end_date}&granularity=${searchQuery.granularity}&trend_qty=${searchQuery.trend_qty}`
    return searchQueryString;
  }

  onBreakpointChange(breakpoint) {
    this.setState({
      currentBreakpoint: breakpoint
    });
  }

  onLayoutChange(layout) {
    this.setState({ layout: layout, disableSaveButton: false });
  }

  saveChartConfig = () => {
    this.updateTokenHOC(this.setChartConfigToServer);
  }

  onWidthChangeMethod = (width, margin, cols) => {
    var height = this.state.rowHeight;
    if (width > 1300) {
      height = width * 1 / (cols + 75);
    }
    else if (width <= 1300) {
      height = width * 1 / (cols + 195);
    }
    this.setState({
      rowHeight: height
    });
  }

  onRemoveItem(i) {
    this.setState({ layouts: { lg: _.reject(this.state.layout, { i: i }) } }, () => {
      let { deletedObj } = this.state;
      deletedObj[i] = true;
      this.setState({ deletedObj: deletedObj });
    })

  }

  getChartConfigFromServer = () => {
    instance.get('/get-user-dashboard?user_id=' + this.props.kc.userInfo.preferred_username + '&subsystem=' + this.state.subSystem)
      .then(response => {
        if (response.data.message) {
        } else {
          const retrievedChartConfig = response.data.config;
          if (retrievedChartConfig !== undefined && retrievedChartConfig !== null) {
            if (retrievedChartConfig.length !== 0) {
              let { deletedObj } = this.state;
              Object.keys(deletedObj).map((key, j) => {
                let isDeleted = true;
                retrievedChartConfig.map((ele, k) => {
                  if (key === retrievedChartConfig[k].i && retrievedChartConfig[k].w !== 1) {
                    isDeleted = false
                  }
                  return null;
                })
                deletedObj[key] = isDeleted;
                return null;
              })
              this.setState({ layouts: { lg: retrievedChartConfig }, deletedObj: deletedObj });
            }
          }
        }
      })
  }

  setChartConfigToServer = (config) => {
    this.setState({ fading: true })
    this.change = setTimeout(() => {
      this.setState({ fading: false })
    }, 2000);
    this.setState({
      active: false
    });
    let setChartObj = {};
    setChartObj.user_id = this.props.kc.userInfo.preferred_username;
    setChartObj.subsystem = this.state.subSystem;
    setChartObj.config = this.state.layout
    instance.post('/set-user-dashboard', setChartObj, config)
      .then(response => {
        if (response.data.message) {
        } else {
        }
      })
      .catch(error => {
        errors(this, error);
      })
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll() {
    this.setState({ scroll: window.scrollY });
  }

  //returns randomized color array from single array of colors.

  getColorArray = (n) => unique_437_colors.slice(n);

  updateTokenHOC(callingFunc) {
    let config = null;
    if (this.props.kc.isTokenExpired(0)) {
      this.props.kc.updateToken(0)
        .success(() => {
          localStorage.setItem('token', this.props.kc.token)
          config = {
            headers: getAuthHeader(this.props.kc.token)
          }
          callingFunc(config);
        })
        .error(() => this.props.kc.logout());
    } else {
      config = {
        headers: getAuthHeader()
      }
      callingFunc(config);
    }
  }
  // Next two function are responsible for toggeling sidebar and filter component

  filtersSidebarDisplay = () => {
    this.showHideFilters();
    document.body.classList.add('brand-minimized');
    document.body.classList.add('sidebar-minimized');
  }

  showHideFilters = () => {
    const div = document.getElementById('searchFormDiv');
    if (this.state.isShowingFilters) {
      div.style.display = 'none';
    }
    else if (!this.state.isShowingFilters) {
      div.style.display = 'block';
    }
    this.setState((prevState) => ({
      isShowingFilters: !prevState.isShowingFilters
    }));
  }

  getElementHeight = (e) => {
    if (e) {
      return e.offsetHeight - 70;
    }
    return 400
  }

  resetChartConfig() {
    this.setState({ fading: true })
    this.change = setTimeout(() => {
      this.setState({ fading: false })
    }, 2000);
    this.setState({ layouts: { lg: _.reject(this.state.layout, { i: 'lsdsByTechnologyOverTimeKey' }) } }, () => {
      let { deletedObj } = this.state;
      deletedObj.lsdsTrendInImeisKey = false;
      deletedObj.lsdsTypeBreakKey = false;
      deletedObj.lsdsByTechnologyKey = false;
      deletedObj.lsdsByTechnologyOverTimeKey = false;
      this.setState({ deletedObj: deletedObj, layouts: { lg: this.props.initialLayout } });
    })
  }


  saveSearchQuery(values) {
    this.setState({ searchQuery: values, lsdsTotalReportedDevicesLoading: true, lsdsIncidentTypeLoading: true, lsdsCaseStatusLoading: true, lsdsTopStolenBrandsLoading: true, lsdsTopStolenModelsLoading: true, lsdsTrendInImeisLoading: true, lsdsByTechnologyLoading: true, lsdsByTechnologyOverTimeLoading: true, lsdsTypeBreakLoading: true, lsdsTypeBreakData: [], lsdsByTechnologyOverTimeData: [], lsdsByTechnologyData: [], lsdsTrendInImeisData: [], lsdsTotalReportedDevicesData: [], lsdsIncidentTypeData: [], lsdsCaseStatusData: [], lsdsTopStolenBrandsData: [], lsdsTopStolenModelsData: [], apiFetched: true, granularity: values.granularity }, () => {
      this.updateTokenHOC(this.getGraphDataFromServer);
    })
  }

  getGraphDataFromServer(config) {
    const searchQuery = this.state.searchQuery;
    let type = getUserType(this.props.resources)
    let role = getUserRole(this.props.resources)
    let postData = {
      ...searchQuery,
      type,
      role
    }

    //Here API is being called to get Operator wise IMEIs. In response we are setting the state with the recieved data

    // instance.get('/pta-core-01-total-imeis' + this.getCallParamsGetMethods(), config).then(response => this.setState({ totalImies: response.data["Total-Core-IMEIs"] }));
    // instance.get('/pta-drs-01-total-imeis', config).then(response => this.setState({ totalDrsImies: response.data["Total-DRS-IMEIs"] }));
    // instance.get('/pta-dps-01-total-imeis', config).then(response => this.setState({ totalPairedImies: response.data["Total-DPS-IMEIs"] }));
    // instance.get('/pta-stolen-01-total-imeis', config).then(response => this.setState({ totalStolenImies: response.data["Total-Stolen-IMEIs"] }));
    // instance.get('/pta-dvs-01-total-imeis', config).then(response => this.setState({ totalDvsImies: response.data["Total-DVS-IMEIs"] }));
    // instance.get('/pta-core-08-total-blocked-imeis' + this.getCallParamsGetMethods(), config).then(response => this.setState({ totalBlocking: response.data["Total-Blocked-IMEIs"] }));

    var resizeEvent = window.document.createEvent('UIEvents');
    resizeEvent.initUIEvent('resize', true, false, window, 0);
    window.dispatchEvent(resizeEvent);

    instance.post('/pta-stolen-02-num-of-imeis', postData, config)
      .then(response => {
        if (response.data.message) {
          this.setState({ lsdsTrendInImeisLoading: false });
        } else {
          this.setState({ lsdsTrendInImeisData: response.data.results, lsdsTrendInImeisLoading: false, granularity: searchQuery.granularity });
        }
      })
      .catch(error => {
        errors(this, error);
      })

    instance.post('/pta-stolen-03-device-type-breakup', postData, config)
      .then(response => {
        if (response.data.message) {
          this.setState({ lsdsTypeBreakLoading: false });
        } else {
          let cleanData = yAxisKeysReplacing(response.data.device_types)
          let uniqueData = getUniqueKeys(cleanData);
          this.setState({ lsdsTypeBreakData: cleanData, uniqueTypeBreakData: uniqueData, lsdsTypeBreakLoading: false, granularity: searchQuery.granularity });
        }
      })
      .catch(error => {
        errors(this, error);
      })

    instance.get('/pta-stolen-04-breakup-by-technology' + this.getCallParamsGetMethods(), config)
      .then(response => {
        if (response.data.message) {
          this.setState({ lsdsByTechnologyLoading: false });
        } else {
          this.setState({ lsdsByTechnologyData: response.data.results, lsdsByTechnologyLoading: false, granularity: searchQuery.granularity });
        }
      })
      .catch(error => {
        errors(this, error);
      })

    instance.get('/pta-stolen-05-breakup-by-technology-over-time_range' + this.getCallParamsGetMethods(), config)
      .then(response => {
        if (response.data.message) {
          this.setState({ lsdsByTechnologyOverTimeLoading: false });
        } else {
          let cleanData = yAxisKeysCleaning(response.data.results);
          let uniqueData = getUniqueKeys(cleanData);
          this.setState({ lsdsByTechnologyOverTimeData: cleanData, lsdsByTechnologyOverTimeLoading: false, uniquelsdsByTechnologyOverTimeData: uniqueData, granularity: searchQuery.granularity });
        }
      })
      .catch(error => {
        errors(this, error);
      })
  }

  render() {
    const { apiFetched, uniqueTypeBreakData, totalImies, totalDrsImies, totalPairedImies, totalStolenImies, totalDvsImies, totalBlocking, lsdsTypeBreakData, lsdsTypeBreakLoading, lsdsByTechnologyOverTimeData, lsdsByTechnologyOverTimeLoading, uniquelsdsByTechnologyOverTimeData, lsdsByTechnologyData, uniquelsdsByTechnologyData, lsdsByTechnologyLoading, lsdsTrendInImeisData, lsdsTrendInImeisLoading, lsdsTotalReportedDevicesData, lsdsIncidentTypeData, lsdsCaseStatusData, lsdsTopStolenBrandsData, lsdsTopStolenModelsData, lsdsTotalReportedDevicesLoading, lsdsIncidentTypeLoading, lsdsCaseStatusLoading, lsdsTopStolenBrandsLoading, lsdsTopStolenModelsLoading, uniqueBrands, uniqueModels, uniqueStatus, uniqueIncidents, granularity, stolen, lost, pending, blocked, recovered, totalReportedDevices, deletedObj } = this.state;
    return (
      <Container fluid>
        <div className="search-box animated fadeIn">
          {/* {apiFetched &&
            <article className="overview">
              <Row>
                <Col xl={2} lg={3} md={4} sm={6}><HeaderCards backgroundColor="#0B6EDE" cardTitle="Total Core IMEIs" cardText={totalImies} /></Col>
                <Col xl={2} lg={3} md={4} sm={6}><HeaderCards backgroundColor="#0BD49C" cardTitle="Total DRS IMEIs" cardText={totalDrsImies} /></Col>
                <Col xl={2} lg={3} md={4} sm={6}><HeaderCards backgroundColor="#0BDDDE" cardTitle="Total Paired IMEIs" cardText={totalPairedImies} /></Col>
                <Col xl={2} lg={3} md={4} sm={6}><HeaderCards backgroundColor="#F07C7C" cardTitle="Total Stolen" cardText={totalStolenImies} /></Col>
                <Col xl={2} lg={3} md={4} sm={6}><HeaderCards backgroundColor="#a3c592" cardTitle="Total DVS Searches" cardText={totalDvsImies} /></Col>
                <Col xl={2} lg={3} md={4} sm={6}><HeaderCards backgroundColor="#F07C7C" cardTitle="Total Blocking" cardText={totalBlocking } /></Col>
              </Row>
            </article>
          } */}
          <div id="fixFilter" className={this.state.scroll > this.state.top ? "filters fixed-filter" : "filters"}>
            {!this.state.isShowingFilters ?
              <Card className="outline-theme-alfa4 applied-filters">
                <CardBody>
                  <div className="filter-toggler-control">
                    <h6>Applied Filters:</h6>
                  </div>
                  <div id="searchFormDiv" style={{ "display": "block" }}>
                    <DateSearchForm callServer={this.saveSearchQuery} showHideComponents={this.filtersSidebarDisplay} />
                  </div>
                  <div style={{ "display": "block" }}>
                    <SearchFilters filters={this.state.searchQuery} />
                  </div>
                  {apiFetched &&
                    <div className="toggler-button eft-tip" onClick={this.showHideFilters}><svg><use xlinkHref={svgSymbol + '#pencil'} /></svg>
                      <div className="eft-text">Click to edit filters</div>
                    </div>
                  }
                </CardBody>
              </Card>
              :
              <Card className={apiFetched ? 'outline-theme-alfa4' : 'outline-theme-alfa4 jc-center'}>
                <CardBody>
                  <div className="filter-toggler-control">
                    <h6>Apply Filters:</h6>
                  </div>
                  <div id="searchFormDiv" style={{ "display": "block" }}>
                    <DateSearchForm callServer={this.saveSearchQuery} showHideComponents={this.filtersSidebarDisplay} />
                  </div>
                  <div style={{ "display": "none" }}>
                    <SearchFilters filters={this.state.searchQuery} />
                  </div>
                  {apiFetched &&
                    <div className="toggler-button" onClick={this.showHideFilters}><svg><use xlinkHref={svgSymbol + '#pencil'} /></svg></div>
                  }
                </CardBody>
              </Card>
            }
          </div>
          {!apiFetched &&
            <SearchInfo />
          }
          <div id="filterData">
            {apiFetched
              ? <React.Fragment>
                <article className={this.state.active ? 'buttons-active button-config-chart' : 'button-config-chart'}>
                  <button
                    className="btn btn-save"
                    disabled={this.state.disableSaveButton}
                    onClick={this.saveChartConfig}
                  >Save</button>
                  <button
                    className="btn btn-reset"
                    onClick={this.resetChartConfig}
                  >Reset</button>
                  <button
                    className={this.state.fading ? 'button--large btn-fading' : 'button--large'}
                    onClick={this._onClick}
                    style={this.state.active ? { transform: 'scale(1)' } : { transform: 'scale(0.8333)' }}
                  >
                    <span className={this.state.active ? 'icon active' : 'icon'} />
                  </button>
                </article>

                <div className="grid-box">
                  <ResponsiveReactGridLayout
                    {...this.props}
                    layouts={this.state.layouts}
                    onBreakpointChange={this.onBreakpointChange}
                    onLayoutChange={this.onLayoutChange}
                    measureBeforeMount={true}
                    useCSSTransforms={this.state.mounted}
                    compactType={this.state.compactType}
                    preventCollision={!this.state.compactType}
                    autoSize={true}
                    rowHeight={this.state.rowHeight}
                    onWidthChange={this.onWidthChangeMethod}
                  >
                    <div name='lsdsTrendInImeisKey' key="lsdsTrendInImeisKey" className={deletedObj.lsdsTrendInImeisKey === true && 'hidden'}>
                      <Linechart cardClass="card-warning" title="Stolen Trend" loading={lsdsTrendInImeisLoading} data={lsdsTrendInImeisData} xAxis="x_axis" yAxisLabel="Count of IMEIS" yAxes={["imeis"]} colorArray={this.getColorArray(32)} granularity={granularity} info={stolenTrendofImeis} showLegend="false" customName="Count" heightProp={this.getElementHeight(document.getElementsByName('lsdsTrendInImeisKey')[0])} removeChart={this.onRemoveItem} chartGridId={'lsdsTrendInImeisKey'} />
                    </div>
                    <div name='lsdsTypeBreakKey' key="lsdsTypeBreakKey" className={deletedObj.lsdsTypeBreakKey === true && 'hidden'}>
                      {/* <Piechart cardClass="card-success" title="Devices Type Breakup" loading={lsdsTypeBreakLoading} data={lsdsTypeBreakData} value="value" colorArray={BoxesColors} granularity={granularity} innerRadiusProp={70} paddingProp={2} info={stolenDeviceTypeBreakup} heightProp={this.getElementHeight(document.getElementsByName('lsdsTypeBreakKey')[0])} removeChart={this.onRemoveItem} chartGridId={'lsdsTypeBreakKey'} /> */}
                      <Barchart cardClass="card-success" title="Categories of Stolen IMEIs" loading={lsdsTypeBreakLoading} data={lsdsTypeBreakData} xAxis="rat" yAxisLabel="Count of IMEIs" yAxes={uniqueTypeBreakData} isSegregate={true} colorArray={this.getColorArray(56)} granularity={granularity} info={stolenDeviceTypeBreakup} heightProp={this.getElementHeight(document.getElementsByName('lsdsTypeBreakKey')[0])} removeChart={this.onRemoveItem} chartGridId={'lsdsTypeBreakKey'}/>
                    </div>
                    <div name='lsdsByTechnologyKey' key="lsdsByTechnologyKey" className={deletedObj.lsdsByTechnologyKey === true && 'hidden'}>
                      <HorizontalBarSegregateChart cardClass="card-info" title="Overall Stolen IMEIs By Technology" loading={lsdsByTechnologyLoading} data={lsdsByTechnologyData} xAxis={["IMEIs"]} yAxis="RAT" colorArray={this.getColorArray(56)} granularity={granularity} info={stolenBreakUpByTechnology2G3G4G} heightProp={this.getElementHeight(document.getElementsByName('lsdsByTechnologyKey')[0])} removeChart={this.onRemoveItem} chartGridId={'lsdsByTechnologyKey'} />
                    </div>
                    <div name='lsdsByTechnologyOverTimeKey' key="lsdsByTechnologyOverTimeKey" className={deletedObj.lsdsByTechnologyOverTimeKey === true && 'hidden'}>
                      <Barchart cardClass="card-primary" title="Stolen IMEIs Trend By Technology" heightProp={this.getElementHeight(document.getElementsByName('lsdsByTechnologyOverTimeKey')[0])} loading={lsdsByTechnologyOverTimeLoading} data={lsdsByTechnologyOverTimeData} yAxisLabel="Count of IMEIS" yAxes={uniquelsdsByTechnologyOverTimeData} xAxis="x_axis" colorArray={this.getColorArray(57)} granularity={granularity} info={stolenBreakUpByTechnology2G3G4GOverTIME} removeChart={this.onRemoveItem} chartGridId={'lsdsByTechnologyOverTimeKey'} />
                    </div>
                  </ResponsiveReactGridLayout>
                </div>
              </React.Fragment>
              : null
            }
          </div>
        </div>
      </Container>
    )
  }
}

Trends.defaultProps = {
  className: "layout",
  cols: { lg: 100, md: 100, sm: 6, xs: 4, xxs: 2 },
  breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
  initialLayout: [
    { i: 'lsdsTrendInImeisKey', x: 0, y: 0, w: 50, h: (50 / 100 * 56.6), minW: 33, minH: 20, maxW: 100, maxH: (75 / 100 * 56.6) },
    { i: 'lsdsTypeBreakKey', x: 0, y: 0, w: 50, h: (50 / 100 * 56.6), minW: 33, minH: 20, maxW: 100, maxH: (75 / 100 * 56.6) },
    { i: 'lsdsByTechnologyKey', x: 50, y: 0, w: 50, h: (50 / 100 * 56.6), minW: 33, minH: 20, maxW: 100, maxH: (75 / 100 * 56.6) },
    { i: 'lsdsByTechnologyOverTimeKey', x: 50, y: 0, w: 50, h: (50 / 100 * 56.6), minW: 33, minH: 20, maxW: 100, maxH: (75 / 100 * 56.6) }
  ]
};

export default Trends;