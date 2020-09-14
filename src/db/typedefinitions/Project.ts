import tgq from 'type-graphql';
import { User } from './User.js';

@tgq.ObjectType()
export class Project {
    // @tgq.Field(() => String)
    // id!: string;

    @tgq.Field(() => String)
    channel_id!: string;

    @tgq.Field(() => [String])
    owners!: string[];

    @tgq.Field(() => [User], { nullable: true })
    ownerUsers!: User[];

    // @tgq.Field(() => String)
    // role_id!: string;
}
