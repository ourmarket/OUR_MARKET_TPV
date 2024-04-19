import { useParams } from "react-router-dom";
import { HomeLayout } from "../components/homeLayout/HomeLayout";
import { Stocks } from "../components/stocks/Stocks";
import { useGetOfertQueryQuery } from "../api/apiOfert";
import Loading from "../components/loading/Loading";

export const StocksPage = () => {
  const { id } = useParams();

  const { data, isLoading, isError } = useGetOfertQueryQuery({ id, stock: 1 });

  return (
    <HomeLayout>
      {isLoading && <Loading />}
      {isError && <h1>Ha ocurrido un error</h1>}
      {data && <Stocks ofert={data.data.ofert} stock={data.data.stock} />}
    </HomeLayout>
  );
};
