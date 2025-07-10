import Cookies from 'js-cookie';
import { useEffect, useState} from 'react';
import { isExpired, decodeToken } from 'react-jwt';
import { useAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { CookieName, ErrorMessage, } from '../utils/pageUtils';
import { PROFILE } from '../services/store';
import { Apis, AuthGetApi } from '../services/API';
import Loader from '../components/Loader';


interface DecodedToken {
    role?: 'student' | 'lecturer' | 'admin';
    [key: string]: any;
}

const AuthGuard: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [, setProfile] = useAtom(PROFILE);
    const [loading, setLoading] = useState(true);
    const [login, setLogin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
    const ValidateEntrance = async () => {
        try {
            const token = Cookies.get(CookieName);

            if (!token || isExpired(token)) {
                ErrorMessage('Session expired. Please log in again.');
                return navigate('/login');
            }
            const decoded: any = decodeToken<DecodedToken>(token);

            // Make sure token was successfully decoded and contains a valid role
            if (!decoded || !['student', 'lecturer', 'admin'].includes(decoded.role)) {
                return navigate('/login');
            }

            const id = decoded.id; 
            const response = await AuthGetApi(`${Apis.auth.fetch_user}/${id}`);
            
            if (response.status === 200) {
                setProfile(response.data);
                setLogin(true);
            } else {
                ErrorMessage('Authentication failed. Please log in again.');
                Cookies.remove(CookieName);
                navigate('/login');
            }
        } catch (error: any) {
            ErrorMessage(error.message || 'Authentication failed');
            navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    ValidateEntrance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);


    if (loading) return <Loader />;
    if (login) return <>{children}</>;
    return null;
};

export default AuthGuard;
