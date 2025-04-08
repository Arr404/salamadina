'use client'
import React, { useState, useEffect } from 'react';
import {
  fetchFilters,
  addPromo, deletePromo, updatePromo,
  addAirport, deleteAirport, updateAirport
} from '@/services/dynamicFilter';
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  Paper,
  IconButton,
  Divider,
  Snackbar,
  Alert, AlertColor
} from '@mui/material'
import {
  Trash2 as DeleteIcon,
  Pencil as EditIcon,
  Save as SaveIcon,
  X as CancelIcon,
  Plus as AddIcon,
  Plane as AirplaneTicketIcon,
  Tag as LocalOfferIcon
} from 'lucide-react';

type Promo = {
  id: string;
  name: string;
};

type Airport = {
  id: string;
  code: string;
  name: string;
};

type Filters = {
  promos: Promo[];
  airports: Airport[];
};

const DynamicFiltersManagement: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    promos: [],
    airports: []
  });

  const [newPromo, setNewPromo] = useState<string>('');
  const [newAirport, setNewAirport] = useState<{ code: string; name: string }>({
    code: '',
    name: ''
  });

  const [editingPromo, setEditingPromo] = useState<Promo | null>(null);
  const [editingAirport, setEditingAirport] = useState<Airport | null>(null);

  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Show notification
  const showNotification = (message: any, severity:AlertColor = 'success') => {
    setNotification({ open: true, message, severity });
  };

  // Close notification
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  useEffect(() => {
    loadFilters();
  }, []);

  const loadFilters = async () => {
    try {
      const data: Filters = await fetchFilters();
      setFilters(data);
    } catch (error) {
      console.error("Failed to load filters:", error);
      alert("Failed to load filters. Please try again.");
    }
  };

  const handleAddPromo = async () => {
    if (!newPromo.trim()) {
      showNotification('Promotion name cannot be empty', 'error');
      return;
    }

    try {
      await addPromo(newPromo);
      setNewPromo('');
      showNotification('Promotion added successfully');
      loadFilters();
    } catch (error) {
      showNotification("Failed to add promo. Please try again.",'error');
    }
  };

  const handleDeletePromo = async (id: string) => {
    try {
      await deletePromo(id);
      loadFilters();
    } catch (error) {
      showNotification("Failed to delete promo. Please try again.",'error');
    }
  };

  const handleUpdatePromo = async () => {
    if (!editingPromo || !editingPromo.name.trim()) {
      showNotification('Promotion name cannot be empty', 'error');
      return
    }

    try {
      await updatePromo(editingPromo.id, editingPromo.name);
      setEditingPromo(null);
      showNotification('Promotion Updated successfully');
      loadFilters();
    } catch (error) {
      showNotification("Failed to update promo. Please try again.",'error');
    }
  };

  const handleAddAirport = async () => {
    if (!newAirport.code.trim() || !newAirport.name.trim()) {
      showNotification("Airport code and name cannot be empty",'error');
      return;
    };

    try {
      await addAirport(newAirport.code, newAirport.name);
      setNewAirport({ code: '', name: '' });
      showNotification('Airport added successfully');
      loadFilters();
    } catch (error) {
      showNotification("Failed to add airport. Please try again.",'error');
    }
  };

  const handleDeleteAirport = async (id: string) => {
    try {
      await deleteAirport(id);
      showNotification('Airport deleted successfully');
      loadFilters();
    } catch (error) {
      showNotification("Failed to delete airport. Please try again.",'error');
    }
  };

  const handleUpdateAirport = async () => {
    if (!editingAirport || !editingAirport.code.trim() || !editingAirport.name.trim()) {
      showNotification("Airport code and name cannot be empty",'error');
      return;
    };

    try {
      await updateAirport(editingAirport.id, editingAirport.code, editingAirport.name);
      setEditingAirport(null);
      showNotification('Airport updated successfully');
      loadFilters();
    } catch (error) {
      showNotification("Failed to update airport. Please try again.",'error');
    }
  };

  return (
    <Container className="py-8" maxWidth="md">
      <Typography variant="h4" component="h1" className="mb-6 font-bold text-gray-800 flex items-center">
        Filter Management
      </Typography>

      {/* Promotions Section */}
      <Paper elevation={2} className="mb-8 p-6 bg-white">
        <Typography variant="h5" component="h2" className="mb-4 font-semibold flex items-center">
          <LocalOfferIcon className="mr-2 text-blue-600" /> Promotions
        </Typography>

        <div className="flex mb-4 gap-2">
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            value={newPromo}
            onChange={(e) => setNewPromo(e.target.value)}
            placeholder="New promotion name"
            className="bg-white"
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddPromo}
            className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
          >
            Add
          </Button>
        </div>

        <List className="bg-gray-50 rounded">
          {filters.promos.length === 0 ? (
            <ListItem className="p-4 text-gray-500 italic">
              No promotions added yet
            </ListItem>
          ) : (
            filters.promos.map((promo) => (
              <React.Fragment key={promo.id}>
                <ListItem className="p-4">
                  {editingPromo?.id === promo.id ? (
                    <div className="flex w-full gap-2 items-center">
                      <TextField
                        fullWidth
                        size="small"
                        value={editingPromo.name}
                        onChange={(e) => setEditingPromo({ ...editingPromo, name: e.target.value })}
                        className="bg-white"
                      />
                      <IconButton
                        onClick={handleUpdatePromo}
                        color="success"
                        size="small"
                      >
                        <SaveIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => setEditingPromo(null)}
                        color="default"
                        size="small"
                      >
                        <CancelIcon />
                      </IconButton>
                    </div>
                  ) : (
                    <div className="flex w-full justify-between items-center">
                      <Typography>{promo.name}</Typography>
                      <div>
                        <IconButton
                          onClick={() => setEditingPromo(promo)}
                          color="primary"
                          size="small"
                          className="mr-1"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeletePromo(promo.id)}
                          color="error"
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    </div>
                  )}
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))
          )}
        </List>
      </Paper>

      {/* Airports Section */}
      <Paper elevation={2} className="mb-8 p-6 bg-white">
        <Typography variant="h5" component="h2" className="mb-4 font-semibold flex items-center">
          <AirplaneTicketIcon className="mr-2 text-blue-600" /> Airports
        </Typography>

        <div className="flex mb-4 gap-2">
          <TextField
            variant="outlined"
            size="small"
            value={newAirport.code}
            onChange={(e) => setNewAirport({ ...newAirport, code: e.target.value.toUpperCase() })}
            placeholder="Code (e.g., CGK)"
            className="w-32 bg-white"
            inputProps={{ maxLength: 3 }}
          />
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            value={newAirport.name}
            onChange={(e) => setNewAirport({ ...newAirport, name: e.target.value })}
            placeholder="Airport name (e.g., Jakarta)"
            className="bg-white"
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddAirport}
            className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
          >
            Add
          </Button>
        </div>

        <List className="bg-gray-50 rounded">
          {filters.airports.length === 0 ? (
            <ListItem className="p-4 text-gray-500 italic">
              No airports added yet
            </ListItem>
          ) : (
            filters.airports.map((airport) => (
              <React.Fragment key={airport.id}>
                <ListItem className="p-4">
                  {editingAirport?.id === airport.id ? (
                    <div className="flex w-full gap-2 items-center">
                      <TextField
                        size="small"
                        value={editingAirport.code}
                        onChange={(e) => setEditingAirport({ ...editingAirport, code: e.target.value.toUpperCase() })}
                        className="w-24 bg-white"
                        inputProps={{ maxLength: 3 }}
                      />
                      <TextField
                        fullWidth
                        size="small"
                        value={editingAirport.name}
                        onChange={(e) => setEditingAirport({ ...editingAirport, name: e.target.value })}
                        className="bg-white"
                      />
                      <IconButton
                        onClick={handleUpdateAirport}
                        color="success"
                        size="small"
                      >
                        <SaveIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => setEditingAirport(null)}
                        color="default"
                        size="small"
                      >
                        <CancelIcon />
                      </IconButton>
                    </div>
                  ) : (
                    <div className="flex w-full justify-between items-center">
                      <Typography>
                        <span className="font-medium">{airport.code}</span> - {airport.name}
                      </Typography>
                      <div>
                        <IconButton
                          onClick={() => setEditingAirport(airport)}
                          color="primary"
                          size="small"
                          className="mr-1"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteAirport(airport.id)}
                          color="error"
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    </div>
                  )}
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))
          )}
        </List>
      </Paper>

      {/* Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default DynamicFiltersManagement;
