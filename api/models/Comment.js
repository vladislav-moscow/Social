import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
	{
		postId: {
			type: String,
		},
		userId: {
			type: String,
		},
		comment: {
			type: String,
		},
		img: {
			type: String,
		},
	},
	{ timestamps: true }
);

export default mongoose.model('Comment', CommentSchema);