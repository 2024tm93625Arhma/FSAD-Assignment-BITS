import React, { useEffect, useState } from 'react';
import api from "../utils/api";
import {
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Typography,
    Box,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    CircularProgress
} from '@mui/material';

// Helper to format date for display
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
};

const AdminDashboard = () => {
    const [pending, setPending] = useState([]);
    const [issued, setIssued] = useState([]);
    const [equipment, setEquipment] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [userMap, setUserMap] = useState({});

    // Dialog state for equipment form
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentEquip, setCurrentEquip] = useState({
        id: null,
        name: '',
        category: '',
        conditionDescription: '',
        totalQuantity: 1,
        description: ''
    });

    // 🟢 Fetch all dashboard data
    const fetchData = async () => {
        try {
            setLoading(true);
            const [pendingRes, issuedRes, equipRes, usersRes] = await Promise.all([
                api.get('/borrow/pending'),
                api.get('/borrow/issued'),
                api.get('/equipment'),
                api.get('/users')
            ]);
            setPending(pendingRes.data);
            setIssued(issuedRes.data);
            setEquipment(equipRes.data);
            setError('');
            const userList = usersRes.data;
            const map = userList.reduce((acc, user) => {
                acc[user.id] = user.name;
                return acc;
            }, {});
            setUserMap(map);
        } catch (err) {
            const msg = err.response?.status === 403
                ? "Access denied — please log in with Admin/Staff role."
                : (err.response?.data?.message || "Server unavailable.");
            setError('Failed to fetch data. ' + msg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 🟡 Request handlers
    const handleApprove = async (id) => {
        // Find the request details
        const req = pending.find(r => r.id === id);
        const equipmentName = req?.equipment?.name || 'This item';

        // ✅ Check if equipment has enough available quantity
        if (req?.equipment?.availableQuantity <= 0) {
            alert(`${equipmentName} is not available at the moment — approval cannot be completed.`);
            return;
        }

        const comment = window.prompt('Approval comment (optional):');
        if (comment === null) return;

        try {
            await api.put(`/borrow/${id}/approve`, { comment });
            fetchData();
            alert(`${equipmentName} approved successfully.`);
        } catch (err) {
            const msg = err.response?.data?.message || err.message;
            alert(`Failed to approve: ${msg}`);
        }
    };


    const handleReject = async (id) => {
        const comment = window.prompt('Rejection reason (required):');
        if (!comment) return alert('Rejection requires a comment.');
        try {
            await api.put(`/borrow/${id}/reject`, { comment });
            fetchData();
        } catch (err) {
            alert('Failed to reject: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleIssue = async (id) => {
        if (!window.confirm('Confirm issue? This will decrement stock.')) return;
        try {
            await api.put(`/borrow/${id}/issue`);
            fetchData();
        } catch (err) {
            alert('Failed to issue: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleReturn = async (id) => {
        if (!window.confirm('Confirm return? This will increment stock.')) return;
        try {
            await api.put(`/borrow/${id}/return`);
            fetchData();
        } catch (err) {
            alert('Failed to return: ' + (err.response?.data?.message || err.message));
        }
    };

    // 🧩 Equipment Handlers
    const handleOpenForm = (equip = null) => {
        if (equip) {
            setIsEdit(true);
            setCurrentEquip(equip);
        } else {
            setIsEdit(false);
            setCurrentEquip({
                id: null,
                name: '',
                category: '',
                conditionDescription: '',
                totalQuantity: 1,
                description: ''
            });
        }
        setOpen(true);
    };

    const handleCloseForm = () => setOpen(false);

    const handleSaveEquipment = async () => {
        try {
            const quantity = parseInt(currentEquip.totalQuantity, 10) || 0;
            if (quantity < 0) {
                alert("Total Quantity cannot be negative.");
                return;
            }

            const payload = {
                name: currentEquip.name,
                category: currentEquip.category,
                conditionDescription: currentEquip.conditionDescription,
                description: currentEquip.description,
                totalQuantity: quantity
            };

            if (isEdit) {
                payload.id = currentEquip.id;
                await api.put(`/equipment/${currentEquip.id}`, payload);
            } else {
                await api.post('/equipment', payload);
            }

            fetchData();
            handleCloseForm();
        } catch (err) {
            alert('Failed to save equipment: ' + (err.response?.data?.message || err.message));
        }
    };

    //    const handleDelete = async (id) => {
    //   try {
    //     await axios.delete(`${API_BASE_URL}/equipment/${id}`);
    //     alert("Equipment deleted successfully.");
    //     fetchEquipments();
    //   } catch (error) {
    //     const backendMessage =
    //       error.response?.data?.message ||
    //       error.response?.data?.error ||
    //       "Failed to delete equipment. Please try again.";
    //     alert(backendMessage);
    //   }
    // };
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this equipment?")) return;

        try {
            await api.delete(`/equipment/${id}`);
            alert("Equipment deleted successfully.");
            fetchData();
        } catch (error) {
            let backendMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "";

            // 💬 Friendly message for 500 errors (linked/dependency issues)
            if (error.response?.status === 500) {
                backendMessage =
                    "This item cannot be deleted because it may be linked to active or past borrow records.";
            } else if (!backendMessage) {
                backendMessage = "Failed to delete equipment. Please try again.";
            }

            alert(backendMessage);
        }
    };





    // 🧠 Conditional content rendering
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

            {/* Equipment Management Section */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4">Equipment Management</Typography>
                <Button variant="contained" color="primary" onClick={() => handleOpenForm()}>
                    Add New Item
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ mb: 4 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Condition</TableCell>
                            <TableCell>Available</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {equipment.length === 0 ? (
                            <TableRow><TableCell colSpan={6} align="center">No equipment found</TableCell></TableRow>
                        ) : equipment.map((e) => (
                            <TableRow key={e.id}>
                                <TableCell>{e.name}</TableCell>
                                <TableCell>{e.category}</TableCell>
                                <TableCell>{e.conditionDescription}</TableCell>
                                <TableCell>{e.availableQuantity}</TableCell>
                                <TableCell>{e.totalQuantity}</TableCell>
                                <TableCell align="right">
                                    <Button size="small" onClick={() => handleOpenForm(e)} sx={{ mr: 1 }}>Edit</Button>

                                    <Button size="small" color="error" onClick={() => handleDelete(e.id)}>Delete</Button>

                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pending Requests */}
            <Typography variant="h4" gutterBottom>
                Action Required (Pending & Approved)
            </Typography>
            <TableContainer component={Paper} sx={{ mb: 4 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Item</TableCell>
                            <TableCell>Requested By</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Period</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pending.length === 0 ? (
                            <TableRow><TableCell colSpan={5} align="center">No pending requests</TableCell></TableRow>
                        ) : pending.map((r) => (
                            <TableRow key={r.id}>
                                <TableCell>{r.equipment?.name || 'N/A'}</TableCell>
                                <TableCell>{userMap[r.userId] || r.userId}</TableCell>
                                <TableCell>{r.status}</TableCell>
                                <TableCell>{formatDate(r.startDate)} → {formatDate(r.endDate)}</TableCell>
                                <TableCell align="right">
                                    <Button
                                        variant="contained"
                                        color="success"
                                        size="small"
                                        onClick={() => handleApprove(r.id)}
                                        sx={{ mr: 1 }}
                                        disabled={r.status !== 'PENDING'}
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        size="small"
                                        onClick={() => handleReject(r.id)}
                                        sx={{ mr: 1 }}
                                        disabled={r.status !== 'PENDING'}
                                    >
                                        Reject
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        onClick={() => handleIssue(r.id)}
                                        disabled={r.status !== 'APPROVED'}
                                    >
                                        Issue
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Issued Items */}
            <Typography variant="h4" gutterBottom>
                Issued Items (Awaiting Return)
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Item</TableCell>
                            <TableCell>Issued To</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Due Date</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {issued.length === 0 ? (
                            <TableRow><TableCell colSpan={5} align="center">No issued items</TableCell></TableRow>
                        ) : issued.map((r) => (
                            <TableRow key={r.id}>
                                <TableCell>{r.equipment?.name || 'N/A'}</TableCell>
                                <TableCell>{userMap[r.userId] || r.userId}</TableCell>
                                <TableCell>{r.quantityRequested}</TableCell>
                                <TableCell>{formatDate(r.endDate)}</TableCell>
                                <TableCell align="right">
                                    <Button variant="contained" color="info" size="small" onClick={() => handleReturn(r.id)}>
                                        Mark Returned
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Equipment Dialog */}
            <Dialog open={open} onClose={handleCloseForm}>
                <DialogTitle>{isEdit ? 'Edit Equipment' : 'Add New Equipment'}</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" label="Name" fullWidth variant="standard"
                        value={currentEquip.name}
                        onChange={(e) => setCurrentEquip({ ...currentEquip, name: e.target.value })} />
                    <TextField margin="dense" label="Category" fullWidth variant="standard"
                        value={currentEquip.category}
                        onChange={(e) => setCurrentEquip({ ...currentEquip, category: e.target.value })} />
                    <TextField margin="dense" label="Condition" fullWidth variant="standard"
                        value={currentEquip.conditionDescription}
                        onChange={(e) => setCurrentEquip({ ...currentEquip, conditionDescription: e.target.value })} />
                    <TextField margin="dense" label="Total Quantity" type="number" fullWidth variant="standard"
                        value={currentEquip.totalQuantity}
                        onChange={(e) => setCurrentEquip({ ...currentEquip, totalQuantity: e.target.value })} />
                    <TextField margin="dense" label="Description" fullWidth variant="standard"
                        value={currentEquip.description}
                        onChange={(e) => setCurrentEquip({ ...currentEquip, description: e.target.value })} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseForm}>Cancel</Button>
                    <Button onClick={handleSaveEquipment}>Save</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AdminDashboard;
