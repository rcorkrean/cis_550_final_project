import numpy as np
import pandas as pd
pd.set_option('display.max_columns', None)

def percent_to_decimal(df):
    for col in ['BB%', 'K%', 'LD%', 'GB%', 'FB%', 'IFFB%', 'HR/FB', 'IFH%', 'BUH%', 'SL%', 'CT%', 'CB%', 'CH%', 'SF%', 'KN%', 'XX%', 'O-Swing%', 'Z-Swing%', 'Swing%', 'O-Contact%', 'Z-Contact%', 'Contact%', 'Zone%', 'F-Strike%', 'SwStr%', 'FA% (sc)', 'FT% (sc)', 'FC% (sc)', 'FS% (sc)', 'FO% (sc)', 'SI% (sc)', 'SL% (sc)', 'CU% (sc)', 'KC% (sc)', 'EP% (sc)', 'CH% (sc)', 'KN% (sc)', 'O-Swing% (sc)', 'Z-Swing% (sc)', 'Swing% (sc)', 'O-Contact% (sc)', 'Z-Contact% (sc)', 'Contact% (sc)', 'Zone% (sc)', 'Pull%', 'Cent%', 'Oppo%', 'Soft%', 'Med%', 'Hard%', 'TTO%', 'CH% (pi)', 'CS% (pi)', 'CU% (pi)', 'FA% (pi)', 'FC% (pi)', 'FS% (pi)', 'KN% (pi)', 'SB% (pi)', 'SI% (pi)', 'SL% (pi)', 'XX% (pi)', 'O-Swing% (pi)', 'Z-Swing% (pi)', 'Swing% (pi)', 'O-Contact% (pi)', 'Z-Contact% (pi)', 'Contact% (pi)', 'Zone% (pi)', 'Barrels/BBE', 'HardHit/BBE', 'CStr%', 'CSW%', 'LOB%', 'K-BB%']:
        if col in df.columns:
            df[col] = df[col].str.strip('%').astype('float64') / 100.0
    return df

def team_abbreviator(df):
    df['Team'] = df['Team'].str.replace('^SDP$', 'SD', regex=True).str.replace('^SFG$', 'SF', regex=True).str.replace('^TBR$', 'TB', regex=True)
    return df

def format_market_value(df):
    df['DollarMV'] = (df['DollarMV'].str.replace(r'^\(\$', '-', regex=True).str.strip(')$').astype('float64') * 10e6).astype('int64')
    return df

def main():
    for cat in ['batting', 'pitching']:
        df = pd.read_csv(f'../data/raw/fangraphs/{cat}/fangraphs{cat}2015.csv')
        df['Season'] = 2015

        for i in range(2016, 2023):
            new_df = pd.read_csv(f'../data/raw/fangraphs/{cat}/fangraphs{cat}{i}.csv')
            new_df['Season'] = i
            df = pd.concat([df, new_df])

        df = df.drop(['FB%.1', 'Age Rng'], axis=1)
        df = df.rename({'playerid': 'fangraphsID', 'SO': 'K', 'K-BB%': 'K%-BB%', 'GDP': 'GIDP', 'SH': 'SAC', 'ShO': 'SHO', 'Starting': 'SPWAR', 'Start-IP': 'SPIP', 'Relieving': 'RPWAR', 'Relief-IP': 'RPIP', 'E-F': 'ERA-FIP', 'Barrel%': 'Barrels/BBE', 'HardHit%': 'HardHit/BBE', 'Events': 'BBE', 'Dol': 'DollarMV', 'Dollars': 'DollarMV', 'GB': 'GB (bis)', 'FB': 'FB (bis)', 'LD': 'LD (bis)', 'IFFB': 'IFFB (bis)', 'Pitches': 'Pitches (bis)', 'Balls': 'Balls (bis)', 'Strikes': 'Strikes (bis)', 'IFH': 'IFH (bis)', 'BU': 'BU (bis)', 'BUH': 'BUH (bis)', 'GB/FB': 'GB/FB (bis)', 'LD%': 'LD% (bis)', 'GB%': 'GB% (bis)', 'FB%': 'FB% (bis)', 'IFFB%': 'IFFB% (bis)', 'HR/FB': 'HR/FB (bis)', 'IFH%': 'IFH% (bis)', 'BUH%': 'BUH% (bis)', 'FBv': 'FBv (bis)', 'SL%': 'SL% (bis)', 'SLv': 'SLv (bis)', 'CT%': 'CT% (bis)', 'CTv': 'CTv (bis)', 'CB%': 'CB% (bis)', 'CBv': 'CBv (bis)', 'CH%': 'CH% (bis)', 'CHv': 'CHv (bis)', 'SF%': 'SF% (bis)', 'SFv': 'SFv (bis)', 'KN%': 'KN% (bis)', 'KNv': 'KNv (bis)', 'XX%': 'XX% (bis)', 'PO%': 'PO% (bis)', 'wFB': 'wFB (bis)', 'wSL': 'wSL (bis)', 'wCT': 'wCT (bis)', 'wCB': 'wCB (bis)', 'wCH': 'wCH (bis)', 'wSF': 'wSF (bis)', 'wKN': 'wKN (bis)', 'wFB/C': 'wFB/C (bis)', 'wSL/C': 'wSL/C (bis)', 'wCT/C': 'wCT/C (bis)', 'wCB/C': 'wCB/C (bis)', 'wCH/C': 'wCH/C (bis)', 'wSF/C': 'wSF/C (bis)', 'wKN/C': 'wKN/C (bis)', 'O-Swing%': 'O-Swing% (bis)', 'Z-Swing%': 'Z-Swing% (bis)', 'Swing%': 'Swing% (bis)', 'O-Contact%': 'O-Contact% (bis)', 'Z-Contact%': 'Z-Contact% (bis)', 'Contact%': 'Contact% (bis)', 'Zone%': 'Zone% (bis)', 'F-Strike%': 'F-Strike% (bis)', 'SwStr%': 'SwStr% (bis)', 'Pull%': 'Pull% (bis)', 'Cent%': 'Cent% (bis)', 'Oppo%': 'Oppo% (bis)', 'Soft%': 'Soft% (bis)', 'Med%': 'Med% (bis)', 'Hard%': 'Hard% (bis)', 'LD+%': 'LD+% (bis)', 'GB%+': 'GB%+ (bis)', 'FB%+': 'FB%+ (bis)', 'HR/FB%+': 'HR/FB%+ (bis)', 'Pull%+': 'Pull%+ (bis)', 'Cent%+': 'Cent%+ (bis)', 'Oppo%+': 'Oppo%+ (bis)', 'Soft%+': 'Soft%+ (bis)', 'Med%+': 'Med%+ (bis)', 'Hard%+': 'Hard%+ (bis)'}, axis=1)
        df = percent_to_decimal(df)
        df = format_market_value(df)
        df = team_abbreviator(df)
        if 'SV' in df.columns:
            df['SVO'] = df['SV'] + df['BS']
        df.to_csv(f'fangraphs{cat}/fangraphs{cat}20152022.csv', index=False)

        
if __name__ == '__main__':
    main()
