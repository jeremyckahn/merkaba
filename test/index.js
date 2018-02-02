import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import './components/merkaba';
import './components/toolbar';
import './components/workspace';
import './components/details';
import './components/merkaba.event-handlers';

Enzyme.configure({ adapter: new Adapter() });
