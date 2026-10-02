import { createClient } from '@supabase/supabase-js';
import { Appointment } from '../types';

export const SUPABASE_PROJECT_ID = 'rqaefaihemrcjvvjjfon';
export const SUPABASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co`;
export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_3whMdcQr5PNQi8WQL8_M_Q__LiH3SKA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Checks connection to the user's Supabase backend
 */
export async function checkSupabaseConnection(): Promise<{
  connected: boolean;
  tableExists: boolean;
  error?: string;
  count?: number;
}> {
  try {
    const { count, error } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true });

    if (error) {
      if (error.code === '42P01') {
        return {
          connected: true,
          tableExists: false,
          error: 'Table "appointments" does not exist yet in Supabase.'
        };
      }
      return {
        connected: false,
        tableExists: false,
        error: error.message
      };
    }

    return {
      connected: true,
      tableExists: true,
      count: count ?? 0
    };
  } catch (err: any) {
    return {
      connected: false,
      tableExists: false,
      error: err?.message || 'Network error connecting to Supabase'
    };
  }
}

/**
 * Saves a new appointment to Supabase
 */
export async function saveAppointmentToSupabase(appointment: Appointment): Promise<{
  success: boolean;
  error?: string;
  data?: any;
}> {
  try {
    const payload = {
      booking_ref: appointment.bookingRef,
      patient_name: appointment.patientName,
      patient_phone: appointment.patientPhone,
      patient_email: appointment.patientEmail,
      patient_age: appointment.patientAge || null,
      is_new_patient: appointment.isNewPatient,
      preferred_contact: appointment.preferredContact,
      service_id: appointment.serviceId,
      service_name: appointment.serviceName,
      doctor_id: appointment.doctorId,
      doctor_name: appointment.doctorName,
      appointment_date: appointment.appointmentDate,
      start_time: appointment.startTime,
      notes: appointment.notes || '',
      status: appointment.status || 'Confirmed',
      created_at: appointment.createdAt || new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('appointments')
      .insert([payload])
      .select();

    if (error) {
      console.warn('Supabase insert warning:', error);
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      data
    };
  } catch (err: any) {
    console.error('Error saving appointment to Supabase:', err);
    return {
      success: false,
      error: err?.message || 'Failed to insert appointment into Supabase'
    };
  }
}

/**
 * Fetches all appointments from Supabase
 */
export async function fetchAppointmentsFromSupabase(): Promise<{
  success: boolean;
  appointments: Appointment[];
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { success: false, appointments: [], error: error.message };
    }

    if (!data) {
      return { success: true, appointments: [] };
    }

    const mapped: Appointment[] = data.map((row: any) => ({
      id: String(row.id || `apt-${Date.now()}`),
      bookingRef: row.booking_ref || row.bookingRef || `SA-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: row.patient_name || row.patientName || 'Patient',
      patientPhone: row.patient_phone || row.patientPhone || '',
      patientEmail: row.patient_email || row.patientEmail || '',
      patientAge: row.patient_age || row.patientAge || undefined,
      isNewPatient: row.is_new_patient ?? row.isNewPatient ?? true,
      preferredContact: row.preferred_contact || row.preferredContact || 'WhatsApp',
      serviceId: row.service_id || row.serviceId || '',
      serviceName: row.service_name || row.serviceName || 'General Consultation',
      doctorId: row.doctor_id || row.doctorId || '',
      doctorName: row.doctor_name || row.doctorName || 'Doctor',
      appointmentDate: row.appointment_date || row.appointmentDate || new Date().toISOString().split('T')[0],
      startTime: row.start_time || row.startTime || '10:00 AM',
      notes: row.notes || '',
      status: row.status || 'Confirmed',
      createdAt: row.created_at || row.createdAt || new Date().toISOString(),
      updatedAt: row.updated_at || row.updatedAt || new Date().toISOString()
    }));

    return { success: true, appointments: mapped };
  } catch (err: any) {
    return { success: false, appointments: [], error: err?.message };
  }
}

/**
 * Updates an appointment's status in Supabase
 */
