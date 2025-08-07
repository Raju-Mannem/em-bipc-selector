// import { gql } from '@apollo/client';

// export const CREATE_COLLEGE = gql`
//   mutation CreateCollege(
//     $institute_code: String!
//     $institute_name: String!
//     $place: String!
//     $district_name: String!
//     $college_type: String!
//     $co_educ: Boolean!
//     $affiliated_to: String!
//   ) {
//     createCollege(
//       institute_code: $institute_code
//       institute_name: $institute_name
//       place: $place
//       district_name: $district_name
//       college_type: $college_type
//       co_educ: $co_educ
//       affiliated_to: $affiliated_to
//     )
//   }
// `;

// export const CREATE_TS_CUTOFF_2024 = gql`
//   mutation CreateTsCutoff2024($data: TsCutoff2024Input!) {
//     createTsCutoff2024(data: $data) {
//       sno
//       inst_code
//       institute_name
//       place
//       dist_code
//       co_education
//       college_type
//       year_of_estab
//       branch_code
//       branch_name
//       oc_boys
//       oc_girls
//       bc_a_boys
//       bc_a_girls
//       bc_b_boys
//       bc_b_girls
//       bc_c_boys
//       bc_c_girls
//       bc_d_boys
//       bc_d_girls
//       bc_e_boys
//       bc_e_girls
//       sc_boys
//       sc_girls
//       st_boys
//       st_girls
//       ews_gen_ou
//       ews_girls_ou
//       tuition_fee
//       affiliated_to
//     }
//   }
// `;

// export const UPDATE_TS_CUTOFF_2024 = gql`
//   mutation UpdateTsCutoff2024($sno: Float!, $data: TsCutoff2024Input!) {
//     updateTsCutoff2024(sno: $sno, data: $data) {
//       sno
//       inst_code
//       institute_name
//       place
//       dist_code
//       co_education
//       college_type
//       year_of_estab
//       branch_code
//       branch_name
//       oc_boys
//       oc_girls
//       bc_a_boys
//       bc_a_girls
//       bc_b_boys
//       bc_b_girls
//       bc_c_boys
//       bc_c_girls
//       bc_d_boys
//       bc_d_girls
//       bc_e_boys
//       bc_e_girls
//       sc_boys
//       sc_girls
//       st_boys
//       st_girls
//       ews_gen_ou
//       ews_girls_ou
//       tuition_fee
//       affiliated_to
//     }
//   }
// `;

// export const DELETE_TS_CUTOFF_2024 = gql`
//   mutation DeleteTsCutoff2024($sno: Float!) {
//     deleteTsCutoff2024(sno: $sno) {
//       sno
//     }
//   }
// `;