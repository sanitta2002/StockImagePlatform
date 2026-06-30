export const API_URLS = {
  AUTH_BASE: '/auth',
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  
  // Images
  IMAGES_BASE: '/images',
  UPLOAD_IMAGES: '/images/upload',
  GET_IMAGES: '/images',
  UPDATE_IMAGE: (id: string) => `/images/${id}`,
  DELETE_IMAGE: (id: string) => `/images/${id}`,
  REORDER_IMAGES: '/images/reorder',
};
