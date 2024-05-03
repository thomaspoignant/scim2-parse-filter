import { Filter, OrExp } from "./index";
import { valfilter } from "./flatten";

const isOr = (f: Filter): f is OrExp => f.op === "or";

function baseProduct<T>(previousProduct: T[][], b: T[]): T[][] {
  const result = [];

  for (const x of previousProduct) {
    for (const y of b) {
      result.push([...x, y]);
    }
  }

  return result;
}

function product<T>(arrays: T[][]): T[][] {
  const [first, ...rest] = arrays;

  let result = first.map((v) => [v]);

  for (const array of rest) {
    result = baseProduct(result, array);
  }

  return result;
}

export const expand = (f: Filter): Filter => {
  switch (f.op) {
    case "[]":
      return valfilter(f.valFilter, f.attrPath);
    case "or":
      return { ...f, filters: f.filters.map(expand) };
    case "and": {
      const expandedChildren = f.filters.map(expand);
      const hasOr = expandedChildren.some(isOr);

      if (!hasOr) return { op: "and", filters: expandedChildren };

      const distributedAnds: Filter[] = product(
        expandedChildren.map((child) =>
          child.op === "or" ? child.filters : [child]
        )
      ).map((filters) => expand({ op: "and", filters }));

      return { op: "or", filters: distributedAnds };
    }
  }
  return f;
};
