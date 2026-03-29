const fromText = document.querySelector(".from-text"),
toText = document.querySelector(".to-text"),
exchangeIcon = document.querySelector(".exchange"),
selectTag = document.querySelectorAll("select"),
icons = document.querySelectorAll(".row i"),
translateBtn = document.querySelector("button"),
statusText = document.querySelector(".status");

// Populate dropdowns
selectTag.forEach((tag, id) => {
    for (let country_code in countries) {
        let selected =
            id == 0
                ? country_code == "en-GB" ? "selected" : ""
                : country_code == "hi-IN" ? "selected" : "";

        let option = `<option ${selected} value="${country_code}">
                        ${countries[country_code]}
                      </option>`;

        tag.insertAdjacentHTML("beforeend", option);
    }
});

// Swap languages
exchangeIcon.addEventListener("click", () => {
    let tempText = fromText.value;
    fromText.value = toText.value;
    toText.value = tempText;

    let tempLang = selectTag[0].value;
    selectTag[0].value = selectTag[1].value;
    selectTag[1].value = tempLang;
});

// Clear translation when input empty
fromText.addEventListener("keyup", () => {
    if (!fromText.value) {
        toText.value = "";
    }
});

// Translate function
translateBtn.addEventListener("click", async () => {
    let text = fromText.value.trim(),
        translateFrom = selectTag[0].value,
        translateTo = selectTag[1].value;

    if (!text) return;

    // Loading UI
    toText.value = "";
    toText.setAttribute("placeholder", "Translating...");
    statusText.innerText = "Translating...";
    statusText.className = "status loading";
    translateBtn.disabled = true;

    let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;

    try {
        let res = await fetch(apiUrl);

        if (!res.ok) throw new Error("Network error");

        let data = await res.json();

        if (!data.responseData.translatedText)
            throw new Error("Translation failed");

        toText.value = data.responseData.translatedText;

        data.matches.forEach(match => {
            if (match.id === 0) {
                toText.value = match.translation;
            }
        });

        statusText.innerText = "Translation successful !";
        statusText.className = "status";

    } catch (error) {
        console.error(error);

        statusText.innerText = "❌ Error: Unable to translate";
        statusText.className = "status error";
        toText.setAttribute("placeholder", "Translation failed");

    } finally {
        translateBtn.disabled = false;
    }
});

// Copy & Speak
icons.forEach(icon => {
    icon.addEventListener("click", ({ target }) => {
        if (!fromText.value && !toText.value) return;

        // Copy
        if (target.classList.contains("fa-copy")) {
            let textToCopy =
                target.id === "from" ? fromText.value : toText.value;

            navigator.clipboard.writeText(textToCopy);
            statusText.innerText = "Copied to clipboard ✅";
        }

        // Speech
        else {
            let utterance = new SpeechSynthesisUtterance(
                target.id === "from" ? fromText.value : toText.value
            );

            utterance.lang =
                target.id === "from"
                    ? selectTag[0].value
                    : selectTag[1].value;

            speechSynthesis.speak(utterance);
        }
    });
});