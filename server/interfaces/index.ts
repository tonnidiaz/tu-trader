import {H3Event, EventHandlerRequest} from 'h3'
import {IUser} from '../models/user'
export interface IE extends H3Event<EventHandlerRequest>{user?: IUser}
