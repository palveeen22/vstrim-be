import { InterestCategory, JoinReason, Prisma, VibeType } from '@prisma/client';
import prisma from '../../prisma'
import AppError from "../../libs/app-error";
import * as bcrypt from 'bcrypt';
import RedisClient from '../../libs/redis-client';
import { TUser, TUserUpdate } from '@/libs/type';

export interface CreateUserParams {
  email: string;
  password: string;
  isVerified?: boolean;
}

export interface ProfileSetupParams {
  username: string;
  mood: string;
  interests: string[];
  joinReasons: JoinReason[];
  coordinates: {
    latitude: number;
    longitude: number;
    city?: string;
    district?: string;
    province?: string;
    accuracy?: number;
  };
  hangoutPlaces: Array<{
    placeName: string;
    placeType: string;
    latitude: number;
    longitude: number;
    address?: string;
    city?: string;
    district?: string;
    googlePlaceId?: string;
    isPrimary?: boolean;
    visitFrequency?: string;
  }>;
}


const prismaJoinReasonMap: Record<string, JoinReason> = {
  make_friends: JoinReason.MAKE_FRIENDS,
  find_activity_partners: JoinReason.FIND_ACTIVITY_PARTNERS,
  explore_city: JoinReason.EXPLORE_CITY,
  try_new_experiences: JoinReason.TRY_NEW_EXPERIENCES,
  professional_networking: JoinReason.PROFESSIONAL_NETWORKING,
  dating_relationships: JoinReason.DATING_RELATIONSHIPS,
  new_to_area: JoinReason.NEW_TO_AREA,
  expand_social_circle: JoinReason.EXPAND_SOCIAL_CIRCLE,
  find_hobby_community: JoinReason.FIND_HOBBY_COMMUNITY,
  attend_events: JoinReason.ATTEND_EVENTS,
};

class UserService {

  static async findAllUsers() {
    return await prisma.user.findMany();
  }

  static async findUserByIdentifier(identifier?: string) {
    // If both are provided, we use OR condition
    if (identifier) {
      return await prisma.user.findFirst({
        where: {
          OR: [
            { username: identifier },
            { email: identifier }
          ]
        },
        include: {
          dailyQuizzes: {
            include: {
              answers: {
                include: {
                  question: {
                    include: {
                      options: true
                    }
                  }
                }
              }
            }
          },
          coordinates: true,
          hangoutPlaces: true,
          communities: {
            include: {
              community: true
            }
          },
        }
      });
    }

    // If only username provided
    if (identifier) {
      return await prisma.user.findUnique({
        where: {
          username: identifier
        }
      });
    }

    // If only email provided
    if (identifier) {
      return await prisma.user.findUnique({
        where: {
          email: identifier
        }
      });
    }

    return null;
  }

  static async findUserById(identifier?: string) {
    // If both are provided, we use OR condition
    if (identifier) {
      return await prisma.user.findFirst({
        where: {
          OR: [
            { id: identifier },
          ]
        },
        include: {
          dailyQuizzes: true,
          coordinates: true,
          hangoutPlaces: true,
          communities: true,
        }
      });
    }

    // If only username provided
    if (identifier) {
      return await prisma.user.findUnique({
        where: {
          id: identifier
        }
      });
    }
    return null;
  }

