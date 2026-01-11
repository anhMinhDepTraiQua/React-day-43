// src/services/auth.js
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithAxios from "./baseQuery"; 

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: baseQueryWithAxios, 
    endpoints: (builder) => ({
        me: builder.query({
            query: () => ({ url: "/auth/me" }), 
        }),
        login: builder.mutation({
            query: (body) => ({
                url: "/auth/login",
                method: "POST",
                body,
            }),
        }),
    }),
});

export const { useMeQuery, useLoginMutation } = authApi;