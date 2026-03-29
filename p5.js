const fromText = document.querySelector(".from-text"),
toText = document.querySelector(".to-text"),
exchangeIcon = document.querySelector(".exchange"),
selectTag = document.querySelectorAll("select"),
icons = document.querySelectorAll(".row i"),
translateBtn = document.querySelector("button"),
statusText = document.querySelector(".status");

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

exchangeIcon.addEventListener("click", () => {
    let tempText = fromText.value;
    fromText.value = toText.value;
    toText.value = tempText;

    let tempLang = selectTag[0].value;
    selectTag[0].value = selectTag[1].value;
    selectTag[1].value = tempLang;
});