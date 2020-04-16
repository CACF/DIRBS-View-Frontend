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
import {
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Label, Surface, Symbols, Legend
} from 'recharts';
import { Card, CardHeader, CardBody } from 'reactstrap';
import CardLoading from '../../Loaders/CardLoading';
import randomColor from "randomcolor";
import InfoModel from './../../Tooltips/InfoTooltip';
import { Scrollbars } from 'react-custom-scrollbars';
import { numberWithCommas } from '../../../utilities/helpers';
import domtoimage from 'dom-to-image';
import { CSVLink } from "react-csv";
/**
* Chart for Top Devices Importer
*/

class TwoLevelPiechart extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            infoTooltipState: false,
            infoButtonColor: '',
            firstGroup: []
        };
        this.toggleInfo = this.toggleInfo.bind(this);
        this.resize = this.resize.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        if (JSON.stringify(props.data.firstDataGroup) !== JSON.stringify(state.firstGroup)) {
            return {
                firstGroup: props.data.firstDataGroup
            }
        }
    }

    componentDidUpdate() {
        this.resize();
    }

    resize() {
        let pieElHeight = this.props.heightProp;
        this.setState({ pieElHeight });
    }

    filter = (node) => {
        return (node.tagName !== 'I');
    }

    generateImg = (event, title) => {
        let th = this;
        th.setState({ downloadImgLoading: true });
        let target = event.target;
        let downloadImgEl = target.parentElement.parentElement;

        domtoimage.toPng(downloadImgEl, { filter: this.filter }).then(function (blob) {
            if (blob != null) {
                window.saveAs(blob, title);
                th.setState({ downloadImgLoading: false });
            }
        })
    }

    toggleInfo() {
        this.setState(prevState => ({
            infoTooltipState: !prevState.infoTooltipState,
            infoButtonColor: !prevState.infoButtonColor ? "#00C5CD" : ''
        }));
    }

    scrollableLegend = (props) => {
        const { payload } = props
        return (
            <Scrollbars
                autoHeight
                autoHeightMax={47}
            >
                <ul className="recharts-default-legend">
                    {
                        payload.map((entry, index) => {
                            const { value, color } = entry
                            return (index < 3 &&
                                <li className="legend-item">
                                    <Surface width={10} height={10} viewbox="0 0 10 10">
                                        <Symbols cx={6} cy={6} type="rect" size={50} fill={color} />
                                    </Surface>
                                    <span>{value}</span>
                                </li>
                            );
                        })
                    }
                </ul>
            </Scrollbars>
        );
    }

    renderCustomizedLabel = (props) => {
        const { cx, cy, midAngle, innerRadius, outerRadius, percent, fill, startAngle, endAngle, value, name, index } = props;
        const { firstGroup } = this.state;
        let percentage = 0;
        let y;
        let x;
        const RADIAN = Math.PI / 180;
        const diffAngle = endAngle - startAngle;
        const delta = ((360 - diffAngle) / 30);
        const radius = innerRadius + (outerRadius - innerRadius);
        if (index < 5) {
            percentage = value / firstGroup[0].value * 100;
        }
        else if (index < 10 && index >= 5) {
            percentage = value / firstGroup[1].value * 100;
        }
        else if (index < 15 && index >= 10) {
            percentage = value / firstGroup[2].value * 100;
        }
        else {
            percentage = value / firstGroup[3].value * 100;
        }

        if ((midAngle >= 0 && midAngle <= 30) || (midAngle >= 330 && midAngle <= 360) || (midAngle >= 150 && midAngle <= 210)) {
            x = cx + (radius + delta * delta) * Math.cos(-midAngle * RADIAN);
            y = cy + (radius + delta + 300) * Math.sin(-midAngle * RADIAN);
        }
        else {
            x = cx + (radius + delta * delta * 0.2) * Math.cos(-midAngle * RADIAN);
            y = cy + (radius + delta * 11.5) * Math.sin(-midAngle * RADIAN);
        }
        return (
            (percent * 100).toFixed(2) > 1.00 ?
                <text x={x} y={y} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                    <tspan alignmentBaseline="middle" fontSize="18" fill={fill}>{percentage.toFixed(2)}%</tspan>
                    <tspan x={x} y={y + 15}>{name}</tspan>
                </text>
                :
                null
        );
    };

    renderCustomizedLabelLine(props) {
        let { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, percent } = props;
        const RADIAN = Math.PI / 180;
        const diffAngle = endAngle - startAngle;
        const radius = innerRadius + (outerRadius - innerRadius);
        let path = '';
        if ((midAngle >= 0 && midAngle <= 30) || (midAngle >= 330 && midAngle <= 360) || (midAngle >= 150 && midAngle <= 210)) {
            for (let i = 0; i < ((360 - diffAngle) / 30); i++) {
                path += `${(cx + (radius + i * i) * Math.cos(-midAngle * RADIAN))},${(cy + (radius + i * 27) * Math.sin(-midAngle * RADIAN))} `
            }
        }
        else {
            for (let i = 0; i < ((360 - diffAngle) / 30); i++) {
                path += `${(cx + (radius + i * i * 0.2) * Math.cos(-midAngle * RADIAN))},${(cy + (radius + i * 11.5) * Math.sin(-midAngle * RADIAN))} `
            }
        }

        return (
            (percent * 100).toFixed(2) > 1.00 &&
            <polyline points={path} stroke={"#800080"} fill="none" />
        );
    }

    render() {
        const { title, loading, data, value, showLegend, legendIconType, legendLayout, legendVerticalAlign, legendAlign, colorArray, dataToDownload, innerRadiusProp, paddingProp, chartMargin, info, cardClass, isShowHeader, isShowLable, removeChart, chartGridId, heightProp } = this.props;
        let toolTipId = "";
        if (info) {
            toolTipId = `infoTooltipPieChart_${info.Explanation.replace(/[^a-zA-Z0-9]/g, "")}`;
        }
        return (
            <Card className={`${cardClass} card-chart`}>
                {isShowHeader &&
                    <CardHeader className="border-bottom-0">
                        {title}
                        {info &&
                            <React.Fragment>
                                <CSVLink data={dataToDownload} filename={title + ".csv"}><i className="fa fa-file-excel-o"></i></CSVLink>
                                <i className={this.state.downloadImgLoading ? 'fa fa-circle-o-notch fa-spin fa-fw' : 'fa fa-cloud-download'} onClick={(e) => this.generateImg(e, title)}></i>
                                <i className="fa fa-trash-o" onClick={() => { removeChart(chartGridId) }}></i>
                                <i className="fa fa-info-circle" style={{ color: this.state.infoButtonColor }} id={toolTipId} aria-hidden="true" onClick={this.toggleInfo}>
                                    <InfoModel TooltipState={this.state.infoTooltipState} toggle={this.toggleInfo} chartInfo={info} id={toolTipId} />
                                </i>
                            </React.Fragment>
                        }
                    </CardHeader>
                }
                <CardBody className='steps-loading'>
                    {loading ? <CardLoading /> : null}
                    {((data.firstDataGroup || {}).length > 0) ?
                        <React.Fragment>
                            <ResponsiveContainer width='100%' height={heightProp}>
                                <PieChart className=""
                                    margin={chartMargin}
                                    label={true}
                                    width={700}
                                    height={700}
                                >
                                    <Tooltip contentStyle={{ borderRadius: '0.5rem', border: '#0093c9 1px solid', borderTopWidth: '4px', padding: '0' }} formatter={(value, name) => [numberWithCommas(value), name]} />
                                    <Label value="any" color="#fff" />
                                    {showLegend && <Legend
                                        content={this.scrollableLegend}
                                        iconType={legendIconType}
                                        layout={legendLayout}
                                        verticalAlign={legendVerticalAlign}
                                        align={legendAlign}
                                    />}
                                    <Pie dataKey={value} isAnimationActive={false} data={data.firstDataGroup} animationDuration={3000} outerRadius={106} innerRadius={70} fill="#8884d8" paddingAngle={paddingProp}>
                                        {
                                            data.firstDataGroup.map((entry, index) => <Cell key={index} />)
                                        }
                                    </Pie>
                                    <Pie dataKey={value} isAnimationActive={false} data={data.secondDataGroup} labelLine={isShowLable && this.renderCustomizedLabelLine} label={isShowLable && this.renderCustomizedLabel} animationDuration={3000} outerRadius={160} fill="#8884d8" innerRadius={innerRadiusProp} paddingAngle={paddingProp}>
                                        {
                                            data.secondDataGroup.map((entry, index) => <Cell key={index} />)
                                        }
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </React.Fragment>
                        : 'No Data Exists'}
                </CardBody>
            </Card>
        )
    }
}

TwoLevelPiechart.defaultProps = {
    chartMargin: { top: 20, right: 0, left: 0, bottom: 5, }, /* Changes margin of chart inside the card */
    legendIconType: 'triangle' /*  'line' | 'rect'| 'circle' | 'cross' | 'diamond' | 'square' | 'star' | 'triangle' | 'wye' | 'none' */,
    legendLayout: 'horizontal', /* 'verticle' */
    legendAlign: 'center', /* 'left', 'center', 'right' */
    legendVerticalAlign: 'bottom', /* 'top', 'middle', 'bottom' */
    colorArray: randomColor({ luminosity: 'bright', count: 100 }), /* luminosity: 'dark', 'light' */
    innerRadiusProp: 0, /* Integer */
    paddingProp: 0, /* Integer */
    showLegend: true, /* boolean to show or hide Legends */
    isShowHeader: true, /* boolean to show or hide card header */
    isShowLable: true /* boolean to show or hide PieChart Label */
}

export default TwoLevelPiechart;