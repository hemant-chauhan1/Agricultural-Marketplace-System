// import {create} from 'zustand';
// import axios from 'axios';

// const API_URL = "http://localhost:5000/api/cart"; // Replace with your actual API URL

//  export const useCartStore = create((set) => ({
//   cart: [],
//   error: null,
//   isLoading: false,

//   // Add item to the cart
//   addToCart: async (userId, productId, quantity, price,image) => {
//     set({ isLoading: true, error: null });

//     try {
//       const response = await axios.post(`${API_URL}/add`, {
//         userId,
//         productId,
//         quantity,
//         price,
//         image
//       });
//         // console.log("response",response.data.success)
//       if (response.data.success) {
//         set((state) => ({
//           cart: [...state.cart, response.data.product], // Update the cart with new item
//           isLoading: false,
//         }));
//         return { success: true, message: "Product added to cart successfully!" };
//       } else {
//         set({ error: response.data.message, isLoading: false });
//         return { success: false, message: response.data.message}
//       }
//     } catch (error) {
//       set({ error: error.response?.data?.message || "Failed to add to cart", isLoading: false });
//       return { success: false, message: error.response?.data?.message || "Failed to add"}
//     }
//   },

//   // Remove item from cart
//   removeFromCart: async ( userId,productId) => {

//     set({ isLoading: true, error: null });
//     try {
//       const response = await axios.post(`${API_URL}/remove`, {
//         userId,
//         productId,
//       });

//       if (response.data.success) {
//         set((state) => ({
//           cart: state.cart.filter((item) => item.productId !== productId), // Remove the item from cart
//           isLoading: false,
//         }));
//         return { success: true, message: "Product removed from cart successfully!" };
//       } else {
//         set({ error: response.data.message, isLoading: false });
//         return { success: false, message: response.data.message }
//       }
//     } catch (error) {
//       set({ error: error.response?.data?.message || "Failed to remove from cart", isLoading: false });
//       return { success: false, message: error.response?.data?.message || "Failed to remove"}
//     }
//   },

//   // Update quantity of an item in cart
//   updateQuantity: async (userId, productId, quantity) => {
//     set({ isLoading: true, error: null });
//     try {
//       const response = await axios.post(`${API_URL}/update`, {
//         userId,
//         productId,
//         quantity,
//       });

//       if (response.data.success) {
//         set((state) => ({
//           cart: state.cart.map((item) =>
//             item.productId === productId ? { ...item, quantity } : item
//           ), // Update quantity of the item in cart
//           isLoading: false,
//         }));
//       } else {
//         set({ error: response.data.message, isLoading: false });
//       }
//     } catch (error) {
//       set({ error: error.response?.data?.message || "Failed to update quantity", isLoading: false });
//     }
//   },

//   // Get current cart
//   getCart: async (userId) => {
//     set({ isLoading: true, error: null });
//     try {
//       const response = await axios.get(`${API_URL}`, { params: { userId } });
//       // console.log(response.data.success)
//       if (response.data.success) {
//         set({ cart: response.data.cart, isLoading: false });
//       } else {
//         set({ error: response.data.message, isLoading: false });
//       }
//       // console.log("first product",cart)
//     } catch (error) {
//       set({ error: error.response?.data?.message || "Failed to fetch cart", isLoading: false });
//     }
//   },

//   // Clear the entire cart
//   clearCart: async (userId) => {
//     set({ isLoading: true, error: null });
//     try {                                                                '     '
//       const response = await axios.post(`${API_URL}/clear`, { userId });

//       if (response.data.success) {
//         set({ cart: [], isLoading: false });
//       } else {
//         set({ error: response.data.message, isLoading: false });
//       }
//     } catch (error) {
//       set({ error: error.response?.data?.message || "Failed to clear cart", isLoading: false });
//     }
//   },

//   // Check for errors in cart actions
//   checkCartError: () => {
//     set({ error: null });
//   },
// }));


import { create } from 'zustand';
import axios from 'axios';

const API_URL = "http://localhost:5000/api/cart"; // Backend cart API

export const useCartStore = create((set) => ({
  cart: { items: [], subTotal: 0 },
  error: null,
  isLoading: false,

  // Add item to cart
  addToCart: async (productId, quantity, price, image) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/add`,
        { productId, quantity, price, image },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        set({ cart: response.data.cart, isLoading: false }); // <-- full cart
        return { success: true, message: response.data.message };
      } else {
        set({ error: response.data.message, isLoading: false });
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      set({ error: error.response?.data?.message || "Failed to add to cart", isLoading: false });
      return { success: false, message: error.response?.data?.message || "Failed to add" };
    }
  },

  // Remove item from cart
  removeFromCart: async (cartItemId) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${API_URL}/remove`,
        { headers: { Authorization: `Bearer ${token}` }, data: { cartItemId } }
      );

      if (response.data.success) {
        set({ cart: response.data.cart, isLoading: false }); // <-- full cart
        return { success: true, message: response.data.message };
      } else {
        set({ error: response.data.message, isLoading: false });
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      set({ error: error.response?.data?.message || "Failed to remove from cart", isLoading: false });
      return { success: false, message: error.response?.data?.message || "Failed to remove" };
    }
  },

  // Clear entire cart
  clearCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${API_URL}/clear`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        set({ cart: { items: [], subTotal: 0 }, isLoading: false });
        return { success: true, message: response.data.message };
      } else {
        set({ error: response.data.message, isLoading: false });
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      set({ error: error.response?.data?.message || "Failed to clear cart", isLoading: false });
      return { success: false, message: error.response?.data?.message || "Failed to clear" };
    }
  },

  // Fetch cart
  getCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        set({ cart: response.data.cart, isLoading: false });
      } else {
        set({ error: response.data.message, isLoading: false });
      }
    } catch (error) {
      set({ error: error.response?.data?.message || "Failed to fetch cart", isLoading: false });
    }
  },

  checkCartError: () => set({ error: null }),
}));




