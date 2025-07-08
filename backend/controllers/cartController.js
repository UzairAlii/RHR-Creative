import userModel from "../models/userModel.js";

const addToCart = async (req, res) => {
  try {
    const { itemId, selectedColor, imageIndex, quantity } = req.body;
    const userId = req.userId;


    const imageIdx = String(imageIndex);

    const cartPath = `cartData.${itemId}.${selectedColor}.${imageIdx}`;


    const result = await userModel.updateOne(
      { _id: userId },
      { $inc: { [cartPath]: quantity } },
      { upsert: true }
    );


    const updatedUser = await userModel.findById(userId);



    res.json({
      success: true,
      msg: "Item added to cart",
      cartData: updatedUser.cartData
    });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


const UpdateCart = async (req, res) => {
  try {
    const { itemId, selectedColor, imageIndex, quantity } = req.body;
    const userId = req.userId;

    const userData = await userModel.findById(userId);
    if (!userData) return res.status(404).json({ success: false, message: "User not found" });

    let cartData = userData.cartData || {};
    const imageIdx = String(imageIndex);

    if (!cartData[itemId]) cartData[itemId] = {};
    if (!cartData[itemId][selectedColor]) cartData[itemId][selectedColor] = {};

    cartData[itemId][selectedColor][imageIdx] = quantity;

    await userModel.findByIdAndUpdate(userId, { cartData }, { new: true });

    res.json({ success: true, msg: "Cart updated", cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const getUserCart = async (req, res) => {
  try {
    const userId = req.userId;

    const userData = await userModel.findById(userId);
    if (!userData) return res.status(404).json({ success: false, message: "User not found" });

    const cartData = userData.cartData || {};
    res.json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { itemId, selectedColor, imageIndex } = req.body;
    const userId = req.userId;

    const userData = await userModel.findById(userId);
    if (!userData) return res.status(404).json({ success: false, message: "User not found" });

    const imageIdx = String(imageIndex);
    const cartPath = `cartData.${itemId}.${selectedColor}.${imageIdx}`;

    const updateResult = await userModel.updateOne(
      { _id: userId },
      { $unset: { [cartPath]: "" } }
    );

    if (updateResult.modifiedCount === 0) {
      return res.status(400).json({ success: false, message: "Item not found in the cart" });
    }

    const updatedUser = await userModel.findById(userId);
    const updatedCart = updatedUser.cartData;

    const cleanEmpty = (obj) => {
      for (const key in obj) {
        if (typeof obj[key] === "object") {
          cleanEmpty(obj[key]);
          if (Object.keys(obj[key]).length === 0) {
            delete obj[key];
          }
        }
      }
    };
    cleanEmpty(updatedCart);

    await userModel.updateOne({ _id: userId }, { cartData: updatedCart });

    res.json({ success: true, message: "Item removed", cartData: updatedCart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addToCart, UpdateCart, getUserCart, removeFromCart };
