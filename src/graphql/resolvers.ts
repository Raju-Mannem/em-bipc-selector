import { Context } from "../pages/api/graphql";
import { GraphQLScalarType, Kind } from "graphql";
import { Decimal } from "@prisma/client/runtime/library";

function toNumber(
  val: Decimal | number | string | null | undefined
): number | null {
  if (val === null || val === undefined) return null;
  // If already a number, return as is
  if (typeof val === "number") {
    return isFinite(val) ? val : null;
  }
  // If Prisma.Decimal, use its toNumber method
  if (
    typeof val === "object" &&
    val !== null &&
    "toNumber" in val &&
    typeof (val as any).toNumber === "function"
  ) {
    try {
      const num = (val as Decimal).toNumber();
      return isFinite(num) ? num : null;
    } catch {
      return null;
    }
  }
  // If a string, attempt to parse as number
  if (typeof val === "string") {
    const num = Number(val);
    return isFinite(num) ? num : null;
  }
  // Fallback: not a valid number
  return null;
}

// JSON Scalar for dynamic fields
const JSONScalar = new GraphQLScalarType({
  name: "JSON",
  description: "Arbitrary JSON value",
  parseValue: (value) => value,
  serialize: (value) => value,
  parseLiteral(ast) {
    switch (ast.kind) {
      case Kind.STRING:
      case Kind.BOOLEAN:
        return ast.value;
      case Kind.INT:
      case Kind.FLOAT:
        return parseFloat(ast.value);
      case Kind.OBJECT: {
        const value = Object.create(null);
        ast.fields.forEach((field) => {
          value[field.name.value] = this.parseLiteral!(field.value);
        });
        return value;
      }
      case Kind.LIST:
        return ast.values.map((n) => this.parseLiteral!(n));
      default:
        return null;
    }
  },
});

const resolvers = {
  JSON: JSONScalar,
  Query: {
    // tsCutoff2024s: async (
    //   _parent: any,
    //   args: { limit?: number; offset?: number },
    //   context: Context
    // ) => {
    //   const limit = args.limit ?? 50;
    //   const offset = args.offset ?? 0;

    //   const [rows, totalCount] = await Promise.all([
    //     context.prisma.ts_bpharmacy_2024.findMany({
    //       skip: offset,
    //       take: limit,
    //       orderBy: { sno: "asc" }, // Or any other ordering you prefer
    //     }),
    //     context.prisma.ts_bpharmacy_2024.count(),
    //   ]);

    //   return { rows, totalCount };
    // },
    tsCutoff2024sByRank: async (
      __parent: any,
      args: { filter: any },
      context: Context
    ) => {
      const { minRank, maxRank, branchCodes, casteColumns, distCodes, coEdu } =
        args.filter;

      const whereClause: any = {
        branch_code: { in: branchCodes },
        dist_code: { in: distCodes },
        ...(coEdu && { co_education: "GIRLS" }),
      };

      // 1. Fetch all rows for selected districts
      const rows = await context.prisma.ts_bpharmacy_2024.findMany({
        where: whereClause,
        // orderBy: {
        //   priority: "asc",
        // },
      });

      // 2. Filter rows: ALL selected caste columns must be within [minRank, maxRank]
      const filteredRows = rows.filter((row) =>
        casteColumns.every((col: any) => {
          const rawValue = row[col as keyof typeof row];
          if (rawValue === null || rawValue === undefined) return false;
          const value = toNumber(rawValue);
          return value! >= minRank && value! <= maxRank;
        })
      );
      // console.log('Filtered rows:', filteredRows.length);

      // ✅ 3. Create a branch code order map for fast lookup
      const branchOrderMap = new Map<string, number>(
        branchCodes.map((code: string, index: number) => [code, index])
      );
      const sortByColumn = casteColumns[0];

      const sortedRows = filteredRows.sort((a, b) => {
        const valA = toNumber(a[sortByColumn as keyof typeof a]);
        const valB = toNumber(b[sortByColumn as keyof typeof b]);
        const safeValA = valA ?? Number.MAX_SAFE_INTEGER;
        const safeValB = valB ?? Number.MAX_SAFE_INTEGER;
        if (safeValA !== safeValB) {
          return safeValA - safeValB;
        }
        const branchAOrder =
          branchOrderMap.get(a.branch_code ?? "") ?? Number.MAX_SAFE_INTEGER;
        const branchBOrder =
          branchOrderMap.get(b.branch_code ?? "") ?? Number.MAX_SAFE_INTEGER;
        return branchAOrder - branchBOrder;
      });

      // 4. Map to result
      return filteredRows.map((row) => ({
        sno: row.sno,
        inst_code: row.inst_code,
        institute_name: row.institute_name,
        place: row.place,
        dist_code: row.dist_code,
        branch_code: row.branch_code,
        branch_name: row.branch_name,
        co_education: row.co_education,
        dynamicCastes: Object.fromEntries(
          casteColumns.map((col: any) => [col, row[col as keyof typeof row]])
        ),
      }));
    },
  },

  // Mutation: {
  //   createTsCutoff2024: async (_parent: any, args: any, context: Context) => {
  //     return await context.prisma.ts_bpharmacy_2024.create({
  //       data: args.data,
  //     });
  //   },
  //   updateTsCutoff2024: async (
  //     _parent: any,
  //     args: { sno: number; data: any },
  //     context: Context
  //   ) => {
  //     return await context.prisma.ts_bpharmacy_2024.update({
  //       where: { sno: args.sno },
  //       data: args.data,
  //     });
  //   },
  //   deleteTsCutoff2024: async (
  //     _parent: any,
  //     args: { sno: number },
  //     context: Context
  //   ) => {
  //     return context.prisma.ts_bpharmacy_2024.delete({
  //       where: { sno: args.sno },
  //     });
  //   },
  // },
};
export default resolvers;
