/* eslint-disable no-undef */
const mongoose = require("mongoose");
const assert = require("assert");
const superagent = require("superagent");

const dbName = "BK-test";
const URL = `http://localhost:8000`;

const User = require("../../model/User");

describe("Unit test-cases for User Controller", () => {
  beforeAll(async () => {
    const url = `mongodb://127.0.0.1:27017/${dbName}`;
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  afterAll(async () => {
    // Removes the User collection
    await User.deleteMany({});
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  test("should register User successfully", async () => {
    // mock user data
    const mockUserData = {
      firstName: "Abhay",
      lastName: "Goswami",
      email: "abhaygoswami676@gmail.com",
      mobile: "8439548813",
      password: "Abhay123#"
    };
    // Pass data to the User constructor
    try {
      const user = new User(mockUserData);
      await user.generateToken();
      // Check isNew is False
      const savedUser = await user.save();
      assert(!savedUser.isNew);
    } catch (error) {
      console.log(error);
    }
  });

  test("should login successfully 😊", async (done) => {
    // Mock user data
    const userData = {
      email: "abhaygoswami676@gmail.com",
      password: "Abhay123#"
    };
    superagent
      .post(`${URL}/api/login`)
      .send(userData)
      .then((res) => {
        expect(res.headers["content-type"]).toBe('application/json; charset=utf-8')
        expect(res.status).toBe(200);
        expect(res.body.email).toMatch(userData.email)
      })
      .catch((err) => {
        expect(err.status).toBe(404);
        expect(err.response.body).toMatchObject({
          success: false,
          code: 404,
          error: "Password don't match"
        });
      });
    done();
  });
});
