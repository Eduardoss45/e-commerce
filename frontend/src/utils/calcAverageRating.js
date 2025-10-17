const calcAverageRating = reviews => {
  if (!reviews || reviews.length === 0) return 0;
  const total = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round(total / reviews.length);
};

export default calcAverageRating;
