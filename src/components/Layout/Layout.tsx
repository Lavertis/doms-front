import {FC, ReactNode} from 'react';
import Navbar from './Navbar/Navbar';
import Chat from "../Chat/Chat";
import UserStore from "../../store/user-store";
import {observer} from "mobx-react-lite";

interface LayoutProps {
    children: ReactNode;
}

const Layout: FC<LayoutProps> = ({children}) => {


    return (
        <div className="flex flex-column bg-indigo-50" style={{minHeight: '100vh'}}>
            <Navbar/>
            <div>
                {children}
            </div>
            <div
                style={{
                    zIndex: 1
                }}
            >
                {UserStore.isLoggedIn ? <Chat/> : <></>}
            </div>
        </div>
    );
}

export default observer(Layout);