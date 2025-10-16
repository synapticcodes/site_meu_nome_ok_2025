import type { APIRoute } from 'astro';
import { onlyDigits } from '@utils/formatters';
import { serverFormSchema } from '@lib/forms/schema';
import type { ServerFormValues } from '@lib/forms/schema';

type SubmissionPayload = ServerFormValues & {
  submittedAt: string;
  source: string;
};

interface RateLimitItem {
  count: number;
  resetAt: number;
}

const RATE_LIMIT_WINDOW = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const rateLimitStore = new Map<string, RateLimitItem>();

const cleanString = (value: string) => value.trim();

const enforceRateLimit = (identifier: string) => {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (entry && entry.resetAt > now) {
    if (entry.count >= RATE_LIMIT_MAX) {
      return false;
    }
    entry.count += 1;
    rateLimitStore.set(identifier, entry);
    return true;
  }

  rateLimitStore.set(identifier, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
  return true;
};

export const POST: APIRoute = async ({ request }) => {
  const identifier =
    request.headers.get('x-forwarded-for') ??
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('x-real-ip') ??
    'local';

  if (!enforceRateLimit(identifier)) {
    return new Response(
      JSON.stringify({ success: false, error: 'RATE_LIMIT', message: 'Muitas tentativas. Tente novamente em breve.' }),
      {
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch (error) {
    console.error('Invalid JSON payload', error);
    return new Response(
      JSON.stringify({ success: false, error: 'INVALID_JSON', message: 'Formato de requisição inválido.' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  if (typeof body !== 'object' || body === null) {
    return new Response(
      JSON.stringify({ success: false, error: 'INVALID_PAYLOAD', message: 'Formato de requisição inválido.' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  const raw = body as Record<string, unknown>;
  const parsed = serverFormSchema.safeParse({
    ...raw,
    debtValue: typeof raw.debtValue === 'number' ? raw.debtValue : Number(raw.debtValue ?? 0),
    document: onlyDigits(String(raw.document ?? '')),
    phone: onlyDigits(String(raw.phone ?? ''))
  });

  if (!parsed.success) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Verifique os campos do formulário.',
        details: parsed.error.flatten()
      }),
      {
        status: 422,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  const payload: SubmissionPayload = {
    ...parsed.data,
    fullName: cleanString(parsed.data.fullName),
    creditor: cleanString(parsed.data.creditor),
    city: cleanString(parsed.data.city),
    submittedAt: new Date().toISOString(),
    source: request.headers.get('origin') ?? 'unknown'
  };

  try {
    const webhookUrl = import.meta.env.FORM_WEBHOOK_URL;
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }

    console.info('Form submission received', payload);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Form submission error', error);
    return new Response(
      JSON.stringify({ success: false, error: 'INTERNAL_ERROR', message: 'Não foi possível processar sua solicitação.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

export const GET: APIRoute = () =>
  new Response(JSON.stringify({ success: false, error: 'METHOD_NOT_ALLOWED' }), {
    status: 405,
    headers: { Allow: 'POST', 'Content-Type': 'application/json' }
  });
