import { z } from 'zod';

export const profileSchema = z.object({
  firstName: z.string().nonempty('First name is required'),
  lastName: z.string().nonempty('Last name is required'),
  dateOfBirth: z.string().nonempty('Date of birth is required'),
  city: z.string().nonempty('City is required'),
  state: z.string().nonempty('State is required'),
  country: z.string().nonempty('Country is required'),
  postalCode: z.string().nonempty('Postal code is required'),
});