import React from 'react';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon'
import ComplianceBreakdownTable from './ComplianceBreakdownTable'

describe("Compliance Breakdown Table", ()=> {

    it('check if component renders', ()=> {
        const wrapper = shallow(<ComplianceBreakdownTable rows={["abc", "xyz"]} headings={["abc", "xyz"]}/>)
        expect(wrapper.find('Card')).toHaveLength(1)
    })

    it('check if component renders card header', ()=> {
        const wrapper = shallow(<ComplianceBreakdownTable rows={["abc", "xyz"]} headings={["abc", "xyz"]}/>)
        expect(wrapper.find('CardHeader')).toHaveLength(1)
    })

    it("check if table is rendered", ()=> {
        const wrapper = mount(<ComplianceBreakdownTable rows={["abc", "xyz"]} headings={["abc", "xyz"]}/>)
        const instance = wrapper.instance()
        console.log(wrapper.props())
        expect(wrapper.find('tbody')).toHaveLength(1)
    })

    it('check if toggle info is called', ()=> {
        const onClick = sinon.spy()
        const wrapper = shallow(<ComplianceBreakdownTable info={{Explanation:'abc'}} toggleInfo={onClick} rows={["abc", "xyz"]} headings={["abc", "xyz"]}/>)
        const clicked = wrapper.find('.fa-info-circle').simulate('click')
        expect(clicked).toHaveLength(1)
    })

})