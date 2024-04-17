import { createSlice } from "@reduxjs/toolkit";
import { mergeArrays } from "../utils/adjustStock";

const ordersListSlice = createSlice({
  name: "ordersList",
  initialState: {
    orders: [],
    selectOrder: null,

    activeProduct: null,
    payment: {
      cash: 0,
      transfer: 0,
      debt: 0,
    },
  },
  reducers: {
    setCash: (state, action) => {
      state.payment = {
        ...state.payment,
        cash: action.payload,
      };
    },
    setTransfer: (state, action) => {
      state.payment = {
        ...state.payment,
        transfer: action.payload,
      };
    },
    setDebt: (state, action) => {
      state.payment = {
        ...state.payment,
        debt: action.payload,
      };
    },
    clearPayment: (state) => {
      state.payment = {
        cash: 0,
        transfer: 0,
        debt: 0,
      };
    },

    addOrder: (state, action) => {
      const newOrder = {
        ...action.payload,
        orderItems: action.payload.orderItems.map((product) => ({
          ...product,
          originalTotalQuantity: product.totalQuantity,
          originalUnitCost: product.unitCost,
          visible: true,

          allStockData: product.stockData.map((stock) => ({
            stockId: stock.stockId,
            quantity: stock.quantityOriginal,
            stock: stock.quantityNew,
            modify: stock.quantityModify,
            unitCost: stock.unitCost,
            dateStock: stock.dateStock,
          })),
          modifyStockData: product.stockData.map((stock) => ({
            stockId: stock.stockId,
            quantity: stock.quantityOriginal,
            stock: stock.quantityNew,
            modify: stock.quantityModify,
            unitCost: stock.unitCost,
            dateStock: stock.dateStock,
          })),
          stockData: product.stockData.map((stock) => ({
            stockId: stock.stockId,
            quantity: stock.quantityOriginal,
            stock: stock.quantityNew,
            modify: stock.quantityModify,
            unitCost: stock.unitCost,
            dateStock: stock.dateStock,
          })),
          modifyAvailableStock: product.stockAvailable.map((stock) => ({
            stockId: stock._id,
            quantity: stock.quantity,
            stock: stock.stock,
            unitCost: stock.unityCost,
            dateStock: stock.createdAt,
          })),
          availableStock: product.stockAvailable.map((stock) => ({
            stockId: stock._id,
            quantity: stock.quantity,
            stock: stock.stock,
            unitCost: stock.unityCost,
            dateStock: stock.createdAt,
          })),
        })),
      };
      state.orders = [...state.orders, newOrder];
    },
    addOrders: (state, action) => {
      state.orders = action.payload.map((order) => ({
        ...order,
        orderItems: order.orderItems.map((product) => ({
          ...product,
          originalTotalQuantity: product.totalQuantity,
          originalUnitCost: product.unitCost,
          visible: true,

          allStockData: product.stockData.map((stock) => ({
            stockId: stock.stockId,
            quantity: stock.quantityOriginal,
            stock: stock.quantityNew,
            modify: stock.quantityModify,
            unitCost: stock.unitCost,
            dateStock: stock.dateStock,
          })),
          modifyStockData: product.stockData.map((stock) => ({
            stockId: stock.stockId,
            quantity: stock.quantityOriginal,
            stock: stock.quantityNew,
            modify: stock.quantityModify,
            unitCost: stock.unitCost,
            dateStock: stock.dateStock,
          })),
          stockData: product.stockData.map((stock) => ({
            stockId: stock.stockId,
            quantity: stock.quantityOriginal,
            stock: stock.quantityNew,
            modify: stock.quantityModify,
            unitCost: stock.unitCost,
            dateStock: stock.dateStock,
          })),
          modifyAvailableStock: product.stockAvailable.map((stock) => ({
            stockId: stock._id,
            quantity: stock.quantity,
            stock: stock.stock,
            unitCost: stock.unityCost,
            dateStock: stock.createdAt,
          })),
          availableStock: product.stockAvailable.map((stock) => ({
            stockId: stock._id,
            quantity: stock.quantity,
            stock: stock.stock,
            unitCost: stock.unityCost,
            dateStock: stock.createdAt,
          })),
        })),
      }));
    },
    addSelectOrder: (state, action) => {
      state.selectOrder = action.payload;
      state.payment = {
        cash: 0,
        transfer: 0,
        debt: 0,
      };
    },
    clearSelectOrder: (state) => {
      state.selectOrder = null;
      state.selectOrderOriginalItems = null;
    },
    setActiveProduct: (state, action) => {
      state.activeProduct = action.payload;
    },
    clearActiveProduct: (state) => {
      state.activeProduct = null;
    },
    updateQuantityActiveProduct: (state, action) => {
      //actualizar la orden activa
      const productUpdate = state.selectOrder.orderItems.map((product) => {
        if (product.uniqueId === action.payload.id) {
          return {
            ...product,
            totalPrice: +action.payload.value * product.unitPrice,
            totalQuantity: +action.payload.value,
            unitCost: +action.payload.unitCost,
            modifyStockData: action.payload.modifyStockData,
            modifyAvailableStock: action.payload.modifyAvailableStock,
            visible: action.payload.visible,
            allStockData:
              product.originalTotalQuantity > +action.payload.totalQuantity
                ? action.payload.modifyStockData
                : mergeArrays(
                    action.payload.modifyStockData,
                    action.payload.modifyAvailableStock
                  ),
          };
        } else {
          return product;
        }
      });

      const subTotal = productUpdate.reduce((acc, cur) => {
        return acc + cur.totalPrice;
      }, 0);

      const total =
        productUpdate.reduce((acc, cur) => {
          return acc + cur.totalPrice;
        }, 0) + state.selectOrder.tax;

      state.selectOrder = {
        ...state.selectOrder,
        orderItems: productUpdate,
        subTotal,
        total,
        numberOfItems: productUpdate.filter((product) => product.visible)
          .length,
      };
      //actualizar orderList
      state.orders = state.orders.map((order) => {
        if (order._id === state.selectOrder._id) {
          return {
            ...order,
            orderItems: productUpdate,
            subTotal,
            total,
            numberOfItems: productUpdate.filter((product) => product.visible)
              .length,
          };
        } else {
          return order;
        }
      });
    },
    updatePriceActiveProduct: (state, action) => {
      const productUpdate = state.selectOrder.orderItems.map((product) => {
        if (product.uniqueId === action.payload.id) {
          return {
            ...product,
            totalPrice: +action.payload.value * product.totalQuantity,
            unitPrice: +action.payload.value,
          };
        } else {
          return product;
        }
      });

      const subTotal = productUpdate.reduce((acc, cur) => {
        return acc + cur.totalPrice;
      }, 0);

      const total =
        productUpdate.reduce((acc, cur) => {
          return acc + cur.totalPrice;
        }, 0) + state.selectOrder.tax;

      state.selectOrder = {
        ...state.selectOrder,
        orderItems: productUpdate,
        subTotal,
        total,
      };

      //actualizar orderList
      state.orders = state.orders.map((order) => {
        if (order._id === state.selectOrder._id) {
          return {
            ...order,
            orderItems: productUpdate,
            subTotal,
            total,
          };
        } else {
          return order;
        }
      });
    },
    deleteActiveProduct: (state, action) => {
      const productUpdate = state.selectOrder.orderItems.filter(
        (product) => product.uniqueId !== action.payload
      );
      const subTotal = productUpdate.reduce((acc, cur) => {
        return acc + cur.totalPrice;
      }, 0);

      const total =
        productUpdate.reduce((acc, cur) => {
          return acc + cur.totalPrice;
        }, 0) + state.selectOrder.tax;

      state.selectOrder = {
        ...state.selectOrder,
        orderItems: productUpdate,
        subTotal,
        total,
        numberOfItems: productUpdate.filter(
          (product) => product.totalQuantity > 0
        ).length,
      };

      //actualizar orderList
      state.orders = state.orders.map((order) => {
        if (order._id === state.selectOrder._id) {
          return {
            ...order,
            orderItems: productUpdate,
            subTotal,
            total,
            numberOfItems: productUpdate.filter(
              (product) => product.totalQuantity > 0
            ).length,
          };
        } else {
          return order;
        }
      });

      state.activeProduct = null;
    },
    deleteOrder: (state, action) => {
      state.orders = state.orders.filter(
        (order) => order._id !== action.payload
      );
      state.selectOrder = null;
      state.activeProduct = null;
    },
    updateProductOrder: (state, action) => {
      const newProduct = action.payload;
      const productUpdate = state.selectOrder.orderItems;
      productUpdate.push({
        ...newProduct,

        originalTotalQuantity: newProduct.totalQuantity,
        originalUnitCost: newProduct.unitCost,
        visible: true,

        allStockData: newProduct.stock.map((stock) => ({
          stockId: stock.stockId,
          quantity: stock.quantityOriginal,
          stock: stock.quantityNew,
          modify: stock.quantityModify,
          unitCost: stock.unitCost,
          dateStock: stock.dateStock,
        })),
        modifyStockData: newProduct.stock.map((stock) => ({
          stockId: stock.stockId,
          quantity: stock.quantityOriginal,
          stock: stock.quantityNew,
          modify: stock.quantityModify,
          unitCost: stock.unitCost,
          dateStock: stock.dateStock,
        })),
        stockData: newProduct.stock.map((stock) => ({
          stockId: stock.stockId,
          quantity: stock.quantityOriginal,
          stock: stock.quantityNew,
          modify: stock.quantityModify,
          unitCost: stock.unitCost,
          dateStock: stock.dateStock,
        })),
        modifyAvailableStock: newProduct.stockAvailable.map((stock) => ({
          stockId: stock._id,
          quantity: stock.quantity,
          stock: stock.stock,
          unitCost: stock.unityCost,
          dateStock: stock.createdAt,
        })),
        availableStock: newProduct.stockAvailable.map((stock) => ({
          stockId: stock._id,
          quantity: stock.quantity,
          stock: stock.stock,
          unitCost: stock.unityCost,
          dateStock: stock.createdAt,
        })),
      });

      const subTotal = productUpdate.reduce((acc, cur) => {
        return acc + cur.totalPrice;
      }, 0);

      const total =
        productUpdate.reduce((acc, cur) => {
          return acc + cur.totalPrice;
        }, 0) + state.selectOrder.tax;

      state.selectOrder = {
        ...state.selectOrder,
        numberOfItems: productUpdate.length,
        orderItems: productUpdate,
        subTotal,
        total,
      };

      //actualizar orderList
      state.orders = state.orders.map((order) => {
        if (order._id === state.selectOrder._id) {
          return {
            ...order,
            orderItems: productUpdate,
            subTotal,
            total,
          };
        } else {
          return order;
        }
      });
    },
    clearOrdersList: (state, action) => {
      state.selectOrder = null;
      state.activeProduct = null;
      state.orders = state.orders.filter(
        (order) => order._id !== action.payload
      );
    },
  },
});

export const {
  addOrder,
  addOrders,
  addSelectOrder,
  clearSelectOrder,
  setActiveProduct,
  clearActiveProduct,
  updateQuantityActiveProduct,
  updatePriceActiveProduct,
  deleteActiveProduct,
  deleteOrder,
  updateProductOrder,
  clearOrdersList,
  setCash,
  setDebt,
  setTransfer,
  clearPayment,
} = ordersListSlice.actions;
export default ordersListSlice.reducer;
