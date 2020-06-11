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
import { getAuthHeader, instance, errors, getUserRole, getUserType, scrollOsetTopPlus, fixFilOsetHeightMinus } from "../../utilities/helpers";
import HeaderCards from '../../components/Cards/HeaderCards';
import moment from "moment";
import {Date_Format } from './../../utilities/constants';

class Dashboard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      fading: false,
      apiFetched: false,
      totalImies: '',
      totalDrsImies: '',
      totalPairedImies: '',
      totalStolenImies: '',
      totalDvsImies: '',
      totalBlocking: '',
      subSystem: 'core_range',
    }
    this.getGraphDataFromServer = this.getGraphDataFromServer.bind(this);
    this.updateTokenHOC = this.updateTokenHOC.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  //In componentDidMount hook we are maximizing sidebar on page load

  componentDidMount() {
    this.updateTokenHOC(this.getGraphDataFromServer);
    this.filtersSidebarDisplay();
  }

  // componentDidUpdate() {
  //   const paddDiv = document.getElementById('filterData');
  //   this.state.scroll > this.state.top ?
  //     paddDiv.style.paddingTop = `${this.state.height}px` :
  //     paddDiv.style.paddingTop = 0;
  // }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll() {
    this.setState({ scroll: window.scrollY });
  }

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

  // Next function are responsible for toggeling sidebar

  filtersSidebarDisplay = () => {
    document.body.classList.add('brand-minimized');
    document.body.classList.add('sidebar-minimized');
  }

  //Here we are getting parameters for get APi calls.

  getCallParamsGetMethods = () => {
    let searchQueryString = "";
    let type = getUserType(this.props.resources);
    let role = getUserRole(this.props.resources);
    searchQueryString = `?role=${role}&type=${type}&start_date=2018-01-01&end_date=${moment().format(Date_Format)}`
    return searchQueryString;
  }

  // In this method we call backend API's to get data deponding on specified search params.

  getGraphDataFromServer(config) {

    //Here API is being called to get Operator wise IMEIs. In response we are setting the state with the recieved data

    instance.get('/pta-core-01-total-imeis' + this.getCallParamsGetMethods(), config).then(response => this.setState({ totalImies: response.data["Total-Core-IMEIs"] }));
    instance.get('/pta-drs-01-total-imeis', config).then(response => this.setState({ totalDrsImies: response.data["Total-DRS-IMEIs"] }));
    instance.get('/pta-dps-01-total-imeis', config).then(response => this.setState({ totalPairedImies: response.data["Total-DPS-IMEIs"] }));
    instance.get('/pta-stolen-01-total-imeis', config).then(response => this.setState({ totalStolenImies: response.data["Total-Stolen-IMEIs"] }));
    instance.get('/pta-dvs-01-total-imeis', config).then(response => this.setState({ totalDvsImies: response.data["Total-DVS-IMEIs"] }));
    instance.get('/pta-core-08-total-blocked-imeis' + this.getCallParamsGetMethods(), config).then(response => this.setState({ totalBlocking: response.data["Total-Blocked-IMEIs"] }));

    var resizeEvent = window.document.createEvent('UIEvents');
    resizeEvent.initUIEvent('resize', true, false, window, 0);
    window.dispatchEvent(resizeEvent);

  }

  render() {
    const { apiFetched, totalDrsImies, totalPairedImies, totalStolenImies, totalDvsImies, totalBlocking, totalImies } = this.state;
    return (
      <Container fluid>
        <div className="search-box animated fadeIn">
            <article className="overview">
            <div className="last-updated"><span>Last Updated: </span>{moment().subtract(1 , 'day').format(Date_Format)}</div>
              <Row className="dashboard-rows">
                <Col xl={2} lg={3} md={4} sm={6}><HeaderCards backgroundColor="#0B6EDE" cardTitle="Total Core IMEIs" cardText={totalImies} /></Col>
                <Col xl={2} lg={3} md={4} sm={6}><HeaderCards backgroundColor="#0BD49C" cardTitle="Total DRS IMEIs" cardText={totalDrsImies} /></Col>
                <Col xl={2} lg={3} md={4} sm={6}><HeaderCards backgroundColor="#0BDDDE" cardTitle="Total Paired IMEIs" cardText={totalPairedImies} /></Col>
              </Row>
              <Row className="dashboard-boxes">
                <Col xl={2} lg={3} md={4} sm={6}><HeaderCards backgroundColor="#F07C7C" cardTitle="Total Stolen" cardText={totalStolenImies} /></Col>
                <Col xl={2} lg={3} md={4} sm={6}><HeaderCards backgroundColor="#a3c592" cardTitle="Total DVS Searches" cardText={totalDvsImies} /></Col>
                <Col xl={2} lg={3} md={4} sm={6}><HeaderCards backgroundColor="#F07C7C" cardTitle="Total Blocking" cardText={totalBlocking } /></Col>
              </Row>
            </article>
        </div>
      </Container>
    )
  }
}

Dashboard.defaultProps = {
  className: "layout",
};


export default Dashboard;