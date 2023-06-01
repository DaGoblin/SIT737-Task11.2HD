document
    .getElementById("createAccountForm")
    .addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission

        // Get the form data
        var formData = new URLSearchParams(new FormData(this)).toString();
        console.log(formData);
        // Perform asynchronous request to handle form submission
        // Replace "/submit" with the appropriate endpoint or script URL
        fetch("/auth/createAccount", {
            method: "POST",
            body: formData,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        })
            .then((response) => {
                // Handle the response if needed
                console.log(response.data);
                this.reset(); // Reset the form if successful
                myModal.hide();
            })
            .catch((error) => {
                // Handle any errors
                console.error("Form submission error:", error);
            });
    });

var myModal = new bootstrap.Modal(document.getElementById("addUserModal"), {
    keyboard: false,
});
