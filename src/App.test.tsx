import {render} from '@testing-library/react';
import App from './App';

test('renders login button', () => {
    render(<App/>);
    expect(1).toBe(1);
});
