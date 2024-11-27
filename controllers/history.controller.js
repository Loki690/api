import History from "../models/history.model.js";

export const getHistory = async (req, res) => {
    try {
        const history = await History.find()
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getHistoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const history = await History.findById(id)
        if (!history) {
            return res.status(404).json({ message: 'History not found' });
        }
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getItemHistory = async (req, res) => {
    try {
        const { itemId } = req.params;
        const history = await History.find({ itemId }).populate('itemId');
        if (!history.length) {
            return res.status(404).json({ message: 'No history found for this item' });
        }
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};