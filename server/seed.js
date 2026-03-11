const db = require('./db');

const plants = [
  {
    plant_name: 'Echinacea purpurea', common_name: 'Purple Coneflower',
    availability_date: '2026-03-15', container_size: '1 gallon', price: 12.99,
    description: 'A beloved native wildflower with striking pink-purple petals surrounding a spiky orange-brown center. Attracts butterflies and bees, and provides winter seed heads for birds.',
    sun_requirements: 'Full Sun', moisture_requirements: 'Medium', type: 'Perennial', image_url: null,
  },
  {
    plant_name: 'Eschscholzia californica', common_name: 'California Poppy',
    availability_date: '2026-03-01', container_size: '4-inch pot', price: 5.99,
    description: 'Brilliant orange to yellow cup-shaped flowers on delicate blue-green foliage. Self-seeds readily and thrives in poor, dry soils with minimal care.',
    sun_requirements: 'Full Sun', moisture_requirements: 'Dry', type: 'Annual', image_url: null,
  },
  {
    plant_name: 'Rudbeckia hirta', common_name: 'Black-Eyed Susan',
    availability_date: '2026-04-01', container_size: '1 gallon', price: 11.99,
    description: 'Cheerful golden-yellow daisy-like flowers with a distinctive dark brown center. A tough, adaptable wildflower that blooms prolifically from summer into fall.',
    sun_requirements: 'Full Sun', moisture_requirements: 'Medium', type: 'Perennial', image_url: null,
  },
  {
    plant_name: 'Asclepias tuberosa', common_name: 'Butterfly Weed',
    availability_date: '2026-04-15', container_size: '1 gallon', price: 14.99,
    description: 'Vivid orange flower clusters that are irresistible to monarch butterflies and other pollinators. Deep taproot makes it drought-tolerant once established.',
    sun_requirements: 'Full Sun', moisture_requirements: 'Dry', type: 'Perennial', image_url: null,
  },
  {
    plant_name: 'Monarda didyma', common_name: 'Bee Balm',
    availability_date: '2026-03-15', container_size: '1 gallon', price: 13.49,
    description: 'Shaggy scarlet flower heads on sturdy stems that hummingbirds and bees find irresistible. The aromatic leaves can be used to make herbal tea.',
    sun_requirements: 'Part Shade', moisture_requirements: 'Moist', type: 'Perennial', image_url: null,
  },
  {
    plant_name: 'Aquilegia canadensis', common_name: 'Wild Columbine',
    availability_date: '2026-03-01', container_size: '4-inch pot', price: 6.99,
    description: 'Nodding red and yellow spurred flowers are perfectly shaped for ruby-throated hummingbirds. One of the first native wildflowers to bloom in spring.',
    sun_requirements: 'Part Shade', moisture_requirements: 'Medium', type: 'Perennial', image_url: null,
  },
  {
    plant_name: 'Solidago rugosa', common_name: 'Goldenrod',
    availability_date: '2026-05-01', container_size: '1 gallon', price: 10.99,
    description: 'Arching plumes of golden yellow flowers in late summer and fall, providing critical nectar for migrating monarchs and native bees preparing for winter.',
    sun_requirements: 'Full Sun', moisture_requirements: 'Medium', type: 'Perennial', image_url: null,
  },
  {
    plant_name: 'Liatris spicata', common_name: 'Blazing Star',
    availability_date: '2026-04-01', container_size: '4-inch pot', price: 7.99,
    description: 'Tall spikes of rosy-purple flowers that bloom from top to bottom, making a dramatic vertical accent in the garden. Extremely attractive to monarch butterflies.',
    sun_requirements: 'Full Sun', moisture_requirements: 'Medium', type: 'Perennial', image_url: null,
  },
  {
    plant_name: 'Penstemon digitalis', common_name: 'Foxglove Beardtongue',
    availability_date: '2026-03-15', container_size: '1 gallon', price: 12.49,
    description: 'Clusters of white tubular flowers with purple-tinged throats on strong upright stems. One of the most adaptable and pest-free native penstemons.',
    sun_requirements: 'Part Shade', moisture_requirements: 'Medium', type: 'Perennial', image_url: null,
  },
  {
    plant_name: 'Coreopsis lanceolata', common_name: 'Lanceleaf Tickseed',
    availability_date: '2026-03-01', container_size: '4-inch pot', price: 6.49,
    description: 'Bright yellow daisy-like flowers bloom for weeks in early summer, and again in fall if deadheaded. Extremely drought-tolerant and low-maintenance.',
    sun_requirements: 'Full Sun', moisture_requirements: 'Dry', type: 'Perennial', image_url: null,
  },
  {
    plant_name: 'Baptisia australis', common_name: 'Blue False Indigo',
    availability_date: '2026-04-15', container_size: '2 gallon', price: 19.99,
    description: 'Striking indigo-blue pea-like flowers in spring followed by attractive inflated seed pods. A long-lived, drought-tolerant plant that improves with age.',
    sun_requirements: 'Full Sun', moisture_requirements: 'Dry', type: 'Perennial', image_url: null,
  },
  {
    plant_name: 'Helianthus maximiliani', common_name: 'Maximilian Sunflower',
    availability_date: '2026-05-01', container_size: '1 gallon', price: 11.49,
    description: 'Tall, late-blooming sunflower with masses of golden-yellow flowers that provide important fall nectar. Seeds are eaten by songbirds throughout winter.',
    sun_requirements: 'Full Sun', moisture_requirements: 'Dry', type: 'Perennial', image_url: null,
  },
  {
    plant_name: 'Symphyotrichum novae-angliae', common_name: 'New England Aster',
    availability_date: '2026-04-01', container_size: '1 gallon', price: 12.99,
    description: 'Masses of rich purple daisy flowers with yellow centers that provide vital late-season nectar for migrating monarchs and native bees.',
    sun_requirements: 'Full Sun', moisture_requirements: 'Moist', type: 'Perennial', image_url: null,
  },
  {
    plant_name: 'Lobelia cardinalis', common_name: 'Cardinal Flower',
    availability_date: '2026-03-15', container_size: '4-inch pot', price: 8.99,
    description: 'Brilliant scarlet flower spikes that are the top nectar source for ruby-throated hummingbirds. Thrives in moist, partially shaded spots near water features.',
    sun_requirements: 'Part Shade', moisture_requirements: 'Wet', type: 'Perennial', image_url: null,
  },
  {
    plant_name: 'Panicum virgatum', common_name: 'Switchgrass',
    availability_date: '2026-03-01', container_size: '2 gallon', price: 16.99,
    description: 'A versatile native grass with airy pink-tinged seed heads that turn golden in fall and persist through winter, providing cover and seeds for birds.',
    sun_requirements: 'Full Sun', moisture_requirements: 'Medium', type: 'Grass', image_url: null,
  },
];

// Clear existing data and reseed
db.prepare('DELETE FROM order_items').run();
db.prepare('DELETE FROM orders').run();
db.prepare('DELETE FROM plants').run();

const insert = db.prepare(`
  INSERT INTO plants (plant_name, common_name, availability_date, container_size, price, description, sun_requirements, moisture_requirements, type, image_url)
  VALUES (@plant_name, @common_name, @availability_date, @container_size, @price, @description, @sun_requirements, @moisture_requirements, @type, @image_url)
`);

const seedAll = db.transaction((plants) => {
  for (const plant of plants) {
    insert.run(plant);
  }
});

seedAll(plants);
console.log(`Seeded ${plants.length} plants into the database.`);
