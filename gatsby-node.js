/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const maxArticlesOnPage = 5;

const getPostPages = (posts) => posts.reduce((pageArr, post, i) => {
  const pageNum = Math.floor(i / maxArticlesOnPage);
  pageArr[pageNum] = pageArr[pageNum] || [];
  pageArr[pageNum].push(post);
  return pageArr;
}, []);

// You can delete this file if you're not using it
const { createFilePath } = require(`gatsby-source-filesystem`)
const path = require(`path`)

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({
      node,
      getNode,
    })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  const postList = path.resolve(`./src/templates/blog-list.jsx`)
  const blogPost = path.resolve(`./src/templates/blog-post.jsx`)
  const authorPage = path.resolve(`./src/templates/author-page.jsx`)
  return graphql(
    `
      {
        allMarkdownRemark(
          sort: { order: DESC, fields: [frontmatter___date] }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
              }
              excerpt(pruneLength: 160)
              frontmatter {
                title
                authors {
                  id
                  name
                }
                description
              }
            }
          }
        }
        allAuthorsJson(limit: 100) {
          edges {
            node {
              id
            }
          }
        }
      }
    `
  ).then(result => {
    if (result.errors) {
      throw result.errors
    }

    // Create blog posts pages.
    const posts = result.data.allMarkdownRemark.edges.map(post => post.node);
    const authorIds = result.data.allAuthorsJson.edges.map(author => author.node.id);

    posts.forEach(post => {
      createPage({
        path: `posts${post.fields.slug}`,
        component: blogPost,
        context: {
          slug: post.fields.slug,
        },
      })
    })

    const postPages = getPostPages(posts);

    createPage({
      path: `/`,
      component: postList,
      context: {
        pageIndex: 0,
        posts: postPages[0],
        pageCount: postPages.length
      },
    })

    for (let i = 1; i < postPages.length; i++) {
      createPage({
        path: `/page/${i + 1}`,
        component: postList,
        context: {
          pageIndex: i,
          posts: postPages[i],
          pageCount: postPages.length
        },
      })
    }

    authorIds.forEach(authorId => {
      const authorPosts = posts.filter(post => post.frontmatter.authors.find(author => author.id === authorId));

      const authorPostPages = getPostPages(authorPosts);

      createPage({
        path: `authors/${authorId}`,
        component: authorPage,
        context: {
          authorId,
          posts: authorPostPages[0],
          pageIndex: 0,
          pageCount: authorPostPages.length
        },
      })

      for (let i = 1; i < authorPostPages.length; i++) {
        createPage({
          path: `/authors/${authorId}/page/${i + 1}`,
          component: authorPage,
          context: {
            authorId,
            posts: authorPostPages[i],
            pageIndex: i,
            pageCount: authorPostPages.length
          },
        })
      }
    })

    return null
  })
}
