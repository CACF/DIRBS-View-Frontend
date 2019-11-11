import React from 'react';
import { shallow, mount } from 'enzyme'
import sinon from 'sinon';
import Piechart from './Piechart'

describe('Pie chart Component', ()=> {

    it('check if component renders', ()=> {
        const wrapper = shallow(<Piechart/>)
        expect(wrapper.find('Card')).toHaveLength(1)
    })

    it('check if card has a header', ()=> {
        const wrapper = shallow(<Piechart/>)
        expect(wrapper.find('CardHeader')).toHaveLength(1)
    })

    it('check if toggle info is called', ()=> {
        const onClick = sinon.spy()
        const wrapper = shallow(<Piechart info={{Explanation:'abc'}} toggleInfo={onClick}/>)
        const clicked = wrapper.find('.fa-info-circle').simulate('click')
        expect(clicked).toHaveLength(1)
    })

    it('check state of Pie chart component', ()=> {
        const wrapper = shallow(<Piechart/>)
        wrapper.setState({ infoTooltipState: false })
        wrapper.setState({ infoButtonColor: '' })
        wrapper.setState({ downloadImgLoading: false })

        expect(wrapper.state().infoTooltipState).toBe(false)
        expect(wrapper.state().infoButtonColor).toEqual('')
        expect(wrapper.state().downloadImgLoading).toBe(false)
    })

    it('check if chart is generated', () => {
        const wrapper = shallow(<Piechart info={{Explanation:'abc'}} downloadImgLoading={true} data={["abc","abd", "xyz"]} yAxes={["abc","abd", "xyz"]} yAxesComposite={["abc","abd", "xyz"]} colorArray={["abc", "abd", "xyz"]}/>)
        expect(wrapper.find('PieChart')).toHaveLength(1)
    })

})

