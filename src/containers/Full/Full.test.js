import React from 'react'
import { shallow } from 'enzyme';
import sinon from 'sinon'
import Full from './Full'

describe('<Full Component/>', () => {
    
    it('renders main div', ()=> {
        const wrapper = shallow(<Full/>)
        expect(wrapper.find(".app")).toHaveLength(1)
    });

    it('displays header component', ()=> {
        const wrapper = shallow(<Full/>)
        expect(wrapper.find('Header')).toHaveLength(1);
    })

    it('render main body div', ()=> {
        const wrapper = shallow(<Full/>)
        expect(wrapper.find(".app-body")).toHaveLength(1);
    })

    it('check if breadcrumb state is true by default', ()=> {
        const wrapper = shallow(<Full/>)
        expect(wrapper.state().breadcrumbOnOff).toEqual(true)
    })

    it('check if breadcrumbSwitch function disables breadcrumb', () => {
        const onClick = sinon.spy
        const wrapper = shallow(<Full breadcrumbSwitch={() => onClick("On")}/>)
        wrapper.setState({breadcrumbOnOff: false})
        expect(wrapper.state().breadcrumbOnOff).toEqual(false)

    })
})