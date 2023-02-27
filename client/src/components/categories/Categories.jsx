import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { request } from '../../utils/fetchApi'
import { format } from 'timeago.js'
import { Link } from 'react-router-dom'
import classes from './categories.module.css'
import { MdOutlinePreview } from 'react-icons/md'
import { AiFillLike } from 'react-icons/ai'
import { FiArrowRight } from 'react-icons/fi'

const Categories = () => {
  const [blogs, setBlogs] = useState([])
  const [filteredBlogs, setFilteredBlogs] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const categories = [
    'all',
    'nature',
    'music',
    'travel',
    'design',
    'programming',
    'fun',
    'fashion'
  ]

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await request('/blog/getAll', 'GET')
        setBlogs(data)
        setFilteredBlogs(data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchBlogs()
  }, [])

  useEffect(() => {
    if(activeCategory === 'all'){
      setFilteredBlogs(blogs)
    } else {
      setFilteredBlogs((prev) => {
        const filteredBlogs = blogs.filter((blog) => blog.category.toLowerCase() === activeCategory.toLowerCase())

        return filteredBlogs
      })
    }
  }, [activeCategory])


  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <h3>Select a category</h3>
        <div className={classes.categoriesAndBlogs}>
          <div className={classes.categories}>
            {categories.map((category) => (
              <span
                key={crypto.randomUUID()}
                className={`${classes.category} ${activeCategory === category && classes.active}`}
                onClick={() => setActiveCategory(prev => category)}
              >
                {category}
              </span>
            ))}
          </div>
          {filteredBlogs?.length > 0 ?
            <div className={classes.blogs}>
              {filteredBlogs?.map((blog) => (
                <div key={blog._id} className={classes.blog}>
                  <Link to={`/blogDetails/${blog?._id}`}>
                    <img src={`http://localhost:5000/images/${blog?.photo}`} />
                  </Link>
                  <div className={classes.blogData}>
                    <div className={classes.categoryAndMetadata}>
                      <span className={classes.category}>{blog?.category}</span>
                      <div className={classes.metadata}>
                        <MdOutlinePreview /> {blog.views} views
                      </div>
                      <div className={classes.metadata}>
                        <AiFillLike /> {blog?.likes?.length} likes
                      </div>
                    </div>
                    <h4>{blog?.title}</h4>
                    <p className={classes.blogDesc}>
                      {blog?.desc}
                    </p>
                    <div className={classes.authorAndCreatedAt}>
                      <span><span>Author:</span> {blog?.userId?.username}</span>
                      <span><span>Created:</span> {format(blog?.createdAt)}</span>
                    </div>
                    <Link to={`/blogDetails/${blog._id}`} className={classes.readMore}>
                      Read More <FiArrowRight />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            : <h3 className={classes.noBlogsMessage}>No blogs</h3>}
        </div>
      </div>
    </div>
  )
}

export default Categories