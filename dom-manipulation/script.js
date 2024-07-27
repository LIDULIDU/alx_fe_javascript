// Array to store quotes
let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Inspiration" },
    { text: "Do not watch the clock. Do what it does. Keep going.", category: "Time" }
];

// Function to show a random quote
function displayRandomQuote() {
    if (quotes && Array.isArray(quotes) && quotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[randomIndex];
        const quoteDisplay = document.getElementById('quoteDisplay');
        quoteDisplay.innerHTML = `<blockquote>"${quote.text}"</blockquote><p><em>Category: ${quote.category}</em></p>`;
        } else {
        console.error("Quotes array is empty or not defined.");
    }
}

// Function to update the DOM with the selected quote
// function updateQuoteDisplay(quote) {
//     const quoteDisplay = document.getElementById('quoteDisplay');
//     quoteDisplay.textContent = `"${quote.text}" - Category: ${quote.category}`;
// }

// Function to add a new quote
function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value.trim();
    const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

    if (newQuoteText !== "" && newQuoteCategory !== "") {
        const newQuote = { text: newQuoteText, category: newQuoteCategory };
        quotes.push(newQuote);

        // Clear input fields
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';

        // Update the DOM with the new quote
        displayQuote(newQuote);
    } else {
        alert("Please enter both quote text and category.");
    }
}

// Function to display a quote in the DOM
function displayQuote(quote) {
    const quoteList = document.getElementById('quoteList');
    const li = document.createElement('li');
    li.textContent = `"${quote.text}" - Category: ${quote.category}`;
    quoteList.appendChild(li);
}

// Initial setup to display the form and the initial quotes
function init() {
    // Display initial quotes
    quotes.forEach(displayQuote);

    // Add event listener for showing a random quote
    const showQuoteButton = document.getElementById('newQuote');
    showQuoteButton.addEventListener('click', displayRandomQuote);
}

// Call the init function on page load
window.onload = init;
