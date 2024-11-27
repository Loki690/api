import StockIssuanceList from '../models/issuance.model.js';
import Project from '../models/project.model.js';

const generateStockIssuanceNo = async (projectId) => {

  const projectPrefix = await Project.findById(projectId).select('prefix').exec();
  const prefix = projectPrefix.prefix;
  // Find the latest stock issuance number that matches the general format
  const lastIssuance = await StockIssuanceList
    .findOne({ stockIssuanceNo: { $regex: `^${prefix}-\\d{4}-\\d{4}$` }})
    .sort({ stockIssuanceNo: -1 })
    .exec();

  // Initialize middle and last sequences
  let middleSequence = 0;
  let lastSequence = 1;

  if (lastIssuance) {
    // Parse the last issuance number
    const [middlePart, lastPart] = lastIssuance.stockIssuanceNo.split('-').slice(1);

    // Convert both parts to integers
    middleSequence = parseInt(middlePart, 10);
    lastSequence = parseInt(lastPart, 10) + 1;

    // If last sequence exceeds 9999, reset it and increment the middle sequence
    if (lastSequence > 9999) {
      lastSequence = 1;
      middleSequence += 1;
    }
  }

  // Pad both sequences with leading zeros
  const paddedMiddleSequence = String(middleSequence).padStart(4, '0');
  const paddedLastSequence = String(lastSequence).padStart(4, '0');

  return `${prefix}-${paddedMiddleSequence}-${paddedLastSequence}`;
};

export default generateStockIssuanceNo;
