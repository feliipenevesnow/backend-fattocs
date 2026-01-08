# 🚀 Task Manager API - Backend

Esta é a API de suporte para o sistema de gerenciamento de tarefas. Construída com **NestJS**, ela foca em fornecer uma interface rápida e segura para manipulação de dados, com um diferencial na lógica de ordenação customizada.

---

## ✨ Funcionalidades

* **CRUD de Tarefas**: Gerenciamento completo (Criar, Ler, Atualizar, Deletar).
* **Lógica de Ordenação**: Endpoints específicos para mover tarefas para cima/baixo e reordenar listas completas (essencial para suporte a Drag-and-Drop).
* **Respostas Padronizadas**: Uso de um `ApiResponse` DTO global para manter a consistência dos dados enviados ao frontend.
* **Persistência**: Banco de dados leve e eficiente com **SQLite**.

## 🛠️ Tecnologias

* **NestJS** (Node.js)
* **TypeScript**
* **SQLite** (via TypeORM ou Sequelize)
* **Docker**

## 📂 Endpoints Principais

* `GET /tarefas`: Lista todas as tarefas.
* `POST /tarefas/reorder`: Atualiza a ordem de múltiplos itens simultaneamente.
* `PATCH /tarefas/:id/move-up`: Sobe a prioridade de uma tarefa específica.

---
Desenvolvido por **Felipe Neves**
