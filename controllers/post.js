const Post = require("../models/post");
const Category = require("../models/category");
const { errorHandler } = require("../helpers/dbErrorHandler");
const { ApiResponse } = require("../helpers");

const fs = require("fs");

//add post
exports.addPost = (req, res) => {
  req.body.createdBy = req.user._id;
  req.body.tags = req.body.tags && req.body.tags.split(",");
  const post = new Post(req.body);
  post.save((err, post) => {
    if (err) {
      return res.json(
        ApiResponse(
          {},
          errorHandler(err) ? errorHandler(err) : err.message,
          false
        )
      );
    }
    return res.json(ApiResponse(post));
  });
};

//get all posts
exports.getPosts = (req, res) => {
  console.log("admin",req.query.admin)
  const options = {
    page: req.query.page ? req.query.page : 1,
    limit: req.query.limit ? req.query.limit : 10,
  };

  let finalAggregate = [];

  finalAggregate.push({
    $lookup: {
      from: "categories",
      localField: "category",
      foreignField: "_id",
      as: "category",
    },
  },
  //in the comments modal get length of all comments with post id
  {
    $lookup: {
      from: "comments",
      let: { id: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$post", "$$id"],
            },
          },
        },
        {
          $count: "count",
        },
      ],
      as: "comments",
    },
  },
  {
    $project: {
      "category.createdBy": 0,
      "category.createdAt": 0,
      "category.updatedAt": 0,
    },
  },
  { $unwind: "$category" });

  if(!req.query.admin) {
    console.log("in condition")
    finalAggregate.push({
      $match: {
        status: "active",
      },
    });
  }

  const myAggregate = finalAggregate.length > 0 ? Post.aggregate(finalAggregate).sort({ postDate: -1 }) : Post.aggregate([]);
  
  

  Post.aggregatePaginate(myAggregate, options, (err, results) => {
    if (err) {
      return res.json(
        ApiResponse(
          {},
          errorHandler(err) ? errorHandler(err) : err.message,
          false
        )
      );
    }
    if (!results) {
      return res.json(ApiResponse({}, "No posts found", false));
    }

    return res.json(ApiResponse(results));
  });
};

//get post by id
exports.getPostById = (req, res) => {
  Post.findById(req.params.id, (err, post) => {
    if (err) {
      return res.json(
        ApiResponse(
          {},
          errorHandler(err) ? errorHandler(err) : err.message,
          false
        )
      );
    }
    if (!post) {
      return res.json(ApiResponse({}, "Post not found", false));
    }
    return res.json(ApiResponse(post));
  });
};

//update post
exports.updatePost = (req, res) => {
  //delete previous image from file if new image is uploaded
  if (req.body.image) {
    Post.findById(req.params.id, (err, plan) => {
      if (err) {
        return res.json(ApiResponse({}, errorHandler(err) ? errorHandler(err) : err.message, false))
      }
      if (plan.image) {
        fs.unlinkSync(`./uploads/${plan.image}`);
      }
    })
  }


  req.body.tags = req.body.tags && req.body.tags.split(",");
  try {
    Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
      (err, post) => {
        if (err) {
          return res.json(
            ApiResponse(
              {},
              errorHandler(err) ? errorHandler(err) : err.message,
              false
            )
          );
        }
        if (!post) {
          return res.json(ApiResponse({}, "Post not found", false));
        }
        return res.json(ApiResponse(post));
      }
    );
  } catch (error) {
    return res.json(
      ApiResponse(
        {},
        errorHandler(err) ? errorHandler(err) : err.message,
        false
      )
    );
  }
};

//delete post
exports.deletePost = (req, res) => {
  Post.findByIdAndRemove(req.params.id, (err, post) => {
    if (err) {
      return res.json(
        ApiResponse(
          {},
          errorHandler(err) ? errorHandler(err) : err.message,
          false
        )
      );
    }
    if (!post) {
      return res.json(ApiResponse({}, "Post not found", false));
    }
    return res.json(ApiResponse(post, "Post deleted successfully"));
  });
};

//post by slug including previous and next post
exports.getPostBySlug = (req, res) => {
  Post.findOne({ slug: req.params.slug })
    .populate("category")
    .exec((err, post) => {
      if (err) {
        return res.json(
          ApiResponse(
            {},
            errorHandler(err) ? errorHandler(err) : err.message,
            false
          )
        );
      }
      if (!post) {
        return res.json(ApiResponse({}, "Post not found", false));
      }
      Post.find({})
        .sort({ createdAt: -1 })
        .exec((err, posts) => {
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
          let previousPost = null;
          let nextPost = null;
          for (let i = 0; i < posts.length; i++) {
            console.log(post._id);
            if (posts[i]._id.toString() == post._id.toString()) {
              if (i > 0) {
                previousPost = posts[i - 1];
              }
              if (i < posts.length - 1) {
                nextPost = posts[i + 1];
              }
            }
          }
          return res.json(ApiResponse({ post, previousPost, nextPost }));
        });
    });
};

exports.importPosts = (req, res) => {
  try {
    fs.readFile(__dirname + "/../uploads/" + req.body.image,async (err, data) => {
      if (err) {
        console.log(err);
        return res.json(ApiResponse({}, err.message, false));
      }

      try {
        fs.unlinkSync(__dirname + "/../uploads/" + req.body.image);
        console.log("File is deleted.");
      } catch (error) {
        console.log(error);
      }
      const posts = JSON.parse(data.toString());

      Category.find({}, (err, categories) => {
        let uncategorized = {}

        const newData = posts.map((item) => {
          const status = categories
            .map((_) => {
              if(_.name=="Uncategorized") {
                uncategorized = _
              }
              return _._id
            })
            .includes(item.category)
          if (status) {
            return item
          }
          else {
            const _item = { ...item, category: uncategorized._id }
            return _item
          }
        })
      console.log(newData,'newData');

        Post.insertMany(newData, (err, posts) => {
          if (err) {
            return res.json(
              ApiResponse(
                {},
                errorHandler(err) ? errorHandler(err) : err.message,
                false
              )
            );
          }
          return res.json(ApiResponse(posts));
        }
        )


      })

    });
     

      // find a category named uncategorized and if not found create one

  } catch (error) {
    return res.json(
      ApiResponse(
        {},
        errorHandler(err) ? errorHandler(err) : err.message,
        false
      )
    );
  }
};


// export posts
exports.exportPosts = (req, res) => {
  Post.find({})
    .sort({ createdAt: -1 })
    .exec((err, posts) => {
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
      return res.json(ApiResponse(posts, "", true));
    });
};


// //update all the posts and set theie createdAt date as PostDate 
// exports.updatePostDate = (req, res) => {
//   Post.find({}, (err, posts) => {
//     if (err) {
//       return res.json(
//         ApiResponse(
//           {},
//           errorHandler(err) ? errorHandler(err) : err.message,
//           false
//         )
//       );
//     }
//     if (!posts) {
//       return res.json(ApiResponse({}, "No posts found", false));
//     }
//     posts.map((post) => {
//       post.status = "active";
//       post.save();
//     });
//     return res.json(ApiResponse(posts));
//   });
// }