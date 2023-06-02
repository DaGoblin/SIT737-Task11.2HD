var expect = require("chai").expect;
var axios = require("axios");
// const server = require("../server");
var { server } = require("../server");
const querystring = require("querystring");

const PORT = process.env.PORT || 4000;
const ServerAddress = process.env.SERVER || "http://localhost";
const JWT_TOKEN = process.env.TEST_JWT_TOKEN;
const DeviceName = "TestDevice";
const DeviceType = "Light";
const Manufacturer = "TestManufacturer";
let itemID = "";

const requestBody = querystring.stringify({
    DeviceName,
    DeviceType,
    Manufacturer,
});

// After running the tests, stop the server
after(function (done) {
    server.close(function () {
        console.log("Server stopped");
        done();
    });
});

describe("Test Item Creation", () => {
    let url = `${ServerAddress}:${PORT}/createItem`;
    it("No JWT expect 401", async () => {
        try {
            const response = await axios.post(url, requestBody);
        } catch (error) {
            expect(error.response.status).to.equal(401);
        }
    });

    it("Return status code 200 & Item Created", async () => {
        const response = await axios.post(url, requestBody, {
            headers: {
                Authorization: `Bearer ${JWT_TOKEN}`, // Include the JWT token in the request header
            },
        });
        expect(response.status).to.equal(200);
        expect(response.data).to.equal("Item Created");
    });
});

describe("Retrive Item", () => {
    let url = `${ServerAddress}:${PORT}/getItems`;
    it("No JWT expect 401", async () => {
        try {
            const response = await axios.get(url, requestBody);
        } catch (error) {
            expect(error.response.status).to.equal(401);
        }
    });

    it("Return status code 200 & Items", async () => {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${JWT_TOKEN}`, // Include the JWT token in the request header
            },
        });

        itemID = querystring.stringify({ id: response.data[0]._id });
        expect(response.status).to.equal(200);
        expect(response.data[0]).to.have.property("DeviceName");
        expect(response.data[0]).to.have.property("DeviceType");
        expect(response.data[0]).to.have.property("Manufacturer");
    });
});

describe("Test Delete item", () => {
    let url = `${ServerAddress}:${PORT}/deleteItem`;
    it("No JWT expect 401", async () => {
        try {
            const response = await axios.post(url, requestBody);
        } catch (error) {
            expect(error.response.status).to.equal(401);
        }
    });

    it("Return status code 200 & Item Deleted", async () => {
        const response = await axios.post(url, itemID, {
            headers: {
                Authorization: `Bearer ${JWT_TOKEN}`, // Include the JWT token in the request header
            },
        });
        expect(response.status).to.equal(200);
        expect(response.data).property("msg").to.equal("Item Deleted");
    });
});
