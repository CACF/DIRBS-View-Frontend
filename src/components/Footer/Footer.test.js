import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import Footer from './Footer';

describe("Footer Component", ()=> {
    
    it("check if component renders", ()=> {
        const wrapper = shallow(<Footer />)
        expect(wrapper.find('footer')).toHaveLength(1)
    })
    
    it("check if body have two divs", ()=> {
        const wrapper = shallow(<Footer/>)
        expect(wrapper.find("div")).toHaveLength(2)
    })
})