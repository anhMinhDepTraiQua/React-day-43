// src/services/baseQuery.js
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import httpRequest from "../utils/httpRequest";

const baseQueryWithAxios = async (args, api, extraOptions) => {
    const { url, method = "GET", body, params } = args;

    try {
        const response = await httpRequest({
            url,
            method,
            data: body,
            params,
        });

        return { data: response };
    } catch (axiosError) {
        const err = axiosError;
        return {
            error: {
                status: err.response?.status,
                data: err.response?.data || err.message,
            },
        };
    }
};

export default baseQueryWithAxios;