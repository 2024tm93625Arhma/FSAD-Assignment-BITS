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

const StudentDashboard = () => {
    const [equipment, setEquipment] = useState([]);
    const [myRequests, setMyRequests] = useState([]);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Form state
    const [selectedEquip, setSelectedEquip] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const fetchData = async () => {
        try {
            const equipRes = await api.get('/equipment');
            setEquipment(equipRes.data);

            const requestsRes = await api.get('/borrow/my');
            setMyRequests(requestsRes.data);
        } catch (err) {
            setError('Failed to fetch data.');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

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
            // Reset form and refresh data
            setSelectedEquip('');
            setQuantity(1);
            setStartDate('');
            setEndDate('');
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || 'Request failed.');
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            
            {/* --- Request Form --- */}
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
                    <TextField
                        label="Quantity"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        InputProps={{ inputProps: { min: 1 } }}
                        sx={{ flex: '1 1 100px' }}
                    />
                    <TextField
                        label="Start Date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{ flex: '1 1 150px' }}
                    />
                    <TextField
                        label="End Date"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{ flex: '1 1 150px' }}
                    />
                    <Button type="submit" variant="contained" sx={{ height: '56px', flex: '1 1 100px' }}>
                        Submit
                    </Button>
                </Box>
                {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
                {message && <Typography color="success.main" sx={{ mt: 2 }}>{message}</Typography>}
            </Paper>

            {/* --- My Requests --- */}
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

            {/* --- Available Equipment --- */}
            <Typography variant="h4" component="h2" gutterBottom>
                Available Equipment
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Condition</TableCell>
                            <TableCell>Available</TableCell>
                            <TableCell>Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {equipment.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.category}</TableCell>
                                <TableCell>{item.conditionDescription}</TableCell>
                                <TableCell>{item.availableQuantity}</TableCell>
                                <TableCell>{item.totalQuantity}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default StudentDashboard;