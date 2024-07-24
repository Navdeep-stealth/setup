document.addEventListener("DOMContentLoaded", function() {
    // Select all links with the class 'confirm-link'
    const links = document.getElementsByClassName('confirm-link');
    
    // Iterate over the selected links and add event listeners
    Array.from(links).forEach(function(link) {
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
});
