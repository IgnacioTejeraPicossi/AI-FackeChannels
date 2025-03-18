document.addEventListener('DOMContentLoaded', function() {
    const analyzeForm = document.getElementById('analyzeForm');
    const channelInfoTextarea = document.getElementById('channelInfo');
    const resultsCard = document.getElementById('resultsCard');
    const fakeProbabilityBar = document.getElementById('fakeProbability');
    const analysisResults = document.getElementById('analysisResults');

    // Initialize the markdown parser
    const renderer = new marked.Renderer();
    marked.setOptions({
        renderer: renderer,
        gfm: true,
        breaks: true,
        sanitize: false,
        smartLists: true,
        smartypants: false,
        xhtml: false
    });

    // Handle form submission
    analyzeForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const channelInfo = channelInfoTextarea.value.trim();
        
        if (!channelInfo) {
            alert('Please enter channel information to analyze');
            return;
        }
        
        // Show loading state
        document.querySelector('button[type="submit"]').disabled = true;
        document.querySelector('button[type="submit"]').textContent = 'Analyzing...';
        resultsCard.classList.add('d-none');
        
        try {
            // Send the analysis request to the server
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ channelInfo })
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            
            // Display the results
            displayResults(data.analysis);
            
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error analyzing the channel. Please try again.');
        } finally {
            // Reset loading state
            document.querySelector('button[type="submit"]').disabled = false;
            document.querySelector('button[type="submit"]').textContent = 'Analyze Channel';
        }
    });
    
    // Function to display analysis results
    function displayResults(analysisText) {
        // Parse the markdown content
        const htmlContent = marked.parse(analysisText);
        
        // Extract the probability percentage from the analysis
        const probabilityMatch = analysisText.match(/(\d+)%/);
        let probability = 0;
        
        if (probabilityMatch && probabilityMatch[1]) {
            probability = parseInt(probabilityMatch[1], 10);
        }
        
        // Update the probability bar
        fakeProbabilityBar.style.width = `${probability}%`;
        fakeProbabilityBar.textContent = `${probability}% probability of being fake`;
        
        // Set the color based on the probability
        if (probability < 30) {
            fakeProbabilityBar.className = 'progress-bar low-probability';
        } else if (probability < 70) {
            fakeProbabilityBar.className = 'progress-bar medium-probability';
        } else {
            fakeProbabilityBar.className = 'progress-bar high-probability';
        }
        
        // Update the analysis results
        analysisResults.innerHTML = htmlContent;
        
        // Show the results card
        resultsCard.classList.remove('d-none');
    }
}); 