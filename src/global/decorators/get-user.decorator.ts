import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  async (data: string | undefined, ctx: ExecutionContext) => {
    const request = await ctx.switchToHttp().getRequest();
    const user = request.user; // Access the user attached to the request by AuthGuard
    // If data is provided, return specific property, otherwise return the full user
    return data ? user?.[data] : user;
  },
);
