import { PubSub } from 'graphql-subscriptions';
import UserService from '../services/User.service';
import CommentService from '../services/Comment.service';
import ReactionService from '../services/Reaction.service';

export interface Context {
  user?: {
    user_id: string;
    role: string;
  };
  pubsub: PubSub;
  dataSources: {
    userService: typeof UserService;
    commentService: typeof CommentService;
    reactionService: typeof ReactionService;
  };
}

export default function createContext(): Context {
  const pubsub = new PubSub();
  return {
    pubsub,
    dataSources: {
      userService: UserService,
      commentService: CommentService,
      reactionService: ReactionService
    }
  };
}
