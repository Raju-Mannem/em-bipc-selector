import { gql } from "@apollo/client";


export const GET_TS_CUTOFFS_2024_BY_RANK = gql`
  query TsCutoff2024sByRank($filter: RankFilterInput!) {
    tsCutoff2024sByRank(filter: $filter) {
      sno
      inst_code
      institute_name
      branch_code
      branch_name
      dist_code
      place
      dynamicCastes
      co_education
    }
  }
`;