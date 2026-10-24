import { prisma } from "../../config/prisma";
import { UserData } from "./Auth.types";

export const R_register = async (newUser: UserData) => {
  return await prisma.user.create({
    data: {
      userName: newUser.userName,
      email: newUser.email,
      password: newUser.password,
       ...(newUser.phoneNumber !== undefined && {
        phoneNumber: newUser.phoneNumber,
      }),

      ...(newUser.image !== undefined && {
        image: newUser.image,
      }),

      ...(newUser.imagePublicId !== undefined && {
        imagePublicId: newUser.imagePublicId,
      }),
      

    },
  });
};

export const findUser = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};