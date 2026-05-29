const CATEGORY_RANK = {
  COMUN: 0,
  ESPECIAL: 1,
  PLATA: 2,
  ORO: 3,
  PLATINO: 4,
};

export function getCategoryRank(cat) {
  if (!cat) return CATEGORY_RANK.COMUN;
  const key = String(cat).toUpperCase();
  return CATEGORY_RANK[key] ?? CATEGORY_RANK.COMUN;
}

export function canEnterAuction(userCategory, auctionCategory) {
  const userRank = getCategoryRank(userCategory);
  const auctionRank = getCategoryRank(auctionCategory);
  return userRank >= auctionRank;
}

export default { getCategoryRank, canEnterAuction };
