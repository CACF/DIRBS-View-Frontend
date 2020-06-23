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
import SearchForm from '../../components/Form/SearchForm';
import { unique_437_colors, getAuthHeader, instance, errors, getUniqueKeys, yAxisToCount, yAxisKeysCleaning, FormatDataForDataTable, getUserRole, getUserType, replaceCharacters, scrollOsetTopPlus, fixFilOsetHeightMinus, removeTotalImeis } from "../../utilities/helpers";
import Barchart from '../../components/Charts/Commons/Barchart';
import Linechart from '../../components/Charts/Commons/Linechart';
import AreaChart from '../../components/Charts/Commons/AreaChart';
import DataTable from '../../components/DataTable/DataTable';
import SearchFilters from "../../components/Form/SearchFilters";
import { SearchInfo } from "../../components/Help/SearchInfo";
import { multiColorStack, multiColors, blueColors, stackBarTwentyColors, stackBarTetrade, BoxesColors, statusColors, progressBarColors, colorThemeShades } from '../../utilities/chart_colors';
import HeaderCards from '../../components/Cards/HeaderCards';
import { coreOperatorWiseIMEIs, coreOperatorWiseMSISDNs, coreNetworkSeenIMEIsByTechnology2G3G4G, coreValidInvalidNetworkSeenIMEIs, coreGrossAddIMEIs, coreGrossAddIMEIsByTechnology, coreBlocking, coreUnBlocking, coreMNORATBreakupInfo } from '../../utilities/reportsInfo';
import svgSymbol from './../../images/svg_symbol.svg';
import { Responsive, WidthProvider } from "react-grid-layout";
import _ from 'lodash';
import HorizontalBarSegregateChart from './../../components/Charts/Commons/HorizontalBarSegregateChart';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

