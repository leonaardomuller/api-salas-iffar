# API de Descrição de Salas para Pessoas com Deficiência Visual

Esta API foi desenvolvida para auxiliar um aplicativo front-end em React Native. Ela permite a descrição de uma sala para que uma pessoa com deficiência visual possa imaginar como é a estrutura interna e, assim, possa se locomover com facilidade. A API permite operações CRUD (Criar, Ler, Atualizar e Excluir) sobre uma coleção de "salas", com cada sala representada por um objeto com suas características individuais.

## Tecnologias Usadas

- Node.js
- Express
- FaunaDB
- Swagger (para documentação da API)

## Como Rodar a API Localmente

1 - Instale Node.js e npm (normalmente vem com o Node.js)
2 - Clone este repositório:

```bash
git clone https://github.com/leonaardomuller/api-salas-iffar.git
```

3 - Navegue até a pasta do repositório clonado e instale as dependências do projeto:

```bash
cd api-salas-iffar
npm install
```

4 - Instale a CLI do Netlify:

```bash
npm install netlify-cli -g
```

5 - Inicie o servidor local:

```bash
npm start
```

5 - Acesse [http://localhost:8888/.netlify/functions/api/api-docs/](http://localhost:8888/.netlify/functions/api/api-docs/) para visualizar a documentação da API(Swagger).

## Uso da API

A API contém os seguintes endpoints:

- GET /salas: Retorna todas as salas
- POST /salas: Cria uma nova sala
- GET /salas/:id: Retorna uma sala específica pelo ID
- PUT /salas/:id: Atualiza uma sala específica pelo ID
- DELETE /salas/:id: Exclui uma sala específica pelo ID
- DELETE /salas: Exclui todas as salas

O corpo da requisição para as rotas POST e PUT deve ser um objeto JSON representando a sala. Exemplo:

```json
{
  "id": 1,
  "predio": "string",
  "andar": 2,
  "sala": 16,
  "descricao": "Você está entrando em uma sala retangular, com a porta no canto inferior esquerdo. À direita da porta, há uma cadeira. Dois metros à frente, uma mesa retangular com quatro cadeiras ocupa a largura da sala. Além disso, um quadro-negro está posicionado na parede ao final da sala, logo atrás da mesa."
}
```

## Como Subir a API em Produção

1 - Este projeto está configurado para ser hospedado na plataforma Netlify, e usa a biblioteca serverless-http para facilitar o processo. Antes de começar, você precisará de uma conta no [Netlify](https://www.netlify.com/).

2 - Instale a CLI do Netlify:

```bash
npm install netlify-cli -g
```

3 - Faça login na sua conta do Netlify através da CLI:

```bash
netlify login
```

4 - Link seu repositório com um novo site no Netlify:

```bash
netlify init
```

5 - Finalmente, implante o projeto:

```bash
netlify deploy --prod
```

Após o processo de implantação, a URL do seu site será exibida.
Para mais detalhes, consulte a documentação da API disponível em [https://salas-iffar-api.netlify.app/.netlify/functions/api/api-docs](https://salas-iffar-api.netlify.app/.netlify/functions/api/api-docs).

OBS: A CHAVE SECRETA FOI DEIXADA PROPOSITALMENTE NO CODIGO PARA FACILITAR O USO DA API, POIS O FAUNADB POSSUI ALGUMAS CONFIGURAÇÕES ESPECÍFICAS, FAÇA BOM USO E POR FAVOR NÃO AVACALHE! DEUS TA VENDO! 

## License

[MIT](https://choosealicense.com/licenses/mit/)
