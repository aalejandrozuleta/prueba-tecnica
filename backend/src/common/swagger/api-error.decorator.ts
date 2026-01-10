import { ApiResponse } from '@nestjs/swagger';

export const ApiErrorResponses = () => {
  return ApiResponse({ status: 400, description: 'Bad Request' });
};