export async function updateAppointmentStatusInSupabase(
  bookingRefOrId: string,
  status: string
): Promise<boolean> {
  try {
    let { error } = await supabase
      .from('appointments')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('booking_ref', bookingRefOrId);

    if (error) {
      const res = await supabase
        .from('appointments')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', bookingRefOrId);
      error = res.error;
    }

    return !error;
  } catch {
    return false;
  }
}

/**
 * Updates full appointment details in Supabase (patient info, doctor, service, date, time, notes, status)
 */
export async function updateAppointmentDetailsInSupabase(
  bookingRefOrId: string,
  updates: Partial<Appointment>
): Promise<{ success: boolean; error?: string }> {
  try {
    const payload: any = {
      updated_at: new Date().toISOString()
    };
    if (updates.patientName !== undefined) payload.patient_name = updates.patientName;
    if (updates.patientPhone !== undefined) payload.patient_phone = updates.patientPhone;
    if (updates.patientEmail !== undefined) payload.patient_email = updates.patientEmail;
    if (updates.patientAge !== undefined) payload.patient_age = updates.patientAge;
    if (updates.isNewPatient !== undefined) payload.is_new_patient = updates.isNewPatient;
    if (updates.preferredContact !== undefined) payload.preferred_contact = updates.preferredContact;
    if (updates.serviceName !== undefined) payload.service_name = updates.serviceName;
    if (updates.serviceId !== undefined) payload.service_id = updates.serviceId;
    if (updates.doctorName !== undefined) payload.doctor_name = updates.doctorName;
    if (updates.doctorId !== undefined) payload.doctor_id = updates.doctorId;
    if (updates.appointmentDate !== undefined) payload.appointment_date = updates.appointmentDate;
    if (updates.startTime !== undefined) payload.start_time = updates.startTime;
    if (updates.notes !== undefined) payload.notes = updates.notes;
    if (updates.status !== undefined) payload.status = updates.status;

    let { error } = await supabase
      .from('appointments')
      .update(payload)
      .eq('booking_ref', bookingRefOrId);

    if (error) {
      const res = await supabase
        .from('appointments')
        .update(payload)
        .eq('id', bookingRefOrId);
      error = res.error;
    }

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

/**
 * Deletes an appointment permanently from Supabase
 */
export async function deleteAppointmentFromSupabase(
  bookingRefOrId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    let { error } = await supabase
      .from('appointments')
      .delete()
      .eq('booking_ref', bookingRefOrId);

    if (error) {
      const res = await supabase
        .from('appointments')
        .delete()
        .eq('id', bookingRefOrId);
      error = res.error;
    }

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export const SUPABASE_SQL_SCHEMA = `-- Run this in your Supabase SQL Editor if the table is not created yet:

CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_ref TEXT NOT NULL UNIQUE,
    patient_name TEXT NOT NULL,
    patient_phone TEXT NOT NULL,
    patient_email TEXT NOT NULL,
    patient_age INTEGER,
    is_new_patient BOOLEAN DEFAULT true,
    preferred_contact TEXT DEFAULT 'WhatsApp',
    service_id TEXT,
    service_name TEXT NOT NULL,
    doctor_id TEXT,
    doctor_name TEXT NOT NULL,
    appointment_date DATE NOT NULL,
    start_time TEXT NOT NULL,
    notes TEXT,
    status TEXT DEFAULT 'Confirmed',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Allow public booking insertions
CREATE POLICY "Allow public booking insertions" 
ON public.appointments 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- Allow reading appointments (for clinic website & dashboard)
CREATE POLICY "Allow reading appointments" 
ON public.appointments 
FOR SELECT 
TO anon, authenticated 
USING (true);

-- Allow updating appointments status (for clinic staff)
CREATE POLICY "Allow updating appointments" 
ON public.appointments 
FOR UPDATE 
TO anon, authenticated 
USING (true)
WITH CHECK (true);

-- Allow deleting appointments (for clinic admin)
CREATE POLICY "Allow deleting appointments" 
ON public.appointments 
FOR DELETE 
TO anon, authenticated 
USING (true);
`;
