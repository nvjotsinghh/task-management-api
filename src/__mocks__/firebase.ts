const db = {
  collection: jest.fn().mockReturnThis(),
  doc: jest.fn().mockReturnThis(),
  get: jest.fn(),
  add: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  where: jest.fn().mockReturnThis(),
};

const auth = {
  verifyIdToken: jest.fn(),
  createUser: jest.fn(),
  setCustomUserClaims: jest.fn(),
};

export { db, auth };
export default {};