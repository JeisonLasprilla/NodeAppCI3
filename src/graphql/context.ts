import { PubSub } from 'graphql-subscriptions';

export interface Context {
  user?: {
    user_id: string;
    role: string;
  };
  pubsub: PubSub;
}
