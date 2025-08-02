import { isValidObjectId, Types } from 'mongoose';
import { IComment } from '../lib/interface/comment';
import { ApiError } from '../middlewares/error.middleware';
import { Blog } from '../models/blog.model';
import { Comment } from '../models/comment.model';

export class CommentService {
  // Add comment to particular blog
  public async addComment(
    commentData: Pick<IComment, 'content'>,
    blogId: string,
    userId: string
  ): Promise<IComment> {
    // Check if blog id is valid
    if (!isValidObjectId(blogId)) {
      throw new ApiError('Invalid blog id', 400);
    }

    // Check if particular blog exists
    const blog = await Blog.findById(blogId);

    if (!blog) {
      throw new ApiError('Blog not found', 404);
    }

    // Create and save new comment
    const comment = new Comment({
      content: commentData.content,
      blog: blog._id,
      author: new Types.ObjectId(userId),
    });

    await comment.save();

    // Push comments to blog
    blog.comments?.push(comment._id);
    await blog.save();

    return comment;
  }

  // Get all comments for a specific blog
  public async getCommentsByBlog(
    blogId: string
  ): Promise<IComment | IComment[]> {
    // Check if blog id is valid
    if (!isValidObjectId(blogId)) {
      throw new ApiError('Invalid blog id', 400);
    }

    // Check if blog exists
    const blog = await Blog.findById(blogId);

    if (!blog) {
      throw new ApiError('Blog not found', 404);
    }

    // Find and return comments if exists
    const comments = await Comment.find()
      .populate('author', 'fullName email')
      .populate('blog', 'title');

    return comments;
  }
}

export const commentService = new CommentService();
