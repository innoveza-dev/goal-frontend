// VMC Test Helper Functions
// Use these functions to test your CRUD operations

export const testVMCOperations = {
  // Test data creation
  createTestData: () => ({
    vision: [
      {
        description: "Test vision description",
        visionImageUrl: "test-image.jpg"
      }
    ],
    mission: [
      {
        description: "Test mission description", 
        missionImageUrl: "test-mission.jpg"
      }
    ],
    core: [
      {
        title: "Test Core Value",
        coreImageUrl: "test-core.jpg"
      }
    ]
  }),

  // Validate vision data
  validateVision: (vision) => {
    if (!Array.isArray(vision)) return false;
    return vision.every(v => 
      v.description && 
      typeof v.description === 'string' && 
      v.description.trim().length > 0
    );
  },

  // Validate mission data
  validateMission: (mission) => {
    if (!Array.isArray(mission)) return false;
    return mission.every(m => 
      m.description && 
      typeof m.description === 'string' && 
      m.description.trim().length > 0
    );
  },

  // Validate core data
  validateCore: (core) => {
    if (!Array.isArray(core)) return false;
    return core.every(c => 
      c.title && 
      typeof c.title === 'string' && 
      c.title.trim().length > 0
    );
  },

  // Test API endpoints
  testEndpoints: (baseURL = 'http://localhost:5000/api/vmc') => ({
    create: `${baseURL}/vision`,
    read: `${baseURL}`,
    update: (id) => `${baseURL}/${id}`,
    delete: (id) => `${baseURL}/${id}`
  }),

  // Common error scenarios to test
  errorScenarios: {
    emptyData: { vision: [], mission: [], core: [] },
    invalidVision: { vision: [{ description: "" }] },
    invalidMission: { mission: [{ description: "" }] },
    invalidCore: { core: [{ title: "" }] },
    missingFields: { vision: [{}], mission: [{}], core: [{}] }
  }
};

// Usage example:
// import { testVMCOperations } from './vmcTestHelper';
// const isValid = testVMCOperations.validateVision(visionData);
