export function getPaginationParams(
  page: number,
  limit: number,
  total: number,
): {
  page: {
    totalPages: number;
    currentPage: number;
    nextPage: number | null;
    previousPage: number | null;
  };
  limit: number;
} {
  const totalPages = Math.ceil(total / limit);
  return {
    page: {
      totalPages,
      currentPage: page,
      nextPage: page < totalPages ? page + 1 : null,
      previousPage: page > 1 ? page - 1 : null,
    },
    limit: limit > 0 ? limit : 20,
  };
}
