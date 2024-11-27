import StockIssuanceList from "../models/issuance.model.js";
import Item from "../models/item.model.js";
import createHistory from "../middlewares/item.middleware.js";
import History from "../models/history.model.js";
import generateStockIssuanceNo from "../middlewares/issuance.middleware.js";

// Controller for creating a Stock Issuance
export const createStockIssuance = async (req, res) => {
  try {
    const { projectId } = req.params;
    const {
      dateIssued,
      department,
      projects,
      purpose,
      requisitioner,
      members,
      receivedBy,
      releasedBy,
      approvedBy,
      remarks,
      items, // Expecting an array of items with item ID, qtyOut, and remarks
    } = req.body;
    const stockIssuanceNo = await generateStockIssuanceNo(projectId);
    let totalQtyIssue = 0;

    // Create the stock issuance record without items
    const newStockIssuance = new StockIssuanceList({
      dateIssued,
      department,
      projects,
      purpose,
      requisitioner,
      members,
      receivedBy,
      releasedBy,
      approvedBy,
      remarks,
      project: projectId,
      stockIssuanceNo,
      items: [], // Initialize items as an empty array
    });

    // Process each item and apply history tracking
    for (const { item, qtyOut, itemRemarks } of items) {
      const foundItem = await Item.findById(item);
      if (!foundItem) {
        return res
          .status(404)
          .json({ message: `Item with ID ${item} not found` });
      }

      // Update item's qtyOut and stockOnHand
      foundItem.qtyOut += qtyOut;
      foundItem.stockOnHand -= qtyOut;
      totalQtyIssue += qtyOut;

      // Ensure stockOnHand doesn't go below 0
      if (foundItem.stockOnHand < 0) {
        return res.status(400).json({
          message: `Insufficient stock on hand for item: ${foundItem.itemCode}`,
        });
      }

      // Save the updated item
      await foundItem.save();
      // Add item to the Stock Issuance
      newStockIssuance.items.push({
        item: foundItem._id,
        qtyOut,
        remarks: itemRemarks,
      });

      // Create history for the item issuance
      await createHistory(
        foundItem._id,
        "issued",
        foundItem,
        stockIssuanceNo,
        totalQtyIssue
      );
    }

    // Save the stock issuance record
    const savedIssuance = await newStockIssuance.save();

    res.status(201).json(savedIssuance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Controller for deleting a specific item from a stock issuance
export const deleteItemFromStockIssuance = async (req, res) => {
  const { issuanceId, itemId } = req.params; // Get the Stock Issuance ID and item ID from route parameters

  try {
    // Find the Stock Issuance by ID
    const stockIssuance = await StockIssuanceList.findById(issuanceId);
    if (!stockIssuance) {
      return res.status(404).json({ message: "Stock Issuance not found" });
    }

    // Find the index of the item to be deleted in the stock issuance's items array
    const itemIndex = stockIssuance.items.findIndex(
      (i) => i._id.toString() === itemId // Use _id directly from the item
    );
    if (itemIndex === -1) {
      return res
        .status(404)
        .json({ message: "Item not found in the stock issuance" });
    }

    // Get the item details before removing it
    const itemToRemove = stockIssuance.items[itemIndex];

    // Find the corresponding item in the Item collection to update stockOnHand
    const foundItem = await Item.findById(itemToRemove.item);
    if (foundItem) {
      foundItem.stockOnHand += itemToRemove.qtyOut; // Restore the stock to the item's stockOnHand
      await foundItem.save(); // Save the updated item
    }

    // Remove the item from the items array
    stockIssuance.items.splice(itemIndex, 1);

    // Delete the history associated with the item
    await History.deleteMany({ item: itemToRemove.item, action: "issued" });

    // Save the updated Stock Issuance
    const updatedIssuance = await stockIssuance.save();

    res.status(200).json({
      message: "Item and its history deleted successfully",
      updatedIssuance, // Optionally return the updated issuance
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllStockIssuancesSelection = async (req, res) => {
  try {
    const { projectId } = req.params;
    const stockIssuance = await StockIssuanceList.find({ project: projectId })
      .populate("requisitioner", "firstName lastName")
      .populate("department", "departmentName")
      .populate("projects", "subprojectName")
      .populate("members", "firstName lastName")
      .populate("receivedBy", "firstName lastName")
      .populate("releasedBy", "firstName lastName")
      .populate("approvedBy", "firstName lastName")
      .populate({
        path: "items.item", // Populate the 'item' field within 'items'
        model: "Item", // Specify the model to populate from
        select: "itemCode itemDescription unit remarks", // Specify the fields to include
      });
    res.status(200).json(stockIssuance);
  } catch (error) {
    res.status(500).json({ messge: error.message });
  }
};
// Controller for getting all stock issuances by project ID
export const getAllStockIssuances = async (req, res, next) => {
  try {
    const { isAdmin } = req.user; // Extract user role from token
    const { projectId } = req.params; // Optional: For non-admin filtering by project

    let stockIssuances;

    if (isAdmin) {
      // Admin can see all stock issuances
      stockIssuances = await StockIssuanceList.find()
        .populate("requisitioner", "firstName lastName")
        .populate("department", "departmentName")
        .populate("projects", "subprojectName")
        .populate("members", "firstName lastName")
        .populate("receivedBy", "firstName lastName")
        .populate("releasedBy", "firstName lastName")
        .populate("approvedBy", "firstName lastName")
        .populate({
          path: "items.item", // Populate the 'item' field within 'items'
          model: "Item", // Specify the model to populate from
          select: "itemCode itemDescription unit remarks", // Specify the fields to include
        });
    } else {
      // Non-admin can only see stock issuances for their assigned project
      if (!projectId) {
        return next(
          errorHandler(400, "Project ID is required for non-admin users")
        );
      }
      stockIssuances = await StockIssuanceList.find({ project: projectId })
        .populate("requisitioner", "firstName lastName")
        .populate("department", "departmentName")
        .populate("projects", "subprojectName")
        .populate("members", "firstName lastName")
        .populate("receivedBy", "firstName lastName")
        .populate("releasedBy", "firstName lastName")
        .populate("approvedBy", "firstName lastName")
        .populate({
          path: "items.item", // Populate the 'item' field within 'items'
          model: "Item", // Specify the model to populate from
          select: "itemCode itemDescription unit remarks", // Specify the fields to include
        });
    }

    res.status(200).json(stockIssuances);
  } catch (error) {
    console.error(error);
    next(error); // Pass the error to the global error handler
  }
};

// Controller for getting a stock issuance by its ID
export const getStockIssuanceById = async (req, res) => {
  const { projectId, issuanceId } = req.params; // Get projectId and issuanceId from route parameters
  try {
    const stockIssuance = await StockIssuanceList.findOne({
      _id: issuanceId,
      project: projectId,
    })
      .populate("requisitioner")
      .populate("members")
      .populate("receivedBy")
      .populate("releasedBy")
      .populate({
        path: "items.item", // Populate the 'item' field within 'items'
        model: "Item", // Specify the model to populate from
        select: "itemCode itemDescription unit remarks", // Specify the fields to include
      });

    if (!stockIssuance) {
      return res.status(404).json({ message: "Stock Issuance not found" });
    }

    res.status(200).json(stockIssuance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getLastIssuance = async (req, res) => {
  const { projectId } = req.params;

  try {
    const lastIssuance = await StockIssuanceList.findOne({
      project: projectId,
    }).sort({ createdAt: -1 });
    if (!lastIssuance) {
      return null;
      //return res.status(404).json({ message: "No Stock Issuance found" });
    }

    res.status(200).json({ stockIssuanceNo: lastIssuance.stockIssuanceNo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Controller for deleting a stock issuance by its ID
export const deleteStockIssuanceById = async (req, res) => {
  const { projectId, issuanceId } = req.params; // Get projectId and issuanceId from route parameters
  try {
    const stockIssuance = await StockIssuanceList.findOneAndDelete({
      _id: issuanceId,
      project: projectId,
    });

    if (!stockIssuance) {
      return res.status(404).json({ message: "Stock Issuance not found" });
    }

    res.status(200).json({ message: "Stock Issuance deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateStockIssuance = async (req, res) => {
  const { projectId, issuanceId } = req.params; // Get projectId and issuanceId from route parameters
  const {
    dateIssued,
    department,
    projects,
    purpose,
    requisitioner,
    members,
    receivedBy,
    releasedBy,
    approvedBy,
    items, // Items to be updated with qtyOut, remarks, etc.
    remarks,
  } = req.body;

  try {
    // Find the stock issuance by ID and project
    const stockIssuance = await StockIssuanceList.findOne({
      _id: issuanceId,
      project: projectId,
    });

    if (!stockIssuance) {
      return res.status(404).json({ message: "Stock Issuance not found" });
    }

    // Loop through items to validate, update, and track changes
    for (const { item, qtyOut, itemRemarks } of items) {
      const foundItem = await Item.findById(item);

      if (!foundItem) {
        return res
          .status(404)
          .json({ message: `Item with ID ${item} not found` });
      }

      // Calculate quantity differences
      const existingItem = stockIssuance.items.find(
        (i) => i.item.toString() === item.toString()
      );

      const previousQtyOut = existingItem ? existingItem.qtyOut : 0;
      const qtyDifference = qtyOut - previousQtyOut;

      // Ensure stock levels are valid
      if (foundItem.stockOnHand - qtyDifference < 0) {
        return res.status(400).json({
          message: `Insufficient stock on hand for item: ${foundItem.itemCode}`,
        });
      }

      // Update item's qtyOut and stockOnHand
      foundItem.qtyOut += qtyDifference;
      foundItem.stockOnHand -= qtyDifference;
      await foundItem.save();

      // Update stock issuance item's details
      if (existingItem) {
        existingItem.qtyOut = qtyOut;
        existingItem.remarks = itemRemarks;
      } else {
        stockIssuance.items.push({
          item: foundItem._id,
          qtyOut,
          remarks: itemRemarks,
        });
      }

      // Create history for the item
      await createHistory(
        foundItem._id,
        "issued",
        foundItem,
        stockIssuance.stockIssuanceNo,
        qtyDifference
      );
    }

    // Update stock issuance details
    stockIssuance.dateIssued = dateIssued;
    stockIssuance.department = department;
    stockIssuance.projects = projects;
    stockIssuance.purpose = purpose;
    stockIssuance.requisitioner = requisitioner;
    stockIssuance.members = members;
    stockIssuance.receivedBy = receivedBy;
    stockIssuance.releasedBy = releasedBy;
    stockIssuance.approvedBy = approvedBy;
    stockIssuance.remarks = remarks;
    stockIssuance.items = items;

    // Save the updated stock issuance
    const updatedIssuance = await stockIssuance.save();
    res.status(200).json(updatedIssuance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createStockIssuanceNo = async (req, res) => {
  try {
    const { projectId } = req.params;
    const stockIssuanceNo = await generateStockIssuanceNo(projectId);
    res.status(200).json({
      success: true,
      statusCode: 200,
      stockIssuanceNo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Server error",
    });
  }
};

export const getAllIssuedItemsForAdmin = async (_, res) => {
  try {
    const issuedItems = await StockIssuanceList.find().populate();
    res.status(200).json(issuedItems);
  } catch (error) {
    res.status(500).json({ message: "Failed to retreive items" });
  }
};
