import React from 'react';
import { shallow, mount } from 'enzyme'
import ComposedCharts from './ComposedChart'

describe('Composed Chart Component', ()=> {

    it('check if component renders', ()=> {
        const wrapper = shallow(<ComposedCharts/>)
        expect(wrapper.find('Card')).toHaveLength(1)
    })

    it('check if card has a header', ()=> {
        const wrapper = shallow(<ComposedCharts/>)
        expect(wrapper.find('CardHeader')).toHaveLength(1)
    })

    it('check state of Composed chart component', ()=> {
        const wrapper = shallow(<ComposedCharts/>)
        wrapper.setState({ infoTooltipState: false })
        wrapper.setState({ infoButtonColor: '' })
        wrapper.setState({ downloadImgLoading: false })

        expect(wrapper.state().infoTooltipState).toBe(false)
        expect(wrapper.state().infoButtonColor).toEqual('')
        expect(wrapper.state().downloadImgLoading).toBe(false)
    })

    it('check for Composed chart props', ()=> {
        const wrapper = mount(<ComposedCharts title= 'someTitle' loading={true} data={['somedata']} yAxesComposite={["", ""]}  yAxes={["", ""]} colorArray={["abc", "abd", "xyz"]}/>)
        
        expect(wrapper.props().title).toEqual('someTitle')
        expect(wrapper.props().loading).toBe(true)
        expect(wrapper.props().data).toEqual(['somedata'])
        expect(wrapper.props().yAxes).toEqual(['', ''])
    })

    it('check if chart is generated', () => {
        const wrapper = shallow(<ComposedCharts info={{Explanation:'abc'}} downloadImgLoading={true} data={["abc","abd", "xyz"]}  yAxes={["", ""]} yAxesComposite={["abc","abd", "xyz"]} colorArray={["abc", "abd", "xyz"]}/>)
        expect(wrapper.find('ComposedChart')).toHaveLength(1)
    })

})