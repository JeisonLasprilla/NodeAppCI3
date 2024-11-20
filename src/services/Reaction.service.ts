import Reaction, { IReaction, ReactionType } from '../models/Reaction';
import Comment from '../models/Comment';
import { GraphQLError } from 'graphql';

export class ReactionService {
    async addReaction(userId: string, commentId: string, type: ReactionType): Promise<IReaction> {
        const existingReaction = await Reaction.findOne({ user: userId, comment: commentId });
        
        if (existingReaction) {
            existingReaction.type = type;
            return await existingReaction.save();
        }

        const reaction = await Reaction.create({
            type,
            user: userId,
            comment: commentId
        });

        await Comment.findByIdAndUpdate(commentId, {
            $push: { reactions: reaction._id }
        });

        return reaction;
    }

    async removeReaction(userId: string, reactionId: string): Promise<void> {
        const reaction = await Reaction.findOne({ _id: reactionId, user: userId });
        
        if (!reaction) {
            throw new GraphQLError('Reacción no encontrada o no autorizado');
        }

        await Comment.findByIdAndUpdate(reaction.comment, {
            $pull: { reactions: reactionId }
        });

        await reaction.deleteOne();
    }

    async getReactionsByComment(commentId: string): Promise<IReaction[]> {
        return await Reaction.find({ comment: commentId }).populate('user');
    }

    async getReactionsByUser(userId: string): Promise<IReaction[]> {
        return await Reaction.find({ user: userId })
            .populate('comment')
            .sort({ createdAt: -1 });
    }
}
