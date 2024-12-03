import ReceivedItem from "../models/receive.model.js";
import Item from "../models/item.model.js";
import createHistory from "../middlewares/item.middleware.js";

// POST: Create a new received item
export const createReceivedItem = async (req, res) => {
  try {
    const { projectId } = req.params;
    const {
      workOrderNo,
      items,
      requistioner,
      receivedBy,
      dateReceived,
      remarks,
    } = req.body;

    // Validate each item and check if it exists in the Item model
    const itemPromises = items.map(async ({ item }) => {
      const foundItem = await Item.findById(item);
      if (!foundItem) {
        throw new Error(`Item with ID ${item} not found`);
      }
      return foundItem;
    });

    // Ensure all items are valid before proceeding
    await Promise.all(itemPromises);
    // Create the received item with all items
    const receivedItem = new ReceivedItem({
      project: projectId,
      requistioner,
      receivedBy,
      dateReceived,
      workOrderNo,
      remarks,
      items,
    });
    await receivedItem.save();
    // Update qtyIn and stockOnHand for each item in items array
    const updatePromises = items.map(async ({ item, qtyIn }) => {
      const updatedItem = await Item.findByIdAndUpdate(
        item,
        { $inc: { qtyIn, stockOnHand: qtyIn } },
        { new: true }
      );
      await createHistory(
        updatedItem,
        "received",
        updatedItem,
        null,
        0,
        qtyIn,
        workOrderNo
      );
      return updatedItem;
    });
    const updatedItems = await Promise.all(updatePromises);

    res.status(201).json({ receivedItem, updatedItems });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT: Update a received item
export const updateReceivedItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { items, ...updateData } = req.body;

    // Find the existing received item
    const receivedItem = await ReceivedItem.findById(itemId);
    if (!receivedItem) {
      return res.status(404).json({ message: "Received item not found" });
    }

    // Calculate differences in qtyIn for each item
    const updatePromises = items.map(async ({ item, qtyIn: newQtyIn }) => {
      const existingItem = receivedItem.items.find(
        (i) => i.item.toString() === item
      );
      const oldQtyIn = existingItem ? existingItem.qtyIn : 0;
      const qtyDifference = newQtyIn - oldQtyIn;

      // Update item's qtyIn and stockOnHand based on qtyDifference
      const updatedItem = await Item.findByIdAndUpdate(
        item,
        { $inc: { qtyIn: qtyDifference, stockOnHand: qtyDifference } },
        { new: true }
      );
      await createHistory(
        updatedItem,
        "received",
        updatedItem,
        null,
        0,
        qtyDifference,
        receivedItem.workOrderNo
      );
      return { item: updatedItem._id, qtyIn: newQtyIn };
    });
    const updatedItems = await Promise.all(updatePromises);

    // Update the received item document with the new items array and other updateData
    const updatedReceivedItem = await ReceivedItem.findByIdAndUpdate(
      itemId,
      { ...updateData, items: updatedItems },
      { new: true }
    );

    res.status(200).json({ updatedReceivedItem, updatedItems });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllReceivedItemsSelection = async (req, res) => {
  try {
    const { projectId } = req.params;
    const receivedItems = await ReceivedItem.find({
      project: projectId,
    })
      .populate("items.item", "itemCode itemDescription unit") // Populate item details
      .populate("requistioner", "firstName lastName") // Populate requisitioner details
      .populate("receivedBy", "firstName lastName");
    res.status(200).json(receivedItems);
  } catch (error) {
    res.status(500).json({ messge: error.message });
  }
};

// GET: Get all received items for a project
export const getAllReceivedItems = async (req, res, next) => {
  try {
    const { role } = req.user; // Extract user role from token
    const { projectId } = req.params; // For non-admin filtering by project

    let receivedItems;

    if (role == "Admin") {
      // Admin can see all received items
      receivedItems = await ReceivedItem.find()
        .populate("items.item", "itemCode itemDescription unit") // Populate item details
        .populate("requistioner", "firstName lastName") // Populate requisitioner details
        .populate("receivedBy", "firstName lastName"); // Populate receivedBy details
    } else {
      // Non-admin can only see received items for their assigned project
      if (!projectId) {
        return next(
          errorHandler(400, "Project ID is required for non-admin users")
        );
      }
      receivedItems = await ReceivedItem.find({ project: projectId })
        .populate("items.item", "itemCode itemDescription unit") // Populate item details
        .populate("requistioner", "firstName lastName") // Populate requisitioner details
        .populate("receivedBy", "firstName lastName"); // Populate receivedBy details
    }

    res.status(200).json(receivedItems);
  } catch (error) {
    console.error(error);
    next(error); // Pass the error to the global error handler
  }
};

// GET: Get a specific received item by ID
export const getReceivedItemById = async (req, res) => {
  try {
    const { itemId } = req.params;
    const receivedItem = await ReceivedItem.findById(itemId)
      .populate("items.item", "itemCode itemDescription unit") // Populate item details
      .populate("requistioner", "firstName lastName") // Populate requistioner details
      .populate("receivedBy", "firstName lastName"); // Populate receivedBy details

    if (!receivedItem) {
      return res.status(404).json({ message: "Received item not found" });
    }

    res.status(200).json(receivedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE: Delete a received item by ID
export const deleteReceivedItemById = async (req, res) => {
  try {
    const { itemId } = req.params;

    // Find the received item to delete
    const receivedItem = await ReceivedItem.findById(itemId);
    if (!receivedItem) {
      return res.status(404).json({ message: "Received item not found" });
    }

    // Delete the received item
    await ReceivedItem.findByIdAndDelete(itemId);

    // Update qtyIn and stockOnHand for each item in items array
    const updatePromises = receivedItem.items.map(async ({ item, qtyIn }) => {
      const updatedItem = await Item.findByIdAndUpdate(
        item,
        { $inc: { qtyIn: -qtyIn, stockOnHand: -qtyIn } },
        { new: true }
      );
      await createHistory(
        updatedItem,
        "received",
        updatedItem,
        null,
        0,
        -qtyIn,
        receivedItem.workOrderNo
      );
      return updatedItem;
    });
    const updatedItems = await Promise.all(updatePromises);

    res.status(200).json({ message: "Received item deleted", updatedItems });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllReceivedItemsForAdmin = async (__, res) => {
  try {
    const receivedItems = await ReceivedItem.find().populate();
    res.status(200).json(receivedItems);
  } catch (error) {
    res.status(500).json({ message: "Failed to retreive items" });
  }
};
