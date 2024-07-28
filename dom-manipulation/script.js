const API_URL = 'https://jsonplaceholder.typicode.com/posts'; // Example URL

let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Inspiration" },
    { text: "Do not watch the clock. Do what it does. Keep going.", category: "Time" }
];

function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    }
}

function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

function showRandomQuote() {
    if (quotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[randomIndex];
        const quoteDisplay = document.getElementById('quoteDisplay');
        quoteDisplay.innerHTML = `<blockquote>"${quote.text}"</blockquote><p><em>Category: ${quote.category}</em></p>`;
        
        sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
    } else {
        console.error("Quotes array is empty.");
    }
}

function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value.trim();
    const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

    if (newQuoteText !== "" && newQuoteCategory !== "") {
        const newQuote = { text: newQuoteText, category: newQuoteCategory };
        quotes.push(newQuote);

        saveQuotes();

        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';

        displayQuote(newQuote);
        updateCategoriesDropdown();
    } else {
        alert("Please enter both quote text and category.");
    }
}

function displayQuote(quote) {
    const quoteList = document.getElementById('quoteList');
    const li = document.createElement('li');
    li.textContent = `"${quote.text}" - Category: ${quote.category}`;
    quoteList.appendChild(li);
}

function populateCategories() {
    const categories = [...new Set(quotes.map(quote => quote.category))];
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    const selectedCategory = localStorage.getItem('selectedCategory');
    if (selectedCategory) {
        categoryFilter.value = selectedCategory;
        filterQuotes();
    }
}

function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const quoteList = document.getElementById('quoteList');
    quoteList.innerHTML = '';

    quotes
        .filter(quote => selectedCategory === 'all' || quote.category === selectedCategory)
        .forEach(displayQuote);

    localStorage.setItem('selectedCategory', selectedCategory);
}

function updateCategoriesDropdown() {
    populateCategories();
}

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

function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        alert('Quotes imported successfully!');
        location.reload();
    };
    fileReader.readAsText(event.target.files[0]);
}

async function fetchQuotesFromServer() {
    try {
        const response = await fetch(API_URL);
        const serverQuotes = await response.json();
        const newQuotes = serverQuotes.map(quote => ({ text: quote.title, category: 'Server' })); // Assuming 'title' as text and category as 'Server'

        const mergedQuotes = [...quotes, ...newQuotes];
        quotes = mergedQuotes;
        saveQuotes();
        filterQuotes();
        updateCategoriesDropdown();
    } catch (error) {
        console.error("Failed to fetch quotes from server:", error);
    }
}

function init() {
    loadQuotes();
    filterQuotes();
    populateCategories();

    document.getElementById('newQuote').addEventListener('click', showRandomQuote);
    document.getElementById('button').onclick = exportToJsonFile;
    document.getElementById('importFile').style.display = 'block';

    const lastViewedQuote = JSON.parse(sessionStorage.getItem('lastViewedQuote'));
    if (lastViewedQuote) {
        const quoteDisplay = document.getElementById('quoteDisplay');
        quoteDisplay.innerHTML = `<blockquote>"${lastViewedQuote.text}"</blockquote><p><em>Category: ${lastViewedQuote.category}</em></p>`;
    }

    setInterval(fetchQuotesFromServer, 30000); // Fetch quotes from server every 30 seconds
}

window.onload = init;
