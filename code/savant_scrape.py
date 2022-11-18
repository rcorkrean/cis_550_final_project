import numpy as np
import pandas as pd
import pybaseball as pb

pb.cache.enable()

events_dict = {'strikeout': 'K', 'field_out': 'O', 'home_run': 'HR', 'single': '1B', 'grounded_into_double_play': 'GIDP', 'walk': 'BB', 'double': '2B', 'caught_stealing_2b': 'CS', 'sac_bunt': 'SAC', 'force_out': 'O', 'hit_by_pitch': 'HBP', 'sac_fly': 'SF', 'double_play': 'DP', 'triple': '3B', 'field_error': 'E', 'fielders_choice': 'O', 'pickoff_1b': 'PO', 'fielders_choice_out': 'O', 'runner_double_play': 'DP', 'strikeout_double_play': 'K', 'sac_fly_double_play': 'SF', 'wild_pitch': 'WP', 'caught_stealing_home': 'CS', 'other_out': 'O', 'game_advisory': 'MV', 'caught_stealing_3b': 'CS', 'catcher_interf': 'CI', 'passed_ball': 'PB', 'pickoff_2b': 'PO', 'triple_play': 'TP', 'stolen_base_2b': 'SB', 'pickoff_caught_stealing_2b': 'CS', 'pickoff_caught_stealing_3b': 'CS', 'pickoff_caught_stealing_home': 'CS', 'pickoff_3b': 'PO', 'sac_bunt_double_play': 'SAC', 'BI': 'BI'}
description_dict = {'hit_into_play': 'InPlay', 'ball': 'BallCalled', 'called_strike': 'StrikeCalled', 'blocked_ball': 'BallCalled', 'swinging_strike': 'StrikeSwinging', 'foul': 'Foul', 'foul_bunt': 'Foul', 'foul_tip': 'StrikeSwinging', 'missed_bunt': 'StrikeSwinging', 'intent_ball': 'BallIntentional', 'hit_by_pitch': 'HBP', 'swinging_strike_blocked': 'StrikeSwinging', 'bunt_foul_tip': 'StrikeSwinging', 'pitchout': 'BallCalled', 'foul_pitchout': 'Foul', 'swinging_pitchout': 'StrikeSwinging', 'CatcherInterference': 'CatcherInterference', 'BatterInterference': 'BatterInterference'}
bb_type_dict = {'fly_ball': 'FB', 'line_drive': 'LD', 'ground_ball': 'GB', 'popup': 'IFFB'}
cq_dict = {1: 'Weak', 2: 'Topped', 3: 'Under', 4: 'FlareBurner', 5: 'SolidContact', 6: 'Barrel'}

def scrape_savant():
    seasons = []
    for season in range(2015, 2023):
        seasons.append(pb.statcast(start_dt=f'{season}-01-01', end_dt=f'{season}-12-31'))
    pd.concat(seasons).to_csv('../data/raw/statcast/statcastraw.csv', index=False)

def pco(x, y, h):
    if np.abs(np.arctan2(x, y)) <= np.pi / 12:
        return 'Center'
    elif x < 0:
        if h == 'R':
            return 'Pull'
        else:
            return 'Oppo'
    elif x > 0:
        if h == 'R':
            return 'Oppo'
        else:
            return 'Pull'
    else:
        return np.nan

def agg_stat(df, col, group, rate=False):
    agg_df = df.groupby(group)[col].value_counts(normalize=rate).rename(None).unstack(fill_value=0)
    if rate:
        agg_df = agg_df.rename({col: col + '/BBE' if col in ['Weak', 'Topped', 'Under', 'FlareBurner', 'SolidContact', 'Barrel'] else col + '%' for col in agg_df.columns}, axis=1)
    return agg_df

