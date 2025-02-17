import React from "react";
import styles from "./StarField.module.css"; // Using CSS Modules for scoped styles

const StarField = () => {
  // Generate an array of stars with random positions
  const stars = Array.from({ length: 200 }).map((_, index) => ({
    id: index,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: `${Math.random() * 2 + 1}px`, // Random size between 1px and 3px
    animationDelay: `${Math.random() * 5}s`, // Random delay for twinkling effect
  }));

  return (
    <div className={styles.starField}>
      {stars.map((star) => (
        <div
          key={star.id}
          className={styles.star}
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            animationDelay: star.animationDelay,
          }}
        ></div>
      ))}
    </div>
  );
};

export default StarField;