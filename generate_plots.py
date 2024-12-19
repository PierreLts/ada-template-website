import pandas as pd
import numpy as np
import plotly.express as px
from scipy.stats import f_oneway
import os

# Function to compute amplitude, slope, and peak timing for each movie
def compute_shape_features(exploded_df):
    """
    Compute amplitude, slope, and peak timing features for sentiment arcs of each movie.
    """
    shape_features = []
    for _, row in exploded_df.iterrows():
        try:
            # Convert string to list of dicts if necessary
            movie_sentiments = eval(row['sentence_sentiments'])
            compound_scores = [sentiment['compound'] for sentiment in movie_sentiments]
            
            # Compute features
            amplitude = max(compound_scores) - min(compound_scores)
            slope = (compound_scores[-1] - compound_scores[0]) / len(compound_scores)
            peak_timing = np.argmax(compound_scores) / len(compound_scores)  # Normalize by arc length
            
            shape_features.append({
                "movie_id": row["movie_id"],
                "amplitude": amplitude,
                "slope": slope,
                "peak_timing": peak_timing
            })
        except Exception:
            continue
    return pd.DataFrame(shape_features)

# Compute shape-based features
shape_features_df = compute_shape_features(exploded_df)

# Merge shape features with the master dataset
movie_master_with_shapes = movie_master_dataset.merge(shape_features_df, on="movie_id", how="left")

# Function to perform ANOVA for a shape-based feature
def perform_anova_on_feature(movie_master_with_shapes, feature):
    """
    Perform ANOVA on a shape-based feature (e.g., amplitude, slope, peak_timing).
    """
    try:
        # Bin the feature into quartiles
        bins = pd.qcut(movie_master_with_shapes[feature], q=4, labels=["Low", "Medium-Low", "Medium-High", "High"])
        movie_master_with_shapes[f'{feature}_bin'] = bins
        
        # Calculate average success by bin
        success_summary = movie_master_with_shapes.groupby(f'{feature}_bin')['success'].mean().reset_index()
        
        # Plot average success by bins using Plotly
        fig = px.bar(
            success_summary,
            x=f'{feature}_bin',
            y='success',
            title=f"Average Success by {feature.capitalize()} Quartiles",
            labels={f'{feature}_bin': f"{feature.capitalize()} Quartiles", 'success': 'Average Success'},
            color_discrete_sequence=['skyblue']
        )
        fig.update_layout(
            xaxis_title=f"{feature.capitalize()} Quartiles",
            yaxis_title="Average Success",
            xaxis_tickangle=-45
        )
        
        # Save the plot as an HTML file in the plots directory
        if not os.path.exists('plots'):
            os.makedirs('plots')
        fig.write_html(f"plots/{feature}_quartiles_plot.html")
        
        # Perform ANOVA
        groups = [
            movie_master_with_shapes[movie_master_with_shapes[f'{feature}_bin'] == level]['success']
            for level in bins.unique()
        ]
        f_stat, p_value = f_oneway(*groups)
        print(f"ANOVA for {feature}: F-statistic = {f_stat:.4f}, P-value = {p_value:.4e}")
    
    except Exception as e:
        print(f"Error during ANOVA for feature: {feature}. Error: {e}")

# Perform analysis for each shape-based feature
print("Performing analysis for amplitude...")
perform_anova_on_feature(movie_master_with_shapes, "amplitude")

print("\nPerforming analysis for slope...")
perform_anova_on_feature(movie_master_with_shapes, "slope")

print("\nPerforming analysis for peak timing...")
perform_anova_on_feature(movie_master_with_shapes, "peak_timing")