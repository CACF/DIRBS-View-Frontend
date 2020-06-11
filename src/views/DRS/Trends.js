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
import { unique_437_colors, getAuthHeader, instance, getTwoLevelPieChartData, errors, getUniqueKeys, yAxisKeysCleaning, getUserType, getUserRole, yAxisToCount, scrollOsetTopPlus, fixFilOsetHeightMinus } from "./../../utilities/helpers";
import Barchart from './../../components/Charts/Commons/Barchart'
import TwoLevelPiechart from '../../components/Charts/Commons/TwoLevelPiechart';
import Areachart from '../../components/Charts/Commons/AreaChart';
import Linechart from '../../components/Charts/Commons/Linechart';
import Composedchart from '../../components/Charts/Commons/Composedchart';
import SearchFilters from "./../../components/Form/SearchFilters";
import { SearchInfo } from "./../../components/Help/SearchInfo";
import { blueColors, stackBarTwentyColors, stackBarTetrade, multiColorStack, multiColors, BoxesColors } from './../../utilities/chart_colors';
import HeaderCards from './../../components/Cards/HeaderCards';
import { dRSImportTrend, grossAddIMEIsVsDRSVsNotification, dRSTop10overAllBrands, dRSTop2G3G4GBrands, dRSCOCTypeInfo,dRSCOCTypeRATInfo } from './../../utilities/reportsInfo';
import svgSymbol from './../../images/svg_symbol.svg';
import { Responsive, WidthProvider } from "react-grid-layout";
import HorizontalBarSegregateChart from './../../components/Charts/Commons/HorizontalBarSegregateChart';

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
      drsImportTrendData: null,
      uniqueImportTrendData: [],
      drsImportTrendLoading: false,
      drsTopBrandsData: null,
      drsTopBrandsLoading: false,
      drsTopBrandsByRatData: null,
      uniqueTopBrandsByRatData: [],
      TopBrandsByRatDataToDownload: [],
      drsTopBrandsByRatLoading: false,
      drsComboGrossData: null,
      uniqueComboGrossData: [],
      drsComboGrossLoading: false,
      drsCOCTypeData: null,
      uniqueCOCTypeData: [],
      drsCOCTypeLoading: false,
      drsCOCTypeRATData: null,
      uniqueCOCTypeRATData: [],
      drsCOCTypeRATLoading: false,
      drsCOCTypeRATRawData: [],

      totalImies: '',
      totalDrsImies: '',
      totalPairedImies: '',
      totalStolenImies: '',
      totalDvsImies: '',
      totalBlocking:  '',
      apiFetched: false,
      searchQuery: {},
      granularity: "",
      subSystem: 'drs',
      currentBreakpoint: "lg",
      compactType: "vertical",
      mounted: false,
      layouts: { lg: props.initialLayout },
      layout: [],
      rowHeight: window.innerWidth < 1300 ? 3.7 : 10.6,
      deletedObj: { drsImportTrendKey: false, drsCOCTypeKey: false, drsCOCTypeRATKey:false, drsTopBrandsKey: false, drsTopBrandsByRatKey: false, drsComboGrossKey: false }
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

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
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
    this.setState({ layouts: { lg: _.reject(this.state.layout, { i: 'drsTopModelsKey' }) } }, () => {
      let { deletedObj } = this.state;
      deletedObj.drsImportTrendKey = false;
      deletedObj.drsTopBrandsKey = false;
      deletedObj.drsTopBrandsByRatKey = false;
      deletedObj.drsComboGrossKey = false;
      deletedObj.drsCOCTypeKey = false;
      deletedObj.drsCOCTypeRATKey = false;
      this.setState({ deletedObj: deletedObj, layouts: { lg: this.props.initialLayout } });
    })
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

  saveSearchQuery(values) {
    this.setState({ searchQuery: values, drsTopBrandsLoading: true, drsImportTrendLoading: true, drsTopBrandsByRatLoading: true, drsComboGrossLoading: false, drsCOCTypeLoading: true, drsCOCTypeData: [], drsCOCTypeRATLoading: true, drsCOCTypeRATData: [], drsComboGrossData: [], drsTopBrandsByRatData: [], drsImportTrendData: [], drsTopBrandsData: [], apiFetched: true, granularity: values.granularity }, () => {
      this.updateTokenHOC(this.getGraphDataFromServer);
    })
  }
  dataFormatter = (array) => {
    let newArr = [];
    array.map(item =>
      newArr.push({ "name": Object.keys(item)[0], "value": item[Object.keys(item)[0]] })
    )
    return newArr;
  }
  getGraphDataFromServer(config) {

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

    instance.get('/pta-drs-02-import-trend' + this.getCallParamsGetMethods(), config)
      .then(response => {
        if (response.data.message) {
          this.setState({ drsImportTrendLoading: false });
        } else {
          let cleanData = yAxisKeysCleaning(response.data.results)
          let uniqueData = getUniqueKeys(cleanData);
          this.setState({ drsImportTrendData: cleanData, uniqueImportTrendData: uniqueData, drsImportTrendLoading: false });
        }
      })
      .catch(error => {
        errors(this, error);
      })

    instance.get('/pta-drs-03-overall-top-brands' + this.getCallParamsGetMethods(), config)
      .then(response => {
        if (response.data.message) {
          this.setState({ drsTopBrandsLoading: false });
        } else {
          this.setState({ drsTopBrandsData: response.data.results, drsTopBrandsLoading: false });
        }
      })
      .catch(error => {
        errors(this, error);
      })

    instance.get('/pta-drs-04-rat-top-brands' + this.getCallParamsGetMethods(), config)
      .then(response => {
        if (response.data.message) {
          this.setState({ drsTopBrandsByRatLoading: false });
        } else {
          let cleanData = yAxisKeysCleaning(response.data.results)
          let formatedData = getUniqueKeys(cleanData);
          this.setState({ drsTopBrandsByRatData: cleanData, uniqueTopBrandsByRatData: formatedData, TopBrandsByRatDataToDownload: cleanData, drsTopBrandsByRatLoading: false });
        }
      })
      .catch(error => {
        errors(this, error);
      })

    instance.get('/pta-drs-07-imeis-bifurcation' + this.getCallParamsGetMethods(), config)
      .then(response => {
        if (response.data.message) {
          this.setState({ drsComboGrossLoading: false });
        } else {
          let cleanData = yAxisKeysCleaning(response.data.results)
          let uniqueData = getUniqueKeys(cleanData);
          this.setState({ drsComboGrossData: cleanData, uniqueComboGrossData: uniqueData, drsComboGrossLoading: false });
        }
      })
      .catch(error => {
        errors(this, error);
      })

    instance.get('/pta-drs-05-coc-types' + this.getCallParamsGetMethods(), config)
      .then(response => {
        if (response.data.message) {
          this.setState({ drsCOCTypeLoading: false });
        } else {
          let cleanData = yAxisKeysCleaning(response.data.result)
          let uniqueData = getUniqueKeys(cleanData);
          this.setState({ drsCOCTypeData: cleanData, uniqueCOCTypeData: uniqueData, drsCOCTypeLoading: false });
        }
      })
      .catch(error => {
        errors(this, error);
      })

    instance.get('/pta-drs-06-coc-type-with-rats' + this.getCallParamsGetMethods(), config)
      .then(response => {
        if (response.data.message) {
          this.setState({ drsCOCTypeRATLoading: false });
        } else {
          let cleanData = yAxisKeysCleaning(response.data);
          //let uniqueData = getUniqueKeys(cleanData);
          this.setState({ drsCOCTypeRATData: cleanData, drsCOCTypeRATLoading: false, drsCOCTypeRATRawData: response.data });
        }
      })
      .catch(error => {
        errors(this, error);
      })

  }
  render() {
    const { apiFetched, drsCOCTypeRATData, drsCOCTypeRATLoading, drsCOCTypeRATRawData, drsCOCTypeData, uniqueCOCTypeData, drsCOCTypeLoading, drsComboGrossData, uniqueTopBrandsByRatData, uniqueComboGrossData, drsComboGrossLoading, totalImies, totalDrsImies, totalPairedImies, totalStolenImies, totalDvsImies, totalBlocking, drsTopBrandsByRatData, TopBrandsByRatDataToDownload, drsTopBrandsByRatLoading, drsTopBrandsData, drsTopBrandsLoading, drsImportTrendData, uniqueImportTrendData, drsImportTrendLoading, granularity, deletedObj } = this.state;
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
              ?
              <React.Fragment>
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
                </article>                <div className="grid-box">
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
                    <div name='drsImportTrendKey' key="drsImportTrendKey" className={deletedObj.drsImportTrendKey === true && 'hidden'}>
                      <Linechart cardClass="card-success" title="Devices Vs IMEIs" loading={drsImportTrendLoading} data={drsImportTrendData} xAxis="x_axis" yAxisLabel="Count of Devices and IMEIs" yAxes={uniqueImportTrendData} colorArray={this.getColorArray(32)} granularity={granularity} info={dRSImportTrend} showLegend="true" heightProp={this.getElementHeight(document.getElementsByName('drsImportTrendKey')[0])} removeChart={this.onRemoveItem} chartGridId={'drsImportTrendKey'} />
                    </div>
                    <div name='drsCOCTypeKey' key="drsCOCTypeKey" className={deletedObj.drsCOCTypeKey === true && 'hidden'}>
                      <Linechart cardClass="card-success" title="DRS Trend of COC Types" loading={drsCOCTypeLoading} data={drsCOCTypeData} xAxis="x_axis" yAxisLabel="Count of IMEIs" yAxes={uniqueCOCTypeData} colorArray={this.getColorArray(32)} granularity={granularity} info={dRSCOCTypeInfo} showLegend="true" heightProp={this.getElementHeight(document.getElementsByName('drsCOCTypeKey')[0])} removeChart={this.onRemoveItem} chartGridId={'drsCOCTypeKey'} />
                    </div>
                    <div name='drsTopBrandsKey' key="drsTopBrandsKey" className={deletedObj.drsTopBrandsKey === true && 'hidden'}>
                      <HorizontalBarSegregateChart cardClass="card-primary" title="Brands by IMEIs" loading={drsTopBrandsLoading} data={drsTopBrandsData} xAxis={["imeis"]} yAxis="brand" colorArray={this.getColorArray(56)} granularity={granularity} info={dRSTop10overAllBrands} heightProp={this.getElementHeight(document.getElementsByName('drsTopBrandsKey')[0])} removeChart={this.onRemoveItem} chartGridId={'drsTopBrandsKey'}/>
                    </div>
                    <div name='drsCOCTypeRATKey' key="drsCOCTypeRATKey" className={deletedObj.drsCOCTypeRATKey === true && 'hidden'}>
                      <Barchart cardClass="card-primary" title="COC Types by technology" loading={drsCOCTypeRATLoading} dataToDownload={drsCOCTypeRATRawData} data={drsCOCTypeRATData} xAxis="e" yAxisLabel="Count of IMEIs" yAxes={["2G", "3G", "4G", "Others"]} isSegregate={true} colorArray={this.getColorArray(56)} granularity={granularity} info={dRSCOCTypeRATInfo} heightProp={this.getElementHeight(document.getElementsByName('drsCOCTypeRATKey')[0])} removeChart={this.onRemoveItem} chartGridId={'drsCOCTypeRATKey'}/>
                    </div>
                    <div name='drsTopBrandsByRatKey' key="drsTopBrandsByRatKey" className={deletedObj.drsTopBrandsByRatKey === true && 'hidden'}>
                      <Barchart cardClass="card-success" title="Top Brands of 2G/3G/4G" loading={drsTopBrandsByRatLoading} data={drsTopBrandsByRatData} xAxis="rat" isSegregate={true} yAxes={uniqueTopBrandsByRatData} colorArray={this.getColorArray(57)} showLegend="true" granularity={granularity} innerRadiusProp={110} paddingProp={0} info={dRSTop2G3G4GBrands} dataToDownload={TopBrandsByRatDataToDownload} heightProp={this.getElementHeight(document.getElementsByName('drsTopBrandsByRatKey')[0])} removeChart={this.onRemoveItem} chartGridId={'drsTopBrandsByRatKey'} />
                    </div>
                    <div name='drsComboGrossKey' key="drsComboGrossKey" className={deletedObj.drsComboGrossKey === true && 'hidden'}>
                      <Composedchart cardClass="card-primary" title="DRS Devices Bifurcation" loading={drsComboGrossLoading} data={drsComboGrossData} xAxis="x_axis" yAxes={uniqueComboGrossData} yAxisComposit="total_registered" yAxisLabel="Count of Devices" colorArray={this.getColorArray(57)} showLegend="true" granularity={granularity} info={grossAddIMEIsVsDRSVsNotification} heightProp={this.getElementHeight(document.getElementsByName('drsComboGrossKey')[0])} removeChart={this.onRemoveItem} chartGridId={'drsComboGrossKey'} />
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
    { i: 'drsImportTrendKey', x: 0, y: 25, w: 50, h: (50 / 100 * 56.6), minW: 33, minH: 20, maxW: 100, maxH: (75 / 100 * 56.6) },
    { i: 'drsCOCTypeKey', x: 0, y: 25, w: 50, h: (50 / 100 * 56.6), minW: 33, minH: 20, maxW: 100, maxH: (75 / 100 * 56.6) },
    { i: 'drsCOCTypeRATKey', x: 50, y: 50, w: 50, h: (50 / 100 * 56.6), minW: 33, minH: 20, maxW: 100, maxH: (75 / 100 * 56.6) },
    { i: 'drsTopBrandsKey', x: 50, y: 25, w: 50, h: (50 / 100 * 56.6), minW: 33, minH: 20, maxW: 100, maxH: (75 / 100 * 56.6) },
    { i: 'drsTopBrandsByRatKey', x: 0, y: 0, w: 50, h: (50 / 100 * 56.6), minW: 33, minH: 20, maxW: 100, maxH: (75 / 100 * 56.6) },
    { i: 'drsComboGrossKey', x: 0, y: 150, w: 100, h: (50 / 100 * 56.6), minW: 33, minH: 20, maxW: 100, maxH: (75 / 100 * 56.6) }
  ]
};

export default Trends;
