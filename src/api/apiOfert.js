import { apiSlice } from "./apiSlice";

export const ofertApi = apiSlice.injectEndpoints({
  keepUnusedDataFor: 60 * 2, // duración de datos en cache
  refetchOnMountOrArgChange: true, // revalida al montar el componente
  refetchOnFocus: true, // revalida al cambiar de foco
  refetchOnReconnect: true, // revalida al reconectar
  tagTypes: ["oferts"],

  endpoints: (builder) => ({
    getOferts: builder.query({
      query: (stock) => `/oferts?stock=${stock}`,
      // keepUnusedDataFor: 3,
      extraOptions: { maxRetries: 5 },
      providesTags: ["oferts"],
    }),

    getOfert: builder.query({
      query: (id) => `/oferts/${id}`,
      // keepUnusedDataFor: 3,
      extraOptions: { maxRetries: 3 },
      providesTags: ["oferts"],
    }),
    getOfertQuery: builder.query({
      query: ({ id, stock }) => `/oferts/${id}?stock=${stock}`,
      keepUnusedDataFor: 10,
      extraOptions: { maxRetries: 3 },
      providesTags: ["oferts"],
    }),
    getOfertByProductId: builder.query({
      query: (id) => `/oferts/product/${id}`,
      // keepUnusedDataFor: 3,
      extraOptions: { maxRetries: 3 },
      providesTags: ["oferts"],
    }),
    getOfertWithCategory: builder.query({
      query: () => `/oferts/categories`,
      // keepUnusedDataFor: 3,
      extraOptions: { maxRetries: 3 },
      providesTags: ["oferts"],
    }),
    getOfertWithCategoryById: builder.query({
      query: (id) => `/oferts/categories/${id}`,
      // keepUnusedDataFor: 3,
      extraOptions: { maxRetries: 3 },
      providesTags: ["oferts"],
    }),
    postOrder: builder.mutation({
      query: (newOrders) => ({
        url: "/orders/local",
        method: "post",
        body: newOrders,
      }),
      invalidatesTags: ["orders"],
      extraOptions: { maxRetries: 0 },
    }),
  }),
});

export const {
  useGetOfertsQuery,
  useGetOfertQuery,
  useGetOfertQueryQuery,
  useGetOfertByProductIdQuery,
  useGetOfertWithCategoryQuery,
  useGetOfertWithCategoryByIdQuery,
  usePostOrderMutation,
} = ofertApi;
