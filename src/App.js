import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box, Paper, Select, MenuItem, InputLabel, FormControl, Checkbox, FormControlLabel, createTheme, ThemeProvider, Stack} from '@mui/material';
import $ from 'jquery';
import { writeFileXLSX, utils, writeFile, read } from "xlsx-js-style";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { setHours, setMinutes, format } from 'date-fns';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import Logo_Pas from '../src/Logo_Pas2.png'
import Background_ from '../src/background_.jpg'
import '../src/App.css'

function App() {
  const [salas, setSalas] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [isGerarVisible, setIsGerarVisible] = useState(false);

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

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
    const { name, value, type, checked } = e.target;
    const newTurmas = [...turmas];
  
    let newValue = (type === 'checkbox') ? checked : value;
  
    newTurmas[index] = { ...newTurmas[index], [name]: newValue };
  
    setTurmas(newTurmas);
  };
  
  const handleBaixarModelo = () => {

    const salaHeader = ["SALAS"];
    const salaInfos = ["Nome", "Bloco", "Capacidade", "Ambiente", "Ar Condicionado", "Ventilador", "Projetor", "Quadro de Vidro"];
    const turmaHeader = ["TURMAS"];
    const turmaInfos = ["Quantidade", "Período", "Curso", "Disciplina", "Ambiente", "Turno", "Horário início", "Horário fim", "Dia da semana", "Ar Condicionado", "Ventilador", "Projetor", "Quadro de Vidro"];
    const linhasVazias = new Array(20).fill([]);

    const planilhaExport = [
      salaHeader,
      salaInfos,
      ...linhasVazias,
      turmaHeader,
      turmaInfos
    ];

    var wb = utils.book_new();

    var ws = utils.json_to_sheet(planilhaExport, { skipHeader: true });

    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: salaInfos.length - 1 } },
      { s: { r: 22, c: 0 }, e: { r: 22, c: turmaInfos.length - 1 } },
    ];

    const cellStyle = {
      alignment: { horizontal: 'center', vertical: 'center' },
      border: {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' }
      }
    };

    Object.keys(ws).forEach(cell => {
      if (cell[0] === '!') return;
      ws[cell].s = cellStyle;
    });

    ws['A1'].s = { ...ws['A1'].s, font: { bold: true } };
    ws['A23'].s = { ...ws['A23'].s, font: { bold: true } };

    const salaInfosExemplo = ["Exemplo: T-15", "Exemplo: Bloco D", "Exemplo: 25", "Usar umas das opções: Sala Adequado ou Laboratório", "Usar uma das opções(Colocar numeração): [1] Tem [0] Não tem", "Usar uma das opções(Colocar numeração): [1] Tem [0] Não tem", "Usar uma das opções(Colocar numeração): [1] Tem [0] Não tem", " Usar uma das opções(Colocar numeração): [1] Tem [0] Não tem"];
    const turmaInfosExemplo = ["Exemplo: 25", "Exemplo: 6", "Exemplo: Ciência da Computação", "Exemplo: Engenharia de Software", "Usar uma das opções: Sala Comum ou Laboratório", "Usar uma das opções: Matutino, Vespertino ou Noturno", "Exemplo: 10:50", "Exemplo: 12:20", "Usar uma das opções: Segunda, Terça, Quarta, Quinta, Sexta, Sábado, Domingo", " Usar uma das opções(Colocar numeração): [1] Tem [0] Não tem", " Usar uma das opções(Colocar numeração): [1] Tem [0] Não tem", " Usar uma das opções(Colocar numeração): [1] Tem [0] Não tem", " Usar uma das opções(Colocar numeração): [1] Tem [0] Não tem"];
    
    for(let i = 0; i < salaInfos.length; i++) {
      ws[String.fromCharCode(65 + i) + '2'].c = [{a: "Instruções", t: salaInfosExemplo[i]}];
    }
    
    for(let i = 0; i < turmaInfos.length; i++) {
      ws[String.fromCharCode(65 + i) + '24'].c = [{a: "Instruções", t: turmaInfosExemplo[i]}];
    }

    utils.book_append_sheet(wb, ws, 'modelo');

    writeFile(wb, 'modelo.xlsx');

  };

  const handleUploadModelo = (event) => {

    const file = event.target.files[0];

    if (!file) {
      console.error("Nenhum arquivo selecionado.");
      return;
    }
  
    if (!file.name.endsWith('.xlsx')) {
      console.error("Formato de arquivo inválido. Por favor, selecione um arquivo .xlsx.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = read(bstr, { type: 'binary', raw: true });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      var data = utils.sheet_to_json(ws, { header: 1 });

      data = data.filter(row => row.some(cell => cell !== undefined && cell !== null && cell !== ''));

      const convertToTimeString = (num) => {
        if (typeof num === 'number') {
          const hours = Math.floor(num * 24);
          const minutes = Math.round((num * 24 - hours) * 60);
          return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        }
        return String(num);
      };

      let salas = [];
      let turmas = [];
      let isSala = true;

      for (let i = 0; i < data.length; i++) {
        if (isSala) {
          if (i > 1 && data[i][0] != "TURMAS" && data[i][0] !== 'undefined') {
            salas.push({
              nome: data[i][0],
              ambiente: data[i][3],
              ar: data[i][4],
              ventilador: data[i][5],
              capacidade: data[i][2],
              projetor: data[i][6],
              quadroVidro: data[i][7],
              bloco: data[i][1]
            });
          }
        } else {
          if (data[i][0] != 'Quantidade' && data[i][0] !== 'undefined') {

            var recursos = [];
            if (data[i][9] === 1) {
              recursos.push('ar');
            }
            if (data[i][10] === 1) {
              recursos.push('ventilador');
            }
            if (data[i][11] === 1) {
              recursos.push('projetor');
            }
            if (data[i][12] === 1) {
              recursos.push('quadroVidro');
            }

            turmas.push({
              qtdAlunos: data[i][0],
              periodo: data[i][1],
              disciplina: {
                nome: data[i][3],
                recursos: recursos,
                ambienteSalaAdequado: data[i][4]
              },
              horario: {
                inicio: convertToTimeString(data[i][6]),
                fim: convertToTimeString(data[i][7]),
                diaSemana: data[i][8],
                turno: data[i][5]
              },
              curso: {
                nome: data[i][2]
              }
            });
          }
        }

        if (data[i][0] === "TURMAS") {
          isSala = false;
          continue;
        }
      }

      const jsonCall = {
        turmas: turmas,
        salas: salas
      };
  
      $.ajax({
        url: 'http://localhost:8080/api/solucaoGulosa',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(jsonCall),
        success: function(data) {
          const wb = utils.book_new();

          const aulasPorSala = data.reduce((acc, item) => {
            const salaNome = item.sala.nome;
            if (!acc[salaNome]) {
              acc[salaNome] = [];
            }
            acc[salaNome].push({
              disciplina: item.disciplina.nome,
              inicio: item.horario.inicio.slice(0, -3),
              fim: item.horario.fim.slice(0, -3),
              diaDaSemana: item.horario.diaSemana,
              curso: item.curso.nome
            });
            return acc;
          }, {});

          for (let salaNome in aulasPorSala) {
            aulasPorSala[salaNome].sort((a, b) => {
              const inicioA = new Date(`1970/01/01 ${a.inicio}`);
              const inicioB = new Date(`1970/01/01 ${b.inicio}`);
              return inicioA - inicioB;
            });
          }

          var planilhaExport = [];
          var merges = [];
          var contador = 0;
          for (let salaNome in aulasPorSala) {
            var salaHeader = ["SALA - " + salaNome];
            var salaInfos = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
            planilhaExport.push(salaHeader)
            planilhaExport.push(salaInfos)
            merges.push({ s: { r: contador, c: 0 }, e: { r: contador, c: 6 } })
            contador += 10
            var horarioInfo1 = ["", "", "", "", "", "", ""];
            var horarioInfo2 = ["", "", "", "", "", "", ""];
            var horarioInfo3 = ["", "", "", "", "", "", ""];
            var horarioInfo4 = ["", "", "", "", "", "", ""];
            var horarioInfo5 = ["", "", "", "", "", "", ""];
            var horarioInfo6 = ["", "", "", "", "", "", ""];
            for (let turma in aulasPorSala[salaNome]) {
              if (aulasPorSala[salaNome][turma]['diaDaSemana'] === "Segunda") {
                if(horarioInfo1[0] === "") {
                  horarioInfo1[0] = aulasPorSala[salaNome][turma]['disciplina'] + "\n" + aulasPorSala[salaNome][turma]['curso'] + "\n" + aulasPorSala[salaNome][turma]['inicio'] + " - " + aulasPorSala[salaNome][turma]['fim'];
                } else if (horarioInfo2[0] === "") {
                  horarioInfo2[0] = aulasPorSala[salaNome][turma]['disciplina'] + "\n" + aulasPorSala[salaNome][turma]['curso'] + "\n" + aulasPorSala[salaNome][turma]['inicio'] + " - " + aulasPorSala[salaNome][turma]['fim'];
                } else if (horarioInfo3[0] === "") {
                  horarioInfo3[0] = aulasPorSala[salaNome][turma]['disciplina'] + "\n" + aulasPorSala[salaNome][turma]['curso'] + "\n" + aulasPorSala[salaNome][turma]['inicio'] + " - " + aulasPorSala[salaNome][turma]['fim'];
                } else if (horarioInfo4[0] === "") {
                  horarioInfo4[0] = aulasPorSala[salaNome][turma]['disciplina'] + "\n" + aulasPorSala[salaNome][turma]['curso'] + "\n" + aulasPorSala[salaNome][turma]['inicio'] + " - " + aulasPorSala[salaNome][turma]['fim'];
                } else if (horarioInfo5[0] === "") {
                  horarioInfo5[0] = aulasPorSala[salaNome][turma]['disciplina'] + "\n" + aulasPorSala[salaNome][turma]['curso'] + "\n" + aulasPorSala[salaNome][turma]['inicio'] + " - " + aulasPorSala[salaNome][turma]['fim'];
                } else if (horarioInfo6[0] === "") {
                  horarioInfo6[0] = aulasPorSala[salaNome][turma]['disciplina'] + "\n" + aulasPorSala[salaNome][turma]['curso'] + "\n" + aulasPorSala[salaNome][turma]['inicio'] + " - " + aulasPorSala[salaNome][turma]['fim'];
                }
              }
              if (aulasPorSala[salaNome][turma]['diaDaSemana'] === "Terça") {
                if(horarioInfo1[1] === "") {
                  horarioInfo1[1] = aulasPorSala[salaNome][turma]['disciplina'] + "\n" + aulasPorSala[salaNome][turma]['curso'] + "\n" + aulasPorSala[salaNome][turma]['inicio'] + " - " + aulasPorSala[salaNome][turma]['fim'];
                } else if (horarioInfo2[1] === "") {
                  horarioInfo2[1] = aulasPorSala[salaNome][turma]['disciplina'] + "\n" + aulasPorSala[salaNome][turma]['curso'] + "\n" + aulasPorSala[salaNome][turma]['inicio'] + " - " + aulasPorSala[salaNome][turma]['fim'];
                } else if (horarioInfo3[1] === "") {
                  horarioInfo3[1] = aulasPorSala[salaNome][turma]['disciplina'] + "\n" + aulasPorSala[salaNome][turma]['curso'] + "\n" + aulasPorSala[salaNome][turma]['inicio'] + " - " + aulasPorSala[salaNome][turma]['fim'];
                } else if (horarioInfo4[1] === "") {
                  horarioInfo4[1] = aulasPorSala[salaNome][turma]['disciplina'] + "\n" + aulasPorSala[salaNome][turma]['curso'] + "\n" + aulasPorSala[salaNome][turma]['inicio'] + " - " + aulasPorSala[salaNome][turma]['fim'];
                } else if (horarioInfo5[1] === "") {
                  horarioInfo5[1] = aulasPorSala[salaNome][turma]['disciplina'] + "\n" + aulasPorSala[salaNome][turma]['curso'] + "\n" + aulasPorSala[salaNome][turma]['inicio'] + " - " + aulasPorSala[salaNome][turma]['fim'];
                } else if (horarioInfo6[1] === "") {
                  horarioInfo6[1] = aulasPorSala[salaNome][turma]['disciplina'] + "\n" + aulasPorSala[salaNome][turma]['curso'] + "\n" + aulasPorSala[salaNome][turma]['inicio'] + " - " + aulasPorSala[salaNome][turma]['fim'];
                }
              }
              if (aulasPorSala[salaNome][turma]['diaDaSemana'] === "Quarta") {
                if(horarioInfo1[2] === "") {
                  horarioInfo1[2] = aulasPorSala[salaNome][turma]['disciplina'] + "\n" + aulasPorSala[salaNome][turma]['curso'] + "\n" + aulasPorSala[salaNome][turma]['inicio'] + " - " + aulasPorSala[salaNome][turma]['fim'];
                } else if (horarioInfo2[2] === "") {
                  horarioInfo2[2] = aulasPorSala[salaNome][turma]['disciplina'] + "\n" + aulasPorSala[salaNome][turma]['curso'] + "\n" + aulasPorSala[salaNome][turma]['inicio'] + " - " + aulasPorSala[salaNome][turma]['fim'];
                } else if (horarioInfo3[2] === "") {
                  horarioInfo3[2] = aulasPorSala[salaNome][turma]['disciplina'] + "\n" + aulasPorSala[salaNome][turma]['curso'] + "\n" + aulasPorSala[salaNome][turma]['inicio'] + " - " + aulasPorSala[salaNome][turma]['fim'];
                } else if (horarioInfo4[2] === "") {
                  horarioInfo4[2] = aulasPorSala[salaNome][turma]['disciplina'] + "\n" + aulasPorSala[salaNome][turma]['curso'] + "\n" + aulasPorSala[salaNome][turma]['inicio'] + " - " + aulasPorSala[salaNome][turma]['fim'];
                } else if (horarioInfo5[2] === "") {
                  horarioInfo5[2] = aulasPorSala[salaNome][turma]['disciplina'] + "\n" + aulasPorSala[salaNome][turma]['curso'] + "\n" + aulasPorSala[salaNome][turma]['inicio'] + " - " + aulasPorSala[salaNome][turma]['fim'];
                } else if (horarioInfo6[2] === "") {
                  horarioInfo6[2] = aulasPorSala[salaNome][turma]['disciplina'] + "\n" + aulasPorSala[salaNome][turma]['curso'] + "\n" + aulasPorSala[salaNome][turma]['inicio'] + " - " + aulasPorSala[salaNome][turma]['fim'];
                }
              }
              if (aulasPorSala[salaNome][turma]['diaDaSemana'] === "Quinta") {
                if(horarioInfo1[3] === "") {
                  horarioInfo1[3] = aulasPorSala[salaNome][turma]['disciplina'] + "\n" + aulasPorSala[salaNome][turma]['curso'] + "\n" + aulasPorSala[salaNome][turma]['inicio'] + " - " + aulasPorSala[salaNome][turma]['fim'];
                } else if (horarioInfo2[3] === "") {
                  horarioInfo2[3] = aulasPorSala[salaNome][turma]['disciplina'] + "\n" + aulasPorSala[salaNome][turma]['curso'] + "\n" + aulasPorSala[salaNome][turma]['inicio'] + " - " + aulasPorSala[salaNome][turma]['fim'];
                } else if (horarioInfo3[3] === "") {
                  horarioInfo3[3] = aulasPorSala[salaNome][turma]['disciplina'] + "\n" + aulasPorSala[salaNome][turma]['curso'] + "\n" + aulasPorSala[salaNome][turma]['inicio'] + " - " + aulasPorSala[salaNome][turma]['fim'];
                } else if (horarioInfo4[3] === "") {
                  horarioInfo4[3] = aulasPorSala[salaNome][turma]['disciplina'] + "\n" + aulasPorSala[salaNome][turma]['curso'] + "\n" + aulasPorSala[salaNome][turma]['inicio'] + " - " + aulasPorSala[salaNome][turma]['fim'];
                } else if (horarioInfo5[3] === "") {
                  horarioInfo5[3] = aulasPorSala[salaNome][turma]['disciplina'] + "\n" + aulasPorSala[salaNome][turma]['curso'] + "\n" + aulasPorSala[salaNome][turma]['inicio'] + " - " + aulasPorSala[salaNome][turma]['fim'];
                } else if (horarioInfo6[3] === "") {
                  horarioInfo6[3] = aulasPorSala[salaNome][turma]['disciplina'] + "\n" + aulasPorSala[salaNome][turma]['curso'] + "\n" + aulasPorSala[salaNome][turma]['inicio'] + " - " + aulasPorSala[salaNome][turma]['fim'];
                }
              }
              if (aulasPorSala[salaNome][turma]['diaDaSemana'] === "Sexta") {
                if(horarioInfo1[4] === "") {
                  horarioInfo1[4] = aulasPorSala[salaNome][turma]['disciplina'] + "\n" + aulasPorSala[salaNome][turma]['curso'] + "\n" + aulasPorSala[salaNome][turma]['inicio'] + " - " + aulasPorSala[salaNome][turma]['fim'];
                } else if (horarioInfo2[4] === "") {
                  horarioInfo2[4] = aulasPorSala[salaNome][turma]['disciplina'] + "\n" + aulasPorSala[salaNome][turma]['curso'] + "\n" + aulasPorSala[salaNome][turma]['inicio'] + " - " + aulasPorSala[salaNome][turma]['fim'];
                } else if (horarioInfo3[4] === "") {
                  horarioInfo3[4] = aulasPorSala[salaNome][turma]['disciplina'] + "\n" + aulasPorSala[salaNome][turma]['curso'] + "\n" + aulasPorSala[salaNome][turma]['inicio'] + " - " + aulasPorSala[salaNome][turma]['fim'];
                } else if (horarioInfo4[4] === "") {
                  horarioInfo4[4] = aulasPorSala[salaNome][turma]['disciplina'] + "\n" + aulasPorSala[salaNome][turma]['curso'] + "\n" + aulasPorSala[salaNome][turma]['inicio'] + " - " + aulasPorSala[salaNome][turma]['fim'];
                } else if (horarioInfo5[4] === "") {
                  horarioInfo5[4] = aulasPorSala[salaNome][turma]['disciplina'] + "\n" + aulasPorSala[salaNome][turma]['curso'] + "\n" + aulasPorSala[salaNome][turma]['inicio'] + " - " + aulasPorSala[salaNome][turma]['fim'];
                } else if (horarioInfo6[4] === "") {
                  horarioInfo6[4] = aulasPorSala[salaNome][turma]['disciplina'] + "\n" + aulasPorSala[salaNome][turma]['curso'] + "\n" + aulasPorSala[salaNome][turma]['inicio'] + " - " + aulasPorSala[salaNome][turma]['fim'];
                }
              }
              if (aulasPorSala[salaNome][turma]['diaDaSemana'] === "Sábado") {
                if(horarioInfo1[5] === "") {
                  horarioInfo1[5] = aulasPorSala[salaNome][turma]['disciplina'] + "\n" + aulasPorSala[salaNome][turma]['curso'] + "\n" + aulasPorSala[salaNome][turma]['inicio'] + " - " + aulasPorSala[salaNome][turma]['fim'];
                } else if (horarioInfo2[5] === "") {
                  horarioInfo2[5] = aulasPorSala[salaNome][turma]['disciplina'] + "\n" + aulasPorSala[salaNome][turma]['curso'] + "\n" + aulasPorSala[salaNome][turma]['inicio'] + " - " + aulasPorSala[salaNome][turma]['fim'];
                } else if (horarioInfo3[5] === "") {
                  horarioInfo3[5] = aulasPorSala[salaNome][turma]['disciplina'] + "\n" + aulasPorSala[salaNome][turma]['curso'] + "\n" + aulasPorSala[salaNome][turma]['inicio'] + " - " + aulasPorSala[salaNome][turma]['fim'];
                } else if (horarioInfo4[5] === "") {
                  horarioInfo4[5] = aulasPorSala[salaNome][turma]['disciplina'] + "\n" + aulasPorSala[salaNome][turma]['curso'] + "\n" + aulasPorSala[salaNome][turma]['inicio'] + " - " + aulasPorSala[salaNome][turma]['fim'];
                } else if (horarioInfo5[5] === "") {
                  horarioInfo5[5] = aulasPorSala[salaNome][turma]['disciplina'] + "\n" + aulasPorSala[salaNome][turma]['curso'] + "\n" + aulasPorSala[salaNome][turma]['inicio'] + " - " + aulasPorSala[salaNome][turma]['fim'];
                } else if (horarioInfo6[5] === "") {
                  horarioInfo6[5] = aulasPorSala[salaNome][turma]['disciplina'] + "\n" + aulasPorSala[salaNome][turma]['curso'] + "\n" + aulasPorSala[salaNome][turma]['inicio'] + " - " + aulasPorSala[salaNome][turma]['fim'];
                }
              }
              if (aulasPorSala[salaNome][turma]['diaDaSemana'] === "Domingo") {
                if(horarioInfo1[6] === "") {
                  horarioInfo1[6] = aulasPorSala[salaNome][turma]['disciplina'] + "\n" + aulasPorSala[salaNome][turma]['curso'] + "\n" + aulasPorSala[salaNome][turma]['inicio'] + " - " + aulasPorSala[salaNome][turma]['fim'];
                } else if (horarioInfo2[6] === "") {
                  horarioInfo2[6] = aulasPorSala[salaNome][turma]['disciplina'] + "\n" + aulasPorSala[salaNome][turma]['curso'] + "\n" + aulasPorSala[salaNome][turma]['inicio'] + " - " + aulasPorSala[salaNome][turma]['fim'];
                } else if (horarioInfo3[6] === "") {
                  horarioInfo3[6] = aulasPorSala[salaNome][turma]['disciplina'] + "\n" + aulasPorSala[salaNome][turma]['curso'] + "\n" + aulasPorSala[salaNome][turma]['inicio'] + " - " + aulasPorSala[salaNome][turma]['fim'];
                } else if (horarioInfo4[6] === "") {
                  horarioInfo4[6] = aulasPorSala[salaNome][turma]['disciplina'] + "\n" + aulasPorSala[salaNome][turma]['curso'] + "\n" + aulasPorSala[salaNome][turma]['inicio'] + " - " + aulasPorSala[salaNome][turma]['fim'];
                } else if (horarioInfo5[6] === "") {
                  horarioInfo5[6] = aulasPorSala[salaNome][turma]['disciplina'] + "\n" + aulasPorSala[salaNome][turma]['curso'] + "\n" + aulasPorSala[salaNome][turma]['inicio'] + " - " + aulasPorSala[salaNome][turma]['fim'];
                } else if (horarioInfo6[6] === "") {
                  horarioInfo6[6] = aulasPorSala[salaNome][turma]['disciplina'] + "\n" + aulasPorSala[salaNome][turma]['curso'] + "\n" + aulasPorSala[salaNome][turma]['inicio'] + " - " + aulasPorSala[salaNome][turma]['fim'];
                }
              }
            }

            planilhaExport.push(horarioInfo1);
            planilhaExport.push(horarioInfo2);
            planilhaExport.push(horarioInfo3);
            planilhaExport.push(horarioInfo4);
            planilhaExport.push(horarioInfo5);
            planilhaExport.push(horarioInfo6);

            const linhasVazias = new Array(2).fill([]);

            planilhaExport.push(...linhasVazias);

          }

          var ws = utils.json_to_sheet(planilhaExport, { skipHeader: true });

          ws['!merges'] = merges;

          const cellStyle = {
            alignment: { horizontal: 'center', vertical: 'center' },
            border: {
              top: { style: 'thin' },
              bottom: { style: 'thin' },
              left: { style: 'thin' },
              right: { style: 'thin' }
            }
          };

          Object.keys(ws).forEach(cell => {
            if (cell[0] === '!') return;
            ws[cell].s = cellStyle;
            var celula = ws[cell].v;
            if (celula === "Segunda" ||
                celula === "Terça" ||
                celula === "Quarta" ||
                celula === "Quinta" ||
                celula === "Sexta" ||
                celula === "Sábado" ||
                celula === "Domingo" ||
                (celula && celula.includes("SALA"))
            ) {
              ws[cell].s = {...ws[cell].s, font: { bold: true } };
            }
          });

          utils.book_append_sheet(wb, ws, "Horarios");
          writeFile(wb, "Horarios.xlsx");
        },
        error: function(error) {
          console.error('Erro ao realizar a solicitação:', error);
        }
      });

    };
    reader.readAsBinaryString(file);

  }

  const handleConfirmJson = () => {
    const salasList = salas;
    const turmasList = turmas;

    const salasJson  = [];
    salasList.forEach((sala, index) => {
      sala.ar = (sala.ar === true) ? 1 : 0;
      sala.ventilador = (sala.ventilador === true) ? 1 : 0;
      sala.projetor = (sala.projetor === true) ? 1 : 0;
      sala.quadroVidro = (sala.quadroVidro === true) ? 1 : 0;
      salasJson.push(
        {
          nome: sala.nome,
          ambiente: sala.ambiente,
          ar: sala.ar,
          ventilador: sala.ventilador,
          capacidade: sala.capacidade,
          projetor: sala.projetor,
          quadroVidro: sala.quadroVidro,
          bloco: sala.bloco
        }
      )
    })

    const turmasJson  = [];
    turmasList.forEach((turma, index) => {
      var recursos = [];
      if (turma.ar === true) {
        recursos.push('ar');
      }
      if (turma.ventilador === true) {
        recursos.push('ventilador');
      }
      if (turma.projetor === true) {
        recursos.push('projetor');
      }
      if (turma.quadroVidro === true) {
        recursos.push('quadroVidro');
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
            inicio: format(turma.horarioInicio, 'HH:mm'),
            fim: format(turma.horarioFim, 'HH:mm'),
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
      projetor: false,
      quadroVidro: false,
      bloco: '',
    }]);

    setIsGerarVisible(true);
  };

  const handleAddTurma = () => {
    setTurmas([...turmas, {
      qtdAlunos: 0,
      periodo: 0,
      disciplinaNome: "",
      ambienteSalaAdequado: "",
      horarioInicio: "",
      horarioFim: "",
      turno: "",
      nomeCurso: "",
      ventilador: false,
      capacidade: 0,
      projetor: false,
      quadroVidro: false,
      ar: false,
    }]);
    setIsGerarVisible(true);
  };

  const handleRemoveSala = (index) => {
    const updatedSalas = [...salas];
    const updatedTurmas = [...turmas];
    updatedSalas.splice(index, 1);
    setSalas(updatedSalas);

    if (updatedSalas.length === 0 && updatedTurmas.length === 0) {
      setIsGerarVisible(false);
    }
  };

  const handleRemoveTurma = (index) => {
    const updatedTurmas = [...turmas];
    const updatedSalas = [...salas];
    updatedTurmas.splice(index, 1);
    setTurmas(updatedTurmas);

    if (updatedSalas.length === 0 && updatedTurmas.length === 0) {
      setIsGerarVisible(false);
    }
  };

  const renderSala = (sala, index) => {
    return (
      <Box key={index} mb={2} width="47vw">
        <Paper elevation={3} style={{ padding: '20px', backgroundColor: darkMode ? '#333' : '#fff', color: darkMode ? '#fff' : '#333', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Typography variant="h5" gutterBottom textAlign={'center'} className="comfortaa-text">Sala {index + 1}</Typography>
          <Stack direction="column" spacing={2}>
            <Stack direction="row" spacing={2}>
              {inputFieldsSala.filter(field => field.type === 'checkbox' || field.type === 'timepicker').map(field => (
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
                  ) : (
                    <TimePicker
                      selectedTime={sala[field.name]}
                      setSelectedTime={(time) => handleTimeChange(index, time, field.name)}
                      placeholder={field.label}
                      filterTime={sala.horarioFilter}
                    />
                  )}
                </FormControl>
              ))}
            </Stack>
            <Stack direction="row" spacing={2}>
              {inputFieldsSala.filter(field => field.type !== 'checkbox' && field.type !== 'timepicker').map(field => (
                <FormControl key={field.name} fullWidth>
                  {field.type === 'select' ? (
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
                    field.type === 'number' ? (
                      <TextField
                        name={field.name}
                        label={field.label}
                        variant="outlined"
                        fullWidth
                        value={sala[field.name] || ''}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (!isNaN(value) && value >= 0) {
                            handleSalaChange(index, e);
                          }
                        }}
                        type={field.type}
                        InputProps={field.inputProps}
                      />
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
                    )
                  )}
                </FormControl>
              ))}
            </Stack>
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
    <Box key={index} mb={2} width="47vw">
      <Paper elevation={3} style={{ padding: '20px', backgroundColor: darkMode ? '#333' : '#fff', color: darkMode ? '#fff' : '#333', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Typography variant="h5" gutterBottom textAlign={'center'} className="comfortaa-text">Turma {index + 1}</Typography>
        <Stack direction="column" spacing={2}>
          <Stack direction="row" spacing={2}>
            {inputFieldsTurma.filter(field => field.type === 'checkbox' || field.type === 'timepicker').map(field => (
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
                ) : (
                  <TimePicker
                    selectedTime={turma[field.name]}
                    setSelectedTime={(time) => handleTimeChange(index, time, field.name)}
                    placeholder={field.label}
                    filterTime={turma.horarioFilter}
                  />
                )}
              </FormControl>
            ))}
          </Stack>
          <Stack direction="row" spacing={2}>
            {inputFieldsTurma.filter(field => field.type !== 'checkbox' && field.type !== 'timepicker').map(field => (
              <FormControl key={field.name} fullWidth>
                {field.type === 'select' ? (
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
                  field.type === 'number' ? (
                    <TextField
                      name={field.name}
                      label={field.label}
                      variant="outlined"
                      fullWidth
                      value={turma[field.name] || ''}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value) && value >= 0) {
                          handleTurmaChange(index, e);
                        }
                      }}
                      type={field.type}
                      InputProps={field.inputProps}
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
                  )
                )}
              </FormControl>
            ))}
          </Stack>
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
        timeIntervals={5}
        timeCaption="Time"
        dateFormat="HH:mm"
        timeFormat="HH:mm"
        placeholderText={placeholder}
        minTime={setHours(setMinutes(new Date(), 0), 0)}
        maxTime={setHours(setMinutes(new Date(), 59), 23)}
        customInput={(
          <input
            type="text"
            value={selectedTime}
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
    { label: 'Projetor', name: 'projetor', type: 'checkbox' },
    { label: 'Quadro de Vidro', name: 'quadroVidro', type: 'checkbox' },
  ];

  const inputFieldsTurma = [
    { label: 'Quantidade de Alunos', name: 'qtdAlunos', type: 'number', inputProps: { min: 0 } },
    { label: 'Período', name: 'periodo', type: 'number', inputProps: { min: 0 } },
    { label: 'Curso', name: 'nomeCurso', type: 'text' },
    { label: 'Disciplina', name: 'disciplinaNome', type: 'text' },
    { label: 'Ambiente adequado', name: 'ambienteSalaAdequado', type: 'select', options: ['Sala Comum', 'Laboratório'] },
    { label: 'Turno', name: 'turno', type: 'select', options: ['Matutino','Vespertino', 'Noturno'] },
    { label: 'Horário de Início', name: 'horarioInicio', type: 'timepicker' },
    { label: 'Horário de Fim', name: 'horarioFim', type: 'timepicker' },
    { label: 'Dia da semana', name: 'diaSemana', type: 'select', 
    options: ['Segunda','Terça','Quarta','Quinta', 'Sexta', 'Sábado',] },
    { label: 'Ar Condicionado', name: 'ar', type: 'checkbox' },
    { label: 'Ventilador', name: 'ventilador', type: 'checkbox' },
    { label: 'Projetor', name: 'projetor', type: 'checkbox' },
    { label: 'Quadro de Vidro', name: 'quadroVidro', type: 'checkbox' }
  ];

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
      <Box 
        sx={{ 
          backgroundImage: `url(${Background_})`, // Definindo a imagem de fundo
          backgroundColor: darkMode ? '#333' : '#fff', 
          minHeight: '100vh', 
          transition: 'background-color 0.3s, color 0.3s', 
          paddingTop: '2rem',
          backgroundSize: 'cover', // Ajustando o tamanho da imagem de fundo
          backgroundPosition: 'center', // Ajustando a posição da imagem de fundo
          backgroundAttachment: 'fixed' // Mantendo a imagem de fundo fixa
        }}
      >
        <Container maxWidth={false}>
          <img src={Logo_Pas} alt="Logo" style={{ position: 'absolute', top: 0, left: 1,  width: '15%', height: '140px',margin: 20 }} />
          <Box mb={2} textAlign="center">
          <div>
            <style>
              {`
                @import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@300..700&display=swap');
                .comfortaa-text {
                  font-family: 'Comfortaa', sans-serif;
                  font-optical-sizing: auto;
                  font-weight: 1000; 
                  font-style: normal;
                }
              `}
            </style>
          <Typography variant="h3" gutterBottom className="comfortaa-text" style={{ color:'#fff'}}>
            Alocação de salas e turmas
          </Typography>
          </div>
          </Box>
          <Box mb={2} textAlign="center">
          <label className="switch">
              <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(prevMode => !prevMode)} />
              <span className="slider"></span>
              <Typography variant="button" className="comfortaa-text" style={{ color: darkMode ? '#fff' : '#000' }}>
              </Typography>
            </label>
          </Box>
          <Box mb={2} textAlign="center">
            <Box display="inline-block" mx={1}>
              <Button className="comfortaa-text" variant="contained" color="primary" onClick={handleAddSala}>
                Adicionar Sala ({salas.length})
              </Button>
            </Box>
            <Box display="inline-block" mx={1}>
              <Button className="comfortaa-text" variant="contained" color="primary" onClick={handleAddTurma}>
                Adicionar Turma ({turmas.length})
              </Button>
            </Box>
          </Box>

          <Box mb={2} textAlign="center">
            <Box display="inline-flex" mx={1}>
              <Button variant="contained" color="success" onClick={() => handleBaixarModelo()}>Baixar modelo</Button>
              <Box mx={2} textAlign="center">
                <Button
                  component="label"
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                >
                  Upload modelo
                  <VisuallyHiddenInput type="file" onChange={handleUploadModelo}/>
                </Button>
              </Box>
            </Box>
          </Box>
          <Box display="flex" flexDirection="row" justifyContent="space-between">
            <Box display="flex" flexDirection="column">
              {salas.map((sala, index) => renderSala(sala, index))}
            </Box>
            <Box display="flex" flexDirection="column">
              {turmas.map((turma, index) => renderTurma(turma, index))}
            </Box>
          </Box>
          <Box textAlign="center" mx={1}>
            {isGerarVisible && (
              <Button variant="contained" color="primary" onClick={() => handleConfirmJson()}>Gerar planilha</Button>
            )}
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;