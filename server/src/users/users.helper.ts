import { isMongoId } from 'class-validator';

const VALID_EXTENSIONS = ['elo', 'role', 'email'] as const;

const ROLE_EXTEND_PERMS: Record<string, readonly Extension[]> = {
  admin: ['elo', 'role', 'email'],
  user: ['elo', 'role'],
} as const;
type Extension = (typeof VALID_EXTENSIONS)[number];

/** Parses the 'extend' query parameter to determine which additional fields (elo, type, email) should be included in the response.
 *  The allowed extensions depend on the user's role, which is determined by the 'role' parameter. */
export function parseExtensions(role: string, extend?: string): Extension[] {
  if (typeof extend !== 'string' || extend.length === 0) return [];

  // Auth guard already checks if the role is valid, so we can assume it's one of the keys in ROLE_EXTEND_PERMS
  const allowedExtensions: readonly Extension[] = ROLE_EXTEND_PERMS[role];

  return extend
    .split(',')
    .map((e) => e.trim())
    .filter(
      (e): e is Extension =>
        VALID_EXTENSIONS.includes(e as Extension) &&
        allowedExtensions.includes(e as Extension),
    );
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
