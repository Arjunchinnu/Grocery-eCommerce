// add address

import Address from "../models/Address.js";
export const addAddress = async (req, res) => {
  try {
    const { address } = req.body;
    const userId = req.user.id;

    if (!address || !userId) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid address or userId" });
    }

    await Address.create({ ...address, userId });
    res.json({ success: true, message: "address added successfully" });
  } catch (err) {
    console.log("error in add address controller", err.message);
    res.json({ success: false, message: err.message });
  }
};

export const getAddress = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "userId is required" });
    }

    const addresses = await Address.find({ userId });

    res.status(200).json({ success: true, addresses });
  } catch (err) {
    console.error("Error in getAddress:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
