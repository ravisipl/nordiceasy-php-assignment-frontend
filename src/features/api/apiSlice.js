import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_ENDPOINTS } from '../../config/apiUrl'

export const apiSlice = createApi({
    reducerPath: 'api', // optional
    baseQuery: fetchBaseQuery({ baseUrl: API_ENDPOINTS.backendBaseUrl }),
    tagTypes: ['Client'],
    endpoints: builder => ({})
})