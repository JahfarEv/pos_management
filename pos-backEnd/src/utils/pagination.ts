import { Model } from 'mongoose';

export async function paginate<T>(model: Model<T>, filter: any, query: any, defaultSort: any = { createdAt: -1 }) {
  const page = Math.max(query.page || 1, 1);
  const limit = Math.max(query.limit || 10, 1);
  const skip = (page - 1) * limit;

  // sort parsing
  let sort: any = defaultSort;
  if (query.sortBy) {
    const [field, dir] = String(query.sortBy).split(':');
    sort = { [field]: dir === 'asc' ? 1 : -1 };
  }

  const [items, total] = await Promise.all([
    model.find(filter).sort(sort).skip(skip).limit(limit),
    model.countDocuments(filter),
  ]);

  return {
    items,
    total,
    page,
    pages: Math.max(1, Math.ceil(total / limit)),
    limit,
  };
}
