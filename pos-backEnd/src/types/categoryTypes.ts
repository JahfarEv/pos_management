export interface CategoryQuery {
  page?: number;
  limit?: number;
  q?: string;
  isActive?: boolean;
}

export interface FindByCategorySlugOpts {
  slug: string;
  page?: number;
  limit?: number;
  includeInactive?: boolean;
  sort?: Record<string, 1 | -1>;

}
