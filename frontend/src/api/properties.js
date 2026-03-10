// Mock Properties API using localStorage

const PROPERTIES_KEY = 'rp_properties';

const getProperties = () =>
  JSON.parse(localStorage.getItem(PROPERTIES_KEY) || '[]');

const saveProperties = (props) =>
  localStorage.setItem(PROPERTIES_KEY, JSON.stringify(props));

// Seed demo properties if none exist
const seedProperties = () => {
  if (getProperties().length === 0) {
    saveProperties([
      {
        id: 'prop-1',
        brokerId: 'broker-1',
        brokerEmail: 'broker@demo.com',
        title: 'Skyline Penthouse',
        location: 'Manhattan, New York',
        price: 4500000,
        bedrooms: 4,
        bathrooms: 3,
        area: 3200,
        description:
          'Breathtaking 32nd-floor penthouse with panoramic city views, floor-to-ceiling glass, designer kitchen, and rooftop terrace.',
        image:
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
        type: 'Penthouse',
      },
      {
        id: 'prop-2',
        brokerId: 'broker-1',
        brokerEmail: 'broker@demo.com',
        title: 'Oceanfront Villa',
        location: 'Malibu, California',
        price: 8900000,
        bedrooms: 6,
        bathrooms: 5,
        area: 5800,
        description:
          'Stunning beachfront estate with private pool, home theater, gourmet kitchen, and direct beach access on the Pacific Ocean.',
        image:
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
        type: 'Villa',
      },
      {
        id: 'prop-3',
        brokerId: 'broker-1',
        brokerEmail: 'broker@demo.com',
        title: 'Downtown Loft',
        location: 'Chicago, Illinois',
        price: 1200000,
        bedrooms: 2,
        bathrooms: 2,
        area: 1800,
        description:
          'Stylish converted industrial loft with exposed brick, polished concrete floors, and stunning river views in the heart of Chicago.',
        image:
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
        type: 'Loft',
      },
      {
        id: 'prop-4',
        brokerId: 'broker-1',
        brokerEmail: 'broker@demo.com',
        title: 'Mountain Retreat',
        location: 'Aspen, Colorado',
        price: 6200000,
        bedrooms: 5,
        bathrooms: 4,
        area: 4500,
        description:
          'Luxury ski-in/ski-out chalet with stone fireplace, heated floors, wine cellar, and sweeping Rocky Mountain vistas.',
        image:
          'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800&q=80',
        type: 'Chalet',
      },
      {
        id: 'prop-5',
        brokerId: 'broker-1',
        brokerEmail: 'broker@demo.com',
        title: 'Garden Townhouse',
        location: 'Austin, Texas',
        price: 980000,
        bedrooms: 3,
        bathrooms: 2,
        area: 2200,
        description:
          'Modern townhouse in a vibrant neighborhood with smart home features, rooftop deck, and a lush private garden.',
        image:
          'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
        type: 'Townhouse',
      },
    ]);
  }
};

seedProperties();

export const getAllProperties = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getProperties()), 300);
  });
};

export const getPropertiesByBroker = (brokerId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getProperties().filter((p) => p.brokerId === brokerId));
    }, 300);
  });
};

export const addProperty = (property) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newProp = { ...property, id: `prop-${Date.now()}` };
      saveProperties([...getProperties(), newProp]);
      resolve(newProp);
    }, 400);
  });
};

export const deleteProperty = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      saveProperties(getProperties().filter((p) => p.id !== id));
      resolve();
    }, 300);
  });
};
