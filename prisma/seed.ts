import bcrypt from 'bcrypt';
import { PrismaClient, JoinReason, VibeType, PlaceType } from '@prisma/client';

const prisma = new PrismaClient();
const DEFAULT_PASSWORD = 'Password123!';
const saltRounds = 10;

async function main() {
  console.log('🌱 Starting SPB seed...');

  // Clean previous data
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
  const usersDataOriginal = [
    { name: 'Ivan Petrov', bio: 'Yoga lover', joinReasons: [JoinReason.FIND_HOBBY_COMMUNITY], vibes: [VibeType.cozy, VibeType.active], photoProfile: 'https://curatedcom.s3.eu-west-2.amazonaws.com/badf0114-70ec-49a8-918c-e59b0a63e31d_profile_F5E6A238-2CDE-4BA2-B932-6A1E63176A5A.jpeg' },
    { name: 'Olga Smirnova', bio: 'Runner and fitness enthusiast', joinReasons: [JoinReason.FIND_ACTIVITY_PARTNERS], vibes: [VibeType.energetic], photoProfile: 'https://curatedcom.s3.eu-west-2.amazonaws.com/b91a6d1b-5c1b-43a9-a838-57c2c8c016dc_F1F87591-C6E4-46C7-9CAE-244FC1F78729.jpeg' },
    { name: 'Dmitry Sokolov', bio: 'Paddle sports fan', joinReasons: [JoinReason.EXPLORE_CITY], vibes: [VibeType.adventurous], photoProfile: 'https://curatedcom.s3.eu-west-2.amazonaws.com/74109cc6-0e04-4f5f-9c8d-a651f8b35ad9_profile_DB278401-11B8-4379-B8E2-A1554A7ED21D.jpeg' },
    { name: 'Anna Volkova', bio: 'Tennis player and coach', joinReasons: [JoinReason.TRY_NEW_EXPERIENCES], vibes: [VibeType.active], photoProfile: 'https://curatedcom.s3.eu-west-2.amazonaws.com/52528e1b-73e8-4364-a226-fb4b892f5356_profile_628B6EF0-ECD8-4CFC-B3A2-597AE8DED353.jpeg' },
    { name: 'Sergey Ivanovich', bio: 'Community organizer', joinReasons: [JoinReason.MAKE_FRIENDS], vibes: [VibeType.cozy, VibeType.social], photoProfile: 'https://curatedcom.s3.eu-west-2.amazonaws.com/36dd3aea-38ab-4923-a6f8-c2d5f035f655_B1658DB5-449F-4B5C-9C7A-C06A2418BD7B-85806-00000C2F5CDF3EBD.jpeg' },
  ];

  const usersData = Array.from({ length: 20 }).map((_, i) => {
    const u = usersDataOriginal[i % usersDataOriginal.length];
    return {
      ...u,
      email: `user${i + 1}@spb.ru`,
      username: `user${i + 1}_spb`,
      password: hashedPassword,
      dateOfBirth: new Date(`199${i % 10}-0${(i % 12) + 1}-15`),
      isVerified: true,
      verificationCompleted: true,
    };
  });

  const users = await Promise.all(usersData.map((data) => prisma.user.create({ data })));

  // ===== USER COORDINATES =====
  const SPB_COORDS = [
    { city: 'Saint Petersburg', district: 'Admiralteysky', latitude: 59.9311, longitude: 30.3609 },
    { city: 'Saint Petersburg', district: 'Vasileostrovsky', latitude: 59.9420, longitude: 30.2730 },
    { city: 'Saint Petersburg', district: 'Tsentralny', latitude: 59.9340, longitude: 30.3350 },
    { city: 'Saint Petersburg', district: 'Krasnoselsky', latitude: 59.9140, longitude: 30.3300 },
    { city: 'Saint Petersburg', district: 'Petrogradsky', latitude: 59.9550, longitude: 30.3200 },
  ];

  for (let i = 0; i < users.length; i++) {
    const loc = SPB_COORDS[i % SPB_COORDS.length];
    await prisma.userCoordinates.create({
      data: { userId: users[i].id, latitude: loc.latitude, longitude: loc.longitude, city: loc.city, district: loc.district },
    });
  }

  // ===== COMMUNITIES =====
  const communityDataOriginal = [
    { name: 'SPB Yoga Community', description: 'Yoga enthusiasts in Saint Petersburg', icon: '🧘', image: 'https://picsum.photos/seed/yoga/300/200' },
    { name: 'SPB Runners', description: 'Running events and groups in SPB', icon: '🏃', image: 'https://picsum.photos/seed/runners/300/200' },
    { name: 'SPB Paddle Club', description: 'Paddle sports lovers', icon: '🛶', image: 'https://picsum.photos/seed/paddle/300/200' },
    { name: 'SPB Tennis League', description: 'Tennis players and coaching events', icon: '🎾', image: 'https://picsum.photos/seed/tennis/300/200' },
    { name: 'SPB Wellness Circle', description: 'Wellness and active lifestyle community', icon: '💆‍♀️', image: 'https://picsum.photos/seed/wellness/300/200' },
  ];

  const communityData = Array.from({ length: 10 }).map((_, i) => {
    const c = communityDataOriginal[i % communityDataOriginal.length];
    return {
      ...c,
      name: `${c.name} #${i + 1}`,
      latitude: SPB_COORDS[i % SPB_COORDS.length].latitude + Math.random() * 0.001,
      longitude: SPB_COORDS[i % SPB_COORDS.length].longitude + Math.random() * 0.001,
      city: SPB_COORDS[i % SPB_COORDS.length].city,
      district: SPB_COORDS[i % SPB_COORDS.length].district
    };
  });

  const communities = await Promise.all(communityData.map((data) => prisma.community.create({ data })));

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

  // ===== EVENTS =====
  const now = new Date();
  const eventsDataOriginal = [
    { name: 'Morning Yoga SPB', vibes: [VibeType.cozy, VibeType.active], icon: '🧘' },
    { name: 'SPB City Run', vibes: [VibeType.energetic], icon: '🏃' },
    { name: 'Paddle Meetup', vibes: [VibeType.adventurous], icon: '🛶' },
    { name: 'Tennis Training SPB', vibes: [VibeType.active], icon: '🎾' },
    { name: 'Wellness Weekend', vibes: [VibeType.cozy, VibeType.social], icon: '💆‍♀️' },
  ];

  const eventsData = Array.from({ length: 10 }).map((_, i) => {
    const e = eventsDataOriginal[i % eventsDataOriginal.length];
    const usePlace = i % 2 === 0; // setengah event pakai place
    const useCommunity = i % 3 === 0; // beberapa event pakai komunitas
    const place = usePlace ? places[i % places.length] : null;
    const community = useCommunity ? communities[i % communities.length] : null;

    return {
      name: `${e.name} #${i + 1}`,
      description: e.name,
      date: new Date(now.getTime() + (i + 1) * 86400000),
      placeId: place?.id,
      communityId: community?.id,
      vibes: e.vibes,
      icon: e.icon,
      image: `https://picsum.photos/seed/event${i + 1}/300/200`,
      latitude: !place ? SPB_COORDS[i % SPB_COORDS.length].latitude + Math.random() * 0.001 : null,
      longitude: !place ? SPB_COORDS[i % SPB_COORDS.length].longitude + Math.random() * 0.001 : null,
      city: !place ? SPB_COORDS[i % SPB_COORDS.length].city : null,
      district: !place ? SPB_COORDS[i % SPB_COORDS.length].district : null,
    };
  });

  await Promise.all(eventsData.map((data) => prisma.event.create({ data })));

  console.log('✅ SPB seed completed successfully with updated schema!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
