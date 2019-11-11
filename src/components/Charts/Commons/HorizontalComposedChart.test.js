import React from 'react';
import { shallow, mount } from 'enzyme'
import sinon from 'sinon';
import HorizontalComposedChart from './HorizontalComposedChart'

describe('Horizontal Composed Bar Chart Component', ()=> {

    it('check if component renders', ()=> {
        const wrapper = shallow(<HorizontalComposedChart/>)
        expect(wrapper.find('Card')).toHaveLength(1)
    })

    it('check if card has a header', ()=> {
        const wrapper = shallow(<HorizontalComposedChart/>)
        expect(wrapper.find('CardHeader')).toHaveLength(1)
    })

    it('check state of Horizontal Composed Bar chart component', ()=> {
        const wrapper = shallow(<HorizontalComposedChart/>)
        wrapper.setState({ infoTooltipState: false })
        wrapper.setState({ infoButtonColor: '' })
        wrapper.setState({ downloadImgLoading: false })

        expect(wrapper.state().infoTooltipState).toBe(false)
        expect(wrapper.state().infoButtonColor).toEqual('')
        expect(wrapper.state().downloadImgLoading).toBe(false)
    })

    it('check for Horizontal Composed Bar chart props', ()=> {
        const wrapper = mount(<HorizontalComposedChart title= 'someTitle' loading={true} data={['somedata']} yAxes={["", ""]} yAxesComposite={["abc","abd", "xyz"]} colorArray={["abc", "abd", "xyz"]}/>)
        
        expect(wrapper.props().title).toEqual('someTitle')
        expect(wrapper.props().loading).toBe(true)
        expect(wrapper.props().data).toEqual(['somedata'])
        expect(wrapper.props().yAxes).toEqual(['', ''])
    })

    it('check if chart is generated', () => {
        const wrapper = shallow(<HorizontalComposedChart info={{Explanation:'abc'}} downloadImgLoading={true} data={["abc","abd", "xyz"]} yAxes={["abc","abd", "xyz"]} yAxesComposite={["abc","abd", "xyz"]} colorArray={["abc", "abd", "xyz"]}/>)
        expect(wrapper.find('ComposedChart')).toHaveLength(1)
    })

})

