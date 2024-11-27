import History from "../models/history.model.js";


const createHistory = async (item, action, changes = {}, stockIssuanceNo,  qtyIssue, qtyReceived, workOrderNo) => {
    const history = new History({
      itemId: item._id,
      action,
      changes: JSON.stringify(changes),
      stockIssuanceNo,
      qtyIssue,
      qtyReceived,
      workOrderNo,
    });
    await history.save();
  };


export default createHistory;
