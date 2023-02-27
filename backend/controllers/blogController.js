const blogController = require("express").Router()
const Blog = require("../models/Blog")
const verifyToken = require('../middlewares/verifyToken')

blogController.get('/getAll', async (req, res) => {
    try {
        const blogs = await Blog.find({}).populate("userId", '-password')
        return res.status(200).json(blogs)
    } catch (error) {
        return res.status(500).json(error)
    }
})

blogController.get('/find/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate("userId", '-password')
        blog.views += 1
        await blog.save()
        return res.status(200).json(blog)
    } catch (error) {
        return res.status(500).json(error)
    }
})

blogController.get('/featured', async (req, res) => {
    try {
        const blogs = await Blog.find({ featured: true }).populate("userId", '-password').limit(3)
        return res.status(200).json(blogs)
    } catch (error) {
        return res.status(500).json(error)
    }
})

blogController.post('/', verifyToken, async (req, res) => {
    try {
        const blog = await Blog.create({ ...req.body, userId: req.user.id })
        return res.status(201).json(blog)
    } catch (error) {
        return res.status(500).json(error)
    }
})

blogController.put("/updateBlog/:id", verifyToken, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
        if (blog.userId.toString() !== req.user.id.toString()) {
            throw new Error("You can update only your own posts")
        }

        const updatedBlog = await Blog
            .findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
            .populate('userId', '-password')

        return res.status(200).json(updatedBlog)
    } catch (error) {
        return res.status(500).json(error.message)
    }
})

blogController.put('/likeBlog/:id', verifyToken, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
        if(blog.likes.includes(req.user.id)){
            blog.likes = blog.likes.filter((userId) => userId !== req.user.id)
            await blog.save()

            return res.status(200).json({msg: 'Successfully unliked the blog'})
        } else {
            blog.likes.push(req.user.id)
            await blog.save()

            return res.status(200).json({msg: "Successfully liked the blog"})
        }

    } catch (error) {
        return res.status(500).json(error)
    }
})

blogController.delete('/deleteBlog/:id', verifyToken, async(req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
        if(blog.userId.toString() !== req.user.id.toString()){
            throw new Error("You can delete only your own posts")
        }
        
        await Blog.findByIdAndDelete(req.params.id)

        return res.status(200).json({msg: "Successfully deleted the blog"})
    } catch (error) {
        return res.status(500).json(error)
    }
})

module.exports = blogController