import { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import styles from "./clientRegister.module.css";

export const ClientRegisterPage = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const ref = searchParams.get("ref");
  const link = searchParams.get("link");
  const tenant = searchParams.get("tenant");

  const handleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const { credential } = credentialResponse;
      
      const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:3040/api';

      await axios.post(`${API_URL}/clients/auth/google`, {
        token: credential,
        ref,
        link,
        tenant
      });

      setSuccess(true);
      Swal.fire({
        title: "¡Éxito!",
        text: "Tu cuenta ha sido validada y vinculada correctamente.",
        icon: "success",
        confirmButtonColor: "#05839b",
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al procesar tu solicitud.",
        icon: "error",
        confirmButtonColor: "#05839b",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img src="/logo.png" alt="Logo" className={styles.logo} />
        <h2>Registro de Cliente</h2>
        
        {success ? (
          <div className={styles.successBox}>
            <h3>¡Validación Exitosa!</h3>
            <p>Ya puedes cerrar esta pestaña y volver al local.</p>
          </div>
        ) : (
          <>
            <p className={styles.subtitle}>
              Continúa con Google para verificar tu cuenta y acceder a los beneficios y descuentos del local de manera rápida y segura.
            </p>

            <div className={styles.googleBtnContainer}>
              {loading ? (
                <p>Procesando...</p>
              ) : (
                <GoogleLogin
                  onSuccess={handleSuccess}
                  onError={() => {
                    Swal.fire({
                      title: "Error",
                      text: "Error al iniciar sesión con Google",
                      icon: "error",
                    });
                  }}
                  useOneTap
                  theme="outline"
                  shape="rectangular"
                  width="100%"
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
