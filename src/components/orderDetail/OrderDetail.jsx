/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from "react-redux";
import styles from "./ticket.module.css";
import {
  keypadModePrice,
  keypadModeQuantityCashier,
  openCashOut,
  openKeypad,
  openLocalOrder,
} from "../../redux/uiSlice";
import { formatPrice } from "../../utils/formatPrice";
import {
  clearActiveProduct,
  deleteOrder,
  setActiveProduct,
  updateQuantityActiveProduct,
} from "../../redux/ordersSlice";
import Swal from "sweetalert2";
import { useDeleteOrderMutation } from "../../api/apiOrder";
import { useEffect } from "react";

const Product = ({ product }) => {
  const { activeProduct } = useSelector((store) => store.ordersList);
  const dispatch = useDispatch();
  const handleClick = () => {
    if (activeProduct == product.uniqueId) {
      dispatch(clearActiveProduct());
    } else {
      dispatch(clearActiveProduct());
      dispatch(setActiveProduct(product.uniqueId));
    }
  };

  return (
    <div
      className={
        activeProduct !== product.uniqueId
          ? styles.product
          : styles.product_active
      }
      onClick={handleClick}
    >
      <div className={styles.flex}>
        <div>
          <h4 style={{ display: "flex", gap: "5px", alignItems: "center" }}>
            <span className={styles.quantity}>{product.totalQuantity}</span>
            <span>
              {product.description} / Unid.({formatPrice(product.unitPrice)})
            </span>
          </h4>
        </div>
        <h4>{formatPrice(product.totalPrice)}</h4>
      </div>
    </div>
  );
};

export const OrderDetail = () => {
  const dispatch = useDispatch();
  const { selectOrder, activeProduct } = useSelector(
    (store) => store.ordersList
  );

  const [deleteOrderApi, { isLoading: l1, isError: e1 }] =
    useDeleteOrderMutation();

  const handleDeleteProduct = () => {
    Swal.fire({
      title: "Deseas borrar este producto?",
      text: "Este cambio no se puede revertir",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Borrar",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          updateQuantityActiveProduct({
            id: activeProduct,
            value: 0,

            visible: false,
          })
        );

        // dispatch(deleteActiveProduct(activeProduct));
      }
    });
  };
  const handleDeleteOrder = () => {
    Swal.fire({
      title: "Deseas borrar esta Orden?",
      text: "Este cambio no se puede revertir",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Borrar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteOrderApi(selectOrder._id);
        if (!e1) {
          dispatch(deleteOrder(selectOrder.orderId));
        }
      }
    });
  };

  useEffect(() => {
    if (e1)
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Error",
        text: "Ha ocurrido un error, la orden no fue borrada",
        showConfirmButton: false,
        timer: 2500,
      });
  }, [e1]);

  const handleOpenClient = () => {
    dispatch(openLocalOrder());
  };

  return (
    <section className={styles.container}>
      <div className={styles.navbar}>
        <button
          className={styles.ticket_btn_quantity}
          onClick={() => {
            dispatch(openKeypad());
            dispatch(keypadModeQuantityCashier());
          }}
          disabled={!activeProduct ? true : false}
        >
          Cantidad
        </button>
        <button
          className={styles.ticket_code}
          onClick={() => {
            dispatch(openKeypad());
            dispatch(keypadModePrice());
          }}
          disabled={!activeProduct ? true : false}
        >
          Precio
        </button>
        {/*  <button
          className={styles.ticket_btn_products}
          onClick={() => dispatch(openPopupProducts())}
          disabled={!selectOrder}
        >
          +Productos
        </button> */}
        <button
          className={styles.ticket_btn_delete}
          onClick={handleDeleteProduct}
          disabled={!activeProduct ? true : false}
        >
          Borrar
        </button>
      </div>
      {selectOrder && (
        <div className={styles.products}>
          {selectOrder.orderItems
            .filter((product) => product.visible)
            .map((product) => (
              <Product product={product} key={product.uniqueId} />
            ))}
        </div>
      )}
      <div className={styles.bottom}>
        <div className={styles.client} onClick={handleOpenClient}>
          {selectOrder && (
            <div className={styles.flex} style={{ padding: "10px" }}>
              <h4>Cliente:</h4>
              <h4>
                {selectOrder.shippingAddress?.name}{" "}
                {selectOrder.shippingAddress?.lastName}
              </h4>
            </div>
          )}
        </div>
        <div className={styles.total}>
          <div className={styles.flex}>
            <h4>Subtotal</h4>
            <h4>{formatPrice(selectOrder?.subTotal || 0)}</h4>
          </div>
          <div className={styles.flex}>
            <h4>Envío</h4>
            <h4>$0</h4>
          </div>
          <div className={styles.divider}></div>
          <div
            className={styles.flex}
            style={{ fontSize: "30px", fontWeight: 800, letterSpacing: "2px" }}
          >
            <h4>Total</h4>
            <h4>{formatPrice(selectOrder?.total || 0)}</h4>
          </div>
        </div>
        <div className={styles.footer}>
          <button
            className={`btn-load ${l1 ? "button--loading" : ""}`}
            type="submit"
            onClick={() => dispatch(openCashOut())}
            disabled={!selectOrder || l1}
            style={{ width: "50%", padding: "20px" }}
          >
            <span className="button__text">$ Cobrar</span>
          </button>
          <button
            className={`btn-load grey ${l1 ? "button--loading" : ""}`}
            type="submit"
            onClick={handleDeleteOrder}
            disabled={!selectOrder || l1}
            style={{ width: "50%", padding: "20px" }}
          >
            <span className="button__text">Borrar</span>
          </button>
        </div>
      </div>
    </section>
  );
};
