import pandas as pd 
import numpy as np 
import datetime as dt 


#Compute the constants
S0 = 101
K= 98.95
r=0.015
N=3
u=1.1
T=1

def binomial_call(S0,K,r,T,N,u):
    
    dt=T/N
    d=1/u
    q = (np.exp(r*dt)-u)/(u-d)
    disc = np.exp(-r*dt)

    #Stock price at maturity 
    S=S0 * (u**(np.arange(N,-1,-1)))* (d**(np.arange(0,N+1,1)))
    C = np.maximum(K-S,np.zeros(N+1))

    #backward computations
    for i in range(N,0,-1): 
        C= disc *( q* C[1:i+1] + (1-q)*C[0:i])

    return C[0]

if __name__== "__main__": 

    call = binomial_call(S0,K,r,T,N,u)
    print("The price of the call is ",call)
