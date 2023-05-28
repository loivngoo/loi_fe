import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { message } from 'antd';
import Joi from 'joi';

import AppUsers from '@src/services/AppUsers';
import Header from '@src/components/Header';
import './Card.scss';
import classNames from 'classnames';
import convert from '../../../helpers/convert';

function Card() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        full_name: '',
        name_bank: '',
        number_bank: '',
        wallet_usdt: '',
    });
    const [cardInfo, setCardInfo] = useState(formData);

    const schema = Joi.object({
        full_name: Joi.string().max(100).required(),
        name_bank: Joi.string().max(100).required(),
        number_bank: Joi.string().max(100).required(),
        wallet_usdt: Joi.any().optional(),
    });

    const GetBankCard = async () => {
        return await AppUsers.GetBankCard();
    };

    useEffect(() => {
        GetBankCard().then((data) => {
            if (data) {
                setFormData({
                    full_name: data?.full_name,
                    name_bank: data?.name_bank,
                    number_bank: data?.number_bank,
                    wallet_usdt: '',
                });
                setCardInfo(data);
            }
        });
    }, []);

    const handleAddBankCard = async () => {
        const { error } = schema.validate(formData);
        console.log(error);
        if (error) return message.error('Vui lòng nhập đầy đủ thông tin');

        const res = await AppUsers.AddBankCard(formData);
        if (res.status === 2) return message.error(res.message);
        if (res.status === 1) {
            message.success(res.message);
            setFormData({
                full_name: '',
                name_bank: '',
                number_bank: '',
                wallet_usdt: '',
            });
        }
    };
    return (
        <div className="page-card">
            <Header title="Liên kết thẻ ngân hàng" />
            <div className="pt-[46px] px-1">
                <div className="flex items-center border-y-[1px] border-[#ebedf0]">
                    <div className="w-[150px] label">Chủ tài khoản </div>
                    <input
                        className={classNames('w-full outline-none py-1.5 text-[#323233]', {
                            'text-gray-500': cardInfo.full_name,
                        })}
                        type="text"
                        placeholder="Nhập tên chủ tài khoản"
                        disabled={cardInfo.full_name ? true : false}
                        value={formData.full_name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, full_name: e.target.value }))}
                    />
                </div>
                <div className="flex items-center border-b-[1px] border-[#ebedf0]">
                    <div className="w-[150px] label">Số tài khoản ngân hàng </div>
                    <input
                        className={classNames('w-full outline-none py-1.5 text-[#323233]', {
                            'text-gray-500': cardInfo.number_bank,
                        })}
                        type="text"
                        placeholder="Nhập số tài khoản ngân hàng"
                        value={
                            formData.number_bank
                                ? convert.replaceCharacters(formData.number_bank)
                                : formData.number_bank
                        }
                        disabled={cardInfo.number_bank ? true : false}
                        onChange={(e) => setFormData((prev) => ({ ...prev, number_bank: e.target.value.trim() }))}
                    />
                </div>
                <div className="flex items-center border-b-[1px] border-[#ebedf0]">
                    <div className="w-[150px] label">Tên ngân hàng </div>
                    <input
                        className={classNames('w-full outline-none py-1.5 text-[#323233]', {
                            'text-gray-500': cardInfo.name_bank,
                        })}
                        type="text"
                        placeholder="Nhập tên ngân hàng"
                        disabled={cardInfo.name_bank ? true : false}
                        value={formData.name_bank}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name_bank: e.target.value }))}
                    />
                </div>

                <div
                    onClick={() => handleAddBankCard()}
                    className="bg-[#1989fa] py-1.5 mx-12 rounded-full text-center mt-12 border-[1px] border-[#2196f3]"
                >
                    <span className="text-white text-sm">Thêm ngân hàng</span>
                </div>
            </div>
        </div>
    );
}

export default Card;
