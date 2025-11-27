import prisma from '../../prisma';

export class DataService {
  static async findAll() {
    const [
      users,
      places,
      communities,
      events,
      promos,
      interests,
    ] = await Promise.all([
      prisma.user.findMany({
        include: {
          coordinates: true,
          hangoutPlaces: true,
          communities: true,
          events: true,
        },
      }),
      prisma.place.findMany({
        include: {
          promos: true,
          events: true,
        },
      }),
      prisma.community.findMany({
        include: {
          users: true,
          events: true,
        },
      }),
      prisma.event.findMany({
        include: {
          place: true,
          community: true,
        },
      }),
      prisma.promo.findMany(),
      prisma.interest.findMany(),
    ]);

    return { users, places, communities, events, promos, interests };
  }
}
