# Alocação de Salas e Turmas

Este projeto é uma aplicação web para gerenciar a alocação de salas e turmas, permitindo adicionar, editar, remover e importar dados de salas e turmas a partir de um arquivo Excel. A aplicação possui uma interface intuitiva e suporte a temas claro e escuro.

## Funcionalidades

- **Gerenciamento de Salas**
  - Adicionar novas salas.
  - Editar informações das salas (nome, bloco, capacidade, ambiente, disciplina, ar condicionado, ventilador, quadros).
  - Remover salas.

- **Gerenciamento de Turmas**
  - Adicionar novas turmas.
  - Editar informações das turmas (quantidade de alunos, período, disciplina, horário, curso).
  - Remover turmas.

- **Importação de Dados**
  - Importar dados de um arquivo Excel para preencher listas de salas e turmas.

- **Interface do Usuário**
  - Interface responsiva e amigável para gerenciar salas e turmas.
  - Suporte a temas claro e escuro.

## Tecnologias Utilizadas

- **Back-end:** Spring-Boot

- **Front-end:** React
- **Bibliotecas:**
  - `@mui/material` para componentes de UI
  - `XLSX` para leitura de arquivos Excel

## Pré-requisitos

- **Back-end:** `Java 17` e `Maven 3` instalados globalmente na sua máquina.
- **Front-end:** `node` e `npm` instalados globalmente na sua máquina.

## Instalação

### Back-End

1. Clone o repositório:
   ```bash
   git clone https://github.com/marcub/alocaai-api.git
   
2. Em seu terminal, navegue até o diretório do projeto.
   
3. Instale as dependências:
  `mvn clean install`
  
4. Inicie a aplicação:
  `mvn spring-boot:run`

### Front-End

1. Clone o repositório:
   ```bash
   git clone https://github.com/sndr/Allocation.git
   
2. Em seu terminal, navegue até o diretório do projeto.
   
3. Instale as dependências:
  `npm install`
  
4. Inicie a aplicação:
  `npm start`

## Uso

0.Subir aplicação
 - Após subir a aplicação vai abrir o [ http://localhost:3000 ](http://localhost:3000)

1.Adicionar Sala
  - Clique no botão "Adicionar Sala".
  - Preencha os campos do formulário da nova sala.
  - Clique em "Confirmar" para salvar a sala.
    
2.Editar Sala
  - Edite os campos de uma sala existente.
    
3.Remover Sala
  - Clique em "Remover" para excluir uma sala.
    
4.Adicionar Turma
  - Clique no botão "Adicionar Turma".
  - Preencha os campos do formulário da nova turma.
  - Clique em "Confirmar" para salvar a turma.
    
5.Editar Turma
  - Edite os campos de uma turma existente.
    
6.Remover Turma
  - Clique em "Remover" para excluir uma turma.
    
7.Importar Excel
  - Baixe o modelo e preencha as informações de acordo com as instruções nos comentários.
  - Clique no botão "Upload modelo".
  - Selecione um arquivo xlsx do modelo editado.
  - Os dados do arquivo serão importados e novas salas e turmas serão adicionadas à lista.
    
8.Alternar Tema
 - Clique no botão "Modo Claro" ou "Modo Escuro" para alternar entre os temas.

9.Gerar Planilha
 - Aperte o botão "Gerar planilha"
   
## Estrutura do Código
O código principal está no arquivo App.js e utiliza React para gerenciar o estado e a interface do usuário. As bibliotecas @mui/material e XLSX são usadas para os componentes de UI e para a importação de dados de arquivos Excel, respectivamente.

# Componentes Principais
  - Componente principal que gerencia o estado das salas e turmas.
  - Usa localStorage para persistência de dados.
  - Contém funções para adicionar, editar, remover e importar salas e turmas.
  - Tema Claro e Escuro
  - Define temas personalizados para a interface.
  - Alterna entre temas claro e escuro com base no estado darkMode.
  - Backend e Endpoints
    
## Repositório do Backend
O repositório do backend pode ser encontrado em [marcub/alocaai-api](https://github.com/marcub/alocaai-api). 
Este repositório contém a implementação dos endpoints descritos acima, utilizando uma stack tecnológica adequada (por exemplo, Node.js com Express, ou outra de sua preferência).

## Contribuição
### Fork o repositório.
- Crie uma nova branch:
`git checkout -b minha-feature`
Faça suas modificações.
### Commit suas mudanças:
`git commit -m 'Adicionar nova feature'`
### Push para a branch:
`git push origin minha-feature`
Abra um Pull Request.

## Contato
Se tiver alguma dúvida ou sugestão, sinta-se à vontade para abrir uma issue ou entrar em contato.

### Contribuidores

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/Davi-Andrade-30">
        <img src="https://avatars.githubusercontent.com/u/84862726?v=4" width="100px;" alt=""/>
      </a>
      <br />
      <sub><b>Davi</b></sub>
      <br />
    </td>
    <td align="center">
      <a href="https://github.com/LuciosSB">
        <img src="https://avatars.githubusercontent.com/u/124175033?v=4" width="100px;" alt=""/>
      </a>
      <br />
      <sub><b>Lucas</b></sub>
      <br />
    <td align="center">
      <a href="https://github.com/marcub">
        <img src="https://avatars.githubusercontent.com/u/42722469?v=4" width="100px;" alt=""/>
      </a>
      <br />
      <sub><b>Marcus</b></sub>
      <br />
  <td align="center">
      <a href="https://github.com/RhayaneFreitas">
        <img src="https://avatars.githubusercontent.com/u/134341915?v=4" width="100px;" alt=""/>
      </a>
      <br />
      <sub><b>Rhayane</b></sub>
      <br />
   <td align="center">
      <a href="https://github.com/Coluno">
        <img src="https://avatars.githubusercontent.com/u/106896178?v=4" width="100px;" alt=""/>
      </a>
      <br />
      <sub><b>Gabriel</b></sub>
      <br />
    </td>
   <td align="center">
      <a href="https://github.com/Rafaelpbnc16">
        <img src="https://avatars.githubusercontent.com/u/170088679?v=4" width="100px;" alt=""/>
      </a>
      <br />
      <sub><b>Rafael</b></sub>
      <br />
    </td>
  <td align="center">
      <a href="https://github.com/juliobrbsa">
        <img src="https://avatars.githubusercontent.com/u/143511071?v=4" width="100px;" alt=""/>
      </a>
      <br />
      <sub><b>Julio</b></sub>
      <br />
    </td>
  <td align="center">
      <a href="https://github.com/gilberto450">
        <img src="https://avatars.githubusercontent.com/u/144842238?v=4" width="100px;" alt=""/>
      </a>
      <br />
      <sub><b>Gilberto</b></sub>
      <br />
    </td>
  </tr>
</table>
<!-- ALL-CONTRIBUTORS-LIST:END -->

