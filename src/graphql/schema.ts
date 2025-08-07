const typeDefs = `#graphql

  type TsCutoff2024 {
    sno: ID!
    inst_code: String
    institute_name: String
    place: String
    dist_code: String
    co_education: String
    college_type: String
    year: Float
    branch_code: String
    branch_name: String
    oc_boys: Int
    oc_girls: Int
    bc_a_boys: Int
    bc_a_girls: Int
    bc_b_boys: Int
    bc_b_girls: Int
    bc_c_boys: Int
    bc_c_girls: Int
    bc_d_boys: Int
    bc_d_girls: Int
    bc_e_boys: Int
    bc_e_girls: Int
    sc_boys: Int
    sc_girls: Int
    st_boys: Int
    st_girls: Int
    ews_girls_ou: Int
    tuition_fee: Int
    affiliated_to: String
  }


  input RankFilterInput {
    minRank: Int!
    maxRank: Int!
    branchCodes: [String!]
    casteColumns: [String!]
    distCodes: [String!]
    coEdu: Boolean
  }

  type TsCutoff2024Dynamic {
    sno: ID!
    inst_code: String
    institute_name: String
    place: String
    dist_code: String
    branch_name: String
    branch_code: String
    co_education: String
    dynamicCastes: JSON
  }

  scalar JSON

  type Query {
    tsCutoff2024s(limit: Int = 50, offset: Int = 0): [TsCutoff2024!]!
    tsCutoff2024(sno: Float!): TsCutoff2024
    tsCutoff2024sByInstCodes(inst_codes: [String!]!): [TsCutoff2024!]!
    tsCutoff2024sByRank(filter: RankFilterInput!): [TsCutoff2024Dynamic!]!
  }

  # type Mutation {
  #   createCollege(
  #     institute_code: String!
  #     institute_name: String!
  #     place: String!
  #     district_name: String!
  #     college_type: String!
  #     co_educ: String!
  #     affiliated_to: String!
  #   ): College
  #   deleteTsCutoff2024(sno: Float!): TsCutoff2024!
  # }
`;

export default typeDefs;