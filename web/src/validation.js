import { z } from 'zod';

export const formSchema = z.object({
  name_first: z.string().min(1, 'First name is required'),
  name_last: z.string().min(1, 'Last name is required'),
  address_line_1: z.string().min(1, 'Address line 1 is required'),
  address_line_2: z.string().optional(),
  address_city: z.string().min(1, 'City is required'),
  address_state: z.string().length(2, 'Use two-letter code (NY, CA)').transform(s => s.toUpperCase()),
  address_postal_code: z.string().regex(/^\d{5}(-\d{4})?$/, 'ZIP must be 5 or 9 digits'),
  address_country_code: z.literal('US', { errorMap: () => ({ message: 'Must be US' }) }),
  document_ssn: z.string().regex(/^\d{9}$/, 'SSN must be 9 digits (no dashes)'),
  email_address: z.string().email('Valid email required'),
  birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'DOB must be YYYY-MM-DD')
});