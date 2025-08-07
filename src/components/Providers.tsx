"use client"
import React from "react"
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client"

export const Providers=({children} : {children: React.ReactNode}) =>{
    const client= new ApolloClient({
        uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URL,
        cache: new InMemoryCache(),
    })
    return <ApolloProvider client={client}>{children}</ApolloProvider>;
};