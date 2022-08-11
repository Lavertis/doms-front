import {FC, useContext} from 'react';
import {TokenContext} from '../../App';
import {Outlet, useLocation} from 'react-router-dom';
import {getRoleFromToken} from '../../utils/jwt-utils';
import Forbidden403 from '../Errors/Forbidden403';
import Login from '../../pages/Auth/Login';

interface ProtectedRouteProps {
    allowedRoles: string[];
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({allowedRoles}) => {
    const {token} = useContext(TokenContext);
    const location = useLocation();

    if (!token)
        return <Login redirectTo={location.pathname}/>;

    const role = getRoleFromToken(token);
    return (
        allowedRoles.includes(role!) ?
            <Outlet/> :
            <Forbidden403/>
    );
};

export default ProtectedRoute;