// File: assets/js/sentiment-analysis-plots.js

function createSentimentComparisonPlot(vaderData, distilbertData, movieId) {
    const layout = {
        title: {
            text: `Sentiment Comparison for Movie ID: ${movieId}`,
            font: { size: 24, color: 'white' }
        },
        xaxis: {
            title: 'Sentence Index',
            gridcolor: 'gray',
            color: 'white'
        },
        yaxis: {
            title: 'Sentiment Score',
            gridcolor: 'gray',
            color: 'white'
        },
        plot_bgcolor: '#1e1e1e',
        paper_bgcolor: '#1e1e1e',
        font: { color: 'white' },
        showlegend: true,
        legend: { font: { color: 'white' } }
    };

    // Process VADER data
    const vaderTrace = {
        x: Array.from({ length: vaderData.length }, (_, i) => i),
        y: vaderData.map(d => parseFloat(d.compound)),
        type: 'scatter',
        mode: 'lines+markers',
        name: 'VADER',
        line: { color: 'cyan', width: 2 }
    };

    // Process DistilBERT data
    const distilbertTrace = {
        x: Array.from({ length: distilbertData.length }, (_, i) => i),
        y: distilbertData.map(d => parseFloat(d.sentiment_score)),
        type: 'scatter',
        mode: 'lines+markers',
        name: 'DistilBERT',
        line: { color: 'magenta', width: 2 }
    };

    Plotly.newPlot('sentiment-comparison-plot', [vaderTrace, distilbertTrace], layout);
}

function createGenreSentimentPlot(data, modelType) {
    const layout = {
        title: {
            text: `Genre-based Sentiment Analysis (${modelType})`,
            font: { size: 24, color: 'white' }
        },
        xaxis: {
            title: 'Genre',
            gridcolor: 'gray',
            color: 'white'
        },
        yaxis: {
            title: 'Average Sentiment Score',
            gridcolor: 'gray',
            color: 'white'
        },
        plot_bgcolor: '#1e1e1e',
        paper_bgcolor: '#1e1e1e',
        font: { color: 'white' }
    };

    // Process genre sentiment data
    const genreStats = processGenreSentiments(data);
    
    const trace = {
        x: Object.keys(genreStats),
        y: Object.values(genreStats).map(g => g.avgSentiment),
        type: 'bar',
        marker: {
            color: Object.values(genreStats).map(g => g.avgSentiment),
            colorscale: 'Viridis'
        }
    };

    Plotly.newPlot(`genre-sentiment-${modelType.toLowerCase()}`, [trace], layout);
}

function processGenreSentiments(data) {
    // Implementation of genre sentiment processing
    // Returns object with genre statistics
    // ...
}