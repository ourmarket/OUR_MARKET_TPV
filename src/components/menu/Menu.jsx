import { useDispatch, useSelector } from "react-redux";
import styles from "./menu.module.css";
import { closeMenu } from "../../redux/uiSlice";
import { Link } from "react-router-dom";
import { logOut } from "../../redux/authSlice";
import { useSocket } from "../../hooks/useSocket";
import { apiSlice } from "../../api/apiSlice";
import { finishSession } from "../../redux/userSlice";
import { useLogoutMutation } from "../../api/apiAuth";

export const Menu = () => {
  const dispatch = useDispatch();
  const { disconnectSocket } = useSocket();
  const { menu } = useSelector((store) => store.ui);
  const { sessionCashier } = useSelector((store) => store.user);

  const [apiLogOut] = useLogoutMutation();

  const handleLogout = () => {
    dispatch(logOut());
    dispatch(finishSession());
    dispatch(closeMenu());
    disconnectSocket();
    dispatch(apiSlice.util.resetApiState());
    apiLogOut();
  };

  return (
    <section className={menu ? styles.container_active : styles.container}>
      <button
        className={styles.btn_close}
        onClick={() => dispatch(closeMenu())}
      >
        x
      </button>
      <div className={styles.menu__logo_container}>
        <div className={styles.menu__logo}>
          <img
            src="https://ik.imagekit.io/mrprwema7/OurMarket/our-market-low-resolution-logo-color-on-transparent-background_tryvGRTNa.png?updatedAt=1695680889949"
            alt="logo"
          />
        </div>
      </div>
      <ul className={styles.menu_list}>
        <Link to={"/"} onClick={() => dispatch(closeMenu())}>
          <li>Modo Vendedor</li>
        </Link>
        <Link to={"/caja"} onClick={() => dispatch(closeMenu())}>
          <li>Modo Cajero</li>
        </Link>
        {sessionCashier && (
          <Link to={"/caja/resumen"} onClick={() => dispatch(closeMenu())}>
            <li>Resumen Caja</li>
          </Link>
        )}

        <li>
          <a
            href={import.meta.env.VITE_APP_DASHBOARD}
            target="_blank"
            rel="noreferrer"
            onClick={() => dispatch(closeMenu())}
          >
            Administrador
          </a>
        </li>
        {!sessionCashier && <li onClick={handleLogout}>Cerrar Sesión</li>}
      </ul>
    </section>
  );
};
