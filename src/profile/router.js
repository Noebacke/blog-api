const router = require("express").Router();
const { createProfile,
        getAllProfiles,
        updateProfile,
        deleteOneProfile,
        deleteAccount,
        getProfilById,
        getPostsByProfilId,
        getCommentsByIdPost } = require("./controllers/profile_controller");

// @route   GET /
// Good:  Get all authenticated account.profile
router.get("/",getAllProfiles);

// @route   POST /
router.post("/",createProfile);

// @route   PATCH /
// Good:  Update authenticated account.profile
router.patch("/:id",updateProfile);

// @route   DELETE /
// Good: Delete authenticated account.profile
router.delete('/:id',deleteOneProfile);
// @route   DELETE /
// Good: Delete authenticated account.profile

router.delete('/',deleteAccount);

// @route   GET /:id
// Good: Get a profile by id
router.get("/:id",getProfilById);

// @route   GET /:id/posts
// Good: Get all posts from a profile
router.get("/:id/posts",getPostsByProfilId);

// @route   GET /:id/comments
// Good: Get all comments from a profile
router.get("/:id/comments",getCommentsByIdPost);

module.exports = router;
