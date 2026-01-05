document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");
    if (!form) return;

    const inputs = form.querySelectorAll("input, textarea");
    function showError(input, type) {
        const error = input.nextElementSibling;
        input.classList.add("error");

        const key = type === "required"
            ? `data-required-${window.currentLang}`
            : `data-error-${window.currentLang}`;

        error.innerText = input.getAttribute(key) || "Invalid";
        error.style.display = "block";
    }

    function clearError(input) {
        const error = input.nextElementSibling;
        input.classList.remove("error");
        error.innerText = "";
        error.style.display = "none";
    }

    inputs.forEach(input => {
        input.addEventListener("input", () => {
            if (input.value.trim() === "") {
                showError(input, "required");
            } else if (input.dataset.regex) {
                const regex = new RegExp(input.dataset.regex);
                if (!regex.test(input.value.trim())) {
                    showError(input, "error");
                } else {
                    clearError(input);
                }
            } else {
                clearError(input);
            }
        });
    });

    form.addEventListener("submit", e => {
        e.preventDefault();
        let isValid = true;

        inputs.forEach(input => {
            if (input.value.trim() === "") {
                showError(input, "required");
                isValid = false;
            } else if (input.dataset.regex) {
                const regex = new RegExp(input.dataset.regex);
                if (!regex.test(input.value.trim())) {
                    showError(input, "error");
                    isValid = false;
                }
            }
        });

        if (isValid) {
            const title = document.body.getAttribute(`data-success-title-${window.currentLang}`);
            const text = document.body.getAttribute(`data-success-text-${window.currentLang}`);

            Swal.fire({
                icon: "success",
                title: title,
                text: text,
                confirmButtonColor: "#c89b3c"
            });

            form.reset();
            inputs.forEach(clearError);
        }
    });

    document.addEventListener("languageChanged", (e) => {
        window.currentLang = e.detail.lang;
        inputs.forEach(input => {
            if (input.classList.contains("error")) {
                const type = input.value.trim() === "" ? "required" : "error";
                showError(input, type);
            }
        });
    });

});
