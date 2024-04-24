/* eslint-disable react-hooks/exhaustive-deps */

import { useSelector } from "react-redux";
import { HomeLayout } from "../components/homeLayout/HomeLayout";
import { Products } from "../components/products/Products";
import { useParams } from "react-router-dom";
import { useGetOfertWithCategoryByIdQuery } from "../api/apiOfert";
import Loading from "../components/loading/Loading";

export const ProductsPage = () => {
  const { id } = useParams();
  const { searchOfert, allOferts } = useSelector((store) => store.oferts);

  const { data, isLoading, isError } = useGetOfertWithCategoryByIdQuery(id);

  const filterAllOferts = allOferts.filter((item) => item.stock.length > 0);

  if (allOferts.length === 0) {
    return (
      <HomeLayout>
        {isLoading && <Loading />}
        {isError && <h1>Ha ocurrido un error</h1>}
        {data && <Products oferts={data.data.oferts} />}
      </HomeLayout>
    );
  }

  return (
    <HomeLayout>
      {searchOfert ? (
        <Products oferts={searchOfert} />
      ) : (
        <Products oferts={filterAllOferts} />
      )}
    </HomeLayout>
  );
};
