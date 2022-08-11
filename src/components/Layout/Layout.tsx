import {FC, ReactNode} from 'react';
import Navbar from '../Navbar/Navbar';

interface LayoutProps {
    children: ReactNode;
}

const Layout: FC<LayoutProps> = ({children}) => (
    <div>
        <Navbar/>
        <div className="mr-7 ml-5">
            {children}
        </div>
    </div>
);

export default Layout;