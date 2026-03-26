const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requests');

/**
 * @swagger
 * tags:
 *   name: Requests
 *   description: API для управления заявками
 */

/**
 * @swagger
 * /api/requests:
 *   get:
 *     summary: Получить список заявок
 *     tags: [Requests]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [New, In Progress, Waiting for Response, Completed, Rejected]
 *         description: Фильтр по статусу
 *     responses:
 *       200:
 *         description: Список заявок
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   status:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   clientName:
 *                     type: string
 *       500:
 *         description: Ошибка сервера
 */
router.get('/', requestController.getAll.bind(requestController));

/**
 * @swagger
 * /api/requests/{id}:
 *   get:
 *     summary: Получить детали заявки
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID заявки
 *     responses:
 *       200:
 *         description: Детали заявки
 *       404:
 *         description: Заявка не найдена
 *       500:
 *         description: Ошибка сервера
 */
router.get('/:id', requestController.getOne.bind(requestController));

/**
 * @swagger
 * /api/requests:
 *   post:
 *     summary: Создать новую заявку
 *     tags: [Requests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - clientName
 *             properties:
 *               title:
 *                 type: string
 *                 description: Название заявки
 *               clientName:
 *                 type: string
 *                 description: Имя клиента
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email клиента
 *               description:
 *                 type: string
 *                 description: Описание заявки
 *     responses:
 *       201:
 *         description: Заявка создана
 *       400:
 *         description: Ошибка валидации
 *       500:
 *         description: Ошибка сервера
 */
router.post('/', requestController.create.bind(requestController));

/**
 * @swagger
 * /api/requests/{id}/status:
 *   patch:
 *     summary: Обновить статус заявки
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID заявки
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [New, In Progress, Waiting for Response, Completed, Rejected]
 *                 description: Новый статус
 *     responses:
 *       200:
 *         description: Статус обновлен
 *       400:
 *         description: Неверный статус
 *       404:
 *         description: Заявка не найдена
 *       500:
 *         description: Ошибка сервера
 */
router.patch('/:id/status', requestController.updateStatus.bind(requestController));

module.exports = router;
