/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import { formatPrice } from "../../../../utils/formatPrice";
import styles from "./productsList.module.css";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { updateProductOrder } from "../../../../redux/ordersSlice";
import Swal from "sweetalert2";
import { formatQuantity } from "../../../../utils/formatQuantity";
import { updateStockFunction } from "../../../../utils/adjustStock";

const ProductStock = ({ selectOfert, setSelectOfert }) => {
  const dispatch = useDispatch();
  const stocks =
    selectOfert.product?.stock.filter((stock) => stock.stock > 0) || [];

  const handleClick = (stock) => {
    dispatch(
      updateProductOrder({
        uniqueId: uuidv4(), //nuevo, este va db
        productId: selectOfert.product._id,
        name: selectOfert.product.name,
        unit: selectOfert.product.unit,
        description: selectOfert.description,
        img: selectOfert.product.img,

        totalQuantity: 1,
        totalPrice: selectOfert.basePrice,
        unitPrice: selectOfert.basePrice,

        unitCost: stock.unityCost,
        stockId: stock._id,
        new: true, // no va a db
      })
    );
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Producto cargado",
      showConfirmButton: false,
      timer: 2000,
    });
  };
  return (
    <section className={styles.container}>
      <div className={styles.product_title}>
        <h3 className={styles.col1}>Producto</h3>
        <h3 className={styles.col2}>Stock</h3>
        <h3 className={styles.col3}>Precio</h3>
      </div>
      {stocks.map((stock) => {
        return (
          <div
            className={styles.product}
            key={stock._id}
            onClick={() => handleClick(stock)}
          >
            <div className={styles.col1}>
              <img src={stock.img} alt={stock.name} />
              <h3>{selectOfert.description}</h3>
            </div>

            <h3 className={styles.col2}>{formatQuantity(stock.stock)} Unid.</h3>
            <h3 className={styles.col3}>
              {formatPrice(selectOfert.basePrice)}
            </h3>
          </div>
        );
      })}
      {stocks.length === 0 && (
        <div className={styles.empty} onClick={() => setSelectOfert(null)}>
          ⚠ Producto sin stock
        </div>
      )}
      <div className={styles.back} onClick={() => setSelectOfert(null)}>
        <AiOutlineArrowLeft />
        Volver
      </div>
    </section>
  );
};

export const ProductsList = ({ oferts, value, ofertStock }) => {
  const dispatch = useDispatch();
  const [selectOfert, setSelectOfert] = useState(null);

  const allOferts = ofertStock
    .filter((ofert) => ofert.stock.length > 0)
    .map((product) => ({
      ...product,
      stockQuantity: product.stock.reduce((acc, curr) => acc + curr.stock, 0),
    }))
    .sort((a, b) => {
      if (a.description < b.description) {
        return -1;
      }
      if (a.description > b.description) {
        return 1;
      }
      return 0;
    });

  const handleClick = (ofert) => {
    const newProduct = {
      visible: true,
      uniqueId: uuidv4(), //nuevo, este va db
      productId: ofert.product._id,
      name: ofert.product.name,
      unit: ofert.product.unit,
      description: ofert.description,
      img: ofert.product.img,

      totalQuantity: 1,
      totalPrice: ofert.basePrice,
      unitPrice: ofert.basePrice,

      unitCost: null,
      stockId: null,
      new: true, // no va a db

      maxStock: ofert.stock.reduce((acc, curr) => acc + curr.stock, 0),
      stock: ofert.stock,
      stockModify: updateStockFunction(ofert.stock, 1),
      ofertId: ofert._id,
    };
    console.log(newProduct);
    console.log(ofert);
    dispatch(updateProductOrder(newProduct));
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Producto cargado",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  return (
    <section className={styles.container}>
      <div className={styles.product_title}>
        <h3 className={styles.col1}>Producto</h3>
        <h3 className={styles.col2}>Stock</h3>
        <h3 className={styles.col3}>Precio</h3>
      </div>
      {allOferts.map((ofert) => {
        return (
          <div
            className={styles.product}
            key={ofert._id}
            onClick={() => handleClick(ofert)}
          >
            <div className={styles.col1}>
              <img src={ofert.product.img} alt={ofert.description} />
              <h3>{ofert.description}</h3>
            </div>

            <h3 className={styles.col2}>{ofert.stockQuantity} unid.</h3>
            <h3 className={styles.col3}>{formatPrice(ofert.basePrice)}</h3>
          </div>
        );
      })}
    </section>
  );
};
