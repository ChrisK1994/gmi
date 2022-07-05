export {};
import { User } from '../../api/models';

const ADMIN_USER = {
  email: 'test@test.com',
  role: 'admin',
  password: 'qwerty12345',
  picture: 'examplephoto'
};

async function userSetup() {
  const adminUser = new User(ADMIN_USER);
  await adminUser.save();
}

async function checkNewDB() {
  const user = await User.findOne({ email: ADMIN_USER.email });
  if (!user) {
    console.log('- Making users...');
    await userSetup();
  } else {
    console.log('- Skip users');
  }
}

checkNewDB();
