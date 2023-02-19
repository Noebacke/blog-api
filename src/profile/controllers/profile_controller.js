const Comment = require("../../blog/models/comment");
const Company = require("../models/company");
const Person = require("../models/person");
const Post = require("../../blog/models/post");
const Profile = require("../models/profile");
const { getUrl } = require("../../../utils/getter");
const { removeFields } = require("../../../utils/remover");


// Post------------------------------------------------------------------------
const createProfile = async (req, res) => {
    const { kind, ...body } = req.body;
    let profile;

    try {
        switch (kind) {
            case "person":
                profile = new Person( {...body, owner: req.account});
                break;
            case "company":
                profile = new Company({...body, owner: req.account });
                break;
            default:
                return res.status(400).json({ msg: "Invalid kind" });
        }

        await profile.save();

        res.header("Location", getUrl(req, profile.id));
        res.status(201).json(removeFields(profile.toObject()));
    } catch (err) {
        res.status(500).json({ msg: err });
    }
};

// Get-------------------------------------------------------------------------
const getAllProfiles = async (req, res) => {
    const profiles = await Profile.find({ owner: req.account });

    res.status(200).json(profiles);
};

const getProfilById = async (req, res) => {
    const  id  = req.params;

    try {
        const profile = await Profile.findOne({ id: id }).lean().exec();
        if (!profile) {
            return res.status(404).json({ msg: "profil inconnu" });
        }

        res.status(200).json(removeFields(profile));
    } catch (err) {
        res.status(500).json({ msg: err.message });
    };
}

const getPostsByProfilId = async (req, res) => {
    const owner  = req.params.id;

    try {
        const post = await Post.find({ owner: owner }).lean().exec();
        if (!post) {
            return res.status(404).json({ msg: RESPONSE_MESSAGES.POST_NOT_FOUND });
        }

        res.status(200).json(removeFields(post));
    } catch (err) {
        res.status(500).json({ msg: err.message });
    };
}

const getCommentsByIdPost = async (req, res) => {
    const  owner  = req.params.id;

    try {
        const comment = await Comment.find({ owner: owner }).lean().exec();
        if (!comment) {
            return res.status(404).json({ msg: RESPONSE_MESSAGES.POST_NOT_FOUND });
        }

        res.status(200).json(removeFields(comment));
    } catch (err) {
        res.status(500).json({ msg: err.message });
    };
}
// Patch-----------------------------------------------------------------------
const updateProfile = async(req, res) => {
    const { id } = req.params;

    const update = {
        email:req.body.email,
        avatar:req.body.avatar,
        bio:req.body.bio,
        username: req.body.username,
        updatedAt: Date.now(),
    };

    try {
        const profile = await Profile.findOneAndUpdate({ id }, update, {
            new: true,
            runValidators: true,
        })
            .lean()
            .exec();

        res.header("Location", getUrl(req, id));
        res.status(200).json({ profile: removeFields(profile) });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    };
};

// Delete----------------------------------------------------------------------
const deleteOneProfile = async (req, res) => {
    const  id  = req.params.id;

    try {
        await Promise.all([
            Profile.deleteOne({id: id}),
            Post.deleteMany({ owner: id }), 
            Comment.deleteMany({ owner: id })
        ]);

        res.status(204).end();
    } catch (err) {
        res.status(500).json({ msg: err.message });
    };
};

const deleteAccount = async (req, res) => {
    const profiles = await Profile.find({ owner: req.account });
    console.log(profiles[0], "profile");
    try {

        for(let i=0; i<profiles.length; i++ ){
            await Promise.all([
                Account.deleteOne({id: req.account}),
                Profile.deleteMany({owner: req.account}),
                Post.deleteMany({ owner: profiles[i].id }), 
                Comment.deleteMany({ owner: profiles[i].id })
            ]);
        }

        res.status(204).end();
    } catch (err) {
        res.status(500).json({ msg: err.message });
    };
}

module.exports = {
    createProfile,
    getAllProfiles,
    updateProfile,
    deleteOneProfile,
    deleteAccount,
    getProfilById,
    getPostsByProfilId,
    getCommentsByIdPost,
};
