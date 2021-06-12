import * as React from "react"
import SEO from "../components/seo"
import { Pagination } from "../components/pagination"
import { PostCard } from "../components/post-card"
import * as styles from "./blog-list.module.css"

const BlogPostListTemplate = ({ pageContext }) => {
  const { posts, pageIndex, pageCount } = pageContext

  return (
    <div>
      <SEO
        title={"Homepage"}
        meta={[
          {
            property: `og:type`,
            content: `website`,
          },
        ]}
      />
      <h1>My Site</h1>
      <ul aria-label={"Blog posts"} className={styles.blogList}>
        {posts.map(post => {
          return (
              <PostCard
                key={post.fields.slug}
                slug={post.fields.slug}
                title={post.frontmatter.title}
                description={post.frontmatter.description}
                authors={post.frontmatter.authors}
              />
          )
        })}
      </ul>
      <Pagination
        pageCount={pageCount}
        pageIndex={pageIndex}
        rootPath={"/"}
        pagePath={"/page"}
      />
    </div>
  )
}

export default BlogPostListTemplate
