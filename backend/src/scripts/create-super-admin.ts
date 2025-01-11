import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../entities/user.entity';
import dataSource from '../database/data-source';

async function createSuperAdmin() {
  try {
    await dataSource.initialize();
    
    const userRepository = dataSource.getRepository(User);
    
    // Check if super admin already exists
    const existingSuperAdmin = await userRepository.findOne({
      where: { role: UserRole.SUPER_ADMIN }
    });
    
    if (existingSuperAdmin) {
      console.log('Super admin already exists');
      return;
    }
    
    // Hash the default password
    const hashedPassword = await bcrypt.hash('1234', 10);
    
    // Create super admin user
    const superAdmin = userRepository.create({
      mobileNumber: '9716160389',
      password: hashedPassword,
      firstName: 'Ashish',
      lastName: 'Patel',
      role: UserRole.SUPER_ADMIN,
      isFirstLogin: true,
      isActive: true
    });
    
    await userRepository.save(superAdmin);
    console.log('Super admin created successfully');
  } catch (error) {
    console.error('Error creating super admin:', error);
  } finally {
    await dataSource.destroy();
  }
}

createSuperAdmin();
