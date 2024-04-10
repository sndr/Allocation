import React, { useState } from 'react';
import { TextField, Button, Container, Grid, Typography, Box, Paper } from '@mui/material';

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
    { label: 'Turma', name: 'turma' },
    { label: 'Professor', name: 'professor' },
    { label: 'Disciplina', name: 'disciplina' },
    { label: 'Horário', name: 'horario' },
    { label: 'Alunos', name: 'alunos' },
    { label: 'Local', name: 'local' },
    { label: 'Capacidade', name: 'capacidade' },
    { label: 'Equipamentos', name: 'equipamentos' }
  ];

  return (
    <div style={{ background: 'linear-gradient(to bottom, #f2f5f8, #d7e1eb)', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" marginTop="20px">
          <Typography variant="h4" gutterBottom>Painel de Alocação</Typography>
        </Box>
        <Grid container spacing={2}>
          {salas.map((sala, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper elevation={3} style={{ padding: '10px' }}>
                <Typography variant="h5">{sala.nome}</Typography>
                <Typography>Turma: {sala.turma}</Typography>
                <Typography>Professor: {sala.professor}</Typography>
                <Typography>Disciplina: {sala.disciplina}</Typography>
                <Typography>Horário: {sala.horario}</Typography>
                <Typography>Alunos: {sala.alunos}</Typography>
                <Typography>Local: {sala.local}</Typography>
                <Typography>Capacidade: {sala.capacidade}</Typography>
                <Typography>Equipamentos: {sala.equipamentos}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={2} style={{ marginTop: '20px' }}>
          <Paper elevation={3} style={{ padding: '20px', width: '100%' }}>
            <Typography variant="h4" gutterBottom style={{ marginBottom: '20px' }}>Nova Sala</Typography>
            <form onSubmit={handleConfirmAll}>
              <Grid container spacing={2}>
                {inputFields.map((input, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <TextField
                      name={input.name}
                      label={input.label}
                      variant="outlined"
                      fullWidth
                      value={formData[input.name] || ''}
                      onChange={handleChange}
                    />
                    <Button onClick={() => handleClearField(input.name)}>Limpar</Button>
                  </Grid>
                ))}
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
