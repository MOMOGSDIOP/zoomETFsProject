from twelvedata import TDClient

td = TDClient(apikey="217ec3f8ecb1429aac8afb36df6b608a")

# Get all expiration dates
expirations = td.get_options_expiration(
    symbol="AAPL",
).as_json()['dates']

# Extract only put options for the soonest expiration date
put_options = td.get_options_chain(
    symbol="AAPL",
    side="put",
    expiration_date=expirations[0]
).as_json()['puts']

print(put_options)