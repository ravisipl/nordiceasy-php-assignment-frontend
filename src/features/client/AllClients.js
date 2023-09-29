import React, { useState } from 'react'
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Link from '@mui/material/Link';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import { useGetClientsListQuery, useDeleteClientMutation } from './clientSlice';
import { notify } from '../../utils/common';

const AllClients = () => {
    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 90,
        },
        {
            field: 'name',
            headerName: 'Name',
            width: 200,
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 150,
        },
        {
            field: 'phone_number',
            headerName: 'Phone Number',
            width: 150,
        },
        {
            field: 'action',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <>
                    <Link
                        href={`/manage-client?cid=${params.row.id}`}
                        underline="none"
                    >
                        Edit
                    </Link>
                    <Link
                        component="span"
                        style={{ marginLeft: "10px", cursor: "pointer" }}
                        onClick={() => handleDeleteClientModalOpen(params.row.id)}
                        underline="none"
                    > Delete
                    </Link>
                </>
            ),
        },
    ];

    const { data: clients, isLoading: isClientDataLoading, isSuccess, isError, error } = useGetClientsListQuery();
    const [deleteClient] = useDeleteClientMutation();
    const [clientIdToDelete, setClientIdToDelete] = useState(null);
    const [clientDeleteModelOpen, setClientDeleteModelOpen] = useState(false);

    const handleDeleteClient = async (clientId) => {
        const response = await deleteClient(clientId).unwrap();
        if (response.success) {
            notify.success(response.message);
            window.location.reload();
        }
    }

    const handleDeleteClientModalOpen = (clientId) => {
        setClientIdToDelete(clientId);
        setClientDeleteModelOpen(true);
    };

    const handleDeleteClientModalClose = () => {
        setClientIdToDelete(null);
        setClientDeleteModelOpen(false);
    };

    return (
        <>
            <div className='table-wrapper'>
                {isClientDataLoading ?
                    <CircularProgress />
                    :
                    <>
                        <h3 className='pageHeading'>All Clients</h3>
                        <Box sx={{ mb: 1.5, textAlign: "right", width: "100%" }} >
                            <Button color="primary" variant="contained" component="a" href="/manage-client">Add Client</Button>
                        </Box>
                        <Box sx={{ height: 400, width: '100%' }}>
                            {
                                clients?.length > 0 && (
                                    <>
                                        <DataGrid
                                            sx={{ mb: 1.5 }}
                                            rows={clients?.length > 0 ? clients : []}
                                            columns={columns}
                                            initialState={{
                                                pagination: {
                                                    paginationModel: {
                                                        pageSize: 10,
                                                    },
                                                },
                                            }}
                                            pageSizeOptions={[10]}
                                        />

                                    </>
                                )
                            }
                            <Dialog
                                open={clientDeleteModelOpen}
                                onClose={handleDeleteClientModalClose}
                            >
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                        Are you sure to delete this client ?
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button color="error" variant="contained" onClick={handleDeleteClientModalClose}>No</Button>
                                    <Button
                                        color="success"
                                        variant="contained"
                                        onClick={() => {
                                            handleDeleteClientModalClose();
                                            handleDeleteClient(clientIdToDelete)
                                        }}
                                        autoFocus
                                    >
                                        Yes
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </Box>
                    </>
                }
            </div>

        </>
    );
}
export default AllClients;