window.onload = function () {
    // Call the function to construct the grid
    getItemList();
    setVisibility();
};

function setVisibility() {
    if (localStorage.getItem("jwtToken")) {
        let addItemForm = document.getElementById("addItemForm");
        addItemForm.classList.remove("visually-hidden");
    } else {
        let loginForm = document.getElementById("loginForm");
        loginForm.classList.remove("visually-hidden");
    }
}

document
    .getElementById("loginForm")
    .addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission

        // Get the form data
        var formData = new URLSearchParams(new FormData(this)).toString();
        // Perform asynchronous request to handle form submission
        fetch("/auth/login", {
            method: "POST",
            body: formData,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Form submission failed");
                }
            })
            .then((data) => {
                // Store the JWT token in localStorage or sessionStorage
                localStorage.setItem("jwtToken", data.token);
                let loginForm = document.getElementById("loginForm");
                loginForm.reset();
                loginForm.classList.add("visually-hidden");
                let addItemForm = document.getElementById("addItemForm");
                addItemForm.classList.remove("visually-hidden");
                getItemList();
            })
            .catch((error) => {
                // Handle any errors
                console.error("Form submission error:", error);
            });
    });
document.addEventListener("storage", function (event) {
    console.log("Storage event" + event);
    if (event.key == "jwtToken") {
        console.log("JWT token update");
        var newToken = event.newValue;
    }
});

function removeJWTToken() {
    localStorage.removeItem("jwtToken");
    window.location.reload();
}

document
    .getElementById("addItemForm")
    .addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission

        // Get the form data
        var formData = new URLSearchParams(new FormData(this)).toString();
        // Perform asynchronous request to handle form submission
        fetch("/data/createItem", {
            method: "POST",
            body: formData,
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwtToken"),
                "Content-Type": "application/x-www-form-urlencoded",
            },
        })
            .then((response) => {
                if (response.ok) {
                    window.location.reload();
                    return response.json();
                } else {
                    throw new Error("Form submission failed");
                }
            })
            .catch((error) => {
                // Handle any errors
                console.error("Form submission error:", error);
            });
    });

async function getItemList() {
    if (localStorage.getItem("jwtToken")) {
        try {
            const response = await fetch("/data/getItems", {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("jwtToken"),
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });

            if (response.ok) {
                const data = await response.json();
                itemList(data);
            } else {
                throw new Error("Form submission failed");
            }
        } catch (error) {
            // Handle any errors
            console.error("Form submission error:", error);
        }
    }
}

// Function to construct the grid
function itemList(data) {
    var gridContainer = document.getElementById("DeviceList");
    gridContainer.classList.remove("visually-hidden");

    // Create a table element
    var table = document.createElement("table");
    table.className = "table";

    // Create table header
    var thead = document.createElement("thead");
    var headerRow = document.createElement("tr");
    var headerColumns = ["Device Name", "Device Type", "Manufacturer", ""];

    // Loop through header column names
    headerColumns.forEach(function (columnName) {
        var headerCell = document.createElement("th");
        headerCell.textContent = columnName;
        headerRow.appendChild(headerCell);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    var tbody = document.createElement("tbody");

    // Loop through data items
    data.forEach(function (item) {
        var row = document.createElement("tr");

        var keysToCheck = ["DeviceName", "DeviceType", "Manufacturer"];

        // Iterate over keys and check if they exist in the item object
        keysToCheck.forEach(function (key) {
            var cell = document.createElement("td");
            if (!item.hasOwnProperty(key)) {
                cell.textContent = "";
            } else {
                cell.textContent = item[key];
            }
            row.appendChild(cell);
        });

        // Add delete button column
        var deleteCell = document.createElement("td");
        var deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "btn btn-danger";
        deleteButton.addEventListener("click", function () {
            // Handle delete button click event
            deleteItem(item._id);
        });
        deleteCell.appendChild(deleteButton);
        row.appendChild(deleteCell);

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    gridContainer.appendChild(table);
}

// Function to handle delete button click event

async function deleteItem(itemId) {
    try {
        await fetch("/data/deleteItem", {
            method: "POST",
            body: "id=" + itemId,
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwtToken"),
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
       window.location.reload();
    } catch (error) {
        // Handle any errors
        console.error("Delete item error:", error);
    }
}
