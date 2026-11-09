// Cloudflare entry point. Kept separate so tests never import 'cloudflare:email'.
import { EmailMessage } from 'cloudflare:email';
import { handle } from './index';
import { toMime } from './alert';
import type { Env } from './env';

interface EmailBinding {
  send(message: EmailMessage): Promise<void>;
}

export default {
  fetch(req: Request, env: Env & { ALERT_EMAIL: EmailBinding }) {
    return handle(req, env, {
      sendEmail: ({ from, to, subject, text }) => env.ALERT_EMAIL.send(new EmailMessage(from, to, toMime(from, to, subject, text)))
    });
  }
};
