        // JavaScript function to go back to the previous page
        function goBack() {
            window.history.back();
        }

        // JavaScript function to go forward to the next page
        function goNext() {
            window.history.forward();
        }

        // JavaScript function to refresh the page
        function refreshPage() {
            window.location.reload();
        }

        // Create buttons dynamically using DOM
        const buttonContainer = document.querySelector('#button-container');

        const backButton = document.createElement('button');
        backButton.className = 'nav-button back';
        backButton.innerHTML = '<span><i class="fa-solid fa-arrow-left-long"></i></span>';
        backButton.addEventListener('click', goBack);

        // const nextButton = document.createElement('button');
        // nextButton.className = 'nav-button';
        // nextButton.innerHTML = '<span><i class="fa-solid fa-arrow-right-long"></i></span>';
        // nextButton.addEventListener('click', goNext);

        const refreshButton = document.createElement('button');
        refreshButton.className = 'nav-button refresh';
        refreshButton.innerHTML = '<span ><i class="fa-solid fa-arrows-rotate"></i></span>';
        refreshButton.addEventListener('click', refreshPage);

        // Append buttons to the container
        buttonContainer.appendChild(backButton);
        // buttonContainer.appendChild(nextButton);
        buttonContainer.appendChild(refreshButton);