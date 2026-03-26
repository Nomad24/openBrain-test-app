const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const VALID_STATUSES = ['New', 'In Progress', 'Waiting for Response', 'Completed', 'Rejected'];

class RequestController {
  async getAll(req, res) {
    try {
      const { status } = req.query;
      const where = status ? { status } : {};

      const requests = await prisma.request.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true,
          clientName: true
        }
      });

      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch requests' });
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params;
      const request = await prisma.request.findUnique({
        where: { id: parseInt(id) }
      });

      if (!request) {
        return res.status(404).json({ message: 'Request not found' });
      }

      res.json(request);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch request' });
    }
  }

  async create(req, res) {
    try {
      const { title, clientName, email, description } = req.body;

      if (!title || !title.trim()) {
        return res.status(400).json({ message: 'Title is required' });
      }

      if (!clientName || !clientName.trim()) {
        return res.status(400).json({ message: 'Client name is required' });
      }

      if (email && !this.isValidEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }

      const request = await prisma.request.create({
        data: {
          title: title.trim(),
          clientName: clientName.trim(),
          email: email || null,
          description: description || null,
          status: 'New'
        }
      });

      res.status(201).json(request);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create request' });
    }
  }

  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({ 
          message: `Invalid status. Valid statuses: ${VALID_STATUSES.join(', ')}` 
        });
      }

      const request = await prisma.request.update({
        where: { id: parseInt(id) },
        data: { status }
      });

      res.json(request);
    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Request not found' });
      }
      res.status(500).json({ message: 'Failed to update status' });
    }
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

module.exports = new RequestController();
