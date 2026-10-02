let addPlayerBtn = document.getElementById("add-player-btn");
let addPlayerForm = document.getElementById("add-player-form");
let cardDisplay = document.getElementById("card-display");

addPlayerBtn.addEventListener("click", () => {
    addPlayerForm.style.display = "block";
});

const cancelAddPlayerBtn = document.getElementById("cancel-add-player");
if (cancelAddPlayerBtn) {
    cancelAddPlayerBtn.addEventListener("click", () => {
        addPlayerForm.style.display = "none";
    });
}

cardDisplay.addEventListener("click", async(e) => {
    const card = e.target.closest(".player-card");
    if (!card) return;
    const playerId = card.dataset.playerId;
    const playerName = card.querySelector(".player-name").textContent.trim();
    const nationality = card.querySelector(".player-nationality").textContent.trim();
    const price = card.querySelector(".player-price").textContent.trim();

    if(e.target.classList.contains("delete-player-btn")) {
        if(!confirm("Are you sure you want to delete this player?")) return;

        const response = await fetch(url, { method: "DELETE" });
        if (response.ok) {
            card.remove();
        } else {
            alert("Failed to delete player.");
        }
    }

    if(e.target.classList.contains("edit-player-btn")) {
        const playerName = card.querySelector(".player-name").textContent;
        const nationality = card.querySelector(".player-nationality").textContent;
        const price = card.querySelector(".player-price").textContent;

        const newPlayerName = prompt("Enter new player name:", playerName);
        const newNationality = prompt("Enter new nationality:", nationality);
        const newPrice = prompt("Enter new price:", price);

        if(newPlayerName == null || newNationality == null || newPrice == null) {
            return;
        }

        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: newPlayerName,
                nationality: newNationality,
                price: newPrice
            })
        });

        if (response.ok) {
            const updatedPlayer = await response.json();
            card.querySelector(".player-name").textContent = updatedPlayer.playername;
            card.querySelector(".player-nationality").textContent = updatedPlayer.countryname;
            card.querySelector(".player-price").textContent = updatedPlayer.price;
        } else {
            alert("Failed to update player.");
        }
    }
});

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