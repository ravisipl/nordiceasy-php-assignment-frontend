import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import Button from '@mui/material/Button';
import { useSearchParams, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

import { useAddNewClientMutation, useGetClientByUserIdQuery, useUpdateClientMutation } from './clientSlice';
import { notify } from '../../utils/common';

const validationSchema = yup.object({
    name: yup
        .string('Enter your name')
        .required('Name is required')
        .max(100, 'Name cannot exceed 100 characters'),
    email: yup
        .string('Enter your email')
        .email('Enter a valid email')
        .required('Email is required')
        .max(100, 'Email cannot exceed 100 characters'),
    phone_number: yup
        .string('Enter your phone number')
        .required('Phone number is required')
        .test('is-number', 'Phone number must contain only numbers', value => {
            return /^[0-9]+$/.test(value);
        })
        .test('max-length', 'Phone number cannot exceed 10 digits', value => {
            return value.length <= 10;
        }),
    comment: yup
        .string('Enter comment')
        .required('Comment is required')
        .max(1000, 'Comment cannot exceed 1000 characters')
});

const clientInitialData = { name: '', email: '', phone_number: '', comment: '' };

const ManageClient = () => {
    const [addNewClient] = useAddNewClientMutation();
    const [updateClient] = useUpdateClientMutation();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    let clientId = searchParams.get("cid");

    const manageClientForm = useFormik({
        initialValues: clientInitialData,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                if (clientId) {
                    let response = await updateClient(values).unwrap();
                    console.log('values: ', values);
                    if (response.success) {
                        notify.success(response.message);
                        navigate("/all-clients")
                    }
                } else {
                    values.client_id = uuidv4();
                    let response = await addNewClient(values).unwrap();
                    if (response.success) {
                        notify.success(response.message);
                        navigate("/all-clients")
                    }
                }
            } catch (err) {
                notify.error(err?.data?.message);
            }
        },
    });
    const [clientDataFetchSkipped, setClientDataFetchSkipped] = useState(true)
    const { data: clientData, isLoading: isClientDataLoading, isSuccess, isError, error } = useGetClientByUserIdQuery(clientId, { skip: clientDataFetchSkipped });

    useEffect(() => {
        if (clientId) {
            setClientDataFetchSkipped(false);
            if (!isClientDataLoading && isSuccess) {
                manageClientForm.setValues(clientData)
            }
            if (isError) {
                notify.error(error?.data?.message);
            }
        }
    }, [isClientDataLoading, clientId])

    return (
        <div className='clientWrapper'>
            <h3 className='pageHeading'>Manage Client</h3>
            <Box sx={{ mb: 1.5, textAlign: "right", width: "100%" }} >
                <Button color="primary" component="a" variant="contained" href="/all-clients">View Clients</Button>
                {clientId && <Button color="primary" component="a" variant="contained" sx={{ ml: 2 }} href="/manage-client">Add Client</Button>}
            </Box>
            <form onSubmit={manageClientForm.handleSubmit}>
                <TextField
                    sx={{ mb: 1.5 }}
                    fullWidth
                    name="name"
                    label="Name"
                    value={manageClientForm.values.name}
                    onChange={manageClientForm.handleChange}
                    onBlur={manageClientForm.handleBlur}
                    error={manageClientForm.touched.name && Boolean(manageClientForm.errors.name)}
                    helperText={manageClientForm.touched.name && manageClientForm.errors.name}
                />
                <TextField
                    sx={{ mb: 1.5 }}
                    fullWidth
                    name="email"
                    label="Email"
                    value={manageClientForm.values.email}
                    onChange={manageClientForm.handleChange}
                    onBlur={manageClientForm.handleBlur}
                    error={manageClientForm.touched.email && Boolean(manageClientForm.errors.email)}
                    helperText={manageClientForm.touched.email && manageClientForm.errors.email}
                />
                <TextField
                    sx={{ mb: 1.5 }}
                    fullWidth
                    name="phone_number"
                    label="Phone"
                    value={manageClientForm.values.phone_number}
                    onChange={manageClientForm.handleChange}
                    onBlur={manageClientForm.handleBlur}
                    error={manageClientForm.touched.phone_number && Boolean(manageClientForm.errors.phone_number)}
                    helperText={manageClientForm.touched.phone_number && manageClientForm.errors.phone_number}
                />
                <TextField
                    sx={{ mb: 1.5 }}
                    multiline
                    rows={6}
                    fullWidth
                    name="comment"
                    label="Comment"
                    value={manageClientForm.values.comment}
                    onChange={manageClientForm.handleChange}
                    onBlur={manageClientForm.handleBlur}
                    error={manageClientForm.touched.comment && Boolean(manageClientForm.errors.comment)}
                    helperText={manageClientForm.touched.comment && manageClientForm.errors.comment}
                />
                <Button sx={{ mb: 2.5 }} color="primary" variant="contained" fullWidth type="submit">
                    Submit
                </Button>

            </form>
        </div>
    );
};

export default ManageClient;