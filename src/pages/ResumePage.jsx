import { useSelector } from "react-redux";
import { Menu } from "../components/menu/Menu";
import { NavbarOrder } from "../components/navbarOrder/NavbarOrder";
import { Pagination } from "../components/pagination/Pagination";
import { Resume } from "../components/resume/Resume";
import { ResumeDetails } from "../components/resume/components/ResumeDetails";
import { useGetCashierSessionQuery } from "../api/apiCashierSession";
import Loading from "../components/loading/Loading";

export const ResumePage = () => {
  const { sessionCashier } = useSelector((store) => store.user);
  const { data, isLoading, isError } = useGetCashierSessionQuery({
    id: sessionCashier,
    orders: "all",
  });

  return (
    <>
      <Menu />
      <main style={{ display: "flex", height: "100vh", width: "100%" }}>
        <div style={{ width: "70%", position: "relative" }}>
          <NavbarOrder />
          {isLoading && <Loading />}
          {isError && <p>Ha ocurrido un error</p>}
          {data && <Resume data={data.data.orders} />}

          <Pagination />
        </div>
        <div style={{ width: "30%", borderLeft: "1px solid #ccc" }}>
          {data && <ResumeDetails data={data.data} />}
        </div>
      </main>
    </>
  );
};
