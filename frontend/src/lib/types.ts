export enum UserRole {
  STUDENT = 'student',
  PARENT = 'parent',
  TEACHER = 'teacher',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

export interface User {
  id: string
  mobileNumber: string
  firstName: string
  lastName: string
  role: UserRole
  isFirstLogin: boolean
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface LoginResponse {
  access_token: string
  user: User
}

export interface ApiError {
  message: string
  statusCode: number
}

export interface FeatureType {
  id: string
  name: string
  description?: string
  isEnabled: boolean
  createdAt: Date
  updatedAt: Date
}
