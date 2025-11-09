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
  TextField,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';

// Helper to format date for display
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
}

const StaffDashboard = () => {
    const [equipment, setEquipment] = useState([]);
    const [myRequests, setMyRequests] = useState([]);
    const [pending, setPending] = useState([]);
    const [issued, setIssued] = useState([]);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [userMap, setUserMap] = useState({});

    // Form state
    const [selectedEquip, setSelectedEquip] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const fetchData = async () => {
        try {
            // 1. Fetch main data first
            const [equipRes, myReqRes, pendingRes, issuedRes] = await Promise.all([
                api.get('/equipment'),
                api.get('/borrow/my'),
                api.get('/borrow/pending'),
                api.get('/borrow/issued')
            ]);
            
            setEquipment(equipRes.data);
            setMyRequests(myReqRes.data);
            setPending(pendingRes.data);
            setIssued(issuedRes.data);

            const allRequests = [...pendingRes.data, ...issuedRes.data];
            const userIds = [...new Set(allRequests.map(r => r.userId))];
            const userFetchPromises = userIds.map(id => 
                api.get(`/users/${id}`)
            );
            const userResponses = await Promise.all(userFetchPromises);
            const map = userResponses.reduce((acc, res) => {
                const user = res.data;
                acc[user.id] = user.name;
                return acc;
            }, {});

            setUserMap(map);

        } catch (err) {
            setError('Failed to fetch data.');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- My Request Handler ---
    const handleSubmitRequest = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        if (!selectedEquip || !startDate || !endDate) {
            setError('Please select an item and a valid date range.');
            return;
        }
        try {
            const dto = {
                equipmentId: selectedEquip,
                quantity: parseInt(quantity, 10),
                startDate,
                endDate
            };
            await api.post('/borrow/request', dto);
            setMessage('Request submitted successfully!');
            setSelectedEquip('');
            setQuantity(1);
            setStartDate('');
            setEndDate('');
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || 'Request failed.');
        }
    };

    // --- Admin Handlers ---
    const handleApprove = async (id) => {
        const comment = window.prompt('Approval comment (optional):');
        if (comment === null) return;
        try {
            await api.put(`/borrow/${id}/approve`, { comment });
            fetchData();
        } catch (err) {
            alert('Failed to approve: ' + (err.response?.data?.message || err.message));
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

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {error && <Typography color="error">{error}</Typography>}
            {message && <Typography color="success.main">{message}</Typography>}

            {/* --- 1. Request Form (for Staff) --- */}
            <Typography variant="h4" component="h2" gutterBottom>
                Request Equipment
            </Typography>
            <Paper sx={{ p: 3, mb: 4 }}>
                <Box component="form" onSubmit={handleSubmitRequest} sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <FormControl fullWidth sx={{ minWidth: 200, flex: '1 1 200px' }}>
                        <InputLabel id="equip-select-label">Equipment</InputLabel>
                        <Select
                            labelId="equip-select-label"
                            value={selectedEquip}
                            label="Equipment"
                            onChange={(e) => setSelectedEquip(e.target.value)}
                        >
                            {equipment.map((item) => (
                                <MenuItem key={item.id} value={item.id}>
                                    {item.name} (Available: {item.availableQuantity})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField label="Quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} InputProps={{ inputProps: { min: 1 } }} sx={{ flex: '1 1 100px' }} />
                    <TextField label="Start Date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} InputLabelProps={{ shrink: true }} sx={{ flex: '1 1 150px' }} />
                    <TextField label="End Date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} InputLabelProps={{ shrink: true }} sx={{ flex: '1 1 150px' }} />
                    <Button type="submit" variant="contained" sx={{ height: '56px', flex: '1 1 100px' }}>
                        Submit Request
                    </Button>
                </Box>
            </Paper>

            {/* --- 2. My Requests (Staff's own) --- */}
            <Typography variant="h4" component="h2" gutterBottom>
                My Borrow Requests
            </Typography>
            <TableContainer component={Paper} sx={{ mb: 4 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Item</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Period</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Admin Comment</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {myRequests.map((r) => (
                            <TableRow key={r.id}>
                                <TableCell>{r.equipment?.name || 'N/A'}</TableCell>
                                <TableCell>{r.quantityRequested}</TableCell>
                                <TableCell>{formatDate(r.startDate)} → {formatDate(r.endDate)}</TableCell>
                                <TableCell>{r.status}</TableCell>
                                <TableCell>{r.adminComment}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* --- 3. Pending Requests (for Staff to manage) --- */}
            <Typography variant="h4" component="h2" gutterBottom>
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
                        {pending.map((r) => (
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

            {/* --- 4. Issued Items (for Staff to manage) --- */}
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

        </Container>
    );
};

export default StaffDashboard;