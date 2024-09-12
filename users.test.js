require("dotenv").config();
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("./app");
const User = require("./models/userModel");

jest.setTimeout(30000);

describe("User API", () => {
  beforeAll(async () => {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is not set");
    }
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
    });
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    jest.setTimeout(60000);
    await User.deleteMany({});
  });

  describe("POST /signup", () => {
    it("should signup a new user and return status 200 with token and user object", async () => {
      const newUser = {
        email: `test${Date.now()}@example.com`,
        password: "password123",
      };

      const response = await request(app)
        .post("/api/users/signup")
        .send(newUser)
        .expect(201);

      expect(response.body.status).toBe("success");
      expect(response.body.user).toHaveProperty("email", newUser.email);
      expect(response.body.user).toHaveProperty("subscription", "starter");
      expect(response.body.user).toHaveProperty("avatarURL");
    });
  });

  describe("POST /login", () => {
    it("should login an existing user and return status 200 with token and user object", async () => {
      const newUser = {
        email: `test${Date.now()}@example.com`,
        password: "password123",
      };

      await request(app).post("/api/users/signup").send(newUser);

      const response = await request(app)
        .post("/api/users/login")
        .send(newUser)
        .expect(200);

      expect(response.body).toHaveProperty("token");
      expect(response.body.user).toHaveProperty("email", newUser.email);
      expect(response.body.user).toHaveProperty("subscription", "starter");
    });
  });
});
