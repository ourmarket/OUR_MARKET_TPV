import { HashRouter, Route, Routes } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage";
import { HomePage } from "../pages/HomePage";
import { ProductsPage } from "../pages/ProductsPage";
import { CashierPage } from "../pages/CashierPage";
import { StocksPage } from "../pages/StocksPage";
import { ClientRegisterPage } from "../pages/ClientRegisterPage";
import PersistLogin from "./PersitRouter";
import RequireAuth from "./RequiereAuth";
import { ResumePage } from "../pages/ResumePage";

export const AppRouter = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/client-register" element={<ClientRegisterPage />} />

        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/categoria/:id" element={<ProductsPage />} />
            <Route path="/oferta/:id" element={<StocksPage />} />
            <Route path="/caja" element={<CashierPage />} />
            <Route path="/caja/resumen" element={<ResumePage />} />
          </Route>
        </Route>
      </Routes>
    </HashRouter>
  );
};
