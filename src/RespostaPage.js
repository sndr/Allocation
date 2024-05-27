import React, { useState, useEffect } from 'react';

function RespostaPage(nomeDaDisciplina) {
  const [resposta, setResposta] = useState(null);
  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const apiUrl = `https://rickandmortyapi.com/api/character${nomeDaDisciplina}`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        // Atualizando o estado com a resposta da API
        setResposta(data);
      } catch (error) {
        console.error('Erro ao buscar dados da API:', error);
        // Caso ocorra algum erro na requisição, você pode tratar aqui
        setResposta('Erro ao buscar dados da API');
      }
    };

    fetchAPI();
  }, []);

  return (
    <div>
      <h1>Resposta da API</h1>
      {resposta ? (
        <pre>{JSON.stringify(resposta, null, 2)}</pre>
      ) : (
        <p>Carregando...</p>
      )}
    </div>
  );
}

export default RespostaPage;
