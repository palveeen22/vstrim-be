import bcrypt from 'bcrypt';
import { PrismaClient, JoinReason, VibeType, PlaceType } from '@prisma/client';

const prisma = new PrismaClient();
const DEFAULT_PASSWORD = 'Password123!';
const saltRounds = 10;

async function main() {
  console.log('🌱 Starting SPB-only seed...');

  // Clean SPB-related data
  await prisma.eventRecommendation.deleteMany();
  await prisma.placeRecommendation.deleteMany();
  await prisma.userHangoutPlace.deleteMany();
  await prisma.userCoordinates.deleteMany();
  await prisma.userMatch.deleteMany();
  await prisma.userEvent.deleteMany();
  await prisma.userCommunity.deleteMany();
  await prisma.event.deleteMany();
  await prisma.promo.deleteMany();
  await prisma.place.deleteMany();
  await prisma.community.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, saltRounds);

  // ===== USERS =====
  const usersData = [
    { 
      name: 'Ivan Petrov',
      email: 'ivan@spb.ru',
      username: 'ivan_spb',
      bio: 'Yoga lover',
      photoProfile: 'https://curatedcom.s3.eu-west-2.amazonaws.com/badf0114-70ec-49a8-918c-e59b0a63e31d_profile_F5E6A238-2CDE-4BA2-B932-6A1E63176A5A.jpeg',
      isVerified: true,
      dateOfBirth: new Date('1990-05-12'),
      joinReasons: [JoinReason.FIND_HOBBY_COMMUNITY],
      verificationCompleted: true,
      vibes: [VibeType.cozy, VibeType.active]
    },
    { 
      name: 'Olga Smirnova',
      email: 'olga@spb.ru',
      username: 'olga_spb',
      bio: 'Runner and fitness enthusiast',
      photoProfile: 'https://curatedcom.s3.eu-west-2.amazonaws.com/b91a6d1b-5c1b-43a9-a838-57c2c8c016dc_F1F87591-C6E4-46C7-9CAE-244FC1F78729.jpeg',
      isVerified: true,
      dateOfBirth: new Date('1992-07-21'),
      joinReasons: [JoinReason.FIND_ACTIVITY_PARTNERS],
      verificationCompleted: true,
      vibes: [VibeType.energetic]
    },
    { 
      name: 'Dmitry Sokolov',
      email: 'dmitry@spb.ru',
      username: 'dmitry_spb',
      bio: 'Paddle sports fan',
      photoProfile: 'https://curatedcom.s3.eu-west-2.amazonaws.com/74109cc6-0e04-4f5f-9c8d-a651f8b35ad9_profile_DB278401-11B8-4379-B8E2-A1554A7ED21D.jpeg',
      isVerified: true,
      dateOfBirth: new Date('1988-11-03'),
      joinReasons: [JoinReason.EXPLORE_CITY],
      verificationCompleted: true,
      vibes: [VibeType.adventurous]
    },
    { 
      name: 'Anna Volkova',
      email: 'anna@spb.ru',
      username: 'anna_spb',
      bio: 'Tennis player and coach',
      photoProfile: 'https://curatedcom.s3.eu-west-2.amazonaws.com/52528e1b-73e8-4364-a226-fb4b892f5356_profile_628B6EF0-ECD8-4CFC-B3A2-597AE8DED353.jpeg',
      isVerified: true,
      dateOfBirth: new Date('1995-02-18'),
      joinReasons: [JoinReason.TRY_NEW_EXPERIENCES],
      verificationCompleted: true,
      vibes: [VibeType.active]
    },
    { 
      name: 'Sergey Ivanovich',
      email: 'sergey@spb.ru',
      username: 'sergey_spb',
      bio: 'Community organizer',
      photoProfile: 'https://curatedcom.s3.eu-west-2.amazonaws.com/36dd3aea-38ab-4923-a6f8-c2d5f035f655_B1658DB5-449F-4B5C-9C7A-C06A2418BD7B-85806-00000C2F5CDF3EBD.jpeg',
      isVerified: true,
      dateOfBirth: new Date('1991-09-30'),
      joinReasons: [JoinReason.MAKE_FRIENDS],
      verificationCompleted: true,
      vibes: [VibeType.cozy, VibeType.social]
    },
  ];

  const users = await Promise.all(
    usersData.map((data) => prisma.user.create({ data: { ...data, password: hashedPassword } }))
  );

  // ===== USER COORDINATES =====
  const SPB_COORDS = [
    { city: 'Saint Petersburg', district: 'Admiralteysky', latitude: 59.9311, longitude: 30.3609 },
    { city: 'Saint Petersburg', district: 'Vasileostrovsky', latitude: 59.9420, longitude: 30.2730 },
  ];

  for (let i = 0; i < users.length; i++) {
    const loc = SPB_COORDS[i % SPB_COORDS.length];
    await prisma.userCoordinates.create({
      data: {
        userId: users[i].id,
        latitude: loc.latitude,
        longitude: loc.longitude,
        city: loc.city,
        district: loc.district,
      },
    });
  }

  // ===== COMMUNITIES =====
  const communityData = [
    { name: 'SPB Yoga Community', description: 'Yoga enthusiasts in Saint Petersburg', icon: '🧘', image: 'https://example.com/yoga-community.jpg' },
    { name: 'SPB Runners', description: 'Running events and groups in SPB', icon: '🏃', image: 'https://example.com/runners.jpg' },
    { name: 'SPB Paddle Club', description: 'Paddle sports lovers', icon: '🛶', image: 'https://example.com/paddle.jpg' },
    { name: 'SPB Tennis League', description: 'Tennis players and coaching events', icon: '🎾', image: 'https://example.com/tennis.jpg' },
    { name: 'SPB Wellness Circle', description: 'Wellness and active lifestyle community', icon: '💆‍♀️', image: 'https://example.com/wellness.jpg' },
  ];

  const communities = await Promise.all(
    communityData.map((data) => prisma.community.create({ data }))
  );

  // ===== ASSIGN USERS TO COMMUNITIES =====
  for (let i = 0; i < users.length; i++) {
    const community = communities[i % communities.length];
    await prisma.userCommunity.create({ data: { userId: users[i].id, communityId: community.id } });
  }

  // ===== PLACES =====
  const placesData = [
    { name: 'Yoga Center SPB', address: 'Nevsky Prospekt 10', type: PlaceType.gym, latitude: 59.9310, longitude: 30.3600, city: 'Saint Petersburg', district: 'Admiralteysky', icon: '🏋️', image: 'https://example.com/yoga-center.jpg' },
    { name: 'SPB Running Track', address: 'Kamennoostrovsky 20', type: PlaceType.park, latitude: 59.9390, longitude: 30.3100, city: 'Saint Petersburg', district: 'Vasileostrovsky', icon: '🏃', image: 'https://example.com/running-track.jpg' },
    { name: 'Coffee Time', address: 'Ligovsky Prospekt 50', type: PlaceType.cafe, latitude: 59.9285, longitude: 30.3400, city: 'Saint Petersburg', district: 'Tsentralny', icon: '☕', image: 'https://example.com/coffee-time.jpg' },
    { name: 'Bean & Brew', address: 'Nevsky Prospekt 75', type: PlaceType.cafe, latitude: 59.9340, longitude: 30.3600, city: 'Saint Petersburg', district: 'Admiralteysky', icon: '☕', image: 'https://example.com/bean-brew.jpg' },
    { name: 'Golden Plate', address: 'Bolshaya Morskaya 12', type: PlaceType.restaurant, latitude: 59.9330, longitude: 30.3400, city: 'Saint Petersburg', district: 'Admiralteysky', icon: '🍽️', image: 'https://example.com/golden-plate.jpg' },
    { name: 'Riverside Dine', address: 'Petrovskaya Naberezhnaya 18', type: PlaceType.restaurant, latitude: 59.9350, longitude: 30.3200, city: 'Saint Petersburg', district: 'Vasileostrovsky', icon: '🍴', image: 'https://example.com/riverside-dine.jpg' },
    { name: 'Central Cafe', address: 'Sadovaya Street 30', type: PlaceType.cafe, latitude: 59.9315, longitude: 30.3550, city: 'Saint Petersburg', district: 'Tsentralny', icon: '☕', image: 'https://example.com/central-cafe.jpg' },
  ];

  const places = await Promise.all(
    placesData.map((data) => prisma.place.create({ data }))
  );

  // ===== EVENTS =====
  const now = new Date();
  const eventsData = [
    { name: 'Morning Yoga SPB', description: 'Start your day with yoga', date: new Date(now.getTime() + 86400000), placeId: places[0].id, communityId: communities[0].id, vibes: ['cozy', 'active'], icon: '🧘', image: 'https://example.com/morning-yoga.jpg' },
    { name: 'SPB City Run', description: 'Join our city running group', date: new Date(now.getTime() + 2 * 86400000), placeId: places[1].id, communityId: communities[1].id, vibes: ['energetic'], icon: '🏃', image: 'https://example.com/city-run.jpg' },
    { name: 'Paddle Meetup', description: 'Paddle with local enthusiasts', date: new Date(now.getTime() + 3 * 86400000), placeId: places[1].id, communityId: communities[2].id, vibes: ['adventurous'], icon: '🛶', image: 'https://example.com/paddle-meetup.jpg' },
    { name: 'Tennis Training SPB', description: 'Weekly tennis sessions', date: new Date(now.getTime() + 4 * 86400000), placeId: places[1].id, communityId: communities[3].id, vibes: ['active'], icon: '🎾', image: 'https://example.com/tennis-training.jpg' },
    { name: 'Wellness Weekend', description: 'Mindfulness and yoga', date: new Date(now.getTime() + 5 * 86400000), placeId: places[0].id, communityId: communities[4].id, vibes: ['cozy', 'social'], icon: '💆‍♀️', image: 'https://example.com/wellness-weekend.jpg' },
  ];

  await Promise.all(eventsData.map((data) => prisma.event.create({ data })));

  // ===== PROMOS =====
  const promoData = [
    { placeId: places[0].id, title: '10% Off Yoga Classes', discountCode: 'YOGA10', validUntil: new Date(Date.now() + 14 * 86400000), image: 'https://example.com/promo-yoga.jpg' },
    { placeId: places[1].id, title: 'Free Smoothie After Run', discountCode: 'RUNFREE', validUntil: new Date(Date.now() + 10 * 86400000), image: 'https://example.com/promo-run.jpg' },
    { placeId: places[2].id, title: 'Buy 1 Get 1 Coffee', discountCode: 'BREW2X', validUntil: new Date(Date.now() + 20 * 86400000), image: 'https://example.com/promo-coffee.jpg' },
    { placeId: places[3].id, title: '15% Off Any Drink', discountCode: 'CAFE15', validUntil: new Date(Date.now() + 7 * 86400000), image: 'https://example.com/promo-cafe.jpg' },
    { placeId: places[4].id, title: 'Dinner Discount 20%', discountCode: 'DINE20', validUntil: new Date(Date.now() + 30 * 86400000), image: 'https://example.com/promo-dinner.jpg' },
  ];

  await Promise.all(promoData.map((promo) => prisma.promo.create({ data: promo })));

  console.log('✅ SPB seed completed successfully with icons & images!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
