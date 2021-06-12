import * as React from "react"
import * as styles from "./post-card.module.css"
import { Link } from "gatsby"

export const PostCard = ({ slug, authors, title, description }) => {
  const authorNames = authors.map(author => author.name).join(", ")
  return (
    <li className={styles.postCard}>
      <Link to={`posts${slug}`}>
        <p className={styles.postHeader}>{title}</p>
        <p>by {authorNames}</p>
        <p>{description}</p>
      </Link>
    </li>
  )
}
