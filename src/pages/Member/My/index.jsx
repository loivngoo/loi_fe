import { faBuildingColumns, faChevronRight, faMoneyBill, faWallet } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { faCopy } from '@fortawesome/free-regular-svg-icons';
import tiki from '@src/assets/images/2.png';
import Header from '@src/components/Header';
import AppUsers from '@src/services/AppUsers';
import { message } from 'antd';
import './My.scss';
import convert from '../../../helpers/convert';
import ModalSupport from './components/ModalSupport';
function My() {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({});
    const [settings, setSettings] = useState({});
    const [showModal, setShowModal] = useState(false);

    const Copy = (text) => {
        message.success('Sao chép thành công');
        navigator.clipboard.writeText(text);
    };

    const GetUserInfo = async () => {
        return await AppUsers.GetUserInfo();
    };

    const GetSettings = async () => {
        return await AppUsers.GetSettings();
    };

    const handleShowModalSupport = () => {
        setShowModal(true);
    };

    useEffect(() => {
        GetUserInfo().then((data) => setUserInfo(data));
        GetSettings().then((data) => setSettings(data));
    }, []);

    return (
        <div className="page-my pb-16">
            <Header title="Trung tâm cá nhân" />

            <div className="top pt-[46px]">
                <div className="flex p-4">
                    <div>
                        <img width="80" height="80" src={tiki} alt="" />
                    </div>
                    <div className="text-white text-sm font-medium pl-3">
                        <p className="text-overflow-name">{userInfo?.name_store}</p>
                        <p className="text-overflow-name">Tài khoản: {userInfo?.username}</p>
                        <p>Hội viên: Thành viên trung tâm thương mại</p>
                        <p
                            className="flex items-center cursor-pointer select-none"
                            onClick={() => Copy(userInfo?.invite)}
                        >
                            Mã mời: {userInfo?.invite}
                            <FontAwesomeIcon className="ml-1.5" icon={faCopy} />
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3 py-3">
                <div className="flex flex-col justify-center items-center">
                    <div className="bg-[#ebedf0] rounded-xl p-4">
                        <FontAwesomeIcon icon={faMoneyBill} />
                    </div>
                    <span className="font-medium text-[#646566] text-sm mt-1">
                        {convert.toVND(userInfo?.money) || 0}
                    </span>
                </div>
                <div onClick={() => navigate('/recharge')} className="flex flex-col justify-center items-center">
                    <div className="bg-[#ebedf0] rounded-xl p-4">
                        <FontAwesomeIcon icon={faWallet} />
                    </div>
                    <span className="font-medium text-[#646566] text-sm mt-1">Nạp tiền</span>
                </div>
                <div onClick={() => navigate('/withdraw')} className="flex flex-col justify-center items-center">
                    <div className="bg-[#ebedf0] rounded-xl p-4">
                        <FontAwesomeIcon icon={faBuildingColumns} />
                    </div>
                    <span className="font-medium text-[#646566] text-sm mt-1">Rút tiền</span>
                </div>
            </div>

            <div className="space"></div>

            <div className="list-action select-none">
                <div onClick={() => navigate('/card')} className="item-action">
                    <span>Liên kết thẻ ngân hàng</span>
                    <FontAwesomeIcon className="text-[#969799]" icon={faChevronRight} />
                </div>
                <div onClick={() => navigate('/wallet-usdt')} className="item-action">
                    <span>Địa chỉ USDT ràng buộc</span>
                    <FontAwesomeIcon className="text-[#969799]" icon={faChevronRight} />
                </div>
                <div onClick={() => navigate('/buy-history')} className="item-action">
                    <span>Lịch sử mua hàng</span>
                    <FontAwesomeIcon className="text-[#969799]" icon={faChevronRight} />
                </div>
                <div onClick={() => navigate('/withdraw-record')} className="item-action">
                    <span>Lịch sử rút tiền</span>
                    <FontAwesomeIcon className="text-[#969799]" icon={faChevronRight} />
                </div>
                <div onClick={() => navigate('/recharge-record')} className="item-action">
                    <span>Lịch sử nạp tiền</span>
                    <FontAwesomeIcon className="text-[#969799]" icon={faChevronRight} />
                </div>
                <div onClick={() => handleShowModalSupport()} className="item-action">
                    <span>Dịch vụ trực tuyến</span>
                    <FontAwesomeIcon className="text-[#969799]" icon={faChevronRight} />
                </div>
            </div>

            <div
                className="btn-logout rounded-full p-3 text-center select-none"
                onClick={() => {
                    localStorage.removeItem('token');
                    navigate('/login');
                }}
            >
                <span>Đăng xuất</span>
            </div>

            {showModal && <ModalSupport open={showModal} setModal={setShowModal} />}
        </div>
    );
}

export default My;
