import { Router } from 'express';
import { isAuthenticated } from '../middleware/auth';
import { scheduleEmails, getScheduledEmails, getSentEmails, getEmailById } from '../controllers/emailController';

const router = Router();

router.use(isAuthenticated);

router.post('/schedule', scheduleEmails);
router.get('/scheduled', getScheduledEmails);
router.get('/sent', getSentEmails);
router.get('/:id', getEmailById);

export default router;
