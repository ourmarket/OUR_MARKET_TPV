/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import styles from "./products.module.css";
import { IoMdArrowBack } from "react-icons/io";
import { useDispatch } from "react-redux";
import { addProduct } from "../../redux/orderSlice";
import { clearSearchOfert, updateOfert } from "../../redux/ofertsSlice";
import { formatQuantity } from "../../utils/formatQuantity";
import { v4 as uuidv4 } from "uuid";
import { updateStockFunction } from "../../utils/adjustStock";

export const Stocks = ({ ofert, stock: stockActual }) => {
  const stocks = stockActual.reduce((acc, curr) => acc + curr.stock, 0);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = (stock) => {
    const product = {
      uniqueId: uuidv4(), //este solo sirve para el carrito, no va a db
      productId: ofert.product._id,
      name: ofert.product.name,
      unit: ofert.product.unit,
      description: ofert.description,
      img: ofert.product.img,

      totalQuantity: 1,
      totalPrice: ofert.basePrice, //precio minorista, el mas caro
      unitPrice: ofert.basePrice, //precio minorista, el mas caro

      unitCost: stock.unityCost,
      stockId: stock._id,
      maxStock: stocks,
      stock: stockActual,
      stockModify: updateStockFunction(stockActual, 1),
      ofertId: ofert._id,
    };

    dispatch(
      addProduct({
        product,
        maxStock: stocks,
      })
    );
    dispatch(
      updateOfert({
        id: ofert._id,
        // stock: updateStockFunction(stock, 1), ya no lo necesito
      })
    );
    navigate("/");
  };
  return (
    <div className={styles.main_products}>
      <div
        className={styles.product_card}
        onClick={() => {
          navigate("/");
          dispatch(clearSearchOfert());
        }}
      >
        <IoMdArrowBack />
        <h3>Volver</h3>
      </div>
      {stocks === 0 && (
        <div className={styles.product_card}>
          <h3>Sin Stock</h3>
        </div>
      )}
      {stocks > 0 && (
        <div className={styles.product_card} onClick={() => handleClick(ofert)}>
          <img
            src={`${ofert.product.img}?tr=w-300,h-300`}
            alt={ofert.product.name}
          />
          <div className={styles.product_card_name}>
            <h3>Stock: {formatQuantity(stocks)} unid.</h3>
          </div>
        </div>
      )}
    </div>
  );
};
