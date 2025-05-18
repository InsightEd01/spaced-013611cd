
import { supabase } from '@/lib/supabase';
import { seedMockData } from './mockData';

// This function can be called to populate the database with mock data
export const initializeDatabase = async () => {
  try {
    console.log('Initializing database with mock data...');
    await seedMockData(supabase);
    console.log('Database initialization complete!');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
};
