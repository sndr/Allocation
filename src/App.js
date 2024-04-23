import React, { useState } from 'react';
import { TextField, Button, Container, Grid, Typography, Box, Paper, Select, MenuItem, InputLabel, FormControl, Checkbox, FormControlLabel } from '@mui/material';

function App() {
  const [salas, setSalas] = useState([]);
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleConfirmAll = (e) => {
    e.preventDefault();
    setSalas([...salas, formData]);
    setFormData({});
  };

  const handleClearField = (fieldName) => {
    setFormData({ ...formData, [fieldName]: '' });
  };

  const inputFields = [
    { label: 'Nome da Sala', name: 'nome' },
    { label: 'Ambiente', name: 'ambiente' },
    { label: 'Capacidade', name: 'capacidade' },
    { label: 'Bloco', name: 'bloco' },
    { label: 'Ar', name: 'ar' },
    { label: 'Ventilador', name: 'ventilador' },
    { label: 'Quadro Giz', name: 'quadroGiz' },
    { label: 'Quadro Branco', name: 'quadroBranco' },
    { label: 'Quadro Vidro', name: 'quadroVidro' }
  ];

  return (
    <div style={{ background: 'linear-gradient(to bottom, #ffffff, #000000)', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" marginTop="10%">
          <Typography variant="h3" gutterBottom>Painel de Alocação</Typography>
        </Box>
        <Grid container spacing={2} style={{ marginTop: '20px' }}>
          <Paper elevation={3} style={{ padding: '20px', width: '100%' }}>
            <Typography variant="h4" gutterBottom style={{ marginBottom: '20px' }}>Salas</Typography>
            <form onSubmit={handleConfirmAll}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    name="nome"
                    label="Nome da Sala"
                    variant="outlined"
                    fullWidth
                    value={formData.nome || ''}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    name="bloco"
                    label="Bloco"
                    variant="outlined"
                    fullWidth
                    value={formData.bloco || ''}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    name="capacidade"
                    label="Capacidade"
                    variant="outlined"
                    type="number"
                    fullWidth
                    InputProps={{
                      inputProps: { min: 0 }
                    }}
                    value={formData.capacidade || ''}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth>
                    <InputLabel id="labelAmbiente">Ambiente</InputLabel>
                    <Select
                      labelId='labelAmbiente'
                      name="ambiente"
                      value={formData.ambiente || ''}
                      label="Ambiente"
                      onChange={handleChange}
                    >
                      <MenuItem value="Sala Comum">Sala Comum</MenuItem>
                      <MenuItem value="Laboratório">Laboratório</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControlLabel
                    control={<Checkbox name="ar" />}
                    label="Ar"
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <FormControlLabel
                    control={<Checkbox name="ventilador" />}
                    label="Ventilador"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControlLabel
                    control={<Checkbox name="quadroGiz" />}
                    label="Quadro Giz"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControlLabel
                    control={<Checkbox name="quadroBranco" />}
                    label="Quadro Branco"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControlLabel
                    control={<Checkbox name="quadroVidro" />}
                    label="Quadro Vidro"
                  />
                </Grid>
                <Grid item xs={12} style={{ marginTop: '20px' }}>
                  <Button type="submit" variant="contained" color="primary">Confirmar</Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Container>
    </div>
  );
}

export default App;
