import { createEntityAdapter } from "@reduxjs/toolkit";
import { API_ENDPOINTS } from "../../config/apiUrl";
import { apiSlice } from "../api/apiSlice";

const clientsAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date)
})

export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getClientsList: builder.query({
            query: () => API_ENDPOINTS.getClientsList,
            transformResponse: responseData => (responseData.data.clients),
        }),
        getClientByUserId: builder.query({
            query: clientId => `${API_ENDPOINTS.getClientsList}/${clientId}`,
            transformResponse: responseData => (responseData.data),
        }),
        addNewClient: builder.mutation({
            query: reqData => {
                return ({
                    url: API_ENDPOINTS.addClient,
                    method: 'POST',
                    body: reqData
                })
            },
        }),
        updateClient: builder.mutation({
            query: reqData => {
                return ({
                    url: `${API_ENDPOINTS.updateClient}/${reqData.id}`,
                    method: 'PUT',
                    body: reqData
                })
            }
        }),
        deleteClient: builder.mutation({
            query: (clientId) => ({
                url: `${API_ENDPOINTS.deleteClient}/${clientId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['client'],
        }),
    })
})

export const {
    useGetClientsListQuery,
    useGetClientByUserIdQuery,
    useAddNewClientMutation,
    useUpdateClientMutation,
    useDeleteClientMutation
} = extendedApiSlice
