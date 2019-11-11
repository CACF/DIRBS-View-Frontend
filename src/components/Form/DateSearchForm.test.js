import React from 'react'
import { shallow, mount } from 'enzyme'
import sinon from 'sinon'
import DateSearchForm from './DateSearchForm'

describe('Date Search Form', ()=> {

    it("check if component renders", ()=> {
        const wrapper = shallow(<DateSearchForm/>)
        expect(wrapper.find('Formik')).toHaveLength(1)
    })

    it("check states of the component", ()=> {
        const wrapper = shallow(<DateSearchForm displayOptions={[]} granularity="monthly" disabled={true} submitButton='Explore'/>)
        expect(wrapper.props().granularity).toEqual('monthly')
        expect(wrapper.props().displayOptions).toEqual([])
        expect(wrapper.props().disabled).toBe(true)
        expect(wrapper.props().submitButton).toEqual('Explore')
    })

    it("checks if form fields render correctly", ()=> {
        const wrapper = mount(<DateSearchForm displayOptions={[]} granularity="monthly" disabled={true} submitButton='Explore'/>)
        const form = wrapper.find('Form')
        const fields = form.find("FieldInner")
        expect(fields.length).toEqual(5)
    })

    it('check if submit button is clicked', ()=> {
        const wrapper = mount(<DateSearchForm displayOptions={[]} granularity="monthly" disabled={true} submitButton='Explore'/>)
        const form = wrapper.find('Form')
        expect(form.find('button')).toHaveLength(1)
    })
})