class Trends extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      fading: false,
      isShowingFilters: true, disableSaveButton: true,
      coreOperatorWiseImeisData: null,
      uniqueOperatorWiseImeisData: [],
      coreOperatorWiseImeisLoading: false,
      coreOperatorWiseMsisdnsData: null,
      uniqueOperatorWiseMsisdnsData: [],
      coreOperatorWiseMsisdnsLoading: false,
      coreImeisOnNetworkData: null,
      uniqueImeisOnNetworkData: [],
      coreImeisOnNetworkLoading: false,
      coreValidInvalidData: null,
      uniqueValidInvalidData: [],
      coreValidInvalidLoading: false,
      coreGrossAddImeiData: null,
      uniqueGrossAddImeiData: [],
      coreGrossAddImeiLoading: false,
      coreGrossAddImeiByTechData: null,
      uniqueGrossAddImeiByTechData: [],
      coreGrossAddImeiByTechLoading: false,
      coreBlockingData: null,
      coreBlockingLoading: false,
      coreUnBlockingData: null,
      coreUnBlockingLoading: false,
      coreMNORATBreakupData: null,
      uniqueMNORATBreakupData: [],
      coreMNORATBreakupLoading: false,

      apiFetched: false,
      searchQuery: {},
      granularity: "",
      totalImies: '',
      totalDrsImies: '',
      totalPairedImies: '',
      totalStolenImies: '',
      totalDvsImies: '',
      totalBlocking: '',
      subSystem: 'core_range',
      currentBreakpoint: "lg",
      compactType: "vertical",
      mounted: false,
      layouts: { lg: props.initialLayout },
      layout: [],
      rowHeight: window.innerWidth < 1300 ? 3.7 : 10.6,
      deletedObj: { coreOperatorWiseImeisKey: false, coreOperatorWiseMsisdnsKey: false, coreImeisOnNetworkKey: false, coreValidInvalidKey: false, coreGrossAddImeiKey: false, coreGrossAddImeiByTechKey: false, coreMNORATBreakupKey:  false, coreBlockingKey: false, coreUnBlockingKey: false }
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

  //In componentDidMount hook we are maximizing sidebar on page load

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
    this.setState({ layouts: { lg: _.reject(this.state.layout, { i: 'coreValidInvalidKey' }) } }, () => {
      let { deletedObj } = this.state;
      deletedObj.coreOperatorWiseImeisKey = false;
      deletedObj.coreOperatorWiseMsisdnsKey = false;
      deletedObj.coreImeisOnNetworkKey = false;
      deletedObj.coreValidInvalidKey = false;
      deletedObj.coreGrossAddImeiKey = false;
      deletedObj.coreGrossAddImeiByTechKey = false;
      deletedObj.coreMNORATBreakupKey = false;
      deletedObj.coreBlockingKey = false;
      deletedObj.coreUnBlockingKey = false;
      this.setState({ deletedObj: deletedObj, layouts: { lg: this.props.initialLayout } });
    })
  }

  handleScroll() {
    this.setState({ scroll: window.scrollY });
  }

  //returns randomized color array from single array of colors.

  getColorArray = (n) => unique_437_colors.slice(n);

  // This method check if user's token is expired, if yes, It updates it and save it in the local storage

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


  // this method set initial state of the component and being called for search component

  saveSearchQuery(values) {
    this.setState({ searchQuery: values, coreOperatorWiseImeisLoading: true, coreOperatorWiseMsisdnsLoading: true, coreImeisOnNetworkLoading: true, coreValidInvalidLoading: true, coreGrossAddImeiLoading: true, coreGrossAddImeiByTechLoading: true, coreBlockingLoading: true, coreUnBlockingLoading: true, coreMNORATBreakupLoading: true, coreMNORATBreakupData: [], coreBlockingData: [], coreUnBlockingData: [], coreGrossAddImeiByTechData: [], coreGrossAddImeiData: [], coreValidInvalidData: [], coreImeisOnNetworkData: [], coreOperatorWiseMsisdnsData: [], coreOperatorWiseImeisData: [], apiFetched: true, granularity: values.granularity }, () => {
      this.updateTokenHOC(this.getGraphDataFromServer);
    })
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

  //Here we are getting parameters for APi calls.
  getCallParams = (chart_id) => {
    const searchQuery = this.state.searchQuery;
    let type = getUserType(this.props.resources);
    let role = getUserRole(this.props.resources);
    let postData = {
      ...searchQuery,
      type,
      role,
      chart_id
    }
    return postData;
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

  // In this method we call backend API's to get data deponding on specified search params.

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

    //Here API is being called to get Operator wise IMEIs. In response we are setting the state with the recieved data

    instance.get('/pta-core-02-operators-imeis' + this.getCallParamsGetMethods(), config)
      .then(response => {
        if (response.data.message) {
          this.setState({ coreOperatorWiseImeisLoading: false });
        } else {
          let cleanData = yAxisKeysCleaning(response.data.results)
          let uniqueData = getUniqueKeys(cleanData);
          this.setState({ coreOperatorWiseImeisData: cleanData, uniqueOperatorWiseImeisData: uniqueData, coreOperatorWiseImeisLoading: false });
        }
      })
      .catch(error => {
        errors(this, error);
      })

    //Here API is being called to get Operator wise MSISDN. In response we are setting the state with the recieved data

    instance.get('/pta-core-03-operators-msisdns' + this.getCallParamsGetMethods(), config)
      .then(response => {
        if (response.data.message) {
          this.setState({ coreOperatorWiseMsisdnsLoading: false });
        } else {
          let cleanData = yAxisKeysCleaning(response.data.results)
          let uniqueData = getUniqueKeys(cleanData);
          this.setState({ coreOperatorWiseMsisdnsData: cleanData, uniqueOperatorWiseMsisdnsData: uniqueData, coreOperatorWiseMsisdnsLoading: false });
        }
      })
      .catch(error => {
        errors(this, error);
      })

    //Here API is being called to get Network Seen IMEIs By Technology (2G/3G/4G). In response we are setting the state with the recieved data

    instance.get('/pta-core-04-rat-wise-seen-imeis' + this.getCallParamsGetMethods(), config)
      .then(response => {
        if (response.data.message) {
          this.setState({ coreImeisOnNetworkLoading: false });
        } else {
          let cleanData = yAxisKeysCleaning(response.data.results)
          let uniqueData = getUniqueKeys(cleanData);
          this.setState({ coreImeisOnNetworkData: cleanData, uniqueImeisOnNetworkData: uniqueData, coreImeisOnNetworkLoading: false });
        }
      })
      .catch(error => {
        errors(this, error);
      })

    //Here API is being called to get Valid/Invalid Network Seen IMEIs. In response we are setting the state with the recieved data

    instance.get('/pta-core-05-valid-invalid-imeis' + this.getCallParamsGetMethods(), config)
      .then(response => {
        if (response.data.message) {
          this.setState({ coreValidInvalidLoading: false });
        } else {
          let cleanData = yAxisKeysCleaning(removeTotalImeis(response.data.results))
          let uniqueData = getUniqueKeys(cleanData);
          this.setState({ coreValidInvalidData: cleanData, uniqueValidInvalidData: uniqueData, coreValidInvalidLoading: false });
        }
      })
      .catch(error => {
        errors(this, error);
      })

    //Here API is being called to get Gross add IMEIs. In response we are setting the state with the recieved data

    instance.get('/pta-core-06-gross-add-imeis' + this.getCallParamsGetMethods(), config)
      .then(response => {
        if (response.data.message) {
          this.setState({ coreGrossAddImeiLoading: false });
        } else {
          let cleanData = yAxisKeysCleaning(response.data.results)
          let uniqueData = getUniqueKeys(cleanData);
          this.setState({ coreGrossAddImeiData: cleanData, uniqueGrossAddImeiData: uniqueData, coreGrossAddImeiLoading: false });
        }
      })
      .catch(error => {
        errors(this, error);
      })

    //Here API is being called to get Gross add IMEIs by Technology. In response we are setting the state with the recieved data

    instance.get('/pta-core-07-rat-wise-gross-imeis' + this.getCallParamsGetMethods(), config)
      .then(response => {
        if (response.data.message) {
          this.setState({ coreGrossAddImeiByTechLoading: false });
        } else {
          let cleanData = yAxisKeysCleaning(response.data.results)
          let uniqueData = getUniqueKeys(cleanData);
          this.setState({ coreGrossAddImeiByTechData: cleanData, uniqueGrossAddImeiByTechData: uniqueData, coreGrossAddImeiByTechLoading: false });
        }
      })
      .catch(error => {
        errors(this, error);
      })

    //Here API is being called to get Blocking Reasons. In response we are setting the state with the recieved data

    instance.get('/pta-core-09-blocked-imeis-by-reasons' + this.getCallParamsGetMethods(), config)
      .then(response => {
        if (response.data.message) {
          this.setState({ coreGrossAddImeiByTechLoading: false });
        } else {
          this.setState({ coreBlockingData: response.data.results, coreBlockingLoading: false });
        }
      })
      .catch(error => {
        errors(this, error);
      })

    // Here API is being called to get Un Blocking Reasons. In response we are setting the state with the recieved data

    instance.get('/pta-core-10-unblocked-imeis-by-reasons' + this.getCallParamsGetMethods(), config)
      .then(response => {
        if (response.data.message) {
          this.setState({ coreUnBlockingLoading: false });
        } else {
          this.setState({ coreUnBlockingData: response.data.results, coreUnBlockingLoading: false });
        }
      })
      .catch(error => {
        errors(this, error);
      })

   //Here API is being called to get MNO breakup By Technology (2G/3G/4G). In response we are setting the state with the recieved data

    instance.get('/pta-core-04-rat-wise-seen-imeis' + this.getCallParamsGetMethods(), config)
    .then(response => {
      if (response.data.message) {
        this.setState({ coreImeisOnNetworkLoading: false });
      } else {
        let cleanData = yAxisKeysCleaning(response.data.results)
        let uniqueData = getUniqueKeys(cleanData);
        this.setState({ coreImeisOnNetworkData: cleanData, uniqueImeisOnNetworkData: uniqueData, coreImeisOnNetworkLoading: false });
      }
    })
    .catch(error => {
      errors(this, error);
    })
    
    instance.get('/pta-core-11-mno-rat-breakup' + this.getCallParamsGetMethods(), config)
      .then(response => {
        if (response.data.message) {
          this.setState({ coreMNORATBreakupLoading: false });
        } else {
          let cleanData = yAxisKeysCleaning(response.data.results);
          let uniqueData = getUniqueKeys(cleanData);
          this.setState({ coreMNORATBreakupData: cleanData, uniqueMNORATBreakupData: uniqueData, coreMNORATBreakupLoading: false });
        }
      })
      .catch(error => {
        errors(this, error);
      })
  }

  render() {
    const { apiFetched, coreUnBlockingData, coreMNORATBreakupData, uniqueMNORATBreakupData, coreMNORATBreakupLoading, coreUnBlockingLoading, coreBlockingData, coreBlockingLoading, totalDrsImies, totalPairedImies, totalStolenImies, totalDvsImies, totalBlocking, coreGrossAddImeiByTechLoading, uniqueGrossAddImeiByTechData, coreGrossAddImeiByTechData, coreGrossAddImeiData, uniqueGrossAddImeiData, coreGrossAddImeiLoading, coreValidInvalidLoading, uniqueValidInvalidData, coreValidInvalidData, coreImeisOnNetworkData, uniqueImeisOnNetworkData, coreImeisOnNetworkLoading, uniqueOperatorWiseImeisData, coreOperatorWiseImeisData, coreOperatorWiseMsisdnsData, uniqueOperatorWiseMsisdnsData, coreOperatorWiseMsisdnsLoading, coreOperatorWiseImeisLoading, granularity, totalImies, deletedObj } = this.state;
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
                    <SearchForm callServer={this.saveSearchQuery} showHideComponents={this.filtersSidebarDisplay} />
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
                    <SearchForm callServer={this.saveSearchQuery} showHideComponents={this.filtersSidebarDisplay} />
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
                    {/* Here we are rendering reusable charts and passing them props according to the need. (Title, loading, data, xAxis and yAxes are the only mandatory props)   */}

                    <div name='coreOperatorWiseImeisKey' key="coreOperatorWiseImeisKey" className={deletedObj.coreOperatorWiseImeisKey === true && 'hidden'}>
                      <Barchart cardClass="card-primary" title="IMEIs Seen On Network By Operators" loading={coreOperatorWiseImeisLoading} data={coreOperatorWiseImeisData} xAxis="x_axis" yAxes={uniqueOperatorWiseImeisData} yAxisLabel="Count of IMEIs" colorArray={colorThemeShades} granularity={granularity} info={coreOperatorWiseIMEIs} heightProp={this.getElementHeight(document.getElementsByName('coreOperatorWiseImeisKey')[0])} removeChart={this.onRemoveItem} chartGridId={'coreOperatorWiseImeisKey'} />
                    </div>
                    <div name='coreOperatorWiseMsisdnsKey' key="coreOperatorWiseMsisdnsKey" className={deletedObj.coreOperatorWiseMsisdnsKey === true && 'hidden'}>
                      <Barchart cardClass="card-primary" title="MSISDNs Seen On Network By Operators" loading={coreOperatorWiseMsisdnsLoading} data={coreOperatorWiseMsisdnsData} xAxis="x_axis" yAxes={uniqueOperatorWiseMsisdnsData} yAxisLabel="Count of MSISDN" colorArray={colorThemeShades} granularity={granularity} info={coreOperatorWiseMSISDNs} heightProp={this.getElementHeight(document.getElementsByName('coreOperatorWiseMsisdnsKey')[0])} removeChart={this.onRemoveItem} chartGridId={'coreOperatorWiseMsisdnsKey'} />
                    </div>
                    <div name='coreImeisOnNetworkKey' key="coreImeisOnNetworkKey" className={deletedObj.coreImeisOnNetworkKey === true && 'hidden'}>
                      <Barchart cardClass="card-primary" title="Network Seen IMEIs By Technology (Overall)" loading={coreImeisOnNetworkLoading} data={coreImeisOnNetworkData} xAxis="x_axis" yAxes={uniqueImeisOnNetworkData} yAxisLabel="Count of IMEIs" colorArray={colorThemeShades} granularity={granularity} info={coreNetworkSeenIMEIsByTechnology2G3G4G} heightProp={this.getElementHeight(document.getElementsByName('coreImeisOnNetworkKey')[0])} removeChart={this.onRemoveItem} chartGridId={'coreImeisOnNetworkKey'} />
                    </div>
                    <div name='coreValidInvalidKey' key="coreValidInvalidKey" className={deletedObj.coreValidInvalidKey === true && 'hidden'}>
                      <Linechart cardClass="card-primary" title="Valid and Invalid IMEIs Seen On Network" loading={coreValidInvalidLoading} data={coreValidInvalidData} xAxis="x_axis" yAxes={uniqueValidInvalidData} yAxisLabel="Count of IMEIs" colorArray={colorThemeShades} granularity={granularity} info={coreValidInvalidNetworkSeenIMEIs} heightProp={this.getElementHeight(document.getElementsByName('coreValidInvalidKey')[0])} removeChart={this.onRemoveItem} chartGridId={'coreValidInvalidKey'} />
                    </div>
                    <div name='coreGrossAddImeiKey' key="coreGrossAddImeiKey" className={deletedObj.coreGrossAddImeiKey === true && 'hidden'}>
                      <Barchart cardClass="card-primary" title="New IMEIs Seen On Network" loading={coreGrossAddImeiLoading} data={coreGrossAddImeiData} xAxis="x_axis" yAxes={uniqueGrossAddImeiData} yAxisLabel="Count of IMEIs" colorArray={blueColors} customName="Count" showLegend="false" isTriangle={true} granularity={granularity} info={coreGrossAddIMEIs} heightProp={this.getElementHeight(document.getElementsByName('coreGrossAddImeiKey')[0])} removeChart={this.onRemoveItem} chartGridId={'coreGrossAddImeiKey'} />
                    </div>
                    <div name='coreGrossAddImeiByTechKey' key="coreGrossAddImeiByTechKey" className={deletedObj.coreGrossAddImeiByTechKey === true && 'hidden'}>
                      <Barchart cardClass="card-warning" title="Gross Add By Technology (New Seen)" loading={coreGrossAddImeiByTechLoading} data={coreGrossAddImeiByTechData} xAxis="x_axis" yAxisLabel="Count of IMEIs" yAxes={uniqueGrossAddImeiByTechData} colorArray={colorThemeShades} granularity={granularity} info={coreGrossAddIMEIsByTechnology} showLegend="true" heightProp={this.getElementHeight(document.getElementsByName('coreGrossAddImeiByTechKey')[0])} removeChart={this.onRemoveItem} chartGridId={'coreGrossAddImeiByTechKey'} />
                    </div>
                    <div name='coreMNORATBreakupKey' key="coreMNORATBreakupKey" className={deletedObj.coreMNORATBreakupKey === true && 'hidden'}>
                      <Barchart cardClass="card-primary" title="IMEIs Seen On Network By Technology and Operator" loading={coreMNORATBreakupLoading} data={coreMNORATBreakupData} yAxisLabel="Count of IMEIs" xAxis="x_axis" yAxes={uniqueMNORATBreakupData} isSegregate={true} colorArray={colorThemeShades} granularity={granularity} info={coreMNORATBreakupInfo} heightProp={this.getElementHeight(document.getElementsByName('coreMNORATBreakupKey')[0])} removeChart={this.onRemoveItem} chartGridId={'coreMNORATBreakupKey'}/>
                    </div>
                    <div name='coreBlockingKey' key="coreBlockingKey" className={deletedObj.coreBlockingKey === true && 'hidden'}>
                      <HorizontalBarSegregateChart cardClass="card-primary" title="Blocked IMEIs by Reasons" loading={coreBlockingLoading} data={coreBlockingData} xAxis={["imeis"]} yAxis="reason" colorArray={colorThemeShades.slice(2)} granularity={granularity} info={coreBlocking} yAxisWidth={140} heightProp={this.getElementHeight(document.getElementsByName('coreBlockingKey')[0])} removeChart={this.onRemoveItem} chartGridId={'coreBlockingKey'}/>
                    </div>
                    <div name='coreUnBlockingKey' key="coreUnBlockingKey" className={deletedObj.coreUnBlockingKey === true && 'hidden'}>
                      <HorizontalBarSegregateChart cardClass="card-primary" title="UnBlocked IMEIs by Reasons" loading={coreUnBlockingLoading} data={coreUnBlockingData} xAxis={["imeis"]} yAxis="reason" colorArray={colorThemeShades.slice(2)} granularity={granularity} info={coreUnBlocking} yAxisWidth={140} heightProp={this.getElementHeight(document.getElementsByName('coreUnBlockingKey')[0])} removeChart={this.onRemoveItem} chartGridId={'coreUnBlockingKey'}/>
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
    { i: 'coreOperatorWiseImeisKey', x: 0, y: 22, w: 50, h: (50 / 100 * 56.6), minW: 33, minH: 20, maxW: 100, maxH: (75 / 100 * 56.6) },
    { i: 'coreOperatorWiseMsisdnsKey', x: 50, y: 50, w: 50, h: (50 / 100 * 56.6), minW: 33, minH: 20, maxW: 100, maxH: (75 / 100 * 56.6) },
    { i: 'coreImeisOnNetworkKey', x: 50, y: 70, w: 50, h: (50 / 100 * 56.6), minW: 33, minH: 20, maxW: 100, maxH: (75 / 100 * 56.6) },
    { i: 'coreValidInvalidKey', x: 0, y: 90, w: 50, h: (50 / 100 * 56.6), minW: 33, minH: 20, maxW: 100, maxH: (75 / 100 * 56.6) },
    { i: 'coreGrossAddImeiKey', x: 0, y: 120, w: 100, h: (50 / 100 * 56.6), minW: 33, minH: 20, maxW: 100, maxH: (75 / 100 * 56.6) },
    { i: 'coreGrossAddImeiByTechKey', x: 0, y: 0, w: 50, h: (50 / 100 * 56.6), minW: 33, minH: 20, maxW: 100, maxH: (75 / 100 * 56.6) },
    { i: 'coreMNORATBreakupKey', x: 50, y: 115, w: 50, h: (50 / 100 * 56.6), minW: 33, minH: 20, maxW: 100, maxH: (75 / 100 * 56.6) },
    { i: 'coreBlockingKey', x: 0, y: 180, w: 50, h: (50 / 100 * 56.6), minW: 33, minH: 20, maxW: 100, maxH: (75 / 100 * 56.6) },
    { i: 'coreUnBlockingKey', x: 50, y: 190, w: 50, h: (50 / 100 * 56.6), minW: 33, minH: 20, maxW: 100, maxH: (75 / 100 * 56.6) },
  ]
};


export default Trends;