  static async createUser(params: CreateUserParams): Promise<any> {
    // Validate required fields
    if (!params.email) {
      throw new AppError(400, "Email must be provided", 400);
    }


    if (!params.password) {
      throw new AppError(400, "Password must be provided", 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(params.password, 10);

    // Build userData
    const userData: Prisma.UserCreateInput = {
      email: params.email,
      password: hashedPassword,
      isVerified: params.isVerified ?? false,
      verificationCompleted: false
    };

    // Create user
    const user = await prisma.user.create({
      data: userData,
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        bio: true,
        dateOfBirth: true,
        photoProfile: true,
        joinReasons: true,
        isVerified: true,
        verificationCompleted: true,
        createdAt: true,
      }
    });

    return user;
  }

  static async updateUser(
    userId: string,
    params: TUserUpdate
  ): Promise<any> {
    try {
      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!existingUser) {
        throw new AppError(400, "User not found", 404);
      }

      // Build update data object - only include provided fields
      const updateData: Prisma.UserUpdateInput = {};

      if (params.name !== undefined) updateData.name = params.name;
      if (params.username !== undefined) updateData.username = params.username;
      if (params.bio !== undefined) updateData.bio = params.bio;
      if (params.dateOfBirth !== undefined) updateData.dateOfBirth = params.dateOfBirth;
      if (params.photoProfile !== undefined) updateData.photoProfile = params.photoProfile;
      if (params.joinReasons !== undefined) {
        if (params.joinReasons.length < 1 || params.joinReasons.length > 3) {
          throw new AppError(400, "Join reasons must be between 1-3 items", 400);
        }
        updateData.joinReasons = params.joinReasons.map(j => prismaJoinReasonMap[j]);
      }

      // Update user
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          username: true,
          bio: true,
          dateOfBirth: true,
          photoProfile: true,
          joinReasons: true,
          isVerified: true,
          verificationCompleted: true,
          createdAt: true,
        }
      });

      return updatedUser;

    } catch (error) {
      console.error('Update user error:', error);

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(400, "Failed to update user", 500);
    }
  }

  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      console.error('Password verification error:', error);
      return false;
    }
  }

  static async saveRefreshToken(userId: string, refreshToken: string): Promise<void> {
    try {
      console.log(`Saving refresh token for user: ${userId}`);

      // Get Redis client
      const redisClient = await RedisClient.getInstance();

      // Create refresh token data
      const tokenData = JSON.stringify({
        token: refreshToken,
        userId: userId,
        createdAt: new Date().toISOString()
      });

      // Store refresh token in Redis with 7 days expiration (604800 seconds)
      const redisKey = `refresh_token:${userId}:${refreshToken.slice(-8)}`; // Use last 8 chars as identifier
      await redisClient.set(redisKey, tokenData, { EX: 604800 }); // 7 days

      console.log(`Refresh token stored in Redis with key: ${redisKey}`);
    } catch (error) {
      console.error('Error saving refresh token:', error);
      throw new AppError(500, "Failed to save refresh token", 500);
    }
  }

