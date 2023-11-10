import { apiSlice } from "./apiSlice";

export const cashierSessionApi = apiSlice.injectEndpoints({
  keepUnusedDataFor: 60, // duración de datos en cache
  refetchOnMountOrArgChange: true, // revalida al montar el componente
  refetchOnFocus: true, // revalida al cambiar de foco
  refetchOnReconnect: true, // revalida al reconectar
  tagTypes: ["cashierSession"],

  endpoints: (builder) => ({
    getCashierSessions: builder.query({
      query: () => "/cashierSession",
      // keepUnusedDataFor: 3,
      extraOptions: { maxRetries: 5 },
      providesTags: ["cashierSession"],
    }),

    getCashierSession: builder.query({
      query: ({ id, orders = "" }) => `/cashierSession/${id}?orders=${orders}`,
      // keepUnusedDataFor: 3,
      extraOptions: { maxRetries: 3 },
      providesTags: ["cashierSession"],
    }),

    postCashierSession: builder.mutation({
      query: (items) => ({
        url: "/cashierSession",
        method: "post",
        body: items,
      }),
      invalidatesTags: ["cashierSession"],
      extraOptions: { maxRetries: 0 },
    }),

    putCashierSession: builder.mutation({
      query: ({ id, ...items }) => ({
        url: `/cashierSession/${id}`,
        method: "put",
        body: items,
      }),
      invalidatesTags: ["cashierSession"],
      extraOptions: { maxRetries: 0 },
    }),

    deleteCashierSession: builder.mutation({
      query: (id) => ({
        url: `/cashierSession/${id}`,
        method: "delete",
      }),
      invalidatesTags: ["cashierSession"],
      extraOptions: { maxRetries: 0 },
    }),
  }),
});

export const {
  useGetCashierSessionsQuery,
  useGetCashierSessionQuery,
  usePostCashierSessionMutation,
  usePutCashierSessionMutation,
  useDeleteCashierSessionMutation,
} = cashierSessionApi;
