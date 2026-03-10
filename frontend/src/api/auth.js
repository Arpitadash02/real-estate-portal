// Mock Auth API using localStorage as the backend store

const USERS_KEY = 'rp_users';

const getUsers = () => JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
const saveUsers = (users) => localStorage.setItem(USERS_KEY, JSON.stringify(users));

// Seed a demo broker and customer if no users exist
const seedUsers = () => {
  const existing = getUsers();
  if (existing.length === 0) {
    saveUsers([
      {
        id: 'broker-1',
        name: 'Alice (Broker)',
        email: 'broker@demo.com',
        password: 'password',
        role: 'broker',
      },
      {
        id: 'customer-1',
        name: 'Bob (Customer)',
        email: 'customer@demo.com',
        password: 'password',
        role: 'customer',
      },
    ]);
  }
};

seedUsers();

export const signupUser = ({ name, email, password, role }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getUsers();
      const exists = users.find((u) => u.email === email);
      if (exists) {
        reject(new Error('An account with this email already exists.'));
        return;
      }
      const newUser = {
        id: `${role}-${Date.now()}`,
        name,
        email,
        password,
        role,
      };
      saveUsers([...users, newUser]);
      const token = btoa(JSON.stringify({ id: newUser.id, role }));
      resolve({ user: { id: newUser.id, name, email, role }, token });
    }, 400);
  });
};

export const loginUser = ({ email, password, role }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getUsers();
      const user = users.find(
        (u) => u.email === email && u.password === password && u.role === role
      );
      if (!user) {
        reject(new Error('Invalid email, password, or role.'));
        return;
      }
      const token = btoa(JSON.stringify({ id: user.id, role: user.role }));
      resolve({
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        token,
      });
    }, 400);
  });
};