static async completeProfileUser(
  userId: string,
  params: TUserUpdate
): Promise<Omit<TUser, 'password'> | null> {
  try {
    const verifiedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: params.name,
        username: params.username,
        bio: params.bio,
        dateOfBirth: params.dateOfBirth,
        photoProfile: params.photoProfile,
        verificationCompleted: true,

        vibes: params.vibes ? {
          set: params.vibes as VibeType[]
        } : undefined,
        
        joinReasons: params.joinReasons ? {
          set: params.joinReasons.map(j => 
            JoinReason[j.toUpperCase() as keyof typeof JoinReason]
          )
        } : undefined,
        
        interests: params.interests ? {
          set: params.interests as InterestCategory[]
        } : undefined,

        coordinates: params.coordinates ? {
          upsert: {
            create: params.coordinates,
            update: params.coordinates,
          },
        } : undefined,

        hangoutPlaces: params.hangoutPlaces ? {
          deleteMany: {},
          create: params.hangoutPlaces.map((p) => ({
            placeName: p.placeName,
            placeType: p.placeType,
            latitude: p.latitude,
            longitude: p.longitude,
            address: p.address,
          })),
        } : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        bio: true,
        dateOfBirth: true,
        photoProfile: true,
        vibes: true,
        tokens: true,
        coordinates: true,
        joinReasons: true,
        interests: true,
        hangoutPlaces: true,
        isVerified: true,
        createdAt: true,
        verificationCompleted: true,
      },
    });

    // Transform: null → undefined untuk match TUser interface
    return {
      id: verifiedUser.id,
      email: verifiedUser.email,
      isVerified: verifiedUser.isVerified,
      verificationCompleted: verifiedUser.verificationCompleted,
      createdAt: verifiedUser.createdAt,
      
      // Optional fields: convert null to undefined
      name: verifiedUser.name ?? undefined,
      username: verifiedUser.username ?? undefined,
      bio: verifiedUser.bio ?? undefined,
      dateOfBirth: verifiedUser.dateOfBirth ?? undefined,
      photoProfile: verifiedUser.photoProfile ?? undefined,
      tokens: verifiedUser.tokens ?? undefined,
      
      // Relations (already arrays, so safe)
      vibes: verifiedUser.vibes as VibeType[] | undefined,
      interests: verifiedUser.interests as InterestCategory[] | undefined,

      joinReasons: verifiedUser.joinReasons as JoinReason[] | undefined,
      // coordinates: verifiedUser.coordinates ?? undefined,
      // hangoutPlaces: verifiedUser.hangoutPlaces ?? undefined,
    };

  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new AppError(404, "User not found", 404);
      }
    }
    
    console.error('Update user error:', error);
    throw new AppError(500, "Failed to update user", 500);
  }
}

  static async findUserProfile(identifier?: string) {
    if (!identifier) return null;

    return await prisma.user.findFirst({
      where: {
        OR: [
          { username: identifier },
          { email: identifier }
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        bio: true,
        dateOfBirth: true,
        photoProfile: true,
        vibes: true,
        joinReasons: true,

        // Account status
        isVerified: true,
        verificationCompleted: true,
        createdAt: true,

        coordinates: {
          select: {
            id: true,
            latitude: true,
            longitude: true,
            city: true,
            updatedAt: true,
            createdAt: true,
          }
        },

        hangoutPlaces: {
          select: {
            id: true,
            placeName: true,
            placeType: true,
            latitude: true,
            longitude: true,
            address: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: [
            { createdAt: 'desc' }
          ]
        },

        communities: {
          select: {
            joinedAt: true,
            community: {
              select: {
                id: true,
                name: true,
                description: true,
                createdAt: true,
                // Optional: count members
                _count: {
                  select: {
                    users: true,
                    events: true
                  }
                }
              }
            }
          },
          orderBy: {
            joinedAt: 'desc'
          }
        },

        events: {
          select: {
            status: true,
            createdAt: true,
            event: {
              select: {
                id: true,
                name: true,
                description: true,
                date: true,
                endDate: true,
                capacity: true,
                price: true,
                isActive: true,
                banner: true,
                place: {
                  select: {
                    id: true,
                    name: true,
                    address: true,
                    city: true,
                    latitude: true,
                    longitude: true,
                    type: true,
                    image: true,
                  }
                },

                // Event community
                community: {
                  select: {
                    id: true,
                    name: true,
                  }
                },

                // Count attendees
                _count: {
                  select: {
                    users: true
                  }
                }
              }
            }
          },
          where: {
            event: {
              isActive: true,
              date: {
                gte: new Date() // Only upcoming events
              }
            }
          },
          orderBy: {
            event: {
              date: 'asc'
            }
          }
        },

        matchesAsUser1: {
          select: {
            matchScore: true,
            createdAt: true,
            user2: {
              select: {
                id: true,
                name: true,
                username: true,
                photoProfile: true,
                bio: true,
                vibes: true,
                coordinates: {
                  select: {
                    city: true,
                  }
                }
              }
            }
          },
          orderBy: {
            matchScore: 'desc'
          },
          take: 20 // Limit to top matches
        },

        matchesAsUser2: {
          select: {
            matchScore: true,
            createdAt: true,
            user1: {
              select: {
                id: true,
                name: true,
                username: true,
                photoProfile: true,
                bio: true,
                vibes: true,
                coordinates: {
                  select: {
                    city: true,
                  }
                }
              }
            }
          },
          orderBy: {
            matchScore: 'desc'
          },
          take: 20
        },

        matchesGiven: {
          select: {
            id: true,
            score: true,
            status: true,
            distance: true,
            breakdown: true,
            createdAt: true,
            expiresAt: true,
            respondedAt: true,
            matchedUser: {
              select: {
                id: true,
                name: true,
                username: true,
                photoProfile: true,
                bio: true,
                vibes: true,
                coordinates: {
                  select: {
                    city: true,
                  }
                },
              }
            }
          },
          where: {
            status: {
              not: 'expired'
            }
          },
          orderBy: {
            score: 'desc'
          },
          take: 10
        },

        matchesReceived: {
          select: {
            id: true,
            score: true,
            status: true,
            distance: true,
            breakdown: true,
            createdAt: true,
            expiresAt: true,
            respondedAt: true,
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                photoProfile: true,
                bio: true,
                vibes: true,
              }
            }
          },
          where: {
            status: 'pending'
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        },

        placeRecommendations: {
          select: {
            id: true,
            score: true,
            distance: true,
            reason: true,
            isViewed: true,
            isVisited: true,
            createdAt: true,
            expiresAt: true,
            place: {
              select: {
                id: true,
                name: true,
                address: true,
                type: true,
                description: true,
                image: true,
                latitude: true,
                longitude: true,
                city: true,
                district: true,
                rating: true,
              }
            }
          },
          where: {
            expiresAt: {
              gte: new Date() // Only active recommendations
            }
          },
          orderBy: {
            score: 'desc'
          },
          take: 10
        },

        eventRecommendations: {
          select: {
            id: true,
            score: true,
            distance: true,
            reason: true,
            isViewed: true,
            isInterested: true,
            createdAt: true,
            expiresAt: true,
            event: {
              select: {
                id: true,
                name: true,
                description: true,
                date: true,
                endDate: true,
                banner: true,
                capacity: true,
                price: true,
                place: {
                  select: {
                    name: true,
                    address: true,
                    city: true,
                  }
                }
              }
            }
          },
          where: {
            expiresAt: {
              gte: new Date()
            },
            event: {
              isActive: true
            }
          },
          orderBy: {
            score: 'desc'
          },
          take: 10
        },

        _count: {
          select: {
            hangoutPlaces: true,
            communities: true,
            events: true,
            matchesGiven: true,
            matchesReceived: true,
            placeRecommendations: true,
            eventRecommendations: true,
          }
        }
      }
    });
  }
}

export default UserService;