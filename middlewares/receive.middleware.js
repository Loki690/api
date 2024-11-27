
import ReceivedItem from "../models/receive.model.js";

const generateWorkOrderNo = async () => {
    const currentYear = new Date().getFullYear();
    const prefix = `WODR-${currentYear}-`;
  
    // Find the latest stock issuance number for the current year
    const lastWorkOrder = await ReceivedItem
      .findOne({ workOrderNo: { $regex: `^${prefix}` } })
      .sort({ workOrderNo: -1 }) // Sort in descending order to get the latest
      .exec();
  
    // Determine the next sequence number
    let nextSequence = 1;
    if (lastWorkOrder) {
      const lastSequence = parseInt(lastWorkOrder.workOrderNo.split('-')[2], 10);
      nextSequence = lastSequence + 1;
    }
  
    // Pad the sequence number with leading zeros to maintain a 4-digit format
    const paddedSequence = String(nextSequence).padStart(4, '0');
    return `${prefix}${paddedSequence}`;
  };

  export default generateWorkOrderNo;