// Add event listener to the search button
document.getElementById("searchButton").addEventListener("click", searchSection);
document.getElementById("searchInput").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        searchSection();
    }
});

function searchSection() {
    // Get the search input value
    const searchValue = document.getElementById("searchInput").value.trim();

    // Find the section by ID
    const section = document.getElementById(searchValue);

    // Check if the section exists
    if (section) {
        // Scroll to the section
        section.scrollIntoView({ behavior: "smooth", block: "start" });

        // Highlight the section temporarily
        section.style.border = "2px solid #007bff";
        setTimeout(() => {
            section.style.border = ""; // Remove the highlight after 2 seconds
        }, 2000);
    } else {
        alert(`Section "${searchValue}" not found.`);
    }
}
