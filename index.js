const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const foodList = document.getElementById("foodList");
const randomMeal = document.getElementById("random-meal")
let searchQuery =""

window.addEventListener("load", function () {
    fetchAndDisplayRandomMeals();
});


searchButton.addEventListener("click", function (event) {
    event.preventDefault();
     searchQuery = searchInput.value.trim();

    if (searchQuery !== "") {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`)
            .then(response => response.json())
            .then(data => {
                foodList.innerHTML = ""; 
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