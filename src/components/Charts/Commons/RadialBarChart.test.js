import React from 'react';
import { shallow } from 'enzyme'
import RadialBarChart from './RadialBarChart'

describe('Radial Bar Chart Component', ()=> {

    it('check if component renders', ()=> {
        const wrapper = shallow(<RadialBarChart/>)
        expect(wrapper.find('.pie-box')).toHaveLength(1)
    })

    it('check if card has a header', ()=> {
        const wrapper = shallow(<RadialBarChart data={["abc", "xyz"]}/>)
        expect(wrapper.find('ResponsiveContainer')).toHaveLength(1)
    })

    it('check state of Pie chart component', ()=> {
        const wrapper = shallow(<RadialBarChart/>)
        wrapper.setState({ pieElHeight: false })

        expect(wrapper.state().pieElHeight).toBe(false)
    })

    it('check if chart is generated', () => {
        const wrapper = shallow(<RadialBarChart info={{Explanation:'abc'}} downloadImgLoading={true} data={["abc","abd", "xyz"]} yAxes={["abc","abd", "xyz"]} yAxesComposite={["abc","abd", "xyz"]} colorArray={["abc", "abd", "xyz"]}/>)
        expect(wrapper.find('RadialBarChart')).toHaveLength(1)
    })

})

