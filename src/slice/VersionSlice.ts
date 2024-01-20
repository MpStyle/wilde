import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const versionApi = createApi({
    reducerPath: 'versionApi',
    baseQuery: fetchBaseQuery({ baseUrl: process.env.PUBLIC_URL }),
    endpoints: (builder) => ({
        getMinorVersion: builder.query<string, void>({
            query: () => 'minor-version.txt',
        }),
    }),
});

export const { useGetMinorVersionQuery } = versionApi;