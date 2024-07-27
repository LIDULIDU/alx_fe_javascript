// Check for the existence of the quotes array
let quotes = quotes || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Inspiration" },
    { text: "Do not watch the clock. Do what it does. Keep going.", category: "Time" }
];

// Function to show a random quote
function showRandomQuote() {
    if (quotes && Array.isArray(quotes) && quotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[randomIndex];
        updateQuoteDisplay(quote);
    } else {
        console.error("Quotes array is empty or not defined.");
    }
}

// Function to update the DOM with the selected quote
function updateQuoteDisplay(quote) {
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.textContent = `"${quote.text}" - Category: ${quote.category}`;
}

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

// Function to create and display the add quote form
function createAddQuoteForm() {
    const formContainer = document.createElement('div');

    const inputQuoteText = document.createElement('input');
    inputQuoteText.id = 'newQuoteText';
    inputQuoteText.type = 'text';
    inputQuoteText.placeholder = 'Enter a new quote';

    const inputQuoteCategory = document.createElement('input');
    inputQuoteCategory.id = 'newQuoteCategory';
    inputQuoteCategory.type = 'text';
    inputQuoteCategory.placeholder = 'Enter quote category';

    const addButton = document.createElement('button');
    addButton.textContent = 'Add Quote';
    addButton.onclick = addQuote;

    formContainer.appendChild(inputQuoteText);
    formContainer.appendChild(inputQuoteCategory);
    formContainer.appendChild(addButton);

    document.body.appendChild(formContainer);
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
    createAddQuoteForm();

    // Create a container to display quotes
    const quoteListContainer = document.createElement('ul');
    quoteListContainer.id = 'quoteList';
    document.body.appendChild(quoteListContainer);

    // Create a container to display the random quote
    const quoteDisplay = document.createElement('div');
    quoteDisplay.id = 'quoteDisplay';
    document.body.appendChild(quoteDisplay);

    // Display initial quotes
    quotes.forEach(displayQuote);

    // Add event listener for showing a random quote
    const showQuoteButton = document.createElement('button');
    showQuoteButton.textContent = 'Show Random Quote';
    showQuoteButton.onclick = showRandomQuote;
    document.body.appendChild(showQuoteButton);
}

// Call the init function on page load
window.onload = init;
