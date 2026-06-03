type CustomerRelation = { name: string } | { name: string }[] | null | undefined;

export function getRelatedCustomerName(relation: CustomerRelation) {
  if (!relation) {
    return null;
  }

  if (Array.isArray(relation)) {
    return relation[0]?.name ?? null;
  }

  return relation.name;
}
