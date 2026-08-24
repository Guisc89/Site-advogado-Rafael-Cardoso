# Site de advocacia — Rafael Cardoso

Este projeto é uma landing page moderna e elegante para um escritório de advocacia, com visual inspirado no mockup fornecido. A estrutura foi montada em HTML5, CSS3 e JavaScript, sem dependências externas de build.

## Como foi organizado o projeto

A pasta do projeto contém os seguintes arquivos:

- `index.html` — estrutura principal da página. Aqui ficam todas as seções do site, como cabeçalho, hero, sobre, áreas de atuação, processo e chamada final.
- `styles.css` — estilos visuais do site. Esse arquivo define as cores, fontes, espaçamentos, layout responsivo e os detalhes de design que deixam a página parecida com o modelo.
- `script.js` — pequenas interações em JavaScript, como destaque de navegação e ajustes simples para links de WhatsApp.

## Estrutura da página

### 1. Cabeçalho
A parte superior da página contém:
- logo do escritório;
- navegação com links para início, sobre, áreas de atuação, blog e contato;
- botão de WhatsApp em destaque.

### 2. Hero
A primeira seção grande da página traz:
- texto principal com foco em estratégia jurídica;
- botão de agendamento;
- botão de WhatsApp;
- imagem de destaque com visual de justiça.

Também há uma barra de benefícios logo abaixo para reforçar a proposta do escritório.

### 3. Sobre
Essa seção apresenta a identidade profissional do advogado, com:
- foto de perfil;
- texto sobre experiência e compromisso;
- dados importantes como inscrição na OAB e anos de atuação;
- linhas de informação com detalhes do atendimento.

### 4. Áreas de atuação
Nesta área, o site mostra as principais especialidades do escritório em cards. Cada card contém:
- ícone da área;
- título;
- descrição curta;
- botão de saiba mais.

### 5. Processo de atendimento
Aqui o usuário entende como funciona o atendimento em quatro passos simples:
1. entrar em contato;
2. explicar a situação;
3. análise estratégica;
4. definição dos próximos passos.

### 6. Chamada final
A última seção trabalha como convite para o cliente entrar em contato e agendar uma conversa jurídica.

## Como visualizar localmente

Você pode abrir o arquivo `index.html` diretamente no navegador, mas para uma experiência mais fiel ao ambiente web, é recomendável usar um servidor local simples.

Exemplo com Python:

```bash
python -m http.server 8000
```

Depois acesse:

```text
http://localhost:8000
```

## Personalização rápida

Se quiser adaptar o site ao seu escritório, os pontos mais fáceis de alterar são:

- nome e textos do advogado;
- número de WhatsApp;
- imagens de destaque;
- áreas de atuação;
- cores da identidade visual.

Basta editar os textos e os links no arquivo `index.html` e ajustar os estilos no `styles.css`.

## Observações

Este projeto foi desenvolvido com foco em simplicidade e performance. Ele não exige instalação de pacotes nem compilação, sendo ideal para uso rápido e fácil manutenção.
