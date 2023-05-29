import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { message } from 'antd';

import AppUsers from '@src/services/AppUsers';
import Navbar from '../Navbar';

function DefaultLayout({ children }) {
    let props = children.props;

    const navigate = useNavigate();

    const IsLogin = async () => {
        const res = await AppUsers.Status();
        if (res.status !== 1) {
            message.error(res.message);
            setTimeout(() => {
                navigate('/login');
            }, 1000);
        }
    }

    useEffect(() => {
        // document.title = props.title;
        window.scrollTo({ top: 0 }); // , behavior: 'smooth'
        if (!props.isLogin) IsLogin();

        return () => {
            IsLogin();
        }
    }, [children.props.link]);
    return (
        <div className="App bg-white">
            {children}
            {props.layout && <Navbar link={props.link} />}
        </div>
    );
}

export default DefaultLayout;
