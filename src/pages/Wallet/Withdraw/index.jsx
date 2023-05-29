import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

import AppUsers from '@src/services/AppUsers';
import SelectType from './SelectType';
import WithdrawBank from './WithdrawBank';
import WithdrawUSDT from './WithdrawUSDT';
import { useState, useEffect } from 'react';
// import './Recharge.scss';

function Withdraw() {
    let navigate = useNavigate();
    const [type, setType] = useState(1);
    const [cardInfo, setCardInfo] = useState({
        full_name: '',
        name_bank: '',
        number_bank: '',
        wallet_usdt: '',
    });

    const GetBankCard = async () => {
        return await AppUsers.GetBankCard()
    }

    useEffect(() => {
        GetBankCard().then(data => {
            if (data) setCardInfo(data);
        });
    }, []);

    return (
        <div className='page-recharge-history'>
            <div className="select-none">
                <div className="header bg-white">
                    <div className="cursor-pointer navbar-left" onClick={() => {
                        if (type === 1) return navigate(-1);
                        setType(1);
                    }}>
                        <FontAwesomeIcon className='text-[#1989fa] px-3 text-sm' icon={faChevronLeft} />
                    </div>
                    <div className="cursor-pointer navbar-title">{type === 1 ? "Chọn phương thức rút tiền" : type === 2 ? "Rút bằng ngân hàng" : "Rút bằng USDT"}</div>
                </div>
            </div>
            <div className='pt-[46px]'>
                {type === 1 && <SelectType setType={setType} cardInfo={cardInfo} />}
                {type === 2 && <WithdrawBank />}
                {type === 3 && <WithdrawUSDT />}
            </div>
        </div>
    );
}

export default Withdraw;