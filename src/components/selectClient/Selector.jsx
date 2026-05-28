import { useEffect, useState } from "react";
import styles from "./client.module.css";
import { useDispatch, useSelector } from "react-redux";
import { QRCodeSVG } from "qrcode.react";
import {
  closeSelector,
  openDeliveryOrder,
  openLocalOrder,
} from "../../redux/uiSlice";

export const Selector = () => {
  const dispatch = useDispatch();
  const { superUser } = useSelector((store) => store.auth);
  const [showQR, setShowQR] = useState(false);
  const autogestionUrl = import.meta.env.VITE_APP_AUTOGESTION_URL || "http://localhost:5173";
  const registerUrl = `${autogestionUrl}/?tenant=${superUser}`;

  const handleKeyPress = (event) => {
    if (event.key === "Escape") {
      if (showQR) setShowQR(false);
      else dispatch(closeSelector());
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showQR]);

  return (
    <section className={styles.container}>
      <div className={styles.client_box_selector}>
        <button
          className={styles.bnt_close}
          onClick={() => {
            if (showQR) setShowQR(false);
            else dispatch(closeSelector());
          }}
        >
          x
        </button>

        {showQR ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>Registrar Nuevo Cliente</h2>
            <p style={{ marginBottom: "20px" }}>Pide al cliente que escanee este código QR</p>
            <QRCodeSVG value={registerUrl} size={200} />
            <div style={{ marginTop: "20px" }}>
              <button 
                className={styles.btn_select_order} 
                onClick={() => setShowQR(false)}
              >
                Volver
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.btn_container}>
            <h2>Selecciona el tipo de orden</h2>
            <button
              className={styles.btn_select_order}
              onClick={() => dispatch(openDeliveryOrder())}
            >
              Orden de reparto
            </button>
            <button
              className={styles.btn_select_order}
              onClick={() => dispatch(openLocalOrder())}
            >
              Orden local
            </button>
            <div style={{ margin: "10px 0", borderTop: "1px solid #ccc" }}></div>
            <button
              className={styles.btn_select_order}
              style={{ backgroundColor: "#2e7d32" }}
              onClick={() => setShowQR(true)}
            >
              NUEVO CLIENTE
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
