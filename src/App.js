import React, { useState, useEffect } from 'react';
import backgroundImage from './rick.jpg';
import * as XLSX from 'xlsx';
import { TextField, Button, Container, Typography, Box, Paper, Select, MenuItem, InputLabel, FormControl, Checkbox, FormControlLabel, Grid, createTheme, ThemeProvider, Stack } from '@mui/material';

function App() {
  const [salas, setSalas] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedSalas = JSON.parse(localStorage.getItem('salas'));
    const savedTurmas = JSON.parse(localStorage.getItem('turmas'));

    if (savedSalas) {
      setSalas(savedSalas);
    }

    if (savedTurmas) {
      setTurmas(savedTurmas);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('salas', JSON.stringify(salas));
    localStorage.setItem('turmas', JSON.stringify(turmas));
  }, [salas, turmas]);

  const handleSalaChange = (index, e) => {
    const { name, type } = e.target;
    let value = type === 'checkbox' ? e.target.checked : e.target.value;

    if (name === 'capacidade') {
      value = Math.max(0, value);
    }

    const updatedSalas = [...salas];
    updatedSalas[index] = { ...updatedSalas[index], [name]: value };
    setSalas(updatedSalas);
  };

  const handleTurmaChange = (index, e) => {
    const { name, type } = e.target;
    let value = type === 'checkbox' ? e.target.checked : e.target.value;

    if (name === 'qtdAlunos' || name === 'periodo') {
      value = Math.max(0, value);
    }

    const updatedTurmas = [...turmas];
    updatedTurmas[index] = { ...updatedTurmas[index], [name]: value };
    setTurmas(updatedTurmas);
  };

  const handleConfirmSala = (index) => {
    const sala = salas[index];
    const salaJSON = JSON.stringify(sala);
    console.log(`Dados da Sala ${index + 1}:`, salaJSON);
  };

  const handleConfirmTurma = (index) => {
    const turma = turmas[index];
    const turmaJSON = JSON.stringify(turma);
    console.log(`Dados da Turma ${index + 1}:`, turmaJSON);
  };

  const handleAddSala = () => {
    setSalas([...salas, {
      nome: '',
      ambiente: '',
      ar: 0,
      ventilador: 0,
      capacidade: 0,
      quadroGiz: 0,
      quadroBranco: 0,
      quadroVidro: 0,
      bloco: '',
      nomeDisciplina: '',
    }]);
  };

  const handleAddTurma = () => {
    setTurmas([...turmas, {
      qtdAlunos: 0,
      periodo: 0,
      nomeDisciplina: '',
      horario: '',
      curso: ''
    }]);
  };

  const handleRemoveSala = (index) => {
    const updatedSalas = [...salas];
    updatedSalas.splice(index, 1);
    setSalas(updatedSalas);
  };

  const handleRemoveTurma = (index) => {
    const updatedTurmas = [...turmas];
    updatedTurmas.splice(index, 1);
    setTurmas(updatedTurmas);
  };

  const renderSala = (sala, index) => {
    return (
      <Box key={index} mb={2} width="100%">
        <Paper elevation={3} style={{ padding: '20px', backgroundColor: darkMode ? '#333' : '#fff', color: darkMode ? '#fff' : '#333', display: 'flex', flexDirection: 'column', gap: '20px', marginLeft: '-15px', marginRight: '-15px' }}>
          <Typography variant="h6" gutterBottom>Sala {index + 1}</Typography>
          <Stack direction="row" spacing={2}>
            {inputFieldsSala.map(field => (
              <FormControl key={field.name} fullWidth>
                {field.type === 'checkbox' ? (
                  <FormControlLabel
                    control={
                      <Checkbox
                        name={field.name}
                        checked={sala[field.name] || false}
                        onChange={e => handleSalaChange(index, e)}
                      />
                    }
                    label={field.label}
                  />
                ) : field.type === 'select' ? (
                  <>
                    <InputLabel id={`${field.name}-label-${index}`}>{field.label}</InputLabel>
                    <Select
                      labelId={`${field.name}-label-${index}`}
                      name={field.name}
                      value={sala[field.name] || ''}
                      label={field.label}
                      onChange={e => handleSalaChange(index, e)}
                    >
                      {field.options.map(option => (
                        <MenuItem key={option} value={option}>{option}</MenuItem>
                      ))}
                    </Select>
                  </>
                ) : (
                  <TextField
                    name={field.name}
                    label={field.label}
                    variant="outlined"
                    fullWidth
                    value={sala[field.name] || ''}
                    onChange={e => handleSalaChange(index, e)}
                    type={field.type}
                    InputProps={field.inputProps}
                  />
                )}
              </FormControl>
            ))}
          </Stack>
          <Box alignSelf="flex-end">
            <Button variant="contained" color="primary" onClick={() => handleConfirmSala(index)}>Confirmar</Button>
            <Button variant="contained" color="secondary" onClick={() => handleRemoveSala(index)}>Remover</Button>
          </Box>
        </Paper>
      </Box>
    );
  };

  const renderTurma = (turma, index) => {
    return (
      <Box key={index} mb={2} width="100%">
        <Paper elevation={3} style={{ padding: '20px', backgroundColor: darkMode ? '#333' : '#fff', color: darkMode ? '#fff' : '#333', display: 'flex', flexDirection: 'column', gap: '20px', marginLeft: '-15px', marginRight: '-15px' }}>
          <Typography variant="h6" gutterBottom>Turma {index + 1}</Typography>
          <Stack direction="row" spacing={2}>
            {inputFieldsTurma.map(field => (
              <FormControl key={field.name} fullWidth>
                {field.type === 'checkbox' ? (
                  <FormControlLabel
                    control={
                      <Checkbox
                        name={field.name}
                        checked={turma[field.name] || false}
                        onChange={e => handleTurmaChange(index, e)}
                      />
                    }
                    label={field.label}
                  />
                ) : field.type === 'select' ? (
                  <>
                    <InputLabel id={`${field.name}-label-${index}`}>{field.label}</InputLabel>
                    <Select
                      labelId={`${field.name}-label-${index}`}
                      name={field.name}
                      value={turma[field.name] || ''}
                      label={field.label}
                      onChange={e => handleTurmaChange(index, e)}
                    >
                      {field.options.map(option => (
                        <MenuItem key={option} value={option}>{option}</MenuItem>
                      ))}
                    </Select>
                  </>
                ) : (
                  <TextField
                    name={field.name}
                    label={field.label}
                    variant="outlined"
                    fullWidth
                    value={turma[field.name] || ''}
                    onChange={e => handleTurmaChange(index, e)}
                    type={field.type}
                    InputProps={field.inputProps}
                  />
                )}
              </FormControl>
            ))}
          </Stack>
          <Box alignSelf="flex-end">
            <Button variant="contained" color="primary" onClick={() => handleConfirmTurma(index)}>Confirmar</Button>
            <Button variant="contained" color="secondary" onClick={() => handleRemoveTurma(index)}>Remover</Button>
          </Box>
        </Paper>
      </Box>
    );
  };

  const inputFieldsSala = [
    { label: 'Nome da Sala', name: 'nome', type: 'text' },
    { label: 'Bloco', name: 'bloco', type: 'text' },
    { label: 'Capacidade', name: 'capacidade', type: 'number', inputProps: { min: 0 } },
    { label: 'Ambiente', name: 'ambiente', type: 'select', options: ['Sala Comum', 'Laboratório'] },
    { label: 'Disciplina', name: 'nomeDisciplina', type: 'select', options: ['Cálculo I', 'Engenharia de Software'] },
    { label: 'Ar Condicionado', name: 'ar', type: 'checkbox' },
    { label: 'Ventilador', name: 'ventilador', type: 'checkbox' },
    { label: 'Quadro Giz', name: 'quadroGiz', type: 'checkbox' },
    { label: 'Quadro Branco', name: 'quadroBranco', type: 'checkbox' },
    { label: 'Quadro de Vidro', name: 'quadroVidro', type: 'checkbox' },
  ];

  const inputFieldsTurma = [
    { label: 'Quantidade de Alunos', name: 'qtdAlunos', type: 'number', inputProps: { min: 0 } },
    { label: 'Período', name: 'periodo', type: 'number', inputProps: { min: 0 } },
    { label: 'Disciplina', name: 'nomeDisciplina', type: 'text' },
    { label: 'Horário', name: 'horario', type: 'text' },
    { label: 'Curso', name: 'curso', type: 'text' }
  ];

  // Tema claro e escuro personalizado
  const lightTheme = createTheme({
    palette: {
      mode: 'light',
    },
  });

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      background: {
        default: '#333',
      },
      text: {
        primary: '#fff',
      },
    },
  });

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Aqui você pode processar jsonData para extrair salas e turmas
      // Exemplo:
      const newSalas = [];
      const newTurmas = [];

      // Lógica para extrair dados do arquivo Excel (jsonData) e adicionar às salas e turmas
      jsonData.forEach((row) => {
        const [salaName, turmaName] = row;
        if (salaName && turmaName) {
          newSalas.push({ name: salaName });
          newTurmas.push({ name: turmaName });
        }
      });

      // Atualiza o estado com as novas salas e turmas extraídas do arquivo Excel
      setSalas([...salas, ...newSalas]);
      setTurmas([...turmas, ...newTurmas]);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Box
        sx={{
          backgroundColor: darkMode ? '#333' : '#fff',
          minHeight: '100vh',
          transition: 'background-color 0.3s, color 0.3s',
          paddingTop: '2rem',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      >
        <Container maxWidth={false}>
          <Box mb={2} textAlign="center">
            <Typography variant="h4" gutterBottom sx={{ color: darkMode ? '#fff' : '#fff' }}>
              Alocação de salas e turmas
            </Typography>
          </Box>
          <Box mb={2} textAlign="center">
            <Button variant="contained" color="primary" onClick={() => setDarkMode(prevMode => !prevMode)}>
              {darkMode ? 'Modo Claro' : 'Modo Escuro'}
            </Button>
          </Box>
          <Box mb={2} textAlign="center">
            <Box display="inline-block" mx={1}>
              <Button variant="contained" color="primary" onClick={handleAddSala}>
                Adicionar Sala
              </Button>
            </Box>
            <Box display="inline-block" mx={1}>
              <Button variant="contained" color="primary" onClick={handleAddTurma}>
                Adicionar Turma
              </Button>
            </Box>
            <Box display="inline-block" mx={1}>
              <label htmlFor="upload-file">
                <Button variant="contained" color="primary" component="span">
                  Receber Excel
                </Button>
                <input
                  id="upload-file"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </Box>
          </Box>
          <Box display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-between">
            {salas.map((sala, index) => renderSala(sala, index))}
          </Box>
          <Box display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-between">
            {turmas.map((turma, index) => renderTurma(turma, index))}
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App;
