import usersModel from "../../schemas/Users.model.js";
import UsersModel from "../../schemas/Users.model.js";
import cartsModel from "../../schemas/carts.schema.js";

export class UsersDAO {
  async getUsers() {
    const users = await UsersModel.find().lean();
    return users;
  }

  async getUserById(id) {
    const user = await UsersModel.findOne({ _id: id }).lean();
    return user;
  }
  async getUserByMail(mail) {
    const user = await UsersModel.findOne({ email: mail }).lean();
    return user;
  }

  async createUser(payload) {
    const newUser = await UsersModel.create(payload);
    return newUser;
  }

  async updateUser(id, payload) {
    const updatedUser = await UsersModel.updateOne({ _id: id }, {
      $set: {role:payload}
    });
    return updatedUser;
  }
  async deleteUser(id,cartid){
    try {
      const deleteCart = await cartsModel.deleteOne({_id:cartid})
      const deletedUser = await usersModel.deleteOne({_id: id})
      return 1
      
    } catch (error) {
      return -1
      
    }
  }
}