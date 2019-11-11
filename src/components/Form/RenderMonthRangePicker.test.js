import React from 'react';
import { shallow, mount } from 'enzyme'
import sinon from 'sinon'
import RenderMonthRangePicker from './RenderMonthRangePicker'

describe('Render Month Range Picker Component', ()=>{
    it('check if component renders', ()=>{
        const onClick = sinon.spy()
        const wrapper = shallow(<RenderMonthRangePicker onChange={onClick} onBlur={onClick}/>)
        expect(wrapper.find('div')).toHaveLength(1)
    })

    it("check state of component", ()=>{
        const onClick = sinon.spy()
        const wrapper = shallow(<RenderMonthRangePicker startDate="123" endDate="123" selectsEnd={null} isRange={true} isDaily={true} onChange={onClick} onBlur={onClick}/>)
        wrapper.setState({ startDate: "123" })
        wrapper.setState({ endDate: "123" })
        wrapper.setState({ selectsEnd: "123" })
        wrapper.setState({ isRange: true })
        wrapper.setState({ isDaily: true })

        expect(wrapper.state().startDate).toEqual("123")
        expect(wrapper.state().endDate).toEqual("123")
        expect(wrapper.state().selectsEnd).toEqual("123")
        expect(wrapper.state().isRange).toEqual(true)
        expect(wrapper.state().isDaily).toEqual(true)
    })

    it("check props of component", ()=>{
        const onClick = sinon.spy()
        const wrapper = mount(<RenderMonthRangePicker startDate="123" endDate="123" selectsEnd={null} isRangerPicker={true} isDaily={true} onChange={onClick} onBlur={onClick}/>)
        expect(wrapper.props().isRangerPicker).toEqual(true)
    })
})