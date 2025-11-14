import pandas as pd 
import numpy as np 
import datetime as dt 
import matplotlib.pyplot as plt 
import yfinance as yf 
import monte_Carlo_Simulation as mc
import scipy.stats as stats 



#Pricing european call option
S= 101.95 #stock price
K = 98.01 # strike price 
sigma = 0.0991 #volatility 
r = 0.01 # interest rate
N = 10 # number of time steps 
M = 10000  # number of simulations
T = ((dt.date.today()-dt.date(2024,3,14)).days + 1)/365


def price_european_call (S,K,sigma,r,T,N,M): 

    #Compute the constants 
    dt = T/N
    nudt = (r- 0.5*sigma**2)*dt 
    volsdt = sigma*np.sqrt(dt)
    lnS = np.log(S)

    ## Monte Carlo simulation 
    Z = np.random.normal(size=(N,M))
    delta_lnSt = nudt + Z*volsdt
    lnSt = lnS + np.cumsum(delta_lnSt,axis=0)
    lnSt = np.concatenate((np.full(shape=(1,M),fill_value=lnS),lnSt))

    St=np.exp(lnSt)
    Ct = np.maximum(0,St-K)
    C0 = np.sum(Ct[-1])/M * np.exp(-r*T)
    sigma_C0= np.sqrt(np.sum(Ct[-1]-C0)**2/(M-1))
    standard_error = sigma_C0/np.sqrt(M)

    return C0, standard_error


def price_european_call_antithetic(S,K, sigma,r,T,N,M) : 

    #Compute the constants 
    dt = T/N
    nudt = ( r - 0.5*sigma**2)*dt 
    volsdt = sigma*np.sqrt(dt)
    lnS = np.log(S)

    #Monte Carlo simulation

    Z = np.random.normal(size=(N,M))
    delta_lnSt= nudt + volsdt*Z 
    delta_lnSt_anti= nudt - volsdt*Z

    lnSt = lnS + np.cumsum(delta_lnSt,axis=0)
    lnSt_anti = lnS + np.cumsum(delta_lnSt_anti,axis=0)
    lnSt = np.concatenate((np.full(shape=(1,M),fill_value=lnS),lnSt))
    lnSt_anti= np.concatenate((np.full(shape=(1,M),fill_value=lnS),lnSt_anti))

    St = np.exp(lnSt)
    St_anti =  np.exp(lnSt_anti)
    Ct= 0.5*np.maximum(0,St-K) + 0.5*np.maximum(0, St_anti-K)
    C0= np.sum(Ct[-1])/M *np.exp(-r*T)
    sigma_C0 = np.sum((Ct[-1]-C0)**2)/(M-1)
    standard_error = sigma_C0/np.sqrt(M)

    return C0,standard_error


"""
if __name__=="__main__": 

    call,std = price_european_call(S,K,sigma,r,T,N,M)
    call_anti, std_anti = price_european_call_antithetic(S,K,sigma,r,T,N,M)

    print("The price call is ", call , "and the std is " ,std)
    print("The price antithetic is ",call_anti, " and the std is  ",std_anti)
"""