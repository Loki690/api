import express from 'express';
// Replace require with import for ES module syntax
import {
    createProject,
    getAllProjects,
    getProjectById,
    updateProjectById,
    deleteProjectById
} from '../controllers/project.controller.js'; // Use full path with '.js' extension

const router = express.Router();

// Create a new project
router.post('/add', createProject);

// Retrieve all projects
router.get('/projects', getAllProjects);

// Retrieve a single project by ID
router.get('/project/:id', getProjectById);

// Update a project by ID
router.put('/update/:id', updateProjectById);

// Delete a project by ID
router.delete('/delete/:id', deleteProjectById);

export default router;
