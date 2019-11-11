import React from 'react';
import { shallow, mount } from 'enzyme'
import RenderError from './RenderError'

describe("Check render error component", ()=>{

    it("check if component renders",()=>{
        const wrapper = shallow(<RenderError form={{ touched:"", errors:"" }} field={{ name:"" }}/>)
        expect(wrapper.find(".field-help")).toHaveLength(1)
    })
})