# import pandas
import pandas as pd

# Importing dataset
df = pd.read_csv('master_vehicles.csv')

# Sample 100 random rows from the dataframe
sampled_df = df.sample(n=4000)

# Save the sampled data to a CSV file
sampled_df.to_csv('reduced_vehicles.csv', index=False)