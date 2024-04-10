import React, { useState } from 'react';
import './App.css';

function App() {
  const [salas, setSalas] = useState([]);
  const [nome, setNome] = useState('');
  const [turma, setTurma] = useState('');
  const [professor, setProfessor] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newSala = {
      id: salas.length + 1,
      nome: nome,
      turma: turma,
      professor: professor
    };
    setSalas([...salas, newSala]);
    setNome('');
    setTurma('');
    setProfessor('');
  };

  return (
    <div className="app">
      <h1>Lista de Salas</h1>
      <div className="sala-form">
        <form onSubmit={handleSubmit}>
          <label htmlFor="nome">Nome da Sala:</label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <label htmlFor="turma">Turma:</label>
          <input
            type="text"
            id="turma"
            value={turma}
            onChange={(e) => setTurma(e.target.value)}
          />

          <label htmlFor="professor">Professor:</label>
          <input
            type="text"
            id="professor"
            value={professor}
            onChange={(e) => setProfessor(e.target.value)}
          />

          <button type="submit">Adicionar Sala</button>
        </form>
      </div>
      <div className="sala-list">
        {salas.map((sala) => (
          <div key={sala.id} className="sala-item">
            <h2>{sala.nome}</h2>
            <p>Turma: {sala.turma}</p>
            <p>Professor: {sala.professor}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
import React, { useState } from 'react';
import './App.css';

function App() {
  const [salas, setSalas] = useState([]);
  const [nome, setNome] = useState('');
  const [turma, setTurma] = useState('');
  const [professor, setProfessor] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newSala = {
      id: salas.length + 1,
      nome: nome,
      turma: turma,
      professor: professor
    };
    setSalas([...salas, newSala]);
    setNome('');
    setTurma('');
    setProfessor('');
  };

  return (
    <div className="app">
      <h1>Lista de Salas</h1>
      <div className="sala-form">
        <form onSubmit={handleSubmit}>
          <label htmlFor="nome">Nome da Sala:</label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <label htmlFor="turma">Turma:</label>
          <input
            type="text"
            id="turma"
            value={turma}
            onChange={(e) => setTurma(e.target.value)}
          />

          <label htmlFor="professor">Professor:</label>
          <input
            type="text"
            id="professor"
            value={professor}
            onChange={(e) => setProfessor(e.target.value)}
          />

          <button type="submit">Adicionar Sala</button>
        </form>
      </div>
      <div className="sala-list">
        {salas.map((sala) => (
          <div key={sala.id} className="sala-item">
            <h2>{sala.nome}</h2>
            <p>Turma: {sala.turma}</p>
            <p>Professor: {sala.professor}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
