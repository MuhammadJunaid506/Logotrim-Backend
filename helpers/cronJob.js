var cron = require('node-cron');
const Post = require("../models/post");

cron.schedule('1 0 * * *', () => {
   //get all posts and if postDate is greater than or equal to today's date, then set status to active
    Post.find({}, (err, posts) => {
        if (err) {
            return res.json(
                ApiResponse(
                    {},
                    errorHandler(err) ? errorHandler(err) : err.message,
                    false
                )
            );
        }
        if (!posts) {
            return res.json(ApiResponse({}, "No posts found", false));
        }
        posts.map((post) => {
            if (new Date(post.postDate).toDateString() === new Date().toDateString()) {
                post.status = "active";
                post.save();
            }
        });
    });
});