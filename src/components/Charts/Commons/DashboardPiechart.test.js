import React from 'react';
import { shallow, mount } from 'enzyme'
import DashboardPiechart from './DashboardPiechart'

describe('Dashboard Pie chart Component', ()=> {

    it('check if component renders', ()=> {
        const wrapper = shallow(<DashboardPiechart/>)
        expect(wrapper.find('.pie-box')).toHaveLength(1)
    })

    it('check if chart has a responsive container', ()=> {
        const wrapper = shallow(<DashboardPiechart data={["abc", "abd", "xyz"]}/>)
        expect(wrapper.find('ResponsiveContainer')).toHaveLength(1)
    })

    it('check state of dashboad pie chart component', ()=> {
        const wrapper = shallow(<DashboardPiechart/>)
        wrapper.setState({ pieElHeight: false })

        expect(wrapper.state().pieElHeight).toBe(false)
    })

    it('check for Composed chart props', ()=> {
        const wrapper = mount(<DashboardPiechart title= 'someTitle' loading={true} data={['somedata']} />)
        
        expect(wrapper.props().title).toEqual('someTitle')
        expect(wrapper.props().loading).toBe(true)
        expect(wrapper.props().data).toEqual(['somedata'])
    })

    it('check if chart is generated', () => {
        const wrapper = shallow(<DashboardPiechart info={{Explanation:'abc'}} downloadImgLoading={true} data={["abc","abd", "xyz"]}  yAxes={["", ""]} yAxesComposite={["abc","abd", "xyz"]} colorArray={["abc", "abd", "xyz"]}/>)
        expect(wrapper.find('PieChart')).toHaveLength(1)
    })

})