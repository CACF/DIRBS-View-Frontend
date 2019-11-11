import React from 'react';
import { shallow, mount } from 'enzyme'
import HeaderCards from './HeaderCards'

describe('Header Cards Component', ()=> {

    it('check if component renders', ()=> {
        const wrapper = shallow(<HeaderCards/>)
        expect(wrapper.find('Card')).toHaveLength(1)
    })

    it('check if card has a title', ()=> {
        const wrapper = mount(<HeaderCards cardTitle="someTitle"/>)
        const cardTitle = wrapper.props()
        expect(cardTitle).toEqual({"cardTitle":'someTitle'})
    })

    it('check if card has a text', ()=> {
        const wrapper = mount(<HeaderCards cardText="someText"/>)
        const cardTitle = wrapper.props()
        expect(cardTitle).toEqual({"cardText":'someText'})
    })
})