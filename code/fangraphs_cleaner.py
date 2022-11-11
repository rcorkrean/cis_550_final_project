import numpy as np
import pandas as pd
pd.set_option('display.max_rows', 100)
pd.set_option('display.max_columns', None)
pd.set_option('display.width', 1000)

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
        df = df.rename({'playerid': 'fangraphsID', 'SO': 'K', 'AVG': 'BA', 'K-BB%': 'K%-BB%', 'GDP': 'GIDP', 'SH': 'SAC', 'ShO': 'SHO', 'Starting': 'SPWAR', 'Start-IP': 'SPIP', 'Relieving': 'RPWAR', 'Relief-IP': 'RPIP', 'E-F': 'ERA-FIP', 'Barrel%': 'Barrels/BBE', 'HardHit%': 'HardHit/BBE', 'Events': 'BBE', 'Dol': 'DollarMV', 'Dollars': 'DollarMV', 'AVG+': 'BA+'}, axis=1)
        df = df.rename({'GB': 'GB (bis)', 'FB': 'FB (bis)', 'LD': 'LD (bis)', 'IFFB': 'IFFB (bis)', 'Pitches': 'Pitches (bis)', 'Balls': 'Balls (bis)', 'Strikes': 'Strikes (bis)', 'IFH': 'IFH (bis)', 'BU': 'BU (bis)', 'BUH': 'BUH (bis)', 'GB/FB': 'GB/FB (bis)', 'LD%': 'LD% (bis)', 'GB%': 'GB% (bis)', 'FB%': 'FB% (bis)', 'IFFB%': 'IFFB% (bis)', 'HR/FB': 'HR/FB (bis)', 'IFH%': 'IFH% (bis)', 'BUH%': 'BUH% (bis)', 'FBv': 'FBv (bis)', 'SL%': 'SL% (bis)', 'SLv': 'SLv (bis)', 'CT%': 'CT% (bis)', 'CTv': 'CTv (bis)', 'CB%': 'CB% (bis)', 'CBv': 'CBv (bis)', 'CH%': 'CH% (bis)', 'CHv': 'CHv (bis)', 'SF%': 'SF% (bis)', 'SFv': 'SFv (bis)', 'KN%': 'KN% (bis)', 'KNv': 'KNv (bis)', 'XX%': 'XX% (bis)', 'PO%': 'PO% (bis)', 'wFB': 'wFB (bis)', 'wSL': 'wSL (bis)', 'wCT': 'wCT (bis)', 'wCB': 'wCB (bis)', 'wCH': 'wCH (bis)', 'wSF': 'wSF (bis)', 'wKN': 'wKN (bis)', 'wFB/C': 'wFB/C (bis)', 'wSL/C': 'wSL/C (bis)', 'wCT/C': 'wCT/C (bis)', 'wCB/C': 'wCB/C (bis)', 'wCH/C': 'wCH/C (bis)', 'wSF/C': 'wSF/C (bis)', 'wKN/C': 'wKN/C (bis)', 'O-Swing%': 'O-Swing% (bis)', 'Z-Swing%': 'Z-Swing% (bis)', 'Swing%': 'Swing% (bis)', 'O-Contact%': 'O-Contact% (bis)', 'Z-Contact%': 'Z-Contact% (bis)', 'Contact%': 'Contact% (bis)', 'Zone%': 'Zone% (bis)', 'F-Strike%': 'F-Strike% (bis)', 'SwStr%': 'SwStr% (bis)', 'Pull%': 'Pull% (bis)', 'Cent%': 'Cent% (bis)', 'Oppo%': 'Oppo% (bis)', 'Soft%': 'Soft% (bis)', 'Med%': 'Med% (bis)', 'Hard%': 'Hard% (bis)', 'LD+%': 'LD+% (bis)', 'GB%+': 'GB%+ (bis)', 'FB%+': 'FB%+ (bis)', 'HR/FB%+': 'HR/FB%+ (bis)', 'Pull%+': 'Pull%+ (bis)', 'Cent%+': 'Cent%+ (bis)', 'Oppo%+': 'Oppo%+ (bis)', 'Soft%+': 'Soft%+ (bis)', 'Med%+': 'Med%+ (bis)', 'Hard%+': 'Hard%+ (bis)'}, axis=1)
        df = df.rename({'FA% (sc)': 'FA%', 'FT% (sc)': 'FT%', 'FC% (sc)': 'FC%', 'FS% (sc)': 'FS%', 'FO% (sc)': 'FO%', 'SI% (sc)': 'SI%', 'SL% (sc)': 'SL%', 'CU% (sc)': 'CU%', 'KC% (sc)': 'KC%', 'EP% (sc)': 'EP%', 'CH% (sc)': 'CH%', 'SC% (sc)': 'SC%', 'KN% (sc)': 'KN%', 'UN% (sc)': 'UN%', 'vFA (sc)': 'vFA', 'vFT (sc)': 'vFT', 'vFC (sc)': 'vFC', 'vFS (sc)': 'vFS', 'vFO (sc)': 'vFO', 'vSI (sc)': 'vSI', 'vSL (sc)': 'vSL', 'vCU (sc)': 'vCU', 'vKC (sc)': 'vKC', 'vEP (sc)': 'vEP', 'vCH (sc)': 'vCH', 'vSC (sc)': 'vSC', 'vKN (sc)': 'vKN', 'FA-X (sc)': 'FA-X', 'FT-X (sc)': 'FT-X', 'FC-X (sc)': 'FC-X', 'FS-X (sc)': 'FS-X', 'FO-X (sc)': 'FO-X', 'SI-X (sc)': 'SI-X', 'SL-X (sc)': 'SL-X', 'CU-X (sc)': 'CU-X', 'KC-X (sc)': 'KC-X', 'EP-X (sc)': 'EP-X', 'CH-X (sc)': 'CH-X', 'SC-X (sc)': 'SC-X', 'KN-X (sc)': 'KN-X', 'FA-Z (sc)': 'FA-Z', 'FT-Z (sc)': 'FT-Z', 'FC-Z (sc)': 'FC-Z', 'FS-Z (sc)': 'FS-Z', 'FO-Z (sc)': 'FO-Z', 'SI-Z (sc)': 'SI-Z', 'SL-Z (sc)': 'SL-Z', 'CU-Z (sc)': 'CU-Z', 'KC-Z (sc)': 'KC-Z', 'EP-Z (sc)': 'EP-Z', 'CH-Z (sc)': 'CH-Z', 'SC-Z (sc)': 'SC-Z', 'KN-Z (sc)': 'KN-Z', 'wFA (sc)': 'wFA', 'wFT (sc)': 'wFT', 'wFC (sc)': 'wFC', 'wFS (sc)': 'wFS', 'wFO (sc)': 'wFO', 'wSI (sc)': 'wSI', 'wSL (sc)': 'wSL', 'wCU (sc)': 'wCU', 'wKC (sc)': 'wKC', 'wEP (sc)': 'wEP', 'wCH (sc)': 'wCH', 'wSC (sc)': 'wSC', 'wKN (sc)': 'wKN', 'wFA/C (sc)': 'wFA/C', 'wFT/C (sc)': 'wFT/C', 'wFC/C (sc)': 'wFC/C', 'wFS/C (sc)': 'wFS/C', 'wFO/C (sc)': 'wFO/C', 'wSI/C (sc)': 'wSI/C', 'wSL/C (sc)': 'wSL/C', 'wCU/C (sc)': 'wCU/C', 'wKC/C (sc)': 'wKC/C', 'wEP/C (sc)': 'wEP/C', 'wCH/C (sc)': 'wCH/C', 'wSC/C (sc)': 'wSC/C', 'wKN/C (sc)': 'wKN/C', 'O-Swing% (sc)': 'O-Swing%', 'Z-Swing% (sc)': 'Z-Swing%', 'Swing% (sc)': 'Swing%', 'O-Contact% (sc)': 'O-Contact%', 'Z-Contact% (sc)': 'Z-Contact%', 'Contact% (sc)': 'Contact%', 'Zone% (sc)': 'Zone%'}, axis=1)
        df = percent_to_decimal(df)
        df = format_market_value(df)
        df = team_abbreviator(df)
        if cat == 'batting':
            df[['fangraphsID', 'Name', 'Season', 'Team', 'Age', 'G', 'AB', 'PA', 'H', '1B', '2B', '3B', 'HR', 'R', 'RBI', 'BB', 'IBB', 'K', 'HBP', 'SF', 'SAC', 'GIDP', 'SB', 'CS', 'BA', 'BB%', 'K%', 'BB/K', 'OBP', 'SLG', 'OPS', 'ISO', 'BABIP', 'wOBA', 'wRAA', 'wRC', 'Bat', 'Fld', 'Rep', 'Pos', 'RAR', 'WAR', 'DollarMV', 'wRC+', 'WPA', '-WPA', '+WPA', 'RE24', 'REW', 'pLI', 'phLI', 'PH', 'WPA/LI', 'Clutch', 'BsR', 'FA%', 'FT%', 'FC%', 'FS%', 'FO%', 'SI%', 'SL%', 'CU%', 'KC%', 'EP%', 'CH%', 'SC%', 'KN%', 'UN%', 'vFA', 'vFT', 'vFC', 'vFS', 'vFO', 'vSI', 'vSL', 'vCU', 'vKC', 'vEP', 'vCH', 'vSC', 'vKN', 'FA-X', 'FT-X', 'FC-X', 'FS-X', 'FO-X', 'SI-X', 'SL-X', 'CU-X', 'KC-X', 'EP-X', 'CH-X', 'SC-X', 'KN-X', 'FA-Z', 'FT-Z', 'FC-Z', 'FS-Z', 'FO-Z', 'SI-Z', 'SL-Z', 'CU-Z', 'KC-Z', 'EP-Z', 'CH-Z', 'SC-Z', 'KN-Z', 'wFA', 'wFT', 'wFC', 'wFS', 'wFO', 'wSI', 'wSL', 'wCU', 'wKC', 'wEP', 'wCH', 'wSC', 'wKN', 'wFA/C', 'wFT/C', 'wFC/C', 'wFS/C', 'wFO/C', 'wSI/C', 'wSL/C', 'wCU/C', 'wKC/C', 'wEP/C', 'wCH/C', 'wSC/C', 'wKN/C', 'O-Swing%', 'Z-Swing%', 'Swing%', 'O-Contact%', 'Z-Contact%', 'Contact%', 'Zone%', 'Def', 'wSB', 'UBR', 'Off', 'Lg', 'wGDP', 'TTO%', 'BA+', 'BB%+', 'K%+', 'OBP+', 'SLG+', 'ISO+', 'BABIP+', 'EV', 'LA', 'Barrels', 'Barrels/BBE', 'maxEV', 'HardHit', 'HardHit/BBE', 'BBE', 'CStr%', 'CSW%', 'xBA', 'xSLG', 'xwOBA']].to_csv(f'../data/cleaned/fangraphs/{cat}/fangraphs{cat}cleaned.csv', index=False)
        else:
            df['SVO'] = df['SV'] + df['BS']
            df[['fangraphsID', 'Name', 'Season', 'Age', 'W', 'L', 'ERA', 'G', 'GS', 'CG', 'SHO', 'SV', 'BS', 'IP', 'TBF', 'H', 'R', 'ER', 'HR', 'BB', 'IBB', 'HBP', 'WP', 'BK', 'K', 'RS', 'K/9', 'BB/9', 'K/BB', 'H/9', 'HR/9', 'BA', 'WHIP', 'BABIP', 'LOB%', 'FIP', 'SPWAR', 'SPIP', 'RPWAR', 'RPIP', 'RAR', 'WAR', 'DollarMV', 'tERA', 'xFIP', 'WPA', '-WPA', '+WPA', 'RE24', 'REW', 'pLI', 'inLI', 'gmLI', 'exLI', 'Pulls', 'WPA/LI', 'Clutch', 'HLD', 'SD', 'MD', 'ERA-', 'FIP-', 'xFIP-', 'K%', 'BB%', 'SIERA', 'RS/9', 'ERA-FIP', 'FA%', 'FT%', 'FC%', 'FS%', 'FO%', 'SI%', 'SL%', 'CU%', 'KC%', 'EP%', 'CH%', 'SC%', 'KN%', 'UN%', 'vFA', 'vFT', 'vFC', 'vFS', 'vFO', 'vSI', 'vSL', 'vCU', 'vKC', 'vEP', 'vCH', 'vSC', 'vKN', 'FA-X', 'FT-X', 'FC-X', 'FS-X', 'FO-X', 'SI-X', 'SL-X', 'CU-X', 'KC-X', 'EP-X', 'CH-X', 'SC-X', 'KN-X', 'FA-Z', 'FT-Z', 'FC-Z', 'FS-Z', 'FO-Z', 'SI-Z', 'SL-Z', 'CU-Z', 'KC-Z', 'EP-Z', 'CH-Z', 'SC-Z', 'KN-Z', 'wFA', 'wFT', 'wFC', 'wFS', 'wFO', 'wSI', 'wSL', 'wCU', 'wKC', 'wEP', 'wCH', 'wSC', 'wKN', 'wFA/C', 'wFT/C', 'wFC/C', 'wFS/C', 'wFO/C', 'wSI/C', 'wSL/C', 'wCU/C', 'wKC/C', 'wEP/C', 'wCH/C', 'wSC/C', 'wKN/C', 'O-Swing%', 'Z-Swing%', 'Swing%', 'O-Contact%', 'Z-Contact%', 'Contact%', 'Zone%', 'Pace', 'K%-BB%', 'kwERA', 'TTO%', 'BA+', 'WHIP+', 'BABIP+', 'LOB%+', 'K%+', 'BB%+', 'EV', 'LA', 'Barrels', 'Barrels/BBE', 'maxEV', 'HardHit', 'HardHit/BBE', 'BBE', 'CStr%', 'CSW%', 'xERA']].to_csv(f'../data/cleaned/fangraphs/{cat}/fangraphs{cat}cleaned.csv', index=False)
        
if __name__ == '__main__':
    main()
