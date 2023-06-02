var expect = require("chai").expect;
var axios = require("axios");
// const server = require("../server");
var { server } = require("../server");

const PORT = process.env.PORT || 4000;
const ServerAddress = process.env.SERVER || "http://localhost";
const username = "testuserAccount1";
const password = "testpassword";

// After running the tests, stop the server
after(function (done) {
    server.close(function () {
        console.log("Server stopped");
        done();
    });
});

describe("Test Account Creation", () => {
    let url = `${ServerAddress}:${PORT}/createAccount`;
    it("Return status code 200 & User Created", async () => {
        const response = await axios.post(url, null, {
            params: {
                username,
                password,
            },
        });
        //console.log(response);
        expect(response.status).to.equal(200);
        expect(response.data).to.equal("testuserAccount1 User Created");
    });
});

describe("Test login", () => {
    let url = `${ServerAddress}:${PORT}/login`;
    it("Return status code 200 & JWT", async () => {
        const response = await axios.post(url, null, {
            params: {
                username,
                password,
            },
        });

        expect(response.status).to.equal(200);
        expect(response.data).to.have.property("token");
    });
});

describe("Test Delete account", () => {
    let url = `${ServerAddress}:${PORT}/deleteAccount`;
    it("Return status code 200 & Account Deleted", async () => {
        const response = await axios.post(url, null, {
            params: {
                username,
            },
        });
        expect(response.status).to.equal(200);

        expect(response.data).include("testuserAccount1 Deleted");
    });
});

