import React from 'react';
import ServiceCard from './ServiceCard';

function ListServices({ onSelect }) {
    return (
        <div
            className="
                grid grid-cols-1
                sm:grid-cols-1
                md:grid-cols-3
                lg:grid-cols-3
                gap-4
            "
        >
            <ServiceCard onClick={() => onSelect('topup')} title="Nạp tiền" />
            <ServiceCard onClick={() => onSelect('withdraw')} title="Rút tiền" />
            <ServiceCard onClick={() => onSelect('shopping')} title="Mua hàng" />
            <ServiceCard onClick={() => onSelect('forgotpassword')} title="Quên mật khẩu" />
        </div>
    );
}

export default ListServices;
