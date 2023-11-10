/* eslint-disable react/prop-types */
import { useEffect, useMemo } from "react";
import { dateToLocalDate } from "../../../utils/formatDate";
import { formatPrice } from "../../../utils/formatPrice";
import styles from "../resume.module.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { usePutCashierSessionMutation } from "../../../api/apiCashierSession";
import { useDispatch } from "react-redux";
import { finishSession } from "../../../redux/userSlice";

export const ResumeDetails = ({ data }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [closeSession, { isLoading: l1, isError: e1 }] =
    usePutCashierSessionMutation();

  const payments = useMemo(
    () => data.orders.map((order) => order.payment),
    [data.orders]
  );

  const { cash, transfer, debt } = useMemo(
    () =>
      payments.reduce(
        (acc, curr) => ({
          cash: acc.cash + curr.cash,
          transfer: acc.transfer + curr.transfer,
          debt: acc.debt + curr.debt,
        }),
        { cash: 0, transfer: 0, debt: 0 }
      ),
    [payments]
  );

  const unPaidOrders = useMemo(
    () => data.orders.filter((order) => !order.paid).length,
    [data.orders]
  );

  const paidOrders = useMemo(
    () => data.orders.filter((order) => order.paid).length,
    [data.orders]
  );

  const handleFishSession = async () => {
    const finishData = {
      finalCash: cash,
      payment: {
        cash,
        transfer,
        debt,
      },
      finishDate: new Date(),
    };

    Swal.fire({
      title: "Deseas cerrar la caja?",

      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Cerrar caja",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await closeSession({
          id: data.session._id,
          ...finishData,
        });

        if (res.data?.ok) {
          dispatch(finishSession());
          navigate("/caja");
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
        text: "No se ha podido cerrar la caja",
        showConfirmButton: false,
        timer: 2500,
      });
  }, [e1]);
  return (
    <section className={styles.container__detail}>
      <div className={styles.container__detail__nav}>
        <h2>Resumen</h2>
      </div>
      <div className={styles.container__detail__main}>
        <div className={styles.container__detail__title}>
          <h3>Sesión</h3>
        </div>
        <div className={styles.container__detail__row}>
          <p>Cajero/s</p>
          <h4>{`${data.session.user.name} ${data.session.user.lastName}`}</h4>
        </div>
        <div className={styles.container__detail__row}>
          <p>Apertura de caja</p>
          <h4>{`${dateToLocalDate(data.session.initDate)}hs`}</h4>
        </div>
        <div className={styles.container__detail__row}>
          <p>Efectivo Inicial</p>
          <h4>{formatPrice(data.session.initialCash)}</h4>
        </div>
        <div className={styles.container__detail__row}>
          <p>Efectivo Actual</p>
          <h4>{formatPrice(cash + data.session.initialCash)}</h4>
        </div>
        <div className={styles.container__detail__row}>
          <p>Diferencia</p>
          <h4>{formatPrice(cash)}</h4>
        </div>
        <div className={styles.container__detail__title}>
          <h3>Ordenes</h3>
        </div>

        <div className={styles.container__detail__row}>
          <p>Cantidad de ordenes</p>
          <h4>{data.orders.length}</h4>
        </div>
        <div className={styles.container__detail__row}>
          <p>Ordenes pagas</p>
          <h4>{paidOrders}</h4>
        </div>
        <div className={styles.container__detail__row}>
          <p>Ordenes impagas</p>
          <h4>{unPaidOrders}</h4>
        </div>
        <div className={styles.container__detail__title}>
          <h3>Pagos</h3>
        </div>
        <div className={styles.container__detail__row}>
          <p>Pagos en efectivo</p>
          <h4>{formatPrice(cash)}</h4>
        </div>
        <div className={styles.container__detail__row}>
          <p>Pagos en transferencia</p>
          <h4>{formatPrice(transfer)}</h4>
        </div>
        <div className={styles.container__detail__row}>
          <p>Monto impago</p>
          <h4>{formatPrice(debt)}</h4>
        </div>
      </div>
      <div className={styles.container__detail__footer}>
        <button
          className={`btn-load ${l1 ? "button--loading" : ""}`}
          type="submit"
          style={{ width: "90%", padding: "20px" }}
        >
          <span className="button__text" onClick={handleFishSession}>
            Cerrar caja
          </span>
        </button>
      </div>
    </section>
  );
};
