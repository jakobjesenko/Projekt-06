import { Router } from 'express';
const contactRouter = Router();
import contactController from '../controllers/contacts.js';
import { protect, restrictTo } from '../middleware/auth.js';

contactRouter.get('/', protect, restrictTo('admin'), contactController.getAllContactForms);
contactRouter.post('/', contactController.submitContactForm);
contactRouter.put(
  '/:contactId/status',
  protect,
  restrictTo('admin'),
  contactController.updateContactFormStatus,
);
contactRouter.delete(
  '/:contactId',
  protect,
  restrictTo('admin'),
  contactController.deleteContactForm,
);

export default contactRouter;