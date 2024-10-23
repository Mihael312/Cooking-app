// Get references to HTML elements
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const foodList = document.getElementById("foodList");
const randomMeal = document.getElementById("random-meal");
let searchQuery = "";

// Add a "load" event listener to fetch and display random meals when the page loads
window.addEventListener("load", function () {
    fetchAndDisplayRandomMeals();
});

// Function to handle clicking on a meal image
function mealImageClickHandler(event) {
    const mealImage = event.target;
    const mealElement = mealImage.parentElement;

    // Get the meal ID from the meal element (you may need to store this data when creating the meal elements)
    const mealID = mealElement.getAttribute("data-meal-id");

    // Clear the foodList
    foodList.innerHTML = "";

    // Fetch the details for the selected meal
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then(response => response.json())
        .then(data => {
            if (data.meals && data.meals.length > 0) {
                const meal = data.meals[0];
                const mealName = meal.strMeal;
                const mealImageURL = meal.strMealThumb;
                const mealDescription = meal.strInstructions;

                // Create a container for the meal details
                const mealDetailsElement = document.createElement("div");
                mealDetailsElement.className = "meal-details";
                mealDetailsElement.innerHTML = `
                    <img src="${mealImageURL}" alt="${mealName}" class="meal-image">
                    <h2 class="meal-name">${mealName}</h2>
                    <p class="meal-description">${mealDescription}</p>
                `;

                // Append the meal details to the foodList
                foodList.appendChild(mealDetailsElement);
            } else {
                foodList.innerHTML = "<p>No details found for this meal.</p>";
            }
        })
        .catch(error => {
            console.error("Error fetching meal details:", error);
        });
}


// Add a click event listener to the search button
searchButton.addEventListener("click", function (event) {
    event.preventDefault();
    searchQuery = searchInput.value.trim();

    if (searchQuery !== "") {
        // Fetch meals based on the search query
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`)
            .then(response => response.json())
            .then(data => {
                foodList.innerHTML = "";
                if (data.meals) {
                    data.meals.forEach(meal => {
                        const mealName = meal.strMeal;
                        const mealImage = meal.strMealThumb;

                        // Create a meal element
                        const mealElement = document.createElement("div");
                        mealElement.className = "meal-item";
                        mealElement.innerHTML = `
                            <img src="${mealImage}" alt="${mealName}" class="meal-image">
                            <p class="meal-name">${mealName}</p>
                        `;

                        // Set a data attribute for meal ID (you may need to store this data when creating the meal elements)
                        mealElement.setAttribute("data-meal-id", meal.idMeal);

                        // Attach the click event listener to the meal image
                        mealElement.querySelector(".meal-image").addEventListener('click', mealImageClickHandler);

                        // Append the meal element to the foodList
                        foodList.appendChild(mealElement);
                    });
                } else {
                    foodList.innerHTML = "<p>No results found.</p>";
                }
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    }
});

// Function to fetch and display random meals
function fetchAndDisplayRandomMeals() {
    let mealList = [];

    const fetchPromises = [];
    for (let i = 0; i < 9; i++) {
        fetchPromises.push(
            fetch('https://www.themealdb.com/api/json/v1/1/random.php')
                .then(response => response.json())
        );
    }

    Promise.all(fetchPromises)
        .then(dataArray => {
            mealList = dataArray.map(data => data.meals[0]);

            foodList.innerHTML = "";
            if (mealList.length > 0) {
                mealList.forEach(meal => {
                    const mealName = meal.strMeal;
                    const mealImage = meal.strMealThumb;

                    // Create a meal element
                    const mealElement = document.createElement("div");
                    mealElement.className = "meal-item";
                    mealElement.innerHTML = `
                        <img src="${mealImage}" alt="${mealName}" class="meal-image">
                        <p class="meal-name">${mealName}</p>
                    `;

                    // Set a data attribute for meal ID (you may need to store this data when creating the meal elements)
                    mealElement.setAttribute("data-meal-id", meal.idMeal);

                    // Attach the click event listener to the meal image
                    mealElement.querySelector(".meal-image").addEventListener('click', mealImageClickHandler);

                    // Append the meal element to the foodList
                    foodList.appendChild(mealElement);
                });
            } else {
                foodList.innerHTML = "<p>No results found.</p>";
            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}