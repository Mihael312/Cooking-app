const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const foodList = document.getElementById("foodList");

searchButton.addEventListener("click", function (event) {
    event.preventDefault();
    const searchQuery = searchInput.value.trim();
    if (searchQuery !== "") {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`)
            .then(response => response.json())
            .then(data => {
                foodList.innerHTML = ""; // Clear previous search results
                if (data.meals) {
                    data.meals.forEach(meal => {
                        const mealName = meal.strMeal;
                        const mealImage = meal.strMealThumb;
                        
                        const mealElement = document.createElement("div");
                        mealElement.className = "meal-item";
                        mealElement.innerHTML = `
                            <img src="${mealImage}" alt="${mealName}" class="meal-image">
                            <p class="meal-name">${mealName}</p>
                        `;
                        
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
