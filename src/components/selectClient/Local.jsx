import { useDispatch, useSelector } from "react-redux";
import styles from "./client.module.css";
import { useState, useEffect } from "react";
import { addClient } from "../../redux/orderSlice";
import { closeLocalOrder } from "../../redux/uiSlice";
import { QRCodeSVG } from "qrcode.react";
import { useLazyGetClientQuery, useLazyGetClientsQuery } from "../../api/apiClient";
import { getAllClients } from "../../redux/clientsSlice";

export const Local = () => {
  const dispatch = useDispatch();
  const { allClients } = useSelector((store) => store.clients);
  const [fetchClient, { isFetching }] = useLazyGetClientQuery();
  const [fetchClients] = useLazyGetClientsQuery();

  useEffect(() => {
    fetchClients().unwrap().then((res) => {
      if (res?.data?.clients) {
        dispatch(getAllClients(res.data.clients));
      }
    }).catch(console.error);
  }, [fetchClients, dispatch]);

  const [value, setValue] = useState("");
  const [selectClient, setSelectClient] = useState(null);

  const handleVerify = async () => {
    if (selectClient?._id) {
      try {
        const response = await fetchClient(selectClient._id).unwrap();
        if (response?.data?.client) {
          setSelectClient(response.data.client);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const onSearch = ({ searchClient, client }) => {
    setValue(searchClient);
    setSelectClient(client);
  };
  const onReset = () => {
    setValue("");
    setSelectClient(null);
  };

  const handleSend = () => {
    dispatch(addClient(selectClient));
    dispatch(closeLocalOrder());
  };
  return (
    <section className={styles.container}>
      <div className={styles.client_box}>
        <button
          className={styles.bnt_close}
          onClick={() => dispatch(closeLocalOrder())}
        >
          x
        </button>
        <h2>Orden local</h2>
        <div className={styles.input_container}>
          <input
            type="text"
            placeholder="Ingresa nombre completo o teléfono"
            value={value}
            onChange={onChange}
            autoFocus
          />
          <button className={styles.bnt_reset} onClick={onReset}>
            X
          </button>
        </div>

        <div className={styles.dropdown}>
          {!value && allClients.length > 0 && (
            <div style={{ padding: '8px 12px', fontSize: '12px', color: '#666', backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>
              Registrados recientemente
            </div>
          )}
          {[...allClients]
            .filter((item) => {
              if (!item || !item.user) return false;
              
              if (!value) return true;

              const searchTerm = value.toLowerCase();
              const fullName = `${item.user.name?.toLowerCase() || ''} ${item.user.lastName?.toLowerCase() || ''}`;
              const phone = item.user.phone ? item.user.phone.toLowerCase() : "";

              return (
                (fullName.includes(searchTerm) || phone.includes(searchTerm)) &&
                fullName !== searchTerm
              );
            })
            .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
            .slice(0, value ? 11 : 5)
            .map((item) => (
              <div
                onClick={() =>
                  onSearch({
                    searchClient: `${item.user?.name || ''} ${item.user?.lastName || ''} - Tel: ${item.user?.phone || 'N/A'}`,
                    client: item,
                  })
                }
                className={styles.dropdown_row}
                key={item._id}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span>{`${item.user?.name || ''} ${item.user?.lastName || ''} - Tel: ${item.user?.phone || 'N/A'}`}</span>
                {!value && item.createdAt && (
                  <span style={{ fontSize: '11px', color: '#888', whiteSpace: 'nowrap', marginLeft: '10px' }}>
                    {new Date(item.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                  </span>
                )}
              </div>
            ))}
        </div>
        {selectClient && (
          <div className={styles.client_data}>
            <h2>Datos del cliente</h2>
            <div className={styles.field}>
              <span>Nombre</span>
              <p>{selectClient.user.name}</p>
            </div>
            <div className={styles.field}>
              <span>Apellido</span>
              <p>{selectClient.user.lastName}</p>
            </div>
            <div className={styles.field} style={{ flexDirection: "column", alignItems: "flex-start" }}>
              <span>Email</span>
              {selectClient.user.google ? (
                <p style={{ marginTop: "5px" }}>{selectClient.user.email}</p>
              ) : (
                <div style={{ marginTop: "10px", textAlign: "center", width: "100%", padding: "10px", backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
                  <p style={{ color: "#d32f2f", marginBottom: "10px", fontSize: "14px", fontWeight: "500" }}>
                    Cuenta no vinculada. Escanea para vincular con Google:
                  </p>
                  <QRCodeSVG 
                    value={`${window.location.origin}/#/client-register?link=${selectClient._id}`} 
                    size={120} 
                  />
                  <div style={{ marginTop: "15px" }}>
                    <button 
                      onClick={handleVerify}
                      disabled={isFetching}
                      style={{
                        backgroundColor: "#05839b",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "4px",
                        cursor: isFetching ? "not-allowed" : "pointer",
                        fontSize: "13px",
                        opacity: isFetching ? 0.7 : 1
                      }}
                    >
                      {isFetching ? "Verificando..." : "Ya escaneé el código"}
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className={styles.field}>
              <span>Teléfono</span>
              <p>{selectClient.user.phone || 'N/A'}</p>
            </div>
            <button className={styles.btn_send} onClick={handleSend}>
              Enviar
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
