import { Router } from 'express';
const messageRouter = Router();
import messageController from '../controllers/messages.js';
import { protect, restrictTo } from '../middleware/auth.js';

messageRouter.get(
  '/:meetingId',
  protect,
  restrictTo('admin', 'user'),
  messageController.getMeetingMessages,
);
messageRouter.post(
  '/:meetingId',
  protect,
  restrictTo('admin', 'user'),
  messageController.sendMessage,
);
messageRouter.put(
  '/:messageId',
  protect,
  restrictTo('admin', 'user'),
  messageController.updateMessage,
);
messageRouter.delete(
  '/:messageId',
  protect,
  restrictTo('admin', 'user'),
  messageController.deleteMessage,
);

export default messageRouter;