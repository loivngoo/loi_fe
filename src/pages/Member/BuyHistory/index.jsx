import Header from '@src/components/Header';
import './BuyHistory.scss';
import { Wrapper } from './styles';
import Product from './components/Product';
import { useEffect, useState } from 'react';
import { openNotification } from '../../../helpers/notification';
import service from '../../../services/AppUsers';
function BuyHistory() {
    const [products, setProducts] = useState([]);

    const fetchDataBuyHistory = async () => {
        try {
            const response = await service.GetProductBought();
            if (response.status === 200) {
                setProducts(response.data);
            } else {
                openNotification('error', 'Lỗi', 'Không thể lấy dữ liệu lịch sử mua hàng');
            }
        } catch (error) {
            openNotification('error', 'Lỗi', 'Không thể lấy dữ liệu lịch sử mua hàng');
        }
    };

    useEffect(() => {
        fetchDataBuyHistory();
    }, []);

    return (
        <div className="page-payment-history">
            <Header title="Lịch sử mua hàng" />
            <Wrapper direction="vertical" className="pt-[46px] pl-[20px]" size={0}>
                {products.map((product, index) => (
                    <Product key={index} product={product} />
                ))}
            </Wrapper>
            {products.length === 0 && (
                <div className="pt-[46px]">
                    <div className="text-center">
                        <span className="no-data">Chưa có dữ liệu</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BuyHistory;
