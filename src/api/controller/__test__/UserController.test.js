/* eslint-disable no-undef */
const mongoose = require("mongoose");
const assert = require("assert");
const dbName = "BK-test";

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
    await User.deleteMany();
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
    const user = new User(mockUserData);
    await user.generateToken();
    // Check isNew is False
    user
      .save()
      .then(() => {
        assert(!user.isNew);
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
