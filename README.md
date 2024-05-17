# Alocação de Salas e Turmas

Este projeto é uma aplicação web para gerenciar a alocação de salas e turmas, permitindo adicionar, editar, remover e importar dados de salas e turmas a partir de um arquivo Excel. A aplicação possui uma interface intuitiva e suporte a temas claro e escuro.

## Funcionalidades

- **Gerenciamento de Salas**
  - Adicionar novas salas.
  - Editar informações das salas (nome, bloco, capacidade, ambiente, disciplina, ar condicionado, ventilador, quadros).
  - Remover salas.
  - Armazenar e recuperar informações das salas do `localStorage`.

- **Gerenciamento de Turmas**
  - Adicionar novas turmas.
  - Editar informações das turmas (quantidade de alunos, período, disciplina, horário, curso).
  - Remover turmas.
  - Armazenar e recuperar informações das turmas do `localStorage`.

- **Importação de Dados**
  - Importar dados de um arquivo Excel para preencher listas de salas e turmas.

- **Interface do Usuário**
  - Interface responsiva e amigável para gerenciar salas e turmas.
  - Suporte a temas claro e escuro.

## Tecnologias Utilizadas

- **Frontend:** React
- **Bibliotecas:**
  - `@mui/material` para componentes de UI
  - `XLSX` para leitura de arquivos Excel

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/nome-do-repositorio.git
2.Navegue até o diretório do projeto:
   `cd nome-do-repositorio`
3.Instale as dependências:
  `npm install`
4.Inicie a aplicação:
  `npm start`

## Uso

1.Adicionar Sala
  - Clique no botão "Adicionar Sala".
  - Preencha os campos do formulário da nova sala.
  - Clique em "Confirmar" para salvar a sala.
    
2.Editar Sala
  - Edite os campos de uma sala existente.
  - As mudanças serão salvas automaticamente no `localStorage`.
    
3.Remover Sala
  - Clique em "Remover" para excluir uma sala.
    
4.Adicionar Turma
  - Clique no botão "Adicionar Turma".
  - Preencha os campos do formulário da nova turma.
  - Clique em "Confirmar" para salvar a turma.
    
5.Editar Turma
  - Edite os campos de uma turma existente.
  - As mudanças serão salvas automaticamente no localStorage.
    
6.Remover Turma
  - Clique em "Remover" para excluir uma turma.
    
7.Importar Excel
  - Clique no botão "Receber Excel".
  - Selecione um arquivo Excel.
  - Os dados do arquivo serão importados e novas salas e turmas serão adicionadas à lista.
    
8.Alternar Tema
 - Clique no botão "Modo Claro" ou "Modo Escuro" para alternar entre os temas.
   
## Estrutura do Código
O código principal está no arquivo App.js e utiliza React para gerenciar o estado e a interface do usuário. As bibliotecas @mui/material e XLSX são usadas para os componentes de UI e para a importação de dados de arquivos Excel, respectivamente.

# Componentes Principais
- App
  - Componente principal que gerencia o estado das salas e turmas.
  - Usa localStorage para persistência de dados.
  - Contém funções para adicionar, editar, remover e importar salas e turmas.
  - Tema Claro e Escuro
  - Define temas personalizados para a interface.
  - Alterna entre temas claro e escuro com base no estado darkMode.
  - Backend e Endpoints
    
## Endpoints
Para esta aplicação, os dados de salas e turmas são armazenados localmente usando localStorage. No entanto, para uma aplicação em produção, é comum integrar com um backend que fornece endpoints para gerenciar os dados de forma persistente e centralizada.

# Estrutura dos Endpoints
GET /salas

# Retorna a lista de todas as salas.
POST /salas

# Adiciona uma nova sala.
Parâmetros: dados da sala no corpo da requisição.
PUT /salas/:id

# Atualiza uma sala existente.
Parâmetros: ID da sala na URL e dados da sala no corpo da requisição.
DELETE /salas/:id

# Remove uma sala existente.
Parâmetros: ID da sala na URL.
GET /turmas

# Retorna a lista de todas as turmas.
POST /turmas

# Adiciona uma nova turma.
Parâmetros: dados da turma no corpo da requisição.
PUT /turmas/:id

# Atualiza uma turma existente.
Parâmetros: ID da turma na URL e dados da turma no corpo da requisição.
DELETE /turmas/:id
Remove uma turma existente.
Parâmetros: ID da turma na URL.

## Repositório do Backend
O repositório do backend pode ser encontrado em marcub/alocaai-api. Este repositório contém a implementação dos endpoints descritos acima, utilizando uma stack tecnológica adequada (por exemplo, Node.js com Express, ou outra de sua preferência).

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

##Licença
Este projeto está licenciado sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

##Contato
Se tiver alguma dúvida ou sugestão, sinta-se à vontade para abrir uma issue ou entrar em contato.

Esperamos que este projeto seja útil para suas necessidades de gerenciamento de salas e turmas!


  
