import classNames from 'classnames';

function Product({ product }) {
    return (
        <div className="flex justify-between border-b p-3">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1">
                    <span className="text-black select-none">{product.Product.product_name}</span>
                </div>
                <span className={classNames('font-medium text-green-500')}>
                    {product.Product.full_price.toLocaleString()} ₫
                </span>
                <span className="text-gray-500">{product.createdAt}</span>
            </div>
            <div>
                <h3 className={classNames('font-medium text-green-500')}>Thành công</h3>
            </div>
        </div>
    );
}

export default Product;
