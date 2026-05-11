import { isMongoId } from 'class-validator';

const VALID_EXTENSIONS = ['elo', 'role', 'email'] as const;
type Extension = (typeof VALID_EXTENSIONS)[number];

/** Parses the 'extend' query parameter to determine which additional fields (elo, type, email) should be included in the response. */
export function parseExtensions(extend?: string): Extension[] {
  if (typeof extend !== 'string' || extend.length === 0) return [];

  return extend
    .split(',')
    .map((e) => e.trim())
    .filter((e): e is Extension => VALID_EXTENSIONS.includes(e as Extension));
}

/** Builds a query object for Prisma based on the provided identifier, which can be either a MongoDB ObjectId or a nickname.*/
export function buildUserQuery(identifier: string) {
  return isMongoId(identifier) ? { id: identifier } : { nickname: identifier };
}

/** Builds a select object for Prisma queries based on the requested extensions.*/
export function buildUserSelect(extensions: Extension[]) {
  return {
    id: true,
    nickname: true,
    ...(extensions.includes('elo') && { elo: true }),
    ...(extensions.includes('role') && { role: true }),
    ...(extensions.includes('email') && { email: true }),
  };
}
