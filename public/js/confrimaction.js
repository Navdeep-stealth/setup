document.addEventListener("DOMContentLoaded", function() {
    // Select the link using its class
    const link = document.getElementById('#confirm-link');
    
    // Add a click event listener to the link
    link.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default link action
        const userConfirmed = confirm("Are you sure you want to proceed?");
        if (userConfirmed) {
            // If the user clicks "OK", proceed with the action
            window.location.href = link.href;
        } else {
            // If the user clicks "Cancel", do nothing
            console.log("Action cancelled");
        }
    });
});