import { createSlice } from "@reduxjs/toolkit";

const ordersListSlice = createSlice({
  name: "ordersList",
  initialState: {
    orders: [],
    selectOrder: null,

    activeProduct: null,
    activeProductUnitPrice: null,
    activeProductCost: null,
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
          originalUnitPrice: product.unitPrice,
          visible: true,
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
      state.activeProduct = action.payload.product;
      state.activeProductUnitPrice = action.payload.unitPrice;
      state.activeProductCost = action.payload.cost;
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
            visible: action.payload.visible,
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
      activeProductUnitPrice= null;
      activeProductCost= null;
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