def main(scrape=True):
    if scrape:
        scrape_savant()
    df = pd.read_csv('../data/raw/statcast/statcastraw.csv')
    while df.isin([pd.NA]).any(axis=None):
        df = df.replace({pd.NA: np.nan})
    df = df[df['game_type'] == 'R'].reset_index(drop=True)
    df['pitch_type'] = df['pitch_type'].replace('FA', 'FF')
    df['hc_x'] = 2.5 * (df['hc_x'] - 125.42)
    df['hc_y'] = 2.5 * (198.27 - df['hc_y'])
    df['events'] = pd.Series(['BI'] * df.shape[0]).where((df['description'] != 'hit_into_play') & (df['type'] == 'X'), df['events'])
    df['description'] = pd.Series(['BatterInterference'] * df.shape[0]).where(df['events'] == 'BI', df['description'])
    df['description'] = pd.Series(['CatcherInterference'] * df.shape[0]).where(df['events'] == 'catcher_interf', df['description'])
    df['events'] = df['events'].map(events_dict, na_action='ignore')
    df['description'] = df['description'].map(description_dict, na_action='ignore')
    df['bb_type'] = df['bb_type'].map(bb_type_dict, na_action='ignore')
    df['launch_speed_angle'] = df['launch_speed_angle'].map(cq_dict, na_action='ignore')
    df['PitcherTeam'] = df['home_team'].where(df['inning_topbot'] == 'Top', df['away_team'])
    df['BatterTeam'] = df['home_team'].where(df['inning_topbot'] == 'Bot', df['away_team'])
    df['PCO'] = df.apply(lambda x: pco(x['hc_x'], x['hc_y'], x['stand']), axis=1)
    df = df.drop(['game_date', 'player_name', 'spin_dir', 'spin_rate_deprecated', 'break_angle_deprecated', 'break_length_deprecated', 'des', 'game_type', 'home_team', 'away_team', 'type', 'hit_location', 'on_3b', 'on_2b', 'on_1b', 'outs_when_up', 'inning', 'inning_topbot', 'tfs_deprecated', 'tfs_zulu_deprecated', 'fielder_2', 'umpire', 'sv_id', 'pitcher.1', 'fielder_2.1', 'fielder_3', 'fielder_4', 'fielder_5', 'fielder_6', 'fielder_7', 'fielder_8', 'fielder_9', 'release_pos_y', 'woba_value', 'woba_denom', 'babip_value', 'iso_value', 'pitch_name', 'home_score', 'away_score', 'bat_score', 'fld_score', 'post_away_score', 'post_home_score', 'post_bat_score', 'post_fld_score', 'if_fielding_alignment', 'of_fielding_alignment', 'delta_home_win_exp', 'delta_run_exp', 'game_pk', 'vx0', 'vy0', 'vz0', 'ax', 'ay', 'az'], axis=1)
    df = df.rename({'pitch_type': 'PitchType', 'release_speed': 'PitchSpeed', 'release_pos_x': 'ReleasePosHorizontal', 'release_pos_z': 'ReleasePosVertical', 'batter': 'BatterID', 'pitcher': 'PitcherID', 'events': 'Play', 'description': 'Result', 'zone': 'Zone', 'stand': 'BatterHandedness', 'p_throws': 'PitcherHandedness', 'type': 'BallStrike', 'bb_type': 'BBType', 'balls': 'Balls', 'strikes': 'Strikes', 'game_year': 'Season', 'pfx_x': 'PitchMovHorizontal', 'pfx_z': 'PitchMovVertical', 'plate_x': 'PitchLocHorizontal', 'plate_z': 'PitchLocVertical', 'hc_x': 'HitLocX', 'hc_y': 'HitLocY', 'sz_top': 'SZTop', 'sz_bot': 'SZBot', 'hit_distance_sc': 'BBDistance', 'launch_speed': 'EV', 'launch_angle': 'LA', 'effective_speed': 'PitchSpeedAdjusted', 'release_spin_rate': 'SpinRate', 'release_extension': 'Extension', 'estimated_ba_using_speedangle': 'xBA', 'estimated_woba_using_speedangle': 'xwOBAcon', 'launch_speed_angle': 'ContactQuality', 'at_bat_number': 'PANumber', 'pitch_number': 'PitchOfPA', 'spin_axis': 'SpinAxis'}, axis=1)
    df.to_csv('../data/statcast/cleaned/statcastpitchescleaned.csv', index=False)

    for p in ['Batter', 'Pitcher']:
        pgroup = [f'{p}ID', 'Season', f'{p}Team']
        agg_dfs = []
        for stat in ['BBType', 'PCO', 'ContactQuality']:
            agg_dfs.append(agg_stat(df, stat, pgroup))
        agg_dfs.append(df.groupby(pgroup)['xwOBAcon'].mean().to_frame())
        pd.concat(agg_dfs, axis=1).to_csv(f"../data/statcast/cleaned/statcast{'batting' if p == 'Batter' else 'pitching'}/statcast{'batting' if p == 'Batter' else 'pitching'}cleaned.csv")


if __name__ == '__main__':
    main()
