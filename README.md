# Documentação do Projeto E-commerce

Este documento descreve a arquitetura e as funcionalidades do projeto de e-commerce, que é dividido em um backend Node.js e um frontend React.

## Backend

O backend é uma aplicação Node.js utilizando o framework Express. Ele é responsável pela autenticação de usuários, gerenciamento de carrinho e favoritos, e processamento de pagamentos.

### Principais Tecnologias

-   **Node.js com Express:** Para o servidor web.
-   **MongoDB com Mongoose:** Como banco de dados para armazenar informações dos usuários.
-   **JSON Web Tokens (JWT):** Para autenticação e gerenciamento de sessão.
-   **Stripe:** Para processamento de pagamentos.
-   **dummyjson.com:** API externa utilizada para obter todas as informações dos produtos.

### Arquitetura

A arquitetura do backend segue um padrão Model-View-Controller (MVC), separando as responsabilidades:

-   **`app.js`**: Ponto de entrada da aplicação. Configura o servidor, middlewares (CORS, JSON, cookieParser), inicia a conexão com o banco de dados e carrega as rotas.
-   **`routes/router.js`**: Define todos os endpoints da API, mapeando cada rota para uma função específica nos controllers.
-   **`controllers/`**: Contêm a lógica de negócio da aplicação.
    -   `authController.js`: Gerencia registro, login, logout, atualização de tokens (access e refresh) e recuperação de senha. A autenticação é baseada em JWTs armazenados em cookies httpOnly, o que é uma prática segura.
    -   `productController.js`: Uma característica arquitetural chave está aqui. O backend **não armazena dados de produtos**. Ele busca informações de produtos em tempo real da API externa `dummyjson.com`. Este controller gerencia a adição/remoção de itens do carrinho e dos favoritos (armazenando apenas os IDs dos produtos no modelo do usuário) e integra-se com o Stripe para criar sessões de checkout.
-   **`models/`**: Define os schemas do Mongoose.
    -   `userModel.js`: Define a estrutura dos dados do usuário, incluindo campos para email, senha (hash), status de verificação, e arrays para armazenar itens do carrinho e favoritos.
-   **`db/conn.js`**: Gerencia a conexão com o banco de dados MongoDB.

### Fluxo de Autenticação

1.  **Registro (`/register`)**: O usuário é criado no banco de dados com uma senha hasheada.
2.  **Login (`/login`)**: Se as credenciais estiverem corretas, o servidor gera um *access token* e um *refresh token*. Ambos são enviados ao cliente como cookies `httpOnly` e seguros.
3.  **Acesso a Rotas Protegidas**: O `authMiddleware` verifica a validade do *access token* em cada requisição a rotas protegidas.
4.  **Renovação de Token (`/refresh`)**: Se o *access token* expirar, o cliente pode usar o *refresh token* para obter um novo par de tokens sem precisar fazer login novamente.

### Endpoints da API (resumo)

-   **Autenticação**:
    -   `POST /api/register`
    -   `POST /api/login`
    -   `GET /api/logout`
    -   `GET /api/refresh`
    -   `GET /api/me` (Obtém dados do usuário logado)
    -   `POST /api/forgot-password`
    -   `POST /api/check-code`
    -   `POST /api/reset-password`
-   **Carrinho e Favoritos**:
    -   `GET /api/cart`
    -   `POST /api/cart`
    -   `DELETE /api/cart/:id`
    -   `GET /api/favorites`
    -   `POST /api/favorites`
    -   `DELETE /api/favorites/:id`
-   **Pagamento**:
    -   `POST /api/create-checkout-session`

---

## Frontend

O frontend é uma Single Page Application (SPA) construída com React. É responsável por toda a interface do usuário, interação e comunicação com o backend.

### Principais Tecnologias

-   **React:** Biblioteca principal para a construção da interface.
-   **React Router DOM:** Para gerenciamento de rotas do lado do cliente.
-   **Zustand:** Para gerenciamento de estado global da aplicação.
-   **Axios:** Para realizar requisições HTTP para a API do backend.
-   **SCSS:** Para estilização dos componentes.
-   **React Toastify:** Para exibir notificações (toasts) para o usuário.

### Arquitetura

A estrutura do frontend é organizada por funcionalidade, separando a lógica em componentes, páginas, hooks e serviços.

-   **`main.jsx`**: Ponto de entrada da aplicação. Configura o `BrowserRouter` do React Router e define todas as rotas da aplicação, associando cada caminho a um componente de página.
-   **`App.jsx`**: Componente raiz que define o layout principal da aplicação, incluindo `Navbar` e `Footer`. Ele utiliza o `<Outlet />` do React Router para renderizar o componente da página correspondente à rota atual. É aqui que a sessão do usuário é verificada na inicialização através do hook `useAuth`.
-   **`pages/`**: Contém os componentes que representam as páginas completas da aplicação (ex: `Home.jsx`, `LoginPage.jsx`, `CartPage.jsx`).
-   **`ui/`**: Contém componentes de interface reutilizáveis (ex: `Navbar.jsx`, `Button.jsx`).
-   **`hooks/`**: Contém hooks customizados que encapsulam lógica reutilizável.
    -   `useAuth.js`: Centraliza toda a lógica de autenticação do usuário (registro, login, logout, etc.). Ele interage com o `useAppStore` para atualizar o estado global e com o `api.js` para fazer as chamadas ao backend.
-   **`store/useAppStore.js`**: Define o *store* global do Zustand.
    -   Gerencia o estado do usuário (`user`), carrinho (`cart`) e favoritos (`favorites`).
    -   Utiliza o middleware `persist` do Zustand para salvar parte do estado (usuário, carrinho e favoritos) no `localStorage`, mantendo a sessão do usuário e seus itens mesmo após recarregar a página.
    -   Contém as ações para modificar o estado, como `addToCart`, `removeFromFavorites`, etc., que também fazem as chamadas de API correspondentes para sincronizar o estado com o backend.
-   **`services/api.js`**: Configura a instância do Axios.
    -   Define a `baseURL` para a API do backend (a partir de variáveis de ambiente).
    -   Habilita `withCredentials: true` para permitir que o navegador envie os cookies (contendo os tokens de autenticação) em cada requisição.
    -   **Interceptor de Resposta:** Possui uma lógica crucial para o refresh de tokens. Se uma requisição falha com status `401` (Não Autorizado), o interceptor tenta automaticamente chamar o endpoint `/api/refresh` para obter um novo *access token*. Se bem-sucedido, a requisição original é repetida. Se a renovação falhar, o usuário é deslogado. Isso proporciona uma experiência de usuário fluida, sem a necessidade de login manual a cada expiração do token de acesso.
