import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box, Paper, Select, MenuItem, InputLabel, FormControl, Checkbox, FormControlLabel, createTheme, ThemeProvider, Stack } from '@mui/material';
import $ from 'jquery';
import { writeFileXLSX, utils } from "xlsx";

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
    let value = (type === 'checkbox') ? e.target.checked : e.target.value;

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

  const handleConfirmJson = () => {
    const salasList = salas;
    const turmasList = turmas;

    const salasJson  = [];
    salasList.forEach((sala, index) => {
      sala.ar = (sala.ar === true) ? 1 : 0;
      sala.ventilador = (sala.ventilador === true) ? 1 : 0;
      sala.quadroBranco = (sala.quadroBranco === true) ? 1 : 0;
      sala.quadroGiz = (sala.quadroGiz === true) ? 1 : 0;
      sala.quadroVidro = (sala.quadroVidro === true) ? 1 : 0;
      salasJson.push(
        {
          nome: sala.nome,
          ambiente: sala.ambiente,
          ar: sala.ar,
          ventilador: sala.ventilador,
          capacidade: sala.capacidade,
          quadroGiz: sala.quadroGiz,
          quadroBranco: sala.quadroBranco,
          quadroVidro: sala.quadroVidro,
          bloco: sala.bloco
        }
      )
    })

    const turmasJson  = [];
    turmasList.forEach((turma, index) => {
      var recursos = [];
      if (turma.ar === true) {
        recursos.push('Ar Condicionado');
      }
      if (turma.ventilador === true) {
        recursos.push('Ventilador');
      }
      if (turma.quadroBranco === true) {
        recursos.push('Quandro Branco');
      }
      if (turma.quadroGiz === true) {
        recursos.push('Quadro Giz');
      }
      if (turma.quadroVidro === true) {
        recursos.push('Quadro Vidro');
      }
      turmasJson.push(
        {
          qtdAlunos: turma.capacidade,
          periodo: turma.periodo,
          disciplina: {
            nome: turma.disciplinaNome,
            recursos: recursos,
            ambienteSalaAdequado: turma.ambienteSalaAdequado,
          },
          horario: {
            horario: turma.horario,
            diaSemana: turma.diaSemana,
            turno: turma.turno,
          },
          curso: {
            nome: turma.nomeCurso,
          }
        }
      )
    })

    const jsonCall = {
      turmas: turmasJson,
      salas: salasJson
    };

    $.ajax({
      url: 'http://localhost:8080/api/solucaoGulosa',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(jsonCall),
      success: function(data) {
        const wb = utils.book_new();

        const aulas = data.map(item => ({
            Sala: item.sala.nome,
            Disciplina: item.disciplina.nome,
            Horario: `${item.horario.diaSemana} - ${item.horario.horario}`,
            Curso: item.curso.nome
        }));

        const ws = utils.json_to_sheet(aulas);
        utils.book_append_sheet(wb, ws, "Horarios");
        writeFileXLSX(wb, "Horarios.xlsx");
      },
      error: function(error) {
        console.error('Erro ao realizar a solicitação:', error);
      }
    });
    
  };

  const handleAddSala = () => {
    setSalas([...salas, {
      nome: '',
      ambiente: '',
      ar: false,
      ventilador: false,
      capacidade: 0,
      quadroGiz: false,
      quadroBranco: false,
      quadroVidro: false,
      bloco: '',
    }]);
  };

  const handleAddTurma = () => {
    setTurmas([...turmas, {
      qtdAlunos: 0,
      periodo: 0,
      disciplinaNome: "",
      ambienteSalaAdequado: "",
      horario: "",
      diaSemana: "",
      turno: "",
      nomeCurso: "",
      ventilador: false,
      capacidade: 0,
      quadroGiz: false,
      quadroBranco: false,
      quadroVidro: false,
      ar: false,
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
    { label: 'Ar Condicionado', name: 'ar', type: 'checkbox' },
    { label: 'Ventilador', name: 'ventilador', type: 'checkbox' },
    { label: 'Quadro Giz', name: 'quadroGiz', type: 'checkbox' },
    { label: 'Quadro Branco', name: 'quadroBranco', type: 'checkbox' },
    { label: 'Quadro de Vidro', name: 'quadroVidro', type: 'checkbox' },
  ];

  const inputFieldsTurma = [
    { label: 'Quantidade de Alunos', name: 'qtdAlunos', type: 'number', inputProps: { min: 0 } },
    { label: 'Período', name: 'periodo', type: 'number', inputProps: { min: 0 } },
    { label: 'Disciplina', name: 'disciplinaNome', type: 'text' },
    { label: 'Ambiente adequado', name: 'ambienteSalaAdequado', type: 'select', options: ['Sala Comum', 'Laboratório'] },
    { label: 'Horário', name: 'horario', type: 'select', 
    options: [
      '07:00 - 07:50',
      '07:50 - 08:40',
      '08:55 - 09:45',
      '09:45 - 10:35',
      '10:40 - 11:30',
      '11:30 - 12:20',
      '13:00 - 13:50',
      '13:50 - 14:40',
      '14:55 - 15:45',
      '15:45 - 16:35',
      '16:40 - 17:30',
      '17:30 - 18:20',
    ] },
    { label: 'Dia da semana', name: 'diaSemana', type: 'select', 
    options: [
      'Segunda',
      'Terça',
      'Quarta',
      'Quinta',
      'Sexta',
      'Sábado',
    ] },
    { label: 'Turno', name: 'turno', type: 'select', options: [
      'Matutino',
      'Vespertino',
    ] },
    { label: 'Curso', name: 'nomeCurso', type: 'text' },
    { label: 'Ar Condicionado', name: 'ar', type: 'checkbox' },
    { label: 'Ventilador', name: 'ventilador', type: 'checkbox' },
    { label: 'Quadro Giz', name: 'quadroGiz', type: 'checkbox' },
    { label: 'Quadro Branco', name: 'quadroBranco', type: 'checkbox' },
    { label: 'Quadro de Vidro', name: 'quadroVidro', type: 'checkbox' }
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

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Box sx={{ backgroundColor: darkMode ? '#333' : '#fff', minHeight: '100vh', transition: 'background-color 0.3s, color 0.3s', paddingTop: '2rem' }}>
        <Container maxWidth={false}>
          <Box mb={2} textAlign="center">
            <Typography variant="h4" gutterBottom>
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
          </Box>
          <Box display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-between">
            {salas.map((sala, index) => renderSala(sala, index))}
          </Box>
          <Box display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-between">
            {turmas.map((turma, index) => renderTurma(turma, index))}
          </Box>
        </Container>
          <Box textAlign="center" mx={1}>
            <Button variant="contained" color="primary" onClick={() => handleConfirmJson()}>Gerar planilha</Button>
          </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
