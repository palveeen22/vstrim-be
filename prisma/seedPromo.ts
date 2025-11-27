import { PrismaClient, PlaceType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting promo seed for SPB...');

  // Hapus semua data promo dan tempat agar seed bersih
  await prisma.promo.deleteMany();
  await prisma.place.deleteMany();

  // ===== PLACES (SPB) =====
  const placesData = [
    { name: 'Yoga Center SPB', address: 'Nevsky Prospekt 10', type: PlaceType.gym, latitude: 59.9310, longitude: 30.3600, city: 'Saint Petersburg', district: 'Admiralteysky' },
    { name: 'SPB Running Track', address: 'Kamennoostrovsky 20', type: PlaceType.park, latitude: 59.9390, longitude: 30.3100, city: 'Saint Petersburg', district: 'Vasileostrovsky' },
    { name: 'Coffee Time', address: 'Ligovsky Prospekt 50', type: PlaceType.cafe, latitude: 59.9285, longitude: 30.3400, city: 'Saint Petersburg', district: 'Tsentralny' },
    { name: 'Bean & Brew', address: 'Nevsky Prospekt 75', type: PlaceType.cafe, latitude: 59.9340, longitude: 30.3600, city: 'Saint Petersburg', district: 'Admiralteysky' },
    { name: 'Golden Plate', address: 'Bolshaya Morskaya 12', type: PlaceType.restaurant, latitude: 59.9330, longitude: 30.3400, city: 'Saint Petersburg', district: 'Admiralteysky' },
    { name: 'Riverside Dine', address: 'Petrovskaya Naberezhnaya 18', type: PlaceType.restaurant, latitude: 59.9350, longitude: 30.3200, city: 'Saint Petersburg', district: 'Vasileostrovsky' },
    { name: 'Central Cafe', address: 'Sadovaya Street 30', type: PlaceType.cafe, latitude: 59.9315, longitude: 30.3550, city: 'Saint Petersburg', district: 'Tsentralny' },
  ];

  const places = await Promise.all(
    placesData.map((data) => prisma.place.create({ data }))
  );

  // ===== PROMOS =====
  const promoData = [
    { placeId: places[0].id, title: '10% Off Yoga Classes', discountCode: 'YOGA10', validUntil: new Date(Date.now() + 14 * 86400000) },
    { placeId: places[1].id, title: 'Free Smoothie After Run', discountCode: 'RUNFREE', validUntil: new Date(Date.now() + 10 * 86400000) },
    { placeId: places[2].id, title: 'Buy 1 Get 1 Coffee', discountCode: 'BREW2X', validUntil: new Date(Date.now() + 20 * 86400000) },
    { placeId: places[3].id, title: '15% Off Any Drink', discountCode: 'CAFE15', validUntil: new Date(Date.now() + 7 * 86400000) },
    { placeId: places[4].id, title: 'Dinner Discount 20%', discountCode: 'DINE20', validUntil: new Date(Date.now() + 30 * 86400000) },
    { placeId: places[5].id, title: 'Free Dessert with Meal', discountCode: 'SWEETFREE', validUntil: new Date(Date.now() + 21 * 86400000) },
    { placeId: places[6].id, title: 'Happy Hour 2-for-1', discountCode: 'HAPPYHOUR', validUntil: new Date(Date.now() + 14 * 86400000) },
  ];

  await Promise.all(promoData.map((promo) => prisma.promo.create({ data: promo })));

  console.log('✅ Promo seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding promo:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
