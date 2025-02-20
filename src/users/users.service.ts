import { Injectable } from '@nestjs/common';
import { ResponseHelperService } from 'src/helper/response-helper.service';
import { ResponseModel } from 'src/models/global.model';
import { UserResponseModel } from 'src/models/user-profile.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthenticatedRequest } from 'src/schema/request.schema';
import { UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private userSingleResponseHelper: ResponseHelperService<UserResponseModel>,
    private userMultiResponseHelper: ResponseHelperService<UserResponseModel[]>,
  ) {}

  async getUser(
    req: AuthenticatedRequest,
  ): Promise<ResponseModel<UserResponseModel>> {
    const { user } = req;

    return this.userSingleResponseHelper.returnSuccessObject(
      'User fetched successfully',
      user,
    );
  }

  async getAllUsers(): Promise<ResponseModel<UserResponseModel[]>> {
    const users = await this.prisma.user.findMany({
      where: {
        isAdmin: false,
      },
    });

    if (users.length === 0) {
      this.userMultiResponseHelper.returnNotFound('No user found');
    }

    return this.userMultiResponseHelper.returnSuccessObject(
      'Users fetched successfully',
      users,
    );
  }

  async updateUser(
    userId: string,
    dto: UpdateUserDto,
  ): Promise<ResponseModel<UserResponseModel>> {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existingUser) {
      this.userSingleResponseHelper.returnNotFound('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        id: existingUser?.id,
      },
      data: {
        ...dto,
      },
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
      },
    });

    return this.userSingleResponseHelper.returnSuccessObject(
      'User updated successfully',
      updatedUser,
    );
  }

  async deleteUser(userId: string): Promise<ResponseModel<UserResponseModel>> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      this.userSingleResponseHelper.returnNotFound('User not found');
    }

    await this.prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return this.userSingleResponseHelper.returnSuccessObject(
      'User deleted successfully',
    );
  }
}
