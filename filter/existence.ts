export type ExistencePropertyFilter = { readonly is_empty: true } | {
  readonly is_not_empty: true;
};

export const isEmpty: ExistencePropertyFilter = { is_empty: true };

export const isNotEmpty: ExistencePropertyFilter = { is_not_empty: true };
