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

async function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value.trim();
    const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

    if (newQuoteText !== "" && newQuoteCategory !== "") {
        const newQuote = { text: newQuoteText, category: newQuoteCategory };
        quotes.push(newQuote);

        saveQuotes();

        // Post the new quote to the server
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newQuote)
            });

            if (response.ok) {
                console.log('Quote added to the server');
                showMessage('Quote added and synced with the server.');
            } else {
                console.error('Failed to add quote to the server');
            }
        } catch (error) {
            console.error('Error:', error);
        }

        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';

        displayQuote(newQuote);
        updateCategoriesDropdown();
    } else {
        showMessage("Please enter both quote text and category.");
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
        showMessage('Quotes imported successfully!');
        location.reload();
    };
    fileReader.readAsText(event.target.files[0]);
}

async function fetchQuotesFromServer() {
    try {
        const response = await fetch(API_URL);
        const serverQuotes = await response.json();
        const newQuotes = serverQuotes.map(quote => ({ text: quote.title, category: 'Server' })); // Assuming 'title' as text and category as 'Server'

        const uniqueNewQuotes = newQuotes.filter(newQuote => !quotes.some(quote => quote.text === newQuote.text));
        quotes = [...quotes, ...uniqueNewQuotes];
        saveQuotes();
        filterQuotes();
        updateCategoriesDropdown();
        showMessage('Quotes synced with server!');
    } catch (error) {
        console.error("Failed to fetch quotes from server:", error);
    }
}

async function syncQuotesWithServer() {
    try {
        // Send local quotes to the server
        for (const quote of quotes) {
            await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(quote)
            });
        }

        // Fetch the latest quotes from the server
        await fetchQuotesFromServer();
        console.log('Quotes synced with the server');
        showMessage('Quotes synced with the server.');
    } catch (error) {
        console.error('Error syncing quotes with the server:', error);
    }
}

function showMessage(message) {
    const messageBox = document.getElementById('messageBox');
    messageBox.textContent = message;
    messageBox.style.display = 'block';
    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 3000); // Hide message after 3 seconds
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

    // Add sync quotes button event listener
    document.getElementById('syncQuotes').addEventListener('click', syncQuotesWithServer);
}

window.onload = init;
