import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import axios from 'axios';
import { z } from 'zod';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const PORT = process.env.PORT || 3001;
const ALLOY_BASE = process.env.ALLOY_BASE || 'https://sandbox.alloy.co';
const AUTH = Buffer.from(`${process.env.ALLOY_TOKEN || ''}:${process.env.ALLOY_SECRET || ''}`).toString('base64');

const AppSchema = z.object({
  name_first: z.string().min(1, 'First name is required'),
  name_last: z.string().min(1, 'Last name is required'),
  address_line_1: z.string().min(1, 'Address line 1 is required'),
  address_line_2: z.string().optional().default(''),
  address_city: z.string().min(1, 'City is required'),
  address_state: z.string().length(2, 'State must be two-letter code').transform(s => s.toUpperCase()),
  address_postal_code: z.string().regex(/^\d{5}(-\d{4})?$/, 'ZIP must be 5 or 9 digits'),
  address_country_code: z.literal('US', { errorMap: () => ({ message: 'Country must be US' }) }),
  document_ssn: z.string().regex(/^\d{9}$/, 'SSN must be 9 digits'),
  email_address: z.string().email('Valid email required'),
  birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'DOB must be YYYY-MM-DD')
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.post('/api/evaluations', async (req, res) => {
  const parsed = AppSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: 'validation_error',
      details: parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`)
    });
  }

  const payload = parsed.data;

  if (process.env.SIMULATE === '1') {
    const ln = (payload.name_last || '').toLowerCase();
    const outcome = ln === 'review' ? 'Manual Review' : (ln === 'deny' || ln === 'denied' ? 'Denied' : 'Approved');
    return res.status(200).json({
      status: 'ok',
      outcome,
      evaluation_token: 'SIM-' + Math.random().toString(36).slice(2, 10),
      summary: { outcome }
    });
  }

  try {
    const r = await axios.post(`${ALLOY_BASE}/v1/evaluations`, payload, {
      headers: { 'Content-Type': 'application/json', 'Authorization': `Basic ${AUTH}` },
      timeout: 15000
    });
    const summary = r?.data?.summary || {};
    const outcome = summary?.outcome || 'Approved';
    res.status(200).json({ status:'ok', outcome, evaluation_token:r?.data?.evaluation_token, summary });
  } catch (err) {
    if (err.response) {
      return res.status(err.response.status || 502).json({
        error: 'upstream_error',
        status: err.response.status,
        message: err.response.data?.error || err.response.data?.message || 'Alloy error',
        details: err.response.data
      });
    } else if (err.request) {
      return res.status(504).json({ error: 'timeout_or_network', message: 'No response from Alloy' });
    } else {
      return res.status(500).json({ error: 'server_error', message: err.message });
    }
  }
});



//app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  console.log(process.env.SIMULATE === '1'
    ? '🚧 SIMULATION MODE (no requests sent to Alloy)'
    : '🔗 REAL MODE (requests sent to Alloy Sandbox)');
});


