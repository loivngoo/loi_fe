import { useState } from 'react';
import { message } from 'antd';

import AppUsers from '@src/services/AppUsers';

function RechargeBank({ setInfoRecharge }) {
    const [amount, setAmount] = useState({ amount: 50000 });

    const GetRechargeInfo = async () => {
        return await AppUsers.GetRechargeInfo();
    };

    const handleRecharge = async () => {
        const res = await AppUsers.NewRecharge(amount);

        if (res.status === 2) return message.error(res.message);
        if (res.status === 1) {
            const recharge = await GetRechargeInfo();
            if (recharge.status === 1) setInfoRecharge(recharge.data);
            return message.success(res.message);
        }
    };

    return (
        <>
            <div className="flex justify-between items-center p-3 border-b-[1px] border-[#ebedf0]">
                <span className="text-[#323233] text-sm font-semibold">Kiểu tài khoản</span>
                <span className="text-[#969799] text-sm">Tài khoản trung tâm mua sắm</span>
            </div>
            <div className="flex justify-between items-center p-3 border-b-[1px] border-[#ebedf0]">
                <span className="text-[#323233] text-sm font-semibold">Số dư</span>
                <span className="text-[#969799] text-sm">0</span>
            </div>
            <div className="flex flex-col justify-between items-start p-3 border-b-[1px] border-[#ebedf0] bg-[#f7f8fa]">
                <p className="text-[#323233] text-sm font-semibold">Nạp tiền bằng thẻ ngân hàng</p>
                <span className="text-[#969799] text-[0.8rem] mt-1">
                    Số tiền tối thiểu cho một lần nạp tiền là 50,000₫,tối đa 500,000,000₫, phí ngân hàng 0₫ phí xử lý!
                </span>
            </div>
            <div className="flex items-center p-3 border-b-[1px] border-[#ebedf0]">
                <div className="w-[120px] text-sm font-semibold">Số tiền nạp </div>
                <input
                    type="text"
                    className="w-full outline-none py-1.5 text-sm"
                    placeholder="Vui lòng nhập số tiền nạp (bắt buộc)"
                    value={amount.amount}
                    onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ''))}
                    onChange={(e) => setAmount({ amount: e.target.value })}
                />
            </div>

            <div
                onClick={() => handleRecharge()}
                className="bg-[#1989fa] py-3 mx-12 rounded-full text-center mt-12 border-[1px] border-[#2196f3]"
            >
                <span className="text-white text-sm">Xác nhận gửi</span>
            </div>
        </>
    );
}

export default RechargeBank;
