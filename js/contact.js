const form = document.getElementById("contactForm");

const fields = {
    name: {
        input: document.getElementById("name"),
        regex: /^[a-zA-Z\s]{3,}$/,
        message: "Name must be at least 3 letters"
    },
    phone: {
        input: document.getElementById("phone"),
        regex: /^[0-9+\s]{8,}$/,
        message: "Enter a valid phone number"
    },
    email: {
        input: document.getElementById("email"),
        regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Enter a valid email address"
    },
    subject: {
        input: document.getElementById("subject"),
        regex: /^.{3,}$/,
        message: "Subject must be at least 3 characters"
    },
    message: {
        input: document.getElementById("message"),
        regex: /^.{10,}$/,
        message: "Message must be at least 10 characters"
    }
};

function showError(input, msg) {
    const error = input.nextElementSibling;
    input.classList.add("error");
    error.innerText = msg;
    error.style.display = "block";
}

function clearError(input) {
    const error = input.nextElementSibling;
    input.classList.remove("error");
    error.innerText = "";
    error.style.display = "none";
}

Object.values(fields).forEach(field => {
    field.input.addEventListener("input", () => {
        if (field.input.value.trim() === "") {
            showError(field.input, "This field is required");
        } else if (!field.regex.test(field.input.value.trim())) {
            showError(field.input, field.message);
        } else {
            clearError(field.input);
        }
    });
});

form.addEventListener("submit", function (e) {
    e.preventDefault();
    let isValid = true;

    Object.values(fields).forEach(field => {
        const value = field.input.value.trim();

        if (value === "") {
            showError(field.input, "This field is required");
            isValid = false;
        } else if (!field.regex.test(value)) {
            showError(field.input, field.message);
            isValid = false;
        }
    });

    if (isValid) {
        Swal.fire({
            icon: "success",
            title: "Message Sent!",
            text: "Your message has been sent successfully.",
            confirmButtonColor: "#c89b3c"
        });

        form.reset();
        Object.values(fields).forEach(field => clearError(field.input));
    }
});
   const section = document.querySelector(".contact");
        const bees = document.querySelectorAll(
            ".contact-bee-shape, .contact-bee-shape-2"
        );

        function moveBee(bee) {
            const sectionWidth = section.clientWidth;
            const sectionHeight = section.clientHeight;
            const beeWidth = bee.offsetWidth;
            const beeHeight = bee.offsetHeight;

            const maxX = sectionWidth - beeWidth;
            const maxY = sectionHeight - beeHeight;

            const randomX = Math.random() * maxX;
            const randomY = Math.random() * maxY;
            const randomRotate = Math.random() * 40 - 20;

            bee.style.left = `${randomX}px`;
            bee.style.top = `${randomY}px`;
            bee.style.transform = `rotate(${randomRotate}deg)`;
        }

        bees.forEach((bee, index) => {
            moveBee(bee);
            setInterval(() => moveBee(bee), 4000 + index * 1500);
        });