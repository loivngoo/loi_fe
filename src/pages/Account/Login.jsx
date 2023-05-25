import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faMobilePhone } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { message } from 'antd';
import Joi from 'joi';
import { v4 as uuidv4 } from 'uuid';

import AppUsers from '@src/services/AppUsers';
import './Account.scss';
import ModalSupport from './components/ModalSupport';

function Login() {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        phone: '',
        password_v1: '',
    });

    const schema = Joi.object({
        phone: Joi.string().min(9).max(20).required(),
        password_v1: Joi.string().required(),
    });

    const handleLogin = async () => {
        const { error } = schema.validate(formData);
        if (error) return message.error('Vui lòng nhập đầy đủ thông tin');

        const res = await AppUsers.Login(formData);
        if (res.status === 2) return message.error(res.message);
        if (res.status === 1) {
            message.success(res.message);
            localStorage.setItem('token', res.token);
            localStorage.setItem('user', JSON.stringify(res.user));
            setFormData({
                phone: '',
                password_v1: '',
            });
            setTimeout(() => {
                navigate('/');
            }, 1000);
        }
    };

    const handleShowModalSupport = () => {
        const user_id = sessionStorage.getItem('user_id');
        if (user_id) return setShowModal(true);
        sessionStorage.setItem('user_id', uuidv4());
        setShowModal(true);
    };

    return (
        <div className="page-login">
            <div className="bg-top"></div>
            <div className="bg-xia"></div>
            <div className="title">
                <div className="text-center"> Đăng nhập </div>
                <div className="desc"> User Login </div>
            </div>
            <div className="main">
                <div className="form">
                    <div className="van-cell van-cell--center van-field">
                        <FontAwesomeIcon className="text-lg text-[#666666]" icon={faMobilePhone} />
                        <input
                            type="number"
                            className="w-full outline-none pl-3"
                            placeholder="Số điện thoại"
                            value={formData.phone}
                            onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value.trim() }))}
                            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                        />
                    </div>
                    <div className="van-cell van-cell--center van-field">
                        <FontAwesomeIcon className="text-lg text-[#666666]" icon={faLock} />
                        <input
                            type="password"
                            className="w-full outline-none pl-3"
                            placeholder="Mật khẩu mở khóa"
                            value={formData.password_v1}
                            onChange={(e) => setFormData((prev) => ({ ...prev, password_v1: e.target.value.trim() }))}
                            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                        />
                    </div>

                    <div className="flex justify-between px-3 text-[#003366] font-medium text-sm">
                        <p onClick={() => navigate('/register')} className="text-left cursor-pointer">
                            Đăng kí
                        </p>
                        <p className="text-right cursor-pointer" onClick={handleShowModalSupport}>
                            Liên hệ với dịch vụ khách hàng
                        </p>
                    </div>

                    <div
                        onClick={() => handleLogin()}
                        className="bg-[#1989fa] p-3 rounded-full text-center mt-6 border-[1px] border-[#2196f3]"
                    >
                        <span className="text-white text-sm">Đăng nhập</span>
                    </div>
                    {showModal && <ModalSupport open={showModal} setModal={setShowModal} />}
                </div>
            </div>
        </div>
    );
}

export default Login;
