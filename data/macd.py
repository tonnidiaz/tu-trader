import pandas as pd

def calculate_macd(df, short_window=12, long_window=26, signal_window=9):
    # Calculate short-term exponential moving average
    short_ema = df['Close'].ewm(span=short_window, min_periods=1, adjust=False).mean()
    
    # Calculate long-term exponential moving average
    long_ema = df['Close'].ewm(span=long_window, min_periods=1, adjust=False).mean()
    
    # Calculate MACD line
    macd_line = short_ema - long_ema
    
    # Calculate signal line
    signal_line = macd_line.ewm(span=signal_window, min_periods=1, adjust=False).mean()
    
    # Calculate MACD histogram
    macd_histogram = macd_line - signal_line
    
    return macd_line, signal_line, macd_histogram

# Example usage:
# Assuming you have a DataFrame 'df' containing historical price data with 'Close' column
# Replace 'df' with your DataFrame containing historical price data
# Adjust parameters (e.g., short_window, long_window, signal_window) according to your preferences

# Load historical price data into DataFrame
# Example:
# df = pd.read_csv('historical_price_data.csv')
# df['Date'] = pd.to_datetime(df['Date'])  # Convert 'Date' column to datetime if needed
# df.set_index('Date', inplace=True)  # Set 'Date' column as index if needed

# Calculate MACD indicator
macd_line, signal_line, macd_histogram = calculate_macd(df)

# Add MACD indicators to DataFrame
df['MACD_Line'] = macd_line
df['Signal_Line'] = signal_line
df['MACD_Histogram'] = macd_histogram

# Print DataFrame with MACD indicators
print(df)


def calculate_chandelier_exit(df, window=22, multiplier=3):
    # Calculate ATR
    df['ATR'] = df['High'].rolling(window=window).max() - df['Low'].rolling(window=window).min()

    # Calculate Chandelier Exit Long
    df['Chandelier_Exit_Long'] = df['High'].rolling(window=window).max() - df['ATR'] * multiplier

    return df['Chandelier_Exit_Long']

# Example usage:
# Assuming you have a DataFrame 'df' containing historical price data with 'High' and 'Low' columns
# Replace 'df' with your DataFrame containing historical price data
# Adjust parameters (e.g., window, multiplier) according to your preferences

# Load historical price data into DataFrame
# Example:
# df = pd.read_csv('historical_price_data.csv')
# df['Date'] = pd.to_datetime(df['Date'])  # Convert 'Date' column to datetime if needed
# df.set_index('Date', inplace=True)  # Set 'Date' column as index if needed

# Calculate Chandelier Exit Long
chandelier_exit_long = calculate_chandelier_exit(df)

# Add Chandelier Exit Long to DataFrame
df['Chandelier_Exit_Long'] = chandelier_exit_long

# Calculate buy signals
buy_signals = df['Close'] > df['Chandelier_Exit_Long']