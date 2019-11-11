import React from 'react';
import { shallow, mount } from 'enzyme'
import SearchFilters from './SearchFilters'

describe("Search Filters component", ()=>{
    it("check if component renders", ()=> {
        const wrapper = shallow(<SearchFilters filters={{ granularity:"sdffzzqqccvvv" }}/>)
        expect(wrapper.find(".selected-filters")).toHaveLength(1)
    })

    it("check if it has granularity", ()=>{
        const wrapper = shallow(<SearchFilters filters={{ granularity:"sdffzzqqccvvv" }} />)
        expect(wrapper.props().filters.granularity).toEqual("sdffzzqqccvvv")
    })

    it("check if it has trend month", ()=>{
        const wrapper = shallow(<SearchFilters filters={{ start_date:"xyz" }}/>)
        expect(wrapper.props().filters.start_date).toEqual("xyz")
    })

    it("check if it has trend mno", ()=>{
        const wrapper = shallow(<SearchFilters filters={{ mno:"xyz" }}/>)
        expect(wrapper.props().filters.mno).toEqual("xyz")
    })
})