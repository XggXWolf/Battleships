import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
    public PrismaClient = new PrismaClient();

    constructor() {
        super();
    }
}
