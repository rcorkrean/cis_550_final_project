import numpy as np
import pandas as pd
pd.set_option('display.max_columns', None)

for cat in ['batting', 'pitching']:
    df = pd.read_csv(f'../data/raw/FanGraphs/{cat}/fangraphs{cat}2015.csv')
    df['Season'] = 2015

    for i in range(2016, 2023):
        new_df = pd.read_csv(f'../data/raw/FanGraphs/{cat}/fangraphs{cat}{i}.csv')
        new_df['Season'] = i
        df = pd.concat([df, new_df])

    df = df.rename({'playerid': 'fangraphsID', 'SO': 'K', 'Barrel%': 'Barrels/BBE', 'Events': 'BBE', 'WAR': 'fWAR'}, axis=1).drop('FB%.1', axis=1)
    df = df[['fangraphsID', 'Name', 'Season'] + df.columns[2:-1].tolist()]
    df.to_csv(f'fangraphs{cat}/fangraphs{cat}20152022.csv', index=False)
