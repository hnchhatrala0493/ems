import { User } from '../../models/User.js';
export class AuthRepository{findByEmailWithPassword(email:string){return User.findOne({email}).select('+password')}findById(id:string){return User.findById(id)}}
