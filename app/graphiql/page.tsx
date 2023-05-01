"use client"

import { createGraphiQLFetcher } from '@graphiql/toolkit';
import { GraphiQL } from 'graphiql';
import React from 'react';
import 'graphiql/graphiql.css';

export default function GraphQLPage() {
    const fetcher = createGraphiQLFetcher({ url: '/api/graphql' });
    return <GraphiQL fetcher={fetcher} />
}