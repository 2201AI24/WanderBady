document.addEventListener("DOMContentLoaded", function () {
    const sendBtn = document.getElementById("send-btn");
    const voiceBtn = document.getElementById("voice-btn");
    const chatInput = document.getElementById("chat-input");
    const chatWindow = document.getElementById("chat-window");

    function appendMessage(sender, text) {
        const messageElement = document.createElement("p");
        messageElement.classList.add(sender === "You" ? "user-message" : "bot-message");
        messageElement.textContent = `${sender}: ${text}`;
        chatWindow.appendChild(messageElement);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function fetchChatbotResponse(userMessage) {
        appendMessage("Bot", "Thinking...");

        fetch("http://127.0.0.1:5000/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userMessage }),
        })
            .then((response) => response.json())
            .then((data) => {
                chatWindow.lastChild.remove(); // Remove "Thinking..."
                appendMessage("Bot", data.response);
            })
            .catch((error) => {
                chatWindow.lastChild.remove();
                appendMessage("Bot", "Error fetching response.");
            });
    }

    // Send button click event
    sendBtn.addEventListener("click", function () {
        const message = chatInput.value.trim();
        if (message) {
            appendMessage("You", message);
            fetchChatbotResponse(message);
            chatInput.value = "";
        }
    });

    // 🔹 Voice Recognition
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        voiceBtn.addEventListener("click", function () {
            recognition.start();
            voiceBtn.textContent = "🎙️ Listening..."; // Update button UI
        });

        recognition.onresult = function (event) {
            const speechResult = event.results[0][0].transcript;
            chatInput.value = speechResult; // Set recognized text
            fetchChatbotResponse(speechResult); // Auto-send the message
        };

        recognition.onspeechend = function () {
            recognition.stop();
            voiceBtn.textContent = "🎤"; // Reset button UI
        };

        recognition.onerror = function (event) {
            console.error("Speech Recognition Error:", event.error);
            voiceBtn.textContent = "🎤"; // Reset button UI
        };
    } else {
        voiceBtn.style.display = "none"; // Hide mic button if unsupported
        console.warn("Speech recognition not supported in this browser.");
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const suggestionButtons = document.querySelectorAll(".suggestion-btn");
    const chatInput = document.getElementById("chat-input");

    suggestionButtons.forEach(button => {
        button.addEventListener("click", function() {
            chatInput.value = button.getAttribute("data-question");
            chatInput.focus(); // Brings cursor into the input field
        });
    });



    // 🟢 Budget, Group, and Activity Selection
    function handleSelection(buttons) {
        buttons.forEach(btn => {
            btn.addEventListener("click", function() {
                if (btn.classList.contains("budget-btn") || btn.classList.contains("group-btn")) {
                    buttons.forEach(b => b.classList.remove("selected"));
                }
                btn.classList.toggle("selected");
            });
        });
    }
    handleSelection(budgetBtns);
    handleSelection(groupBtns);
    handleSelection(activityBtns);

    // 🟢 Smooth scrolling to trip planner
    searchBtn?.addEventListener("click", function() {
        const destination = searchBar.value.trim();
        if (destination) {
            localStorage.setItem("destination", destination);
            document.getElementById("planner").scrollIntoView({ behavior: 'smooth' });
        } else {
            alert("Please enter a destination.");
        }
    });

    // 🟢 Redirect to result.html on form submission
    generatePlanBtn?.addEventListener("click", function() {
        const destination = localStorage.getItem("destination") || "";
        const date = document.getElementById("date")?.value;
        const days = document.getElementById("days")?.value;
        const budget = document.querySelector(".budget-btn.selected")?.dataset.value;
        const group = document.querySelector(".group-btn.selected")?.dataset.value;
        const activities = Array.from(document.querySelectorAll(".activity-btn.selected"))
                               .map(btn => btn.dataset.value);

        if (!destination || !date || !days || !budget || !group) {
            alert("Please fill in all required fields!");
            return;
        }

        fetch("http://127.0.0.1:5000/plan-trip", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ destination, date, days, budget, group, activities })
        })
        .then(response => response.json())
        .then(data => {
            localStorage.setItem("itinerary", data.itinerary);
            window.location.href = "result.html";
        })
        .catch(error => {
            alert("Error generating itinerary. Please try again.");
        });
    });

    // 🟢 Fetch AI Travel Insights in result.html
    if (window.location.pathname.includes("result.html")) {
        const insightsDiv = document.getElementById("travel-insights");
        const destination = localStorage.getItem("destination");

        if (destination) {
            fetch("http://127.0.0.1:5000/travel-insights", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ destination })
            })
            .then(response => response.json())
            .then(data => {
                if (data.travel_info) {
                    insightsDiv.innerHTML = `<strong>AI Insights for ${destination}:</strong><br>${data.travel_info}`;
                    insightsDiv.classList.remove("hidden");
                }
            })
            .catch(error => {
                insightsDiv.innerHTML = "Error fetching travel insights.";
            });
        }
    }
});
