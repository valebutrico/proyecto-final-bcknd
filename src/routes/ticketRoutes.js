import { Router } from 'express';
import TicketController from '../controllers/ticketController.js';
import logger from '../utils/logger.js'; // Importar el logger

const router = Router();

router.get("/", (req, res, next) => {
  try {
    TicketController.getAllTickets(req, res);
    logger.info('Fetched all tickets successfully');
  } catch (error) {
    logger.error(`Error fetching tickets: ${error.message}`);
    next(error);
  }
});

router.get('/:id', (req, res, next) => {
  try {
    TicketController.getTicketById(req, res);
    logger.info(`Fetched ticket with id ${req.params.id} successfully`);
  } catch (error) {
    logger.error(`Error fetching ticket with id ${req.params.id}: ${error.message}`);
    next(error);
  }
});

router.post('/', (req, res, next) => {
  try {
    TicketController.createTicket(req, res);
    logger.info('Ticket created successfully');
  } catch (error) {
    logger.error(`Error creating ticket: ${error.message}`);
    next(error);
  }
});

router.put('/:id', (req, res, next) => {
  try {
    TicketController.updateTicket(req, res);
    logger.info(`Ticket with id ${req.params.id} updated successfully`);
  } catch (error) {
    logger.error(`Error updating ticket with id ${req.params.id}: ${error.message}`);
    next(error);
  }
});

router.delete('/:id', (req, res, next) => {
  try {
    TicketController.deleteTicket(req, res);
    logger.info(`Ticket with id ${req.params.id} deleted successfully`);
  } catch (error) {
    logger.error(`Error deleting ticket with id ${req.params.id}: ${error.message}`);
    next(error);
  }
});

export default router;
