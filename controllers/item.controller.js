import Item from '../models/item.model.js';
import createHistory from '../middlewares/item.middleware.js';
import * as XLSX from 'xlsx/xlsx.mjs';

/* load 'fs' for readFile and writeFile support */
import * as fs from 'fs';
XLSX.set_fs(fs);

export const createItem = async (req, res) => {
  try {
    const item = new Item(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createFakeItem = async (req, res) => {
  try {
    const fakeItem = {
      itemCode: 'Fake item 1',
      itemDescription: 'This is a fake item for testing',
      unit: 'pcs',
      qtyIn: 100,
      qtyOut: 10,
      stockOnHand: 90,
      toolLocator: 'A1B2C3',
      remarks: 'No remarks',
      project: (req.body.project = '66ffdb2a37391abba424fe6b'),
    };
    const item = new Item(fakeItem);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createItemOnProject = async (req, res) => {
  try {
    const { id } = req.params;
    const itemData = { ...req.body, project: id };
    const item = new Item(itemData);
    await item.save();
    await createHistory(item, 'created', itemData);
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllItemsSelection = async (req, res) => {
  try {
    const { id } = req.params;
    const items = await Item.find({ project: id }).populate('project', 'name');
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//Use for the future function
// export const getAllItemsSelection = async (req, res, next) => {
//   try {
//     const { isAdmin } = req.user; // Extract user role from token
//     const { id } = req.params; // Optional: For non-admin filtering by project

//     let items;

//     if (isAdmin) {
//       // Admin can see all items
//       items = await Item.find().populate("project", "name");
//     } else {
//       // Non-admin can only see items for their assigned project
//       if (!id) {
//         return next(
//           errorHandler(400, "Project ID is required for non-admin users")
//         );
//       }
//       items = await Item.find({ project: id }).populate("project", "name");
//     }

//     res.status(200).json(items);
//   } catch (error) {
//     next(error); // Pass error to global error handler
//   }
// };
export const getAllItems = async (req, res, next) => {
  try {
    const { role } = req.user; // Extract user role from token
    const { id } = req.params; // Optional: For non-admin filtering by project

    let items;

    if (role == 'Admin' || role == 'Head') {
      // Admin can see all items
      items = await Item.find().populate('project', 'name');
    } else {
      // Non-admin can only see items for their assigned project
      if (!id) {
        return next(
          errorHandler(400, 'Project ID is required for non-admin users')
        );
      }
      items = await Item.find({ project: id }).populate('project', 'name');
    }

    res.status(200).json(items);
  } catch (error) {
    next(error); // Pass error to global error handler
  }
};
//uncomment if want to use the server side pagination
// export const getAllItems = async (req, res, next) => {
//   try {
//     const { isAdmin } = req.user; // Extract user role from token
//     const { id } = req.params; // For non-admin filtering by project
//     const page = parseInt(req.query.page, 10) || 1;
//     const limit = parseInt(req.query.limit, 10) || 10;
//     const search = req.query.search || "";

//     const skip = (page - 1) * limit;

//     const searchFilter = search
//       ? {
//           $or: [
//             { itemCode: { $regex: search, $options: "i" } },
//             { itemDescription: { $regex: search, $options: "i" } },
//             { project: { $regex: search, $options: "i" } },
//           ],
//         }
//       : {};

//     let items;
//     let totalItems;

//     if (isAdmin) {
//       // Admin can see all items
//       items = await Item.find(searchFilter)
//         .skip(skip)
//         .limit(limit)
//         .populate("project", "name");

//       totalItems = await Item.countDocuments(searchFilter);
//     } else {
//       // Non-admin can only see items for their assigned project
//       if (!id) {
//         return next(
//           errorHandler(400, "Project ID is required for non-admin users")
//         );
//       }

//       const projectFilter = { project: id };

//       // Combine searchFilter with projectFilter
//       const combinedFilter = { ...searchFilter, ...projectFilter };

//       items = await Item.find(combinedFilter)
//         .skip(skip)
//         .limit(limit)
//         .populate("project", "name");

//       totalItems = await Item.countDocuments(combinedFilter);
//     }

//     res.status(200).json({
//       items,
//       currentPage: page,
//       totalPages: Math.ceil(totalItems / limit),
//       totalItems,
//     });
//   } catch (error) {
//     next(error); // Pass error to global error handler
//   }
// };

export const getItemById = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await Item.findOne({ _id: itemId });
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateItemById = async (req, res) => {
  try {
    const item = await Item.findOneAndUpdate(
      { _id: req.params.itemId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(item);
    await createHistory(item, 'updated', req.body);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteItemById = async (req, res) => {
  const { itemId, projectId } = req.params;

  try {
    // Attempt to find and delete the item
    const item = await Item.findOneAndDelete({
      _id: itemId,
      project: projectId,
    });

    // Check if the item was found
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Respond with success message
    res.status(200).json({ message: 'Item deleted successfully' });
    await createHistory(item, 'deleted', req.body);
  } catch (error) {
    // Handle any errors that occur
    console.error(error);
    res
      .status(500)
      .json({ message: 'An error occurred while deleting the item' });
  }
};

export const importExcel = async (req, res) => {
  try {
    const { id } = req.params; // Extract project ID from route parameters
    if (!id) {
      return res.status(400).json({ message: 'Project ID is required' });
    }

    // Access the uploaded file
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Read the Excel file
    const workbook = XLSX.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Map data to item model and attach project ID
    const items = sheetData.map((data) => ({
      itemCode: data.itemCode,
      itemDescription: data.itemDescription,
      unit: data.unit,
      qtyIn: data.qtyIn || 0,
      qtyOut: data.qtyOut || 0,
      stockOnHand: data.stockOnHand || 0,
      toolLocator: data.toolLocator || '',
      remarks: data.remarks || '',
      project: id, // Reference the project ID from the route parameters
    }));

    // Save items in bulk
    const savedItems = await Item.insertMany(items);
    res
      .status(201)
      .json({ message: 'Items imported successfully', savedItems });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Failed to import items', error: error.message });
  }
};

export const getAllItemsForAdmin = async (_, res) => {
  try {
    // Fetch all items without filtering by project
    const items = await Item.find().populate('project', 'name'); // Populating project details if needed
    console.log('Items fetched:', items); // Debugging line
    res.status(200).json(items);
  } catch (error) {
    console.error('Error in getAllItemsForAdmin:', error.message);
    res.status(500).json({ message: 'Failed to retrieve items' });
  }
};

export const getAllItemsAdmin = async (req, res) => {
  try {
    // Extract page, limit, and search term from query parameters
    const page = parseInt(req.query.page, 10) || 1; // Default to page 1
    const limit = parseInt(req.query.limit, 10) || 10; // Default to 20 items per page
    const search = req.query.search || ''; // Default to an empty string

    // Calculate the number of items to skip
    const skip = (page - 1) * limit;

    // Create a filter object for the search term
    const searchFilter = search
      ? {
          $or: [
            { itemCode: { $regex: search, $options: 'i' } },
            { itemDescription: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    // Fetch items with pagination and search filter
    const allItems = await Item.find(searchFilter)
      .skip(skip)
      .limit(limit)
      .populate('project', 'name');

    // Get the total number of matching items
    const totalItems = await Item.countDocuments(searchFilter);

    // Respond with paginated data and metadata
    res.status(200).json({
      items: allItems,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllProjectItems = async (req, res) => {
  try {
    const { id } = req.params; // Project ID from the request parameters
    const page = parseInt(req.query.page, 10) || 1; // Default to page 1
    const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 items per page
    const search = req.query.search || ''; // Default to an empty search string

    // Calculate the number of items to skip
    const skip = (page - 1) * limit;

    // Create a filter object for the project and search term
    const filter = {
      project: id,
      ...(search && {
        $or: [
          { itemCode: { $regex: search, $options: 'i' } },
          { itemDescription: { $regex: search, $options: 'i' } },
        ],
      }),
    };

    // Fetch items with pagination, search filter, and project filter
    const allItems = await Item.find(filter)
      .skip(skip)
      .limit(limit)
      .populate('project', 'name');

    // Get the total number of matching items for the given project
    const totalItems = await Item.countDocuments(filter);

    // Respond with paginated data and metadata
    res.status(200).json({
      items: allItems,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
