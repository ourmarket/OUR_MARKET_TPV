/* eslint-disable react/prop-types */
import { useState } from "react";
import styles from "./loginSessionCashier.module.css";
import { v4 as uuidv4 } from "uuid";
import { usePostCashierSessionMutation } from "../../api/apiCashierSession";
import { useDispatch, useSelector } from "react-redux";
import { useGetUserQuery } from "../../api/userApi";
import Loading from "../loading/Loading";
import { initSession } from "../../redux/userSlice";

export const LoginSessionCashier = () => {
  const { user: id } = useSelector((store) => store.auth);

  const { data, isLoading, isError, error } = useGetUserQuery(id);

  return (
    <section className={styles.container}>
      {isLoading && <Loading />}
      {isError && (
        <div className={styles.error}>
          <p>⚠ Error: {error.data?.msg || "Ha ocurrido un error"}</p>
        </div>
      )}
      {data && <FormSession user={data.data.user} />}
    </section>
  );
};

const FormSession = ({ user }) => {
  const [cashier, setCashier] = useState(`${user.name} ${user.lastName}`);
  const [cash, setCash] = useState(0);
  const dispatch = useDispatch();

  const [newSessionCashier, { isLoading, isError, error }] =
    usePostCashierSessionMutation();

  const handleCashierChange = (e) => {
    setCashier(e.target.value);
  };
  const handleCashChange = (e) => {
    setCash(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      sessionId: uuidv4(),
      user: user._id,
      role: user.role,
      initialCash: cash,
      finalCash: 0,

      payment: {
        cash: 0,
        transfer: 0,
        debt: 0,
      },

      initDate: new Date(),
      finishDate: null,

      localOrder: [],
      deliveryOrder: [],
    };
    const session = await newSessionCashier({
      ...data,
    }).unwrap();
    if (session.ok) {
      console.log(session);
      dispatch(initSession(session.data.session._id));
    }
  };

  return (
    <div className={styles.wrapper}>
      <h2>Apertura de caja</h2>
      <form action="" onSubmit={handleSubmit}>
        <div className={styles.input__container}>
          <label>Cajero/a</label>
          <input
            type="text"
            value={cashier}
            onChange={handleCashierChange}
            disabled
          />
        </div>
        <div className={styles.input__container}>
          <label>Efectivo existente</label>
          <input
            type="number"
            autoFocus
            value={cash}
            onChange={handleCashChange}
          />
        </div>
        <button
          className={`btn-load ${isLoading ? "button--loading" : ""}`}
          type="submit"
          disabled={isLoading}
          style={{ marginTop: "20px" }}
        >
          <span className="button__text">Enviar</span>
        </button>
        {isError && (
          <div className={styles.error}>
            <p>⚠ Error: {error.data?.msg || "Ha ocurrido un error"}</p>
          </div>
        )}
      </form>
    </div>
  );
};
