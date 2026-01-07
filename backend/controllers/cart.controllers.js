import Cart from "../models/cart.model.js";

// Fetch user's cart
export const getCart = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not found",
      });
    }

    const cart = await Cart.findOne({ userId: req.user.userId }).populate(
      "items.productId",
      "name price unit image"
    );

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart is empty",
        cart: { items: [], subTotal: 0 },
      });
    }

    res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching cart",
      error: error.message,
    });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
    console.log("req.user:", req.user);      // <-- Add this line
  console.log("req.body:", req.body);
  const { productId, quantity, price, image } = req.body;

  if (!req.user || !req.user.userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  if (!productId || !quantity || !price) {
    return res.status(400).json({
      success: false,
      message: "Product ID, quantity, and price are required",
    });
  }

  try {
    let cart = await Cart.findOne({ userId: req.user.userId });

    if (cart) {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
        cart.items[itemIndex].total = cart.items[itemIndex].quantity * price;
      } else {
        cart.items.push({ productId, quantity, price, image, total: quantity * price });
      }
    } else {
      cart = new Cart({
        userId: req.user.userId,
        items: [{ productId, quantity, price, image, total: quantity * price }],
      });
    }

    await cart.save();
    const populatedCart = await cart.populate("items.productId", "name price unit image");
    res.status(200).json({ success: true, message: "Item added to cart", cart: populatedCart });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding item to cart",
      error: error.message,
    });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  const { cartItemId } = req.body;

  if (!req.user || !req.user.userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const cart = await Cart.findOne({ userId: req.user.userId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    cart.items = cart.items.filter((item) => item._id.toString() !== cartItemId);

    await cart.save();
    const populatedCart = await cart.populate("items.productId", "name price unit image");
    res.status(200).json({ success: true, message: "Item removed from cart", cart: populatedCart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error removing item from cart", error: error.message });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  if (!req.user || !req.user.userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const cart = await Cart.findOneAndUpdate(
      { userId: req.user.userId },
      { items: [], subTotal: 0 },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Cart cleared", cart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error clearing cart", error: error.message });
  }
};
