/* eslint-disable react/prop-types */
import { formatPrice } from "../../../../utils/formatPrice";
import styles from "./productsList.module.css";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { updateProductOrder } from "../../../../redux/ordersSlice";
import Swal from "sweetalert2";

export const ProductsList = ({ ofertStock }) => {
  const dispatch = useDispatch();

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
