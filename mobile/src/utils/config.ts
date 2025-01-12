export const API_URL = process.env.API_URL || 'http://localhost:8000';

export const SCHOOL_CONFIG = {
  name: process.env.SCHOOL_NAME || 'School Management System',
  address: process.env.SCHOOL_ADDRESS || '',
  phone: process.env.SCHOOL_PHONE || '',
  email: process.env.SCHOOL_EMAIL || '',
};

export const FEATURE_FLAGS = {
  library: process.env.ENABLE_LIBRARY === 'true',
  calendar: process.env.ENABLE_CALENDAR === 'true',
  busTracking: process.env.ENABLE_BUS_TRACKING === 'true',
  chat: process.env.ENABLE_CHAT === 'true',
};
