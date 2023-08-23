const searchBtn = document.querySelector(".search-btn");
const input = document.querySelector(".input");
const operation = document.querySelector("#operation");
const savedBtn = document.querySelector(".save-btn");
const savedSolution = document.querySelector(".solution-tab");
const solutionContainer = document.querySelector(".solution");

let solutions = [];

if (localStorage.getItem("solution")) {
    solutions = JSON.parse(localStorage.getItem("solution"));
}

function fetchProblem() {
    if (input.value !== "") {
        const expression = encodeURIComponent(input.value);
        const operator = operation.options[operation.selectedIndex].value;
        
        fetch(`https://newton.vercel.app/api/v2/${operator}/${expression}`)
        .then((response) => response.json())
        .then((result) => {
            solutions.push(result);
            localStorage.setItem("solution", JSON.stringify(solutions));
            renderSavedSolutions();
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            alert("An error occurred while fetching data.");
        });
    } else {
        alert("Please Enter Valid Expression!");
    }
}

searchBtn.addEventListener("click", fetchProblem);

function renderSavedSolutions() {
    savedSolution.innerHTML = "";

    if (solutions.length > 0) {
        solutions.forEach((e, index) => {
            const div = document.createElement("div");
            div.classList.add("solution-div");

            div.innerHTML = `<h2>${e.operation} : ${e.expression}</h2>
                              <div id="solution">${e.result}</div>
                              <i class="fa-regular fa-trash-can fa-2xl"></i>`;

            div.querySelector(".fa-trash-can").addEventListener("click", () => {
                solutions.splice(index, 1);
                localStorage.setItem("solution", JSON.stringify(solutions));
                renderSavedSolutions();
            });

            savedSolution.appendChild(div);
        });
        solutionContainer.style.display = "block";
    } else {
        solutionContainer.style.display = "none";
        savedSolution.innerHTML = `<h2 class="result">No Results Found</h2>`;
    }
}

savedBtn.addEventListener("click", () => {
    renderSavedSolutions();
    solutionContainer.style.display = "block";
});

document.querySelector(".close").addEventListener("click", () => {
    solutionContainer.style.display = "none";
});
