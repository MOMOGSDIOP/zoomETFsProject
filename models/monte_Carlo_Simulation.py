import yfinance as yf 
import numpy as np 
import pandas as pd
import matplotlib.pyplot as plt
import datetime as dt

endDate = dt.datetime.now()
startDate = endDate - dt.timedelta(days=300)
stocksList = ['AAPL', 'MSFT', 'GOOGL', 'AMZN']
initialAmount = 10000
number_simulations = 1000
T = 100


def get_data(ticker, start, end):
    data = yf.download(ticker, start, end)
    stocks = data['Close'].pct_change()

    return stocks.mean(), stocks.cov() 

def monte_carlo_simulation(stocks,startDate,endDate,initialAmount,number_simulations,T):
    mean_returns , cov_matrix = get_data(stocks, startDate, endDate)
    weights = np.random.random(len(mean_returns))
    weights /=np.sum(weights)

    meanMarix = np.full(shape=(T,len(weights)),fill_value=mean_returns).T
    portfolioMatrix = np.full(shape=(T,number_simulations),fill_value=0.0)


    for i in range (number_simulations):
        Z = np.random.normal(size=(T,len(weights)))
        L = np.linalg.cholesky(cov_matrix)
        returns = meanMarix + np.inner(L,Z)
        portfolioMatrix[:,i] = initialAmount * np.cumprod(np.inner(weights,returns.T) + 1)

    plt.plot(portfolioMatrix)
    plt.ylabel('Portfolio value ($)')
    plt.xlabel('Days')
    plt.title('Monte Carlo simulation of portfolio value over time')
    #plt.show()

    return portfolioMatrix

def vaR(returns, alpha=5): 
    
    if isinstance(returns,pd.Series):
        return np.percentile(returns,alpha)
    else: 
        raise TypeError("We should use pandas series")
    
def expected_Shortfall (returns, alpha=5):
    
    if isinstance(returns,pd.Series):
        belows = returns <= vaR(returns,alpha)
        return returns[belows].mean()
    else: 
        raise TypeError("We should have a pandas Series")
    

"""
if __name__ == "__main__":

    ## Run the simulation
    stocks_simulation = monte_carlo_simulation(stocksList,startDate,endDate,initialAmount,number_simulations,T)
    stocks_simulation = pd.Series(stocks_simulation[-1,:])

    print("Var : ", initialAmount - vaR(stocks_simulation))
    print("Expected ShortFall : ",initialAmount -  expected_Shortfall(stocks_simulation))

"""