"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt");
const user_entity_1 = require("../entities/user.entity");
const data_source_1 = require("../database/data-source");
async function createSuperAdmin() {
    try {
        await data_source_1.default.initialize();
        const userRepository = data_source_1.default.getRepository(user_entity_1.User);
        const existingSuperAdmin = await userRepository.findOne({
            where: { role: user_entity_1.UserRole.SUPER_ADMIN }
        });
        if (existingSuperAdmin) {
            console.log('Super admin already exists');
            return;
        }
        const hashedPassword = await bcrypt.hash('1234', 10);
        const superAdmin = userRepository.create({
            mobileNumber: '9716160389',
            password: hashedPassword,
            firstName: 'Ashish',
            lastName: 'Patel',
            role: user_entity_1.UserRole.SUPER_ADMIN,
            isFirstLogin: true,
            isActive: true
        });
        await userRepository.save(superAdmin);
        console.log('Super admin created successfully');
    }
    catch (error) {
        console.error('Error creating super admin:', error);
    }
    finally {
        await data_source_1.default.destroy();
    }
}
createSuperAdmin();
//# sourceMappingURL=create-super-admin.js.map