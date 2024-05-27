import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box, Paper, Select, MenuItem, InputLabel, FormControl, Checkbox, FormControlLabel, createTheme, ThemeProvider, Stack } from '@mui/material';
import $ from 'jquery';
import '../src/App.css';
import { writeFileXLSX, utils } from "xlsx";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { setHours, setMinutes } from 'date-fns';

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
    const { name, value } = e.target;
    const newTurmas = [...turmas];
    newTurmas[index] = { ...newTurmas[index], [name]: value };
  
    if (name === 'turno') {
      let horarioInicio, horarioFim;
      let filterTime = {};
      switch (value) {
        case 'Matutino':
          horarioInicio = setHours(setMinutes(new Date(), 0), 7);
          horarioFim = setHours(setMinutes(new Date(), 0), 12);
          filterTime = {
            start: setHours(setMinutes(new Date(), 0), 7),
            end: setHours(setMinutes(new Date(), 0), 12)
          };
          break;
        case 'Vespertino':
          horarioInicio = setHours(setMinutes(new Date(), 0), 13);
          horarioFim = setHours(setMinutes(new Date(), 0), 17);
          filterTime = {
            start: setHours(setMinutes(new Date(), 0), 13),
            end: setHours(setMinutes(new Date(), 0), 17)
          };
          break;
        case 'Noturno':
          horarioInicio = setHours(setMinutes(new Date(), 0), 18);
          horarioFim = setHours(setMinutes(new Date(), 0), 22);
          filterTime = {
            start: setHours(setMinutes(new Date(), 0), 18),
            end: setHours(setMinutes(new Date(), 0), 22)
          };
          break;
        default:
          break;
      }
      newTurmas[index].horarioInicio = horarioInicio;
      newTurmas[index].horarioFim = horarioFim;
      newTurmas[index].horarioFilter = filterTime;
    }
  
    setTurmas(newTurmas);
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


  const handleTimeChange = (index, time, type) => {
    const newTurmas = [...turmas];
    newTurmas[index][type] = time;
    setTurmas(newTurmas);
  };
  
  const renderTurma = (turma, index) => (
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
              ) : field.type === 'timepicker' ? (
                <TimePicker
                  selectedTime={turma[field.name]}
                  setSelectedTime={(time) => handleTimeChange(index, time, field.name)}
                  placeholder={field.label}
                  filterTime={turma.horarioFilter}
                   // Estilos diretamente no retorno JSX// Corrigido para usar horarioFilter da turma
                />
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

  const TimePicker = ({ selectedTime, setSelectedTime, placeholder, filterTime }) => (
    <div style={{ margin: '0 10px' }}> 
      <DatePicker
        selected={selectedTime}
        onChange={setSelectedTime}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={15}
        timeCaption="Time"
        dateFormat="h:mm aa"
        placeholderText={placeholder}
        minTime={filterTime && filterTime.start ? filterTime.start : setHours(setMinutes(new Date(), 0), 0)}
        maxTime={filterTime && filterTime.end ? filterTime.end : setHours(setMinutes(new Date(), 0), 23)}
        customInput={(
          <input
            type="text"
            value={selectedTime ? selectedTime.toLocaleTimeString('pt-BR', { hour: 'numeric', minute: '2-digit' }) : ''}
            placeholder={placeholder}
            readOnly
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: '#fff',
              color: '#333',
              fontSize: '16px',
              lineHeight: '1.5',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
          />
        )}
      />
    </div>
  );
  
  
  
  

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
    { label: 'Curso', name: 'nomeCurso', type: 'text' },
    { label: 'Disciplina', name: 'disciplinaNome', type: 'text' },
    { label: 'Ambiente adequado', name: 'ambienteSalaAdequado', type: 'select', options: ['Sala Comum', 'Laboratório'] },
    { label: 'Turno', name: 'turno', type: 'select', options: [
      'Matutino',
      'Vespertino',
      'Noturno'
    ] },
    { label: 'Horário de Início', name: 'horarioInicio', type: 'timepicker' },
    { label: 'Horário de Fim', name: 'horarioFim', type: 'timepicker' },
    { label: 'Dia da semana', name: 'diaSemana', type: 'select', 
    options: [
      'Segunda',
      'Terça',
      'Quarta',
      'Quinta',
      'Sexta',
      'Sábado',
    ] },
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
