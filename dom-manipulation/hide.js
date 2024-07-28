// Array to store quotes
let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Inspiration" },
    { text: "Do not watch the clock. Do what it does. Keep going.", category: "Time" }
];

// Function to show a random quote
function showRandomQuote() {
    if (quotes && Array.isArray(quotes) && quotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[randomIndex];
        const quoteDisplay = document.getElementById('quoteDisplay');
        quoteDisplay.innerHTML = `<blockquote>"${quote.text}"</blockquote><p><em>Category: ${quote.category}</em></p>`;
        } else {
        console.error("Quotes array is empty or not defined.");
    }
}


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
        createAddQuoteForm().appendChild(displayQuote());
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

function createAddQuoteForm() {
    const formContainer = document.createElement('div');
    formContainer.innerHTML = `
        <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
        <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
        <button onclick="addQuote()">Add Quote</button>
    `;
    document.body.appendChild(formContainer);
}
// Initial setup to display the form and the initial quotes
function init() {
    // Display initial quotes
    quotes.forEach(displayQuote);

    // Add event listener for showing a random quote
    const showQuoteButton = document.getElementById('newQuote');
    showQuoteButton.addEventListener('click', showRandomQuote);
}

// Call the init function on page load
window.onload = init;
/////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
// Array to store quotes
let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Inspiration" },
    { text: "Do not watch the clock. Do what it does. Keep going.", category: "Time" }
];

// Function to load quotes from local storage
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    }
}

// Function to save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to show a random quote
function showRandomQuote() {
    if (quotes && Array.isArray(quotes) && quotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[randomIndex];
        const quoteDisplay = document.getElementById('quoteDisplay');
        quoteDisplay.innerHTML = `<blockquote>"${quote.text}"</blockquote><p><em>Category: ${quote.category}</em></p>`;
        
        // Save the last viewed quote to session storage
        sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
    } else {
        console.error("Quotes array is empty or not defined.");
    }
}

// Function to add a new quote
function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value.trim();
    const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

    if (newQuoteText !== "" && newQuoteCategory !== "") {
        const newQuote = { text: newQuoteText, category: newQuoteCategory };
        quotes.push(newQuote);

        // Save quotes to local storage
        saveQuotes();

        // Clear input fields
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';

        // Update the categories dropdown
        updateCategoriesDropdown();

        // Update the DOM with the new quote
        filterQuotes();
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

// Function to filter quotes based on selected category
function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const quoteList = document.getElementById('quoteList');
    quoteList.innerHTML = ''; // Clear the list

    const filteredQuotes = quotes.filter(quote => 
        selectedCategory === 'all' || quote.category === selectedCategory
    );

    filteredQuotes.forEach(displayQuote);

    // Save the selected category to local storage
    localStorage.setItem('selectedCategory', selectedCategory);
}

// Function to populate categories dynamically in the dropdown
function populateCategories() {
    const categories = [...new Set(quotes.map(quote => quote.category))];
    const categoryFilter = document.getElementById('categoryFilter');

    // Clear existing options except the first one
    const firstOption = categoryFilter.options[0];
    categoryFilter.innerHTML = '';
    categoryFilter.appendChild(firstOption);

    // Add categories to dropdown
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Function to update categories dropdown
function updateCategoriesDropdown() {
    populateCategories();
}

// Function to export quotes to a JSON file
function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'quotes.json';
    downloadLink.click();
    URL.revokeObjectURL(url);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        updateCategoriesDropdown(); // Update categories dropdown with new categories
        filterQuotes(); // Refresh displayed quotes
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

// Initial setup to display the form and the initial quotes
function init() {
    // Load quotes from local storage
    loadQuotes();

    // Display initial quotes
    filterQuotes(); // Use filterQuotes to display quotes initially

    // Populate categories dropdown
    populateCategories();

    // Set last selected filter category
    const lastSelectedCategory = localStorage.getItem('selectedCategory');
    if (lastSelectedCategory) {
        document.getElementById('categoryFilter').value = lastSelectedCategory;
        filterQuotes(); // Apply last selected filter
    }

    // Add event listener for showing a random quote
    const showQuoteButton = document.getElementById('newQuote');
    showQuoteButton.addEventListener('click', showRandomQuote);

    // Add export button
    const exportButton = document.getElementById('button');
    exportButton.onclick = exportToJsonFile;

    // Add import file input
    const importInput = document.getElementById('importFile');
    importInput.style.display = 'block';

    // Display last viewed quote from session storage
    const lastViewedQuote = JSON.parse(sessionStorage.getItem('lastViewedQuote'));
    if (lastViewedQuote) {
        const quoteDisplay = document.getElementById('quoteDisplay');
        quoteDisplay.innerHTML = `<blockquote>"${lastViewedQuote.text}"</blockquote><p><em>Category: ${lastViewedQuote.category}</em></p>`;
    }
}

// Call the init function on page load
window.onload = init;
