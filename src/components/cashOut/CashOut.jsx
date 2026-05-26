/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import styles from "./cashOut.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  closeCashOut,
  keypadModeCash,
  keypadModeDebt,
  keypadModeTransfer,
  openKeypad,
} from "../../redux/uiSlice";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { formatPrice } from "../../utils/formatPrice";
import { Receipt } from "../receipt/Receipt";
import { usePutOrderMutation } from "../../api/apiOrder";
import { useGetClientQuery, useGetConfigQuery } from "../../api/apiClient";
import Swal from "sweetalert2";
import {
  clearOrdersList,
  clearPayment,
  setCash,
  setDebt,
  setTransfer,
} from "../../redux/ordersSlice";
import { CgKeyboard } from "react-icons/cg";
import { usePutCashierSessionMutation } from "../../api/apiCashierSession";

export const CashOut = () => {
  const { selectOrder, payment } = useSelector((store) => store.ordersList);
  const { user } = useSelector((store) => store.auth);
  const { sessionCashier } = useSelector((store) => store.user);
  const id = selectOrder._id;

  const dispatch = useDispatch();

  const [sendOrder, { isLoading: l1, isError: e1 }] = usePutOrderMutation();

  const [updateSession, { isLoading: l3, isError: e3 }] =
    usePutCashierSessionMutation();

  // --- LÓGICA DE CANJE DE PUNTOS ---
  const [usePoints, setUsePoints] = useState(false);

  // Obtener puntos más recientes de este cliente
  const { data: clientResponse } = useGetClientQuery(selectOrder?.client?._id, {
    skip: !selectOrder?.client?._id,
  });
  const clientPoints = clientResponse?.data?.client?.points || 0;

  // Obtener tasa de canje configurada en el sistema
  const { data: configResponse } = useGetConfigQuery();
  const conversionRate = configResponse?.config?.pointsConversionRate || 10;

  // Calcular descuento equivalente y puntos a utilizar (sin exceder el total de la orden)
  const pointsDiscount = usePoints ? Math.min(clientPoints / conversionRate, selectOrder.total) : 0;
  const pointsUsed = usePoints ? Math.min(clientPoints, selectOrder.total * conversionRate) : 0;

  const finalTotal = selectOrder.total - pointsDiscount;
  // ---------------------------------

  const handleKeyPress = (event) => {
    if (event.key === "Escape") {
      dispatch(closeCashOut());
    }
  };
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlerCash = () => {
    const rest = finalTotal - payment.transfer - payment.debt;
    dispatch(setCash(rest));
  };
  const handlerTransfer = () => {
    const rest = finalTotal - payment.cash - payment.debt;
    dispatch(setTransfer(rest));
  };
  const handlerDebt = () => {
    const rest = finalTotal - payment.transfer - payment.cash;

    dispatch(setDebt(rest));
  };

  const handleConfirmOrder = async () => {
    if (+payment.cash + +payment.transfer + +payment.debt > finalTotal) {
      return Swal.fire({
        position: "center",
        icon: "error",
        title: `La suma del total de pagos(${formatPrice(
          +payment.cash + +payment.transfer + +payment.debt
        )}) supera el total de la orden`,
        showConfirmButton: true,
        confirmButtonColor: "#d33",
      });
    }
    if (+payment.cash + +payment.transfer + +payment.debt === 0 && finalTotal > 0) {
      return Swal.fire({
        position: "center",
        icon: "error",
        title: `El monto total pagos no puede ser 0, si la orden no se abonara, complete el total en "DEUDA"`,
        showConfirmButton: true,
        confirmButtonColor: "#d33",
      });
    }
    if (
      +payment.cash + +payment.transfer + +payment.debt !==
      +finalTotal
    ) {
      return Swal.fire({
        position: "center",
        icon: "error",
        title: `La suma de monto total pagos (${formatPrice(
          +payment.cash + +payment.transfer + +payment.debt
        )}) no coincide con el total de la orden`,
        showConfirmButton: true,
        confirmButtonColor: "#d33",
      });
    }
    const order = {
      userCashier: user, // id del usuario cajero
      userSeller: selectOrder.userSeller,
      client: selectOrder.client._id,
      userId: selectOrder.userId._id,
      cashierMode: false, // cambiamos a false porque va a db definitivamente
      receiptId: selectOrder?.receiptId,

      orderItems: selectOrder.orderItems.map((product) => ({
        uniqueId: product?.uniqueId || null,
        productId: product.productId,
        name: product.name,
        unit: product.unit,
        description: product?.description || null,
        img: product.img,
        totalQuantity: product.totalQuantity,
        totalPrice: product.totalPrice,
        unitPrice: product.unitPrice,
        unitCost: product.unitCost,
        stockId: null,
        stockData: product.stockData,
      })),

      shippingAddress: selectOrder.shippingAddress,

      deliveryTruck: selectOrder.deliveryTruck,
      employee: null, //este esta de mas, borrar
      deliveryZone: selectOrder.deliveryZone,
      numberOfItems: selectOrder.numberOfItems,
      tax: selectOrder.tax,
      subTotal: selectOrder.subTotal,
      total: finalTotal, // Enviamos el total final ajustado con descuento

      status: "Entregado", // Entregado
      active: false, //solo si es de reparto

      commentary: "",

      payment: {
        cash: +payment.cash,
        transfer: +payment.transfer,
        debt: +payment.debt,
      },

      paid: +payment.cash + +payment.transfer === finalTotal,
      discount: pointsDiscount,
      pointsUsed: pointsUsed,
      pointsDiscount: pointsDiscount,

      deliveryDate: new Date(),

      state: true, // cambiar en producción
    };

    console.log(order);

    await sendOrder({ id, ...order });

    //guardar la orden en la sesión del cajero

    await updateSession({ id: sessionCashier, newOrderId: id });

    if (!e1 && !e3) {
      //close
      dispatch(closeCashOut());
      //confirm
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Orden cobrada con éxito",
        showConfirmButton: false,
        timer: 2500,
      });
      //clear state
      dispatch(clearOrdersList(id));
      dispatch(clearPayment());
    }
  };

  useEffect(() => {
    if (e1)
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Error",
        text: "Ha ocurrido un error, orden no enviada",
        showConfirmButton: false,
        timer: 2500,
      });
  }, [e1, e3]);

  return (
    <section className={styles.container}>
      <div className={styles.window_container}>
        <div className={styles.nav}>
          <button
            className={styles.close}
            onClick={() => {
              dispatch(closeCashOut());
              dispatch(clearPayment());
            }}
          >
            <AiOutlineClose />
          </button>
        </div>
        <div className={styles.products}>
          <div className={styles.titles}>
            <div className={styles.col1}>
              <h3>Cantidad</h3>
            </div>
            <div className={styles.col2}>
              <h3>Producto</h3>
            </div>
            <div className={styles.col3}>
              <h3>$ Unidad</h3>
            </div>
            <div className={styles.col4}>
              <h3>Total</h3>
            </div>
          </div>
          {selectOrder.orderItems
            .filter((item) => item.visible)
            .map((product) => {
              return (
                <div className={styles.product} key={product._id}>
                  <div className={styles.col1}>
                    <h3>{product.totalQuantity} unid.</h3>
                  </div>
                  <div className={styles.col2}>
                    <h3>{product.name}</h3>
                  </div>
                  <div className={styles.col3}>
                    <h3>{formatPrice(product.unitPrice)}</h3>
                  </div>
                  <div className={styles.col4}>
                    <h3>{formatPrice(product.totalPrice)}</h3>
                  </div>
                </div>
              );
            })}

          <div className={styles.data}>
            <div className={styles.totals}>
              <div className={styles.row}>
                <h3>Cliente</h3>
                <h3>{`${selectOrder.shippingAddress.name} ${selectOrder.shippingAddress.lastName}`}</h3>
              </div>

              {/* Módulo visual de canje de puntos de fidelidad */}
              {selectOrder.client && (
                <div 
                  className={styles.row} 
                  style={{ 
                    backgroundColor: "rgba(0, 150, 136, 0.08)", 
                    borderRadius: "8px", 
                    padding: "10px 14px", 
                    margin: "8px 0",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "6px",
                    width: "100%"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                    <span style={{ fontSize: "14px", fontWeight: "700", color: "#00796b" }}>
                      Puntos Disponibles: {clientPoints} pts
                    </span>
                    {clientPoints > 0 && (
                      <span style={{ fontSize: "13px", color: "#444", fontWeight: "600" }}>
                        (Equivale a -{formatPrice(clientPoints / conversionRate)})
                      </span>
                    )}
                  </div>
                  
                  {clientPoints > 0 ? (
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", width: "100%", fontSize: "14px", fontWeight: "500", marginTop: "2px" }}>
                      <input 
                        type="checkbox" 
                        checked={usePoints} 
                        onChange={(e) => {
                          setUsePoints(e.target.checked);
                          // Limpiamos los pagos cargados para evitar montos descuadrados tras aplicar el descuento
                          dispatch(clearPayment());
                        }}
                        style={{ width: "18px", height: "18px", cursor: "pointer" }}
                      />
                      <span style={{ color: "#333" }}>Canjear puntos en esta compra</span>
                    </label>
                  ) : (
                    <div style={{ fontSize: "12.5px", color: "#555", fontStyle: "italic", marginTop: "2px", fontWeight: "500" }}>
                      ¡Este cliente acumulará puntos con el pago de esta compra!
                    </div>
                  )}
                </div>
              )}

              <div className={styles.row}>
                <h3>Subtotal</h3>
                <h3>{formatPrice(selectOrder.subTotal)}</h3>
              </div>
              <div className={styles.row}>
                <h3>Envío</h3>
                <h3>{formatPrice(selectOrder.tax)}</h3>
              </div>
              {pointsDiscount > 0 && (
                <div className={styles.row} style={{ color: "green", fontWeight: "bold" }}>
                  <h3>Descuento Puntos</h3>
                  <h3>-{formatPrice(pointsDiscount)}</h3>
                </div>
              )}
              <div
                className={styles.row}
                style={{ fontSize: "30px", letterSpacing: "3px" }}
              >
                <h3>Total</h3>
                <h3>{formatPrice(finalTotal)}</h3>
              </div>
            </div>
            <div className={styles.data_entry}>
              <div className={styles.input_container}>
                <div className={styles.input_wrapper}>
                  <input
                    type="number"
                    placeholder="Pago en efectivo"
                    style={{ outlineColor: "green" }}
                    autoFocus
                    //defaultValue={0}
                    value={payment.cash}
                    onChange={(e) => dispatch(setCash(e.target.value))}
                  />
                  <button
                    className={styles.btn_keypad}
                    onClick={() => {
                      dispatch(openKeypad());
                      dispatch(keypadModeCash());
                    }}
                  >
                    <CgKeyboard />
                  </button>
                </div>
                <button onClick={handlerCash} className={styles.btn_cash}>
                  $ Efectivo
                </button>
              </div>
              <div className={styles.input_container}>
                <div className={styles.input_wrapper}>
                  <input
                    type="number"
                    placeholder="Pago en transferencia"
                    style={{ outlineColor: "green" }}
                    value={payment.transfer}
                    onChange={(e) => dispatch(setTransfer(e.target.value))}
                  />
                  <button
                    className={styles.btn_keypad}
                    onClick={() => {
                      dispatch(openKeypad());
                      dispatch(keypadModeTransfer());
                    }}
                  >
                    <CgKeyboard />
                  </button>
                </div>
                <button onClick={handlerTransfer} className={styles.btn_cash}>
                  $ Transferencia
                </button>
              </div>
              <div className={styles.input_container}>
                <div className={styles.input_wrapper}>
                  <input
                    type="number"
                    placeholder="Deuda de compra"
                    style={{ outlineColor: "red" }}
                    value={payment.debt}
                    onChange={(e) => dispatch(setDebt(e.target.value))}
                  />
                  <button
                    className={styles.btn_keypad}
                    onClick={() => {
                      dispatch(openKeypad());
                      dispatch(keypadModeDebt());
                    }}
                  >
                    <CgKeyboard />
                  </button>
                </div>
                <button id={styles.btn_debt} onClick={handlerDebt}>
                  $ Deuda
                </button>
              </div>
            </div>
            <div className={styles.send_order}>
              <Receipt />

              <button
                className={`btn-load ${l1 || l3 ? "button--loading" : ""}`}
                type="submit"
                onClick={handleConfirmOrder}
                disabled={l1}
                style={{ width: "50%" }}
              >
                <span
                  className="button__text"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <AiOutlineCheck />
                  Confirmar compra
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
