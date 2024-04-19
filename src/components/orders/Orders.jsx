/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from "react-redux";
import styles from "./orders.module.css";
import { formatDateToHour } from "../../utils/formatDate";
import { formatPrice } from "../../utils/formatPrice";
import { addOrder, addOrders, addSelectOrder } from "../../redux/ordersSlice";
import { useGetCashierOrdersQuery, useGetOrderQuery } from "../../api/apiOrder";
import Loading from "../loading/Loading";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../../context/SocketContext";

const Order = ({ order }) => {
  const dispatch = useDispatch();
  const { selectOrder } = useSelector((store) => store.ordersList);

  return (
    <div
      className={
        selectOrder && selectOrder._id == order._id
          ? styles.order_container_active
          : styles.order_container
      }
      onClick={() => dispatch(addSelectOrder(order))}
    >
      <h3 className={styles.col1}>{formatDateToHour(order?.createdAt)}hs</h3>
      <h3
        className={styles.col2}
      >{`${order?.shippingAddress?.name} ${order?.shippingAddress?.lastName}`}</h3>
      <h3 className={styles.col3}>
        {order?.numberOfItems}{" "}
        {order?.numberOfItems === 1 ? "producto" : "productos"}
      </h3>
      <h3 className={styles.col4}>{formatPrice(order?.total)}</h3>
    </div>
  );
};

export const Orders = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((store) => store.ordersList);
  const [id, setId] = useState(null);
  const [skip, setSkip] = useState(true);

  const { socket } = useContext(SocketContext);

  const { data, isLoading: l1, isError: e1 } = useGetCashierOrdersQuery();

  const {
    data: order,
    isLoading: l2,
    isError: e2,
  } = useGetOrderQuery({ id, stock: 1 }, { skip });

  // de los datos enviados del socket solo tomo el id
  useEffect(() => {
    socket.on("orderData", (data) => {
      console.log("Id de orden enviada:", data._id);
      setId(data._id);
      setSkip(false);
    });
    return () => socket.off("orderData");
  }, [socket]);

  // cargo en store datos con id obtenida por socket
  useEffect(() => {
    if (order) {
      const newOrder = {
        ...order.data.order,
        stock: order.data.stock,
      };

      dispatch(addOrder(newOrder));
    }
    setSkip(true);
  }, [order]);

  // cargo los al recargar la pagina
  useEffect(() => {
    if (data) {
      dispatch(addOrders(data?.data.orders));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (l1 || l2) {
    return <Loading />;
  }
  if (e1 || e2) {
    return <p>Ha ocurrido un error</p>;
  }

  return (
    <section className={styles.container}>
      {orders &&
        data &&
        orders.map((order) => <Order key={order?._id} order={order} />)}
    </section>
  );
};
