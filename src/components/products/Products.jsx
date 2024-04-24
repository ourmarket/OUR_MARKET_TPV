/* eslint-disable react/prop-types */
import { useNavigate, useParams } from "react-router-dom";
import styles from "./products.module.css";
import { IoMdArrowBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { clearSearchOfert } from "../../redux/ofertsSlice";

export const Products = ({ oferts }) => {
  const { id } = useParams();

  const { searchOfert } = useSelector((store) => store.oferts);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const filterOferts = oferts.filter(
    (item) => item?.product?.category === id || item?.category === id
  );

  return (
    <div className={styles.scroll}>
      <div className={styles.main_products}>
        <div
          className={styles.product_card}
          onClick={() => {
            navigate("/");
            dispatch(clearSearchOfert());
          }}
        >
          <IoMdArrowBack />
          <h3>Volver</h3>
        </div>
        {searchOfert &&
          searchOfert.map((ofert) => {
            return (
              <div
                className={styles.product_card}
                key={ofert._id}
                onClick={() => navigate(`/oferta/${ofert._id}`)}
              >
                <img
                  src={`${ofert.product.img}?tr=w-300,h-300`}
                  alt={ofert.product.name}
                />
                <div className={styles.product_card_name}>
                  <h3>{ofert.description}</h3>
                </div>
              </div>
            );
          })}
        {!searchOfert &&
          filterOferts.map((ofert) => {
            return (
              <div
                className={styles.product_card}
                key={ofert._id}
                onClick={() => navigate(`/oferta/${ofert._id}`)}
              >
                <img
                  src={ofert?.product?.img || ofert.img}
                  alt={ofert?.product?.name || ofert.name}
                />
                <div className={styles.product_card_name}>
                  <h3>{ofert.description}</h3>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
