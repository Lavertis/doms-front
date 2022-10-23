import {FC, ReactNode} from 'react';
import Navbar from '../Navbar/Navbar';

interface LayoutProps {
    children: ReactNode;
}

const Layout: FC<LayoutProps> = ({children}) => (
    <div className="flex flex-column bg-indigo-50" style={{minHeight: '100vh'}}>
        <Navbar/>
        <div>
            {children}
        </div>
    </div>
);

export default Layout;