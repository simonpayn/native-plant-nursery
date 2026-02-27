const db = require('./db');

const plants = [
  { plant_name: 'Echinacea purpurea', common_name: 'Purple Coneflower', availability_date: '2026-03-15', container_size: '1 gallon', price: 12.99 },
  { plant_name: 'Eschscholzia californica', common_name: 'California Poppy', availability_date: '2026-03-01', container_size: '4-inch pot', price: 5.99 },
  { plant_name: 'Rudbeckia hirta', common_name: 'Black-Eyed Susan', availability_date: '2026-04-01', container_size: '1 gallon', price: 11.99 },
  { plant_name: 'Asclepias tuberosa', common_name: 'Butterfly Weed', availability_date: '2026-04-15', container_size: '1 gallon', price: 14.99 },
  { plant_name: 'Monarda didyma', common_name: 'Bee Balm', availability_date: '2026-03-15', container_size: '1 gallon', price: 13.49 },
  { plant_name: 'Aquilegia canadensis', common_name: 'Wild Columbine', availability_date: '2026-03-01', container_size: '4-inch pot', price: 6.99 },
  { plant_name: 'Solidago rugosa', common_name: 'Goldenrod', availability_date: '2026-05-01', container_size: '1 gallon', price: 10.99 },
  { plant_name: 'Liatris spicata', common_name: 'Blazing Star', availability_date: '2026-04-01', container_size: '4-inch pot', price: 7.99 },
  { plant_name: 'Penstemon digitalis', common_name: 'Foxglove Beardtongue', availability_date: '2026-03-15', container_size: '1 gallon', price: 12.49 },
  { plant_name: 'Coreopsis lanceolata', common_name: 'Lanceleaf Tickseed', availability_date: '2026-03-01', container_size: '4-inch pot', price: 6.49 },
  { plant_name: 'Baptisia australis', common_name: 'Blue False Indigo', availability_date: '2026-04-15', container_size: '2 gallon', price: 19.99 },
  { plant_name: 'Helianthus maximiliani', common_name: 'Maximilian Sunflower', availability_date: '2026-05-01', container_size: '1 gallon', price: 11.49 },
  { plant_name: 'Symphyotrichum novae-angliae', common_name: 'New England Aster', availability_date: '2026-04-01', container_size: '1 gallon', price: 12.99 },
  { plant_name: 'Lobelia cardinalis', common_name: 'Cardinal Flower', availability_date: '2026-03-15', container_size: '4-inch pot', price: 8.99 },
  { plant_name: 'Panicum virgatum', common_name: 'Switchgrass', availability_date: '2026-03-01', container_size: '2 gallon', price: 16.99 },
];

// Clear existing data and reseed
db.prepare('DELETE FROM order_items').run();
db.prepare('DELETE FROM orders').run();
db.prepare('DELETE FROM plants').run();

const insert = db.prepare(`
  INSERT INTO plants (plant_name, common_name, availability_date, container_size, price)
  VALUES (@plant_name, @common_name, @availability_date, @container_size, @price)
`);

const seedAll = db.transaction((plants) => {
  for (const plant of plants) {
    insert.run(plant);
  }
});

seedAll(plants);
console.log(`Seeded ${plants.length} plants into the database.`);
