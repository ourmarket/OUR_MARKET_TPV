import { ErrorMessage, Field, Form, Formik } from "formik";
import styles from "./login.module.css";
import * as Yup from "yup";
import { useLoginMutation } from "../../api/apiAuth";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const SignupSchema = Yup.object().shape({
  email: Yup.string().email("Formato invalido").required("*Requerido"),
  password: Yup.string().min(6, "6 caracteres mínimo").required("*Requerido"),
  clientId: Yup.string().required("*Requerido"),
});

export const Login = () => {
  const [login, { isLoading, isError, error }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [rememberMe, setRememberMe] = useState(true);

  useEffect(() => {
    const storedEmail = localStorage.getItem("rememberedEmail_tpv");
    const storedClientId = localStorage.getItem("rememberedClientId_tpv");

    if (storedEmail && storedClientId) {
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (values) => {
    try {
      const userData = await login({
        email: values.email,
        clientId: values.clientId,
        password: values.password,
      }).unwrap();
      if (userData) {
        dispatch(setCredentials({ ...userData }));

        if (rememberMe) {
          localStorage.setItem("rememberedEmail_tpv", values.email);
          localStorage.setItem("rememberedClientId_tpv", values.clientId);
        } else {
          localStorage.removeItem("rememberedEmail_tpv");
          localStorage.removeItem("rememberedClientId_tpv");
        }

        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.left}>
        <div className={styles.logo_container}>
          <img
            src="https://ik.imagekit.io/mrprwema7/OurMarket/our-market-low-resolution-logo-color-on-transparent-background_tryvGRTNa.png?updatedAt=1695680889949"
            alt="logo"
          />
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.form_container}>
          <h2>TPV - Ingresar</h2>
          <Formik
            initialValues={{
              email: rememberMe
                ? localStorage.getItem("rememberedEmail_tpv") || ""
                : "",
              clientId: rememberMe
                ? localStorage.getItem("rememberedClientId_tpv") || ""
                : "",
              password: "",
            }}
            validationSchema={SignupSchema}
            onSubmit={(values, { resetForm }) => {
              handleSubmit(values);
              resetForm();
            }}
          >
            {() => (
              <Form>
                <div className={styles.input__container}>
                  <img
                    src="https://ik.imagekit.io/mrprwema7/OurMarket/user_OkKLt0tst%20(1)__K2sUFDZJ.png?updatedAt=1695681678392"
                    alt="icono usuario"
                  />
                  <Field
                    type="email"
                    name="email"
                    placeholder="Ingresa tu email"
                  />
                </div>

                <ErrorMessage
                  name="email"
                  component="p"
                  className="form__error"
                />
                <div className={styles.input__container}>
                  <img
                    src="https://ik.imagekit.io/mrprwema7/OurMarket/user_OkKLt0tst%20(1)__K2sUFDZJ.png?updatedAt=1695681678392"
                    alt="icono usuario"
                  />
                  <Field
                    type="text"
                    name="clientId"
                    placeholder="Ingresa el id del cliente"
                  />
                </div>

                <ErrorMessage
                  name="clientId"
                  component="p"
                  className="form__error"
                />
                <div className={styles.input__container}>
                  <img
                    src="https://ik.imagekit.io/mrprwema7/OurMarket/password_sMXDhy2rr%20(1)_Z8pTPQmhK.png?updatedAt=1695681678685"
                    alt="icono password"
                  />

                  <Field
                    type="password"
                    name="password"
                    placeholder="Ingresa tu contraseña"
                  />
                </div>
                <ErrorMessage
                  name="password"
                  component="p"
                  className="form__error"
                />
                <div className={styles.checkbox}>
                  <input
                    type="checkbox"
                    name="remember"
                    id="remember"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <label htmlFor="remember">Recordar</label>
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
                    <p>⚠ Error:</p>
                    <p>{error.data?.msg || "Ha ocurrido un error"}</p>
                  </div>
                )}
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <footer>
        <small>
          &copy; {new Date().getFullYear()}, made with ❤ by
          <a href="www.our-market.com.ar">&nbsp;OurMarket&nbsp;</a>
        </small>
      </footer>
    </main>
  );
};
