let addPlayerBtn = document.getElementById("add-player-btn");
let addPlayerForm = document.getElementById("add-player-form");

addPlayerBtn.addEventListener("click", () => {
    addPlayerForm.style.display = "block";
});

const cancelAddPlayerBtn = document.getElementById("cancel-add-player");
if (cancelAddPlayerBtn) {
    cancelAddPlayerBtn.addEventListener("click", () => {
        addPlayerForm.style.display = "none";
    });
}

const countriesDataEl = document.getElementById("countries-data");
const countries = countriesDataEl ? JSON.parse(countriesDataEl.textContent || "[]") : [];

const nationalitySearch = document.getElementById("nationality-search");
const nationalityCode = document.getElementById("nationality-code");
const nationalityFlag = document.getElementById("nationality-flag");
const suggestionsList = document.getElementById("nationality-suggestions");

// ISO 3166-1 alpha-2 codes (already provided by the countries API) are all
// flagcdn.com needs to look up a country's flag - nothing to persist.
const flagUrl = (isoCode) => `https://flagcdn.com/24x18/${isoCode.toLowerCase()}.png`;

if (nationalitySearch && nationalityCode && suggestionsList) {
    const MAX_SUGGESTIONS = 10;

    const hideSuggestions = () => {
        suggestionsList.innerHTML = "";
        suggestionsList.hidden = true;
    };

    const renderSuggestions = (matches) => {
        suggestionsList.innerHTML = "";

        matches.forEach((country) => {
            const item = document.createElement("li");

            const flagImg = document.createElement("img");
            flagImg.className = "suggestion-flag";
            flagImg.src = flagUrl(country.code);
            flagImg.alt = "";

            const label = document.createElement("span");
            label.textContent = country.name;

            item.append(flagImg, label);
            item.addEventListener("click", () => {
                nationalitySearch.value = country.name;
                nationalityCode.value = country.code;
                if (nationalityFlag) {
                    nationalityFlag.src = flagUrl(country.code);
                    nationalityFlag.hidden = false;
                }
                hideSuggestions();
            });
            suggestionsList.appendChild(item);
        });

        suggestionsList.hidden = matches.length === 0;
    };

    nationalitySearch.addEventListener("input", () => {
        const query = nationalitySearch.value.trim().toLowerCase();
        nationalityCode.value = "";
        if (nationalityFlag) {
            nationalityFlag.hidden = true;
        }

        if (!query) {
            hideSuggestions();
            return;
        }

        const matches = countries
            .filter((country) => country.name.toLowerCase().includes(query))
            .slice(0, MAX_SUGGESTIONS);

        renderSuggestions(matches);
    });

    document.addEventListener("click", (event) => {
        if (!nationalitySearch.contains(event.target) && !suggestionsList.contains(event.target)) {
            hideSuggestions();
        }
    });
}