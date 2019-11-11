import React from 'react';
import { shallow } from 'enzyme'
import ScrollableLegend from './scrollableLegend'

describe('Scrollable Legend component', ()=> {

    it('check if component renders', ()=> {
        const wrapper = shallow(<ScrollableLegend/>)
        expect(wrapper.find('Scrollbars')).toHaveLength(1)
    })

    it('check if it renders default legend content', ()=> {
        const wrapper = shallow(<ScrollableLegend/>)
        expect(wrapper.find('Legend')).toHaveLength(1)
    })
})