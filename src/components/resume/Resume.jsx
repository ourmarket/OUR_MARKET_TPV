/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import styles from "./resume.module.css";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { dateToLocalDate } from "../../utils/formatDate";
import { formatPrice } from "../../utils/formatPrice";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor("deliveryDate", {
    header: () => <span>Fecha</span>,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.client, {
    id: "client",
    header: () => <span>Cliente</span>,
    cell: (info) => info.getValue(),
  }),

  columnHelper.accessor("numberOfItems", {
    header: "Num. Prod.",
  }),

  columnHelper.accessor("cash", {
    header: "Efectivo",
  }),
  columnHelper.accessor("transfer", {
    header: "Transf.",
  }),
  columnHelper.accessor("debt", {
    header: "Deuda",
  }),
  columnHelper.accessor("total", {
    header: "Total",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("paid", {
    header: () => "Pago",
    cell: (info) =>
      info.getValue() ? (
        <div
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <div
            style={{
              height: "30px",
              width: "30px",
              borderRadius: "50%",
              backgroundColor: "green",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
            }}
          >
            <AiOutlineCheck />
          </div>
        </div>
      ) : (
        <div
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <div
            style={{
              height: "30px",
              width: "30px",
              borderRadius: "50%",
              backgroundColor: "red",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            <AiOutlineClose />
          </div>
        </div>
      ),
  }),
];

export const Resume = ({ data }) => {
  const table = useReactTable({
    data: data.map((order) => ({
      ...order,
      deliveryDate: dateToLocalDate(order.deliveryDate),
      client: `${order.shippingAddress.name} ${order.shippingAddress.lastName}`,
      total: formatPrice(order.total),
      cash: formatPrice(order.payment.cash),
      transfer: formatPrice(order.payment.transfer),
      debt: formatPrice(order.payment.debt),
    })),
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <section className={styles.container}>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  style={{
                    textAlign: "center",
                    padding: "8px",
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};
