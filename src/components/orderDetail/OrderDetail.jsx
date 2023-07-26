/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from "react-redux";
import styles from "./ticket.module.css";
import {
  keypadModePrice,
  keypadModeQuantity,
  openCashOut,
  openClient,
  openKeypad,
  openPopupProducts,
} from "../../redux/uiSlice";
import { formatPrice } from "../../utils/formatPrice";
import {
  clearActiveProduct,
  deleteActiveProduct,
  deleteOrder,
  setActiveProduct,
} from "../../redux/ordersSlice";
import Swal from "sweetalert2";
import { useDeleteOrderMutation } from "../../api/apiOrder";
import { useEffect } from "react";

const Product = ({ product }) => {
  const { activeProduct } = useSelector((store) => store.ordersList);
  const dispatch = useDispatch();
  const handleClick = () => {
    if (activeProduct == product._id) {
      dispatch(clearActiveProduct());
    } else {
      dispatch(clearActiveProduct());
      dispatch(setActiveProduct(product._id));
    }
  };

  return (
    <div
      className={
        activeProduct !== product._id ? styles.product : styles.product_active
      }
      onClick={handleClick}
    >
      <div className={styles.flex}>
        <div>
          <h4 style={{ display: "flex", gap: "5px" }}>
            <span className={styles.quantity}>{product.totalQuantity}</span>
            {product.description} / Unid.({formatPrice(product.unitPrice)})
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

  const [deleteOrderApi, { isLoading, isError }] = useDeleteOrderMutation();

  const handleDelete = () => {
    Swal.fire({
      title: "Deseas borrar este producto?",
      text: "Este cambio no se puede revertir",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Borrar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        dispatch(deleteActiveProduct(activeProduct));
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
        const res = await deleteOrderApi(selectOrder._id);
        if (res.data.ok) {
          dispatch(deleteOrder(selectOrder.orderId));
        }
      }
    });
  };

  /* const handleSendOrder = () => {
    console.log(selectOrder);
    /*    dispatch(
      addOrder({
        userCashier: null, // id del usuario cajero
        userSeller: null, // id del usuario vendedor
        client: client._id,

        orderItems: products,

        shippingAddress: {
          addressId: null,
          name: null,
          lastName: null,
          phone: null,
          address: null,
          flor: null,
          department: null,
          city: null,
          province: null,
          zip: null,
          lat: null,
          lng: null,
        },

        deliveryTruck: null,
        employee: null, //este esta de mas, borrar
        deliveryZone: null,
        numberOfItems: products.length,
        tax: 0,
        subTotal: subTotal,
        total: subTotal,

        status: "Pendiente", // Entregado
        active: false, //solo si es de reparto

        commentary: "",

        payment: {
          cash: 0,
          transfer: 0,
          debt: 0,
        },

        paid: false,
        discount: 0,

        deliveryDate: null,

        //datos que no va a DB
        orderId: uuidv4(),
        clientFullName: `${client.user.name} ${client.user.lastName}`,
        date: new Date(),
      })
    );
    dispatch(clearCart()); 
  }; */

  useEffect(() => {
    if (isError)
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Error",
        text: "Ha ocurrido un error, la orden no fue borrada",
        showConfirmButton: false,
        timer: 2500,
      });
  }, [isError]);

  return (
    <section className={styles.container}>
      <div className={styles.navbar}>
        <button
          className={styles.ticket_btn_quantity}
          onClick={() => {
            dispatch(openKeypad());
            dispatch(keypadModeQuantity());
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
        <button
          className={styles.ticket_btn_products}
          onClick={() => dispatch(openPopupProducts())}
          disabled={!selectOrder}
        >
          +Productos
        </button>
        <button
          className={styles.ticket_btn_delete}
          onClick={handleDelete}
          disabled={!activeProduct ? true : false}
        >
          Borrar
        </button>
      </div>
      {selectOrder && (
        <div className={styles.products}>
          {selectOrder.orderItems.map((product) => (
            <Product product={product} key={product._id} />
          ))}
        </div>
      )}
      <div className={styles.bottom}>
        <div className={styles.client} onClick={() => dispatch(openClient())}>
          {selectOrder && selectOrder.userId && (
            <div className={styles.flex} style={{ padding: "10px" }}>
              <h4 style={{ fontSize: "20px" }}>Cliente:</h4>
              <h4>
                {selectOrder.userId.name} {selectOrder.userId.lastName}
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
            className={`btn-load ${isLoading ? "button--loading" : ""}`}
            type="submit"
            onClick={() => dispatch(openCashOut())}
            disabled={!selectOrder || isLoading}
            style={{ width: "50%", padding: "20px" }}
          >
            <span className="button__text">$ Cobrar</span>
          </button>
          <button
            className={`btn-load grey ${isLoading ? "button--loading" : ""}`}
            type="submit"
            onClick={handleDeleteOrder}
            disabled={!selectOrder || isLoading}
            style={{ width: "50%", padding: "20px" }}
          >
            <span className="button__text">Borrar orden</span>
          </button>
        </div>
      </div>
    </section>
  );
};
