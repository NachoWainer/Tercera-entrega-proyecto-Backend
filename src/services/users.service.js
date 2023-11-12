import { HttpError, HTTP_STATUS } from "../utils/utils.js";
import { getDAOS } from "../models/daos/indexDAO.js";

const { usersDao } = getDAOS();

export class UsersService {
    async getUsers() {
      const users = await usersDao.getUsers();
      return users;
    }
    async getUserByMail(mail){
      if (!mail) {
        throw new HttpError('Missing param', HTTP_STATUS.BAD_REQUEST)
      }
      const user = await usersDao.getUserByMail(mail);
      if (!user) {
        throw new HttpError('User not found', HTTP_STATUS.NOT_FOUND)
      }
      return user;
    }

    async getUserById(id) {
      if (!id) {
        throw new HttpError('Missing param', HTTP_STATUS.BAD_REQUEST)
      }
      const user = await usersDao.getUserById(id);
      if (!user) {
        throw new HttpError('User not found', HTTP_STATUS.NOT_FOUND)
      }
      return user;
    }

    async createUser(payload) {
      const { name, email } = payload;
      if (!name || !email) {
        throw new HttpError('Missing fields', HTTP_STATUS.BAD_REQUEST);
      }

      const newUserPayload = {
        name,
        email,
        role: 'USER',
        orders: []
      };

      const newUser = await usersDao.createUser(newUserPayload);
      return newUser;
    }
    async updateUserRole(id,newRole){
      if (!id) {
        throw new HttpError('Missing param', HTTP_STATUS.BAD_REQUEST);
      }
      if (!newRole) {
        throw new HttpError('Missing fields', HTTP_STATUS.BAD_REQUEST);
      }
      const updatedUser = await usersDao.updateUser(id, newRole);
      return updatedUser;
      
    }

    async updateUser(id, payload) {
      if (!id) {
        throw new HttpError('Missing param', HTTP_STATUS.BAD_REQUEST);
      }
      const { name, email } = payload;
      if (!name || !email) {
        throw new HttpError('Missing fields', HTTP_STATUS.BAD_REQUEST);
      }
      const updatePayload = {};
      payload.name && (updatePayload.name = payload.name);
      payload.email && (updatePayload.email = payload.email);
      const updatedUser = await usersDao.updateUser(id, updatePayload);
      return updatedUser;
    }


    async uploadDocument(userId, folder, files) {
      if (!userId || !folder || !files || files.length === 0) {
        throw new HttpError('Missing or invalid parameters', HTTP_STATUS.BAD_REQUEST);
      }
      const user = await usersDao.getUserById(userId);
      if (!user) {
        throw new HttpError('User not found', HTTP_STATUS.NOT_FOUND);
      }
  
      const documentField = `documentStatus.${folder}`;
  
      files.forEach((file) => {
        user.documents.push({
          name: file.originalname,
          reference: file.path, 
        });
      });
      const updatedUser = await usersDao.updateUser(userId, user);
      return updatedUser;
    }

    async deleteUsers(userId,cartId){
      if (!userId){
        throw new HttpError('Missing or invalid parameters', HTTP_STATUS.BAD_REQUEST);
      }
      const deletedUser = await usersDao.deleteUser(userId,cartId)
      if (deletedUser == -1) throw new HttpError('User not found', HTTP_STATUS.NOT_FOUND);
    }

}
