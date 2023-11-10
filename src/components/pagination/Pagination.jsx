import styles from "./pagination.module.css";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { AiOutlineHome } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearSearchOfert } from "../../redux/ofertsSlice";
import { cashMode, sellMode } from "../../redux/uiSlice";

export const Pagination = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { windows } = useSelector((store) => store.ui);

  return (
    <div className={styles.products_pagination}>
      <div className={styles.products_pagination_flex}>
        <div className={styles.products_pagination_buttons}>
          <button
            className={
              windows === "ventas"
                ? styles.products_pagination_btn_active
                : styles.products_pagination_btn
            }
            onClick={() => {
              navigate("/");
              dispatch(sellMode());
            }}
          >
            Ventas
          </button>
          <button
            className={
              windows === "caja"
                ? styles.products_pagination_btn_active
                : styles.products_pagination_btn
            }
            onClick={() => {
              navigate("/caja");
              dispatch(cashMode());
            }}
          >
            Caja
          </button>
        </div>
        <div className={styles.flex}>
          <BsChevronLeft
            onClick={() => {
              navigate(-1);
              dispatch(clearSearchOfert());
            }}
          />

          <AiOutlineHome
            onClick={() => {
              navigate("/");
              dispatch(clearSearchOfert());
            }}
          />
          <BsChevronRight
            onClick={() => {
              navigate(+1);
              dispatch(clearSearchOfert());
            }}
          />

          {/*     <BsChevronRight />
          <BsChevronDoubleRight /> */}
        </div>
      </div>
    </div>
  );
};
