import React from 'react';
import { shallow, mount } from 'enzyme'
import sinon from 'sinon';
import HorizontalBarChart from './HorizontalBarChart'

describe('Horizontal Bar Chart Component', ()=> {

    it('check if component renders', ()=> {
        const wrapper = shallow(<HorizontalBarChart/>)
        expect(wrapper.find('Card')).toHaveLength(1)
    })

    it('check if card has a header', ()=> {
        const wrapper = shallow(<HorizontalBarChart/>)
        expect(wrapper.find('CardHeader')).toHaveLength(1)
    })

    it('check state of Horizontal Bar chart component', ()=> {
        const wrapper = shallow(<HorizontalBarChart/>)
        wrapper.setState({ infoTooltipState: false })
        wrapper.setState({ infoButtonColor: '' })
        wrapper.setState({ downloadImgLoading: false })

        expect(wrapper.state().infoTooltipState).toBe(false)
        expect(wrapper.state().infoButtonColor).toEqual('')
        expect(wrapper.state().downloadImgLoading).toBe(false)
    })

    it('check for Horizontal Bar chart props', ()=> {
        const wrapper = mount(<HorizontalBarChart title= 'someTitle' loading={true} data={['somedata']} yAxes={["", ""]} colorArray={["abc", "abd", "xyz"]}/>)
        
        expect(wrapper.props().title).toEqual('someTitle')
        expect(wrapper.props().loading).toBe(true)
        expect(wrapper.props().data).toEqual(['somedata'])
        expect(wrapper.props().yAxes).toEqual(['', ''])
    })

    it('check if toggle info is called', ()=> {
        const onClick = sinon.spy()
        const wrapper = shallow(<HorizontalBarChart info={{Explanation:'abc'}} toggleInfo={onClick}/>)
        const clicked = wrapper.find('.fa-info-circle').simulate('click')
        expect(clicked).toHaveLength(1)
    })

    it('check if chart is generated', () => {
        const wrapper = shallow(<HorizontalBarChart info={{Explanation:'abc'}} downloadImgLoading={true} data={["abc","abd", "xyz"]} yAxes={["abc","abd", "xyz"]} colorArray={["abc", "abd", "xyz"]}/>)
        expect(wrapper.find('BarChart')).toHaveLength(1)
    })

})

