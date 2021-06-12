import * as React from "react"
import { graphql, Link } from "gatsby"
import SEO from "../components/seo"
import { Pagination } from "../components/pagination"
import * as listStyles from "./blog-list.module.css"
import * as authorStyles from "./author-page.module.css"
import { PostCard } from "../components/post-card"
import { FaTwitter, FaGlobe, FaHome } from "react-icons/fa"

const BlogPostListTemplate = ({ data, pageContext }) => {
  const { authorsJson: author } = data
  const { posts, pageIndex, pageCount } = pageContext

  const userImgSrc = author.profilePic.childImageSharp.largeSize.src

  return (
    <div>
      <SEO
        title={author.name}
        description={`The profile page for ${author.name}`}
        meta={[
          {
            property: `og:type`,
            content: `profile`,
          },
          {
            property: `profile:first_name`,
            content: author.firstName,
          },
          {
            property: `profile:last_name`,
            content: author.lastName,
          },
          {
            property: "profile:username",
            content: author.id,
          },
        ]}
      />
      <header>
        <Link to={"/"} className={authorStyles.homeLink}>
          <FaHome className={authorStyles.homeIcon} />
        </Link>
        <h1 className={authorStyles.personName}>{author.name}</h1>
        <img
          className={authorStyles.profilePic}
          src={userImgSrc}
          alt={`${author.name} profile picture`}
        />
        <ul
          aria-label={`${author.name}'s Social Media Accounts`}
          className={authorStyles.socialLinks}
        >
          <li className={authorStyles.socialListItem}>
            <a
              href={`https://twitter.com/${author.socials.twitter}`}
              className={authorStyles.socialLink}
            >
              <FaTwitter className={authorStyles.socialIcons} />
            </a>
          </li>
          <li className={authorStyles.socialListItem}>
            <a
              href={author.socials.website}
              className={authorStyles.socialLink}
            >
              <FaGlobe className={authorStyles.socialIcons} />
            </a>
          </li>
        </ul>
      </header>
      <main>
        <h1 id="posts-header">Blog Posts</h1>
        <ul aria-describedby={`posts-header`} className={listStyles.blogList}>
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
          rootPath={`/authors/${author.id}`}
          pagePath={`/authors/${author.id}/page`}
        />
      </main>
    </div>
  )
}

export default BlogPostListTemplate

export const pageQuery = graphql`
  query AuthorById($authorId: String!) {
    authorsJson(id: { eq: $authorId }) {
      id
      name
      firstName
      lastName
      profilePic {
        childImageSharp {
          largeSize: fixed(width: 500) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      socials {
        twitter
        website
      }
    }
  }
`
