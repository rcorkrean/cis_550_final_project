import numpy as np
import pandas as pd
import pybaseball as pb
pd.set_option('display.max_columns', None)

for cat in ['batting', 'pitching']:
    df = pd.read_csv(f'fangraphs{cat}/fangraphs{cat}2015.csv')
    df['Season'] = 2015

    for i in range(2016, 2023):
        new_df = pd.read_csv(f'fangraphs{cat}/fangraphs{cat}{i}.csv')
        new_df['Season'] = i
        df = pd.concat([df, new_df])

    df = df.rename({'playerid': 'fangraphsID', 'SO': 'K', 'Barrel%': 'Barrels/BBE', 'Events': 'BBE', 'WAR': 'fWAR'}, axis=1).drop('FB%.1', axis=1)
    df = df[['fangraphsID', 'Name', 'Season'] + df.columns[2:-1].tolist()]
    df.to_csv(f'fangraphs{cat}/fangraphs{cat}20152022.csv', index=False)

fangraphs_batting = pd.read_csv('fangraphsbatting/fangraphsbatting20152022.csv', low_memory=False)
fangraphs_pitching = pd.read_csv('fangraphspitching/fangraphspitching20152022.csv', low_memory=False)

