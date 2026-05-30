import { SetMetadata } from '@nestjs/common';

export const SkipProfileCheck = () => SetMetadata('skipProfileCheck', true);
