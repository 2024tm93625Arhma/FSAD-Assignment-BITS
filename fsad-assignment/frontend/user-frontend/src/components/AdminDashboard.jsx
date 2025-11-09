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
  DialogTitle
} from '@mui/material';

// Helper to format date for display
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
}

const AdminDashboard = () => {
    const [pending, setPending] = useState([]);
    const [issued, setIssued] = useState([]);
    const [equipment, setEquipment] = useState([]);
    const [error, setError] = useState('');

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

    // Fetch all data
    const fetchData = async () => {
        try {
            const [pendingRes, issuedRes, equipRes] = await Promise.all([
                api.get('/borrow/pending'),
                api.get('/borrow/issued'),
                api.get('/equipment')
            ]);
            setPending(pendingRes.data);
            setIssued(issuedRes.data);
            setEquipment(equipRes.data);
        } catch (err) {
            setError('Failed to fetch data. ' + (err.response?.data?.message || ''));
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- Request Handlers ---
    const handleApprove = async (id) => {
        const comment = window.prompt('Approval comment (optional):');
        if (comment === null) return; // User cancelled
        try {
            await api.put(`/borrow/${id}/approve`, { comment }); // Use PUT
            fetchData(); // Refresh lists
        } catch (err) {
            alert('Failed to approve: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleReject = async (id) => {
        const comment = window.prompt('Rejection reason (required):');
        if (!comment) return alert('Rejection requires a comment.');
        try {
            await api.put(`/borrow/${id}/reject`, { comment }); // Use PUT
            fetchData();
        } catch (err) {
            alert('Failed to reject: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleIssue = async (id) => {
        if (!window.confirm('Confirm issue? This will decrement stock.')) return;
        try {
            await api.put(`/borrow/${id}/issue`); // Use PUT
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

    // --- Equipment Handlers ---
    const handleOpenForm = (equip = null) => {
        if (equip) {
            setIsEdit(true);
            setCurrentEquip(equip);
        } else {
            setIsEdit(false);
            setCurrentEquip({ id: null, name: '', category: '', conditionDescription: '', totalQuantity: 1, description: '' });
        }
        setOpen(true);
    };

    const handleCloseForm = () => setOpen(false);

    // --- THIS FUNCTION CONTAINS THE FIX ---
    const handleSaveEquipment = async () => {
        try {
            const quantity = parseInt(currentEquip.totalQuantity, 10) || 0;
            if (quantity < 0) {
                alert("Total Quantity cannot be negative.");
                return;
            }

            // 1. Construct the payload with all fields *except* id and availableQuantity
            const payload = {
                name: currentEquip.name,
                category: currentEquip.category,
                conditionDescription: currentEquip.conditionDescription,
                description: currentEquip.description,
                totalQuantity: quantity
            };

            if (isEdit) {
                // 2. If editing, add the ID back and call PUT
                payload.id = currentEquip.id; 
                await api.put(`/equipment/${currentEquip.id}`, payload);
            } else {
                // 3. If creating, do NOT add the id. Call POST.
                await api.post('/equipment', payload);
            }
            // --- END OF FIX ---

            fetchData();
            handleCloseForm();
        } catch (err) {
            alert('Failed to save equipment: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleDeleteEquipment = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        try {
            await api.delete(`/equipment/${id}`);
            fetchData();
        } catch (err) {
            alert('Failed to delete: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {error && <Typography color="error">{error}</Typography>}

            {/* --- Equipment Management --- */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" component="h2">
                    Equipment Management
                </Typography>
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
                        {equipment.map((e) => (
                            <TableRow key={e.id}>
                                <TableCell>{e.name}</TableCell>
                                <TableCell>{e.category}</TableCell>
                                <TableCell>{e.conditionDescription}</TableCell>
                                <TableCell>{e.availableQuantity}</TableCell>
                                <TableCell>{e.totalQuantity}</TableCell>
                                <TableCell align="right">
                                    <Button size="small" onClick={() => handleOpenForm(e)} sx={{ mr: 1 }}>Edit</Button>
                                    <Button size="small" color="error" onClick={() => handleDeleteEquipment(e.id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* --- Pending & Approved Requests --- */}
            <Typography variant="h4" component="h2" gutterBottom>
                Action Required (Pending & Approved)
            </Typography>
            <TableContainer component={Paper} sx={{ mb: 4 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Item</TableCell>
                            <TableCell>Requested By</TableCell>
                            <TableCell>Status</TableCell> {/* Added Status column */}
                            <TableCell>Period</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pending.map((r) => (
                            <TableRow key={r.id}>
                                <TableCell>{r.equipment?.name || 'N/A'}</TableCell>
                                <TableCell>{r.userId}</TableCell>
                                <TableCell>{r.status}</TableCell> {/* Added Status */}
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

            {/* --- Issued Items --- */}
            <Typography variant="h4" component="h2" gutterBottom>
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
                        {issued.map((r) => (
                            <TableRow key={r.id}>
                                <TableCell>{r.equipment?.name || 'N/A'}</TableCell>
                                <TableCell>{r.userId}</TableCell>
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

            {/* --- Equipment Edit/Create Dialog --- */}
            <Dialog open={open} onClose={handleCloseForm}>
                <DialogTitle>{isEdit ? 'Edit Equipment' : 'Add New Equipment'}</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" label="Name" type="text" fullWidth variant="standard" value={currentEquip.name} onChange={(e) => setCurrentEquip({ ...currentEquip, name: e.target.value })} />
                    <TextField margin="dense" label="Category" type="text" fullWidth variant="standard" value={currentEquip.category} onChange={(e) => setCurrentEquip({ ...currentEquip, category: e.target.value })} />
                    <TextField margin="dense" label="Condition" type="text" fullWidth variant="standard" value={currentEquip.conditionDescription} onChange={(e) => setCurrentEquip({ ...currentEquip, conditionDescription: e.target.value })} />
                    
                    <TextField 
                        margin="dense" 
                        label="Total Quantity" 
                        type="number" 
                        fullWidth 
                        variant="standard" 
                        value={currentEquip.totalQuantity} 
                        onChange={(e) => setCurrentEquip({ ...currentEquip, totalQuantity: e.target.value })} 
                    />

                    <TextField margin="dense" label="Description" type="text" fullWidth variant="standard" value={currentEquip.description} onChange={(e) => setCurrentEquip({ ...currentEquip, description: e.target.value })} />
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