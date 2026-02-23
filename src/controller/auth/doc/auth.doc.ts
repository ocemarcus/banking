import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";


export class AuthDoc {
    static Controller() {
        return applyDecorators(ApiTags('Auth'));
    }
    static create() {
        return applyDecorators(
            ApiOperation({ summary: 'Autenticar usuário' }),
            ApiBody({
            schema: {
             type: 'object',
             properties: {
                 email: {
                    type: 'string',
                    example: 'jose@gmail.com',
                 },
                 password: {
                    type: 'string',
                    example: '323232',
                 },
             }
          }
        }
       ),
      ApiResponse({
        status: 200,
        schema: {
          example: {
              token: 'JWT',
              user: {
                 fullName: 'Jose Da Silva',
                 document: '21212121212'
              }
          },
        },
      }),
        )
    }
}