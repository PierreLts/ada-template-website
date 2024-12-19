// File: assets/js/sentiment-analysis-plots.js

function createSentimentPlots(vaderData, distilbertData) {
    createSentimentComparisonPlot(vaderData, distilbertData);
    createGenreSentimentPlot(vaderData);
}

// Function to update DistilBERT plot
function updateDistilBERTPlot(movieId) {
    // Load the sentiment data
    Papa.parse('/data/distillbert_sentiment_analysis.csv', {
        download: true,
        header: true,
        complete: function(results) {
            // Filter data for the selected movie
            const movieData = results.data.filter(row => row.movie_id === movieId);
            
            if (movieData.length === 0) {
                console.error('No data found for movie ID:', movieId);
                return;
            }

            // Create the plot data
            const trace = {
                x: movieData.map((_, index) => index),
                y: movieData.map(row => parseFloat(row.sentiment_score)),
                type: 'scatter',
                mode: 'lines+markers',
                line: {
                    color: 'rgb(75, 192, 192)',
                    width: 2
                },
                marker: {
                    size: 6
                }
            };

            const layout = {
                title: {
                    text: `Sentence Sentiment for Movie ID: ${movieId} (DistilBERT)`,
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
                font: { color: 'white' }
            };

            Plotly.newPlot('distilbert-sentiment-plot', [trace], layout);
        },
        error: function(error) {
            console.error('Error loading sentiment data:', error);
        }
    });
}

// Call the function when the page loads with the default movie ID
document.addEventListener('DOMContentLoaded', function() {
    updateDistilBERTPlot('77856');
});

function createSentimentComparisonPlot(vaderData, distilbertData) {
    const movieId = '77856';
    
    // Process VADER data
    const vaderMovieData = vaderData
        .filter(d => d.movie_id === movieId)
        .map((d, i) => ({
            x: i,
            y: JSON.parse(d.sentence_sentiments)[0].compound
        }));

    // Process DistilBERT data
    const distilbertMovieData = distilbertData
        .filter(d => d.movie_id === movieId)
        .map((d, i) => ({
            x: i,
            y: parseFloat(d.sentiment_score)
        }));

    const traces = [
        {
            x: vaderMovieData.map(d => d.x),
            y: vaderMovieData.map(d => d.y),
            type: 'scatter',
            mode: 'lines+markers',
            name: 'VADER',
            line: { color: 'cyan', width: 2 }
        },
        {
            x: distilbertMovieData.map(d => d.x),
            y: distilbertMovieData.map(d => d.y),
            type: 'scatter',
            mode: 'lines+markers',
            name: 'DistilBERT',
            line: { color: 'magenta', width: 2 }
        }
    ];

    const layout = {
        title: {
            text: 'Sentiment Analysis Comparison',
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

    Plotly.newPlot('sentiment-comparison-plot', traces, layout);
}

// function createGenreSentimentPlot(vaderData) {
//     const genreStats = processGenreSentiments(vaderData);
    
//     const trace = {
//         x: Object.keys(genreStats),
//         y: Object.values(genreStats).map(d => d.avgSentiment),
//         type: 'bar',
//         marker: {
//             color: Object.values(genreStats).map(d => d.avgSentiment),
//             colorscale: [
//                 [0, 'rgb(178,24,43)'],
//                 [0.5, 'rgb(244,244,244)'],
//                 [1, 'rgb(33,102,172)']
//             ]
//         }
//     };

//     const layout = {
//         title: {
//             text: 'Average Sentiment by Genre',
//             font: { size: 24, color: 'white' }
//         },
//         xaxis: {
//             title: 'Genre',
//             tickangle: 45,
//             gridcolor: 'gray',
//             color: 'white'
//         },
//         yaxis: {
//             title: 'Average Sentiment Score',
//             gridcolor: 'gray',
//             color: 'white'
//         },
//         plot_bgcolor: '#1e1e1e',
//         paper_bgcolor: '#1e1e1e',
//         font: { color: 'white' }
//     };

//     Plotly.newPlot('genre-sentiment-plot', [trace], layout);
// }

// function processGenreSentiments(data) {
//     const genreStats = {};
    
//     data.forEach(movie => {
//         if (!movie.genres) return;
        
//         const genres = movie.genres.split(', ');
//         const sentiments = JSON.parse(movie.sentence_sentiments);
//         const avgSentiment = sentiments.reduce((sum, s) => sum + s.compound, 0) / sentiments.length;
        
//         genres.forEach(genre => {
//             if (!genreStats[genre]) {
//                 genreStats[genre] = {
//                     total: 0,
//                     count: 0
//                 };
//             }
//             genreStats[genre].total += avgSentiment;
//             genreStats[genre].count += 1;
//         });
//     });
    
//     Object.keys(genreStats).forEach(genre => {
//         genreStats[genre].avgSentiment = genreStats[genre].total / genreStats[genre].count;
//     });
    
//     // Get top 20 genres by count
//     return Object.fromEntries(
//         Object.entries(genreStats)
//             .sort((a, b) => b[1].count - a[1].count)
//             .slice(0, 20)
//     );
// }

function updateVaderSentimentPlot(movieId) {
    // Load the sentiment data
    Papa.parse('/data/sentence_sentimental_analysis_Vader.csv', {
        download: true,
        header: true,
        complete: function(results) {
            // Filter data for the selected movie
            const movieData = results.data.filter(row => row.movie_id === movieId);
            
            if (movieData.length === 0) {
                console.error('No data found for movie ID:', movieId);
                return;
            }

            // Extract and parse sentence sentiments
            const sentenceSentiments = movieData.map(row => {
                try {
                    console.log('Parsing plot_sentiment:', row.plot_sentiment);
                    return JSON.parse(row.sentence_sentiments.replace(/'/g, '"')); // Replace single quotes with double quotes
                } catch (e) {
                    console.error('Error parsing plot_sentiment:', row.plot_sentiment, e);
                    return [];
                }
            }).flat();

            // Extract sentiment scores
            const compoundScores = sentenceSentiments.map(sentiment => sentiment.compound);
            const posScores = sentenceSentiments.map(sentiment => sentiment.pos);
            const neuScores = sentenceSentiments.map(sentiment => sentiment.neu);
            const negScores = sentenceSentiments.map(sentiment => sentiment.neg);

            // Create the plot data
            const traceCompound = {
                x: compoundScores.map((_, index) => index),
                y: compoundScores,
                type: 'scatter',
                mode: 'lines+markers',
                name: 'Compound',
                line: { color: 'blue', width: 2 },
                marker: { size: 6 }
            };

            const tracePos = {
                x: posScores.map((_, index) => index),
                y: posScores,
                type: 'scatter',
                mode: 'lines+markers',
                name: 'Positive',
                line: { color: 'green', width: 2 },
                marker: { size: 6 }
            };

            const traceNeu = {
                x: neuScores.map((_, index) => index),
                y: neuScores,
                type: 'scatter',
                mode: 'lines+markers',
                name: 'Neutral',
                line: { color: 'orange', width: 2 },
                marker: { size: 6 }
            };

            const traceNeg = {
                x: negScores.map((_, index) => index),
                y: negScores,
                type: 'scatter',
                mode: 'lines+markers',
                name: 'Negative',
                line: { color: 'red', width: 2 },
                marker: { size: 6 }
            };

            const layout = {
                title: {
                    text: `Sentence Sentiment Scores for Movie ID: ${movieId} (VADER)`,
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
                font: { color: 'white' }
            };

            Plotly.newPlot('vader-sentiment-plot', [traceCompound, tracePos, traceNeu, traceNeg], layout);
        },
        error: function(error) {
            console.error('Error loading sentiment data:', error);
        }
    });
}

// Call the function when the page loads with the default movie ID
// document.addEventListener('DOMContentLoaded', function() {
//     updateVaderSentimentPlot('77856');
// });

function plotSentimentAnalysis() {
    // Load the CSV data
    Plotly.d3.csv('data/sentence_sentimental_analysis_Vader.csv', function(err, rows) {
        if (err) {
            console.error('Error loading CSV data:', err);
            return;
        }

        // Process the data
        let genres = [];
        let sentimentScores = [];
        let genreCounts = {};

        rows.forEach(row => {
            let plotSentiment;
            try {
                // Replace single quotes with double quotes
                let jsonString = row.plot_sentiment.replace(/'/g, '"');
                plotSentiment = JSON.parse(jsonString);
            } catch (e) {
                console.error('Error parsing JSON:', e, row.plot_sentiment);
                return;
            }
            let compoundScore = plotSentiment.compound;
            let rowGenres = row.genres.split(', ');

            rowGenres.forEach(genre => {
                if (!genreCounts[genre]) {
                    genreCounts[genre] = { count: 0, totalSentiment: 0 };
                }
                genreCounts[genre].count += 1;
                genreCounts[genre].totalSentiment += compoundScore;
            });
        });

        // Calculate average sentiment scores and prepare data for plotting
        let topGenres = Object.keys(genreCounts)
            .map(genre => ({
                genre: genre,
                count: genreCounts[genre].count,
                avgSentiment: genreCounts[genre].totalSentiment / genreCounts[genre].count
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 20);

        genres = topGenres.map(item => item.genre);
        sentimentScores = topGenres.map(item => item.avgSentiment);

        // Create the plot
        let trace = {
            x: genres,
            y: sentimentScores,
            type: 'bar',
            marker: { color: 'green' }
        };

        let layout = {
            title: 'Average Sentiment by Top 20 Genres by Number of Sentences (VADER)',
            xaxis: { title: 'Genre', tickangle: -45 },
            yaxis: { title: 'Average Sentiment Score' }
        };

        Plotly.newPlot('plotDiv', [trace], layout);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    updateVaderSentimentPlot('77856');
    plotSentimentAnalysis();
    plotSentimentVariability();
});

function plotSentimentVariability() {
    // Load the CSV data
    Plotly.d3.csv('data/sentence_sentimental_analysis_Vader.csv', function(err, vaderRows) {
        if (err) {
            console.error('Error loading CSV data:', err);
            return;
        }

        Plotly.d3.csv('data/movie_master_dataset.csv', function(err, masterRows) {
            if (err) {
                console.error('Error loading master dataset:', err);
                return;
            }

            // Process the data
            let variabilityData = [];
            vaderRows.forEach(row => {
                try {
                    let movieSentiments = JSON.parse(row.sentence_sentiments.replace(/'/g, '"'));
                    let compoundScores = movieSentiments.map(sentiment => sentiment.compound);
                    let stdDev = math.std(compoundScores);
                    variabilityData.push({ movie_id: row.movie_id, variability: stdDev });
                } catch (e) {
                    console.error('Error processing sentiment data:', e, row.sentence_sentiments);
                }
            });

            console.log('Variability Data:', variabilityData);

            // Merge variability with the master dataset
            let masterData = masterRows.map(row => {
                let variability = variabilityData.find(v => v.movie_id === row.movie_id);
                return {
                    ...row,
                    variability: variability ? variability.variability : null
                };
            });

            console.log('Master Data with Variability:', masterData);

            // Split movies into high and low variability based on median
            let validVariability = masterData.filter(row => row.variability !== null);
            console.log('Valid Variability Data:', validVariability);

            let medianVariability = math.median(validVariability.map(row => row.variability));
            console.log('Median Variability:', medianVariability);

            let highVariability = validVariability.filter(row => row.variability > medianVariability);
            let lowVariability = validVariability.filter(row => row.variability <= medianVariability);

            console.log('High Variability:', highVariability);
            console.log('Low Variability:', lowVariability);

            // Check success values
            highVariability.forEach(row => {
                console.log('High Variability Success:', row.success);
            });

            lowVariability.forEach(row => {
                console.log('Low Variability Success:', row.success);
            });

            // Calculate average success for each group
            let highVariabilitySuccessValues = highVariability.map(row => parseFloat(row.success));
            let lowVariabilitySuccessValues = lowVariability.map(row => parseFloat(row.success));

            console.log('High Variability Success Values:', highVariabilitySuccessValues);
            console.log('Low Variability Success Values:', lowVariabilitySuccessValues);

            let highVariabilitySuccess = math.mean(highVariabilitySuccessValues);
            let lowVariabilitySuccess = math.mean(lowVariabilitySuccessValues);

            console.log('High Variability Success:', highVariabilitySuccess);
            console.log('Low Variability Success:', lowVariabilitySuccess);

            // Create the plot
            let trace = {
                x: ['High Variability', 'Low Variability'],
                y: [highVariabilitySuccess, lowVariabilitySuccess],
                type: 'bar',
                marker: { color: ['skyblue', 'lightcoral'] }
            };

            let layout = {
                title: 'Average Success by Sentiment Variability',
                xaxis: { title: 'Sentiment Variability' },
                yaxis: { title: 'Average Success' },
                grid: { y: { lines: { show: true } } }
            };

            Plotly.newPlot('variabilityPlotDiv', [trace], layout);

            // Statistical significance test
            let tStat, pValue;
            try {
                let tTestResult = ttest(highVariabilitySuccessValues, lowVariabilitySuccessValues);
                tStat = tTestResult.t;
                pValue = tTestResult.p;
            } catch (e) {
                console.error('Error performing t-test:', e);
            }

            console.log(`T-statistic: ${tStat}`);
            console.log(`P-value: ${pValue}`);
        });
    });
}

// Include the t-test function
function ttest(arr1, arr2) {
    let n1 = arr1.length;
    let n2 = arr2.length;
    let mean1 = math.mean(arr1);
    let mean2 = math.mean(arr2);
    let var1 = math.variance(arr1);
    let var2 = math.variance(arr2);
    let t = (mean1 - mean2) / Math.sqrt((var1 / n1) + (var2 / n2));
    let df = Math.pow((var1 / n1) + (var2 / n2), 2) / ((Math.pow(var1 / n1, 2) / (n1 - 1)) + (Math.pow(var2 / n2, 2) / (n2 - 1)));
    let p = 2 * (1 - jStat.studentt.cdf(Math.abs(t), df));
    return { t: t, p: p };
}

// document.addEventListener('DOMContentLoaded', function() {
//     updateVaderSentimentPlot('77856');
//     plotSentimentAnalysis();
// });