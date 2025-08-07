"use client";
import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import {
  GET_TS_CUTOFFS_2024_BY_RANK,
  // GET_TS_CUTOFFS_2024_BY_RANK_DIST,
} from "../graphql/queries";
import { districtOptions } from "../data/districts";
import { casteOptions } from "../data/caste";
import { branchOptions } from "../data/branch";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import { toast } from "sonner";

interface TsCutoffData {
  __typename: string;
  sno: string;
  inst_code: string;
}

interface tsCutoff2024sPdfData {
  sno: number;
  inst_code: string;
  institute_name: string;
  branch_code: string;
  branch_name: string;
  dist_code: string;
  distName: string;
  place: string;
  co_education: string;
}

export interface CutoffRow {
  sno: number;
  inst_code: string;
  institute_name: string;
  branch_code: string;
  branch_name: string;
  dist_code: string;
  place: string;
  co_education: string;
  dynamicCastes?: {
    [key: string]: number | null;
  };
}

const Cutoff2024 = () => {
  const [minRank, setMinRank] = useState("");
  const [maxRank, setMaxRank] = useState("");
  const [selectedCastes, setSelectedCastes] = useState<string[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  // const [instCodes, setInstCodes] = useState<string[]>([]);
  const [stdName, setStdName] = useState<string>("");
  const [stdRank, setStdRank] = useState<string>("");
  const [stdCaste, setStdCaste] = useState<string>("");
  const [coEdu, setCoEdu] = useState<boolean>(false);
  const [result, setResult] = useState<CutoffRow[]>([]);

  const [fetchCutoffs, { data, loading, error }] = useLazyQuery(
    GET_TS_CUTOFFS_2024_BY_RANK,
    { errorPolicy: "all" }
  );

  // const [
  //   fetchRowsByInstDistCodes,
  //   { data: rowsData, loading: rowsLoading, error: rowsError },
  // ] = useLazyQuery(GET_TS_CUTOFFS_2024_BY_RANK_DIST, { errorPolicy: "all" });

  const handlePDF = () => {
    if (!stdName) {
      toast.error("invalid details");
    } else {
      const doc = new jsPDF();
      /** 
	const imgURL = "/EAMCET INSTRUCTIONS_page-0001.jpg";
    doc.addImage(imgURL, "PNG", 5, 10, 200, 250);  
    
    doc.addPage("p");
    **/

      // doc.text(
      //   `Name: ${stdName} | Rank: ${stdRank} | Caste: ${stdCaste}`,
      //   14,
      //   16
      // );

      const tableData = result?.map(
        (row: CutoffRow, index: number) => ({
          sno: index + 1,
          inst_code: row.inst_code,
          institute_name: row.institute_name,
          branch_code: row.branch_code,
          branch_name: row.branch_name,
          dist_code: row.dist_code,
          place: row.place,
          co_education: row.co_education, // keep for logic, not display
        })
      );

      const firstTableColumn = [
        `Name: ${stdName} `,
        `Rank: ${stdRank} `,
        `Caste: ${stdCaste} `,
      ];

      const tableColumn = [
        { header: "S.NO", dataKey: "sno" },
        { header: "College Code", dataKey: "inst_code" },
        { header: "College Name", dataKey: "institute_name" },
        { header: "Branch Code", dataKey: "branch_code" },
        { header: "Branch Name", dataKey: "branch_name" },
        { header: "District Code", dataKey: "dist_code" },
        { header: "Place", dataKey: "place" },
        // Do NOT include co_education column!
      ];

      autoTable(doc, {
        head: [firstTableColumn],
        startY: 14,
        margin: { top: 10 },
        styles: {
          fontSize: 9,
          cellPadding: 4,
          font: "helvetica",
          // textColor: [40, 40, 40],
          // lineColor: [44, 62, 80],
          // lineWidth: 0.2,
          valign: "middle",
          halign: "center",
        },
        headStyles: {
          fillColor: [236, 250, 229], // light green header background
          textColor: [16, 46, 80], // Navy blue header text
          fontStyle: "bold",
          halign: "center",
        },
        columnStyles: {
          0: { halign: "center", fontStyle: "bold" }, // Example: first column centered and bold
          1: { halign: "center" },
        },
        theme: "plain", // Use 'plain' to avoid built-in styling interference
      });

      autoTable(doc, {
        columns: tableColumn,
        body: tableData,
        startY: 34,
        margin: { top: 10, bottom: 10  },
        styles: {
          fontSize: 9,
          cellPadding: 2,
          minCellHeight: 14,
          valign: "middle",
        },
        columnStyles: {
          2: { cellWidth: "auto", halign: "left" },
          0: { halign: "center" },
          1: { halign: "center" },
          3: { halign: "center" },
          4: { halign: "left" },
          5: { halign: "center" },
          6: { halign: "center" },
        },
        theme: "grid",
        didParseCell: function (data) {
          if (data.section === "body") {
            const raw = data.row.raw;
            if (
              typeof raw === "object" &&
              raw !== null &&
              "co_education" in raw &&
              (raw as any).co_education === "GIRLS"
            ) {
              data.cell.styles.textColor = [233, 30, 99]; // Pink
            }
          }
        },
      });

      doc.save(`${stdName}-${stdRank}-${stdCaste}.pdf`);
      toast.success(`pdf downloaded successfully`);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      Number(minRank) >= Number(maxRank) ||
      Number(minRank) < 0 ||
      selectedCastes.length < 1 ||
      selectedBranches.length < 1 ||
      selectedDistricts.length < 1
    ) {
      toast.error(`Invalid details, Please check details`);
    } else {
      const variables = {
        filter: {
          minRank: Number(minRank),
          maxRank: Number(maxRank),
          casteColumns: selectedCastes,
          branchCodes: selectedBranches,
          distCodes: selectedDistricts,
          coEdu: coEdu,
        },
      };

      // console.log("Submitting filter:", variables);
      fetchCutoffs({ variables });
    }
  };

  
  useEffect(() => {
    if (data?.tsCutoff2024sByRank) {
      setResult(data.tsCutoff2024sByRank);
    }
  }, [data]);

  const handleDelete = (sno: number) => {
    setResult(prevItems => prevItems.filter(item => item.sno !== sno));
  };

  // useEffect(() => {
  //   if (data && data.tsCutoff2024sByRank.length) {
  //     const uniqueInstCodes = data.tsCutoff2024sByRank
  //       .map((item: TsCutoffData) => item.inst_code)
  //       .filter(
  //         (value: TsCutoffData, index: number, self: TsCutoffData[]) =>
  //           self.indexOf(value) === index
  //       );

  //     setInstCodes(uniqueInstCodes);
  //     const variables = {
  //       filter: {
  //         instCodes: uniqueInstCodes,
  //         casteColumns: selectedCastes,
  //         branchCodes: selectedBranches,
  //         distCodes: selectedDistricts,
  //       },
  //     };

  //     console.log("Submitting filter:", variables);

  //     fetchRowsByInstDistCodes({ variables });
  //   }
  // }, [data, fetchRowsByInstDistCodes]);

  return (
    <section className="flex justify-center items-center flex-col overflow-x-auto py-2 sm:py-4 sm:px-8 text-[6px] sm:text-[12px] font-sans">
      <article className="w-full h-full">
        <form
          className="flex justify-start flex-wrap items-start gap-2"
          onSubmit={handleSubmit}
        >
          <div className="basis-2/12 flex gap-2">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Minimum Rank
              </label>
              <input
                type="number"
                className="px-1 sm:px-3 py-1 sm:py-2 border border-indigo-100 bg-indigo-50 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="minimum rank"
                value={minRank}
                onChange={(e) => setMinRank(e.target.value)}
                required
                min={0}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Maximum Rank
              </label>
              <input
                type="number"
                className="px-1 sm:px-3 py-1 sm:py-2 border border-indigo-100 bg-indigo-50 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="maximum rank"
                value={maxRank}
                onChange={(e) => setMaxRank(e.target.value)}
                required
                min={0}
              />
            </div>
          </div>
          <div className="basis-2/12 mt-2 sm:mt-6">
            <details className="group relative overflow-hidden rounded border border-gray-300 shadow-sm bg-indigo-50">
              <summary className="flex items-center justify-between gap-2 p-2 sm:p-3 text-gray-700 transition-colors hover:text-gray-900 [&::-webkit-details-marker]:hidden">
                <span className="font-medium"> Branches </span>

                <span className="transition-transform group-open:-rotate-180">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-2 sm:size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </span>
              </summary>

              <div className="divide-y divide-gray-300 border-t border-gray-300 bg-white">
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-gray-700">
                    {" "}
                    {selectedBranches.length}{" "}
                  </span>

                  <button
                    type="button"
                    className="text-gray-700 underline transition-colors hover:text-gray-900"
                    onClick={() => {
                      setSelectedBranches([]);
                    }}
                  >
                    Reset
                  </button>
                </div>

                <fieldset className="p-3">
                  <legend className="sr-only">Checkboxes</legend>

                  <div className="flex flex-col items-start gap-3 max-h-24 overflow-y-auto pr-2">
                    <label
                      htmlFor="all"
                      className="inline-flex items-center gap-2 sm:gap-3"
                    >
                      <input
                        type="checkbox"
                        className="size-2 sm:size-5 rounded border-gray-300 shadow-sm"
                        checked={
                          selectedBranches.length === branchOptions.length
                        }
                        onChange={() => {
                          if (
                            selectedBranches.length === branchOptions.length
                          ) {
                            // Deselect all
                            setSelectedBranches([]);
                          } else {
                            // Select all
                            setSelectedBranches(
                              branchOptions.map((opt) => opt.value)
                            );
                          }
                        }}
                      />

                      <span className="font-medium text-gray-700"> All </span>
                    </label>

                    {branchOptions.map((opt) => (
                      <label
                        htmlFor="Option"
                        key={opt.value}
                        className="inline-flex items-center gap-2 sm:gap-3"
                      >
                        <input
                          type="checkbox"
                          className="size-2 sm:size-5 rounded border-gray-300 shadow-sm"
                          value={opt.value}
                          checked={selectedBranches.includes(opt.value)}
                          onChange={(e) => {
                            const { value, checked } = e.target;
                            setSelectedBranches((prevState) =>
                              checked
                                ? [...prevState, value]
                                : prevState.filter((branch) => branch !== value)
                            );
                          }}
                        />

                        <span className="font-medium text-gray-700">
                          {" "}
                          {opt.label}{" "}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>
            </details>
          </div>
          <div className="basis-2/12  mt-2 sm:mt-6">
            <details className="group relative overflow-hidden rounded border border-gray-300 shadow-sm bg-indigo-50">
              <summary className="flex items-center justify-between gap-2 p-2 sm:p-3  text-gray-700 transition-colors hover:text-gray-900 [&::-webkit-details-marker]:hidden">
                <span className="font-medium"> Caste </span>

                <span className="transition-transform group-open:-rotate-180">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-2 sm:size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </span>
              </summary>

              <div className="divide-y divide-gray-300 border-t border-gray-300 bg-white">
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-gray-700">
                    {" "}
                    {selectedCastes.length}{" "}
                  </span>

                  <button
                    type="button"
                    className="text-gray-700 underline transition-colors hover:text-gray-900"
                    onClick={() => {
                      setSelectedCastes([]);
                    }}
                  >
                    Reset
                  </button>
                </div>

                <fieldset className="p-3">
                  <legend className="sr-only">Checkboxes</legend>

                  <div className="flex flex-col items-start gap-3 max-h-24 overflow-y-auto pr-2">
                    <label
                      htmlFor="all"
                      className="inline-flex items-center gap-2 sm:gap-3"
                    >
                      <input
                        type="checkbox"
                        className="size-2 sm:size-5 rounded border-gray-300 shadow-sm"
                        checked={selectedCastes.length === casteOptions.length}
                        onChange={() => {
                          if (selectedCastes.length === casteOptions.length) {
                            // Deselect all
                            setSelectedCastes([]);
                          } else {
                            // Select all
                            setSelectedCastes(
                              casteOptions.map((opt) => opt.value)
                            );
                          }
                        }}
                      />

                      <span className="font-medium text-gray-700"> All </span>
                    </label>

                    {casteOptions.map((opt) => (
                      <label
                        htmlFor="Option"
                        key={opt.value}
                        className="inline-flex items-center gap-2 sm:gap-3"
                      >
                        <input
                          type="checkbox"
                          className="size-2 sm:size-5 rounded border-gray-300 shadow-sm"
                          value={opt.value}
                          checked={selectedCastes.includes(opt.value)}
                          onChange={(e) => {
                            const { value, checked } = e.target;
                            setSelectedCastes((prevState) =>
                              checked
                                ? [...prevState, value]
                                : prevState.filter((caste) => caste !== value)
                            );
                          }}
                        />

                        <span className="font-medium text-gray-700">
                          {" "}
                          {opt.label}{" "}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>
            </details>
          </div>
          <div className="basis-2/12  mt-2 sm:mt-6">
            <details className="group relative overflow-hidden rounded border border-gray-300 shadow-sm bg-indigo-50">
              <summary className="flex items-center justify-between gap-2 p-2 sm:p-3 text-gray-700 transition-colors hover:text-gray-900 [&::-webkit-details-marker]:hidden">
                <span className="font-medium"> District </span>

                <span className="transition-transform group-open:-rotate-180">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-2 sm:size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </span>
              </summary>

              <div className="divide-y divide-gray-300 border-t border-gray-300 bg-white">
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-gray-700">
                    {" "}
                    {selectedDistricts.length}{" "}
                  </span>

                  <button
                    type="button"
                    className="text-gray-700 underline transition-colors hover:text-gray-900"
                    onClick={() => {
                      setSelectedDistricts([]);
                    }}
                  >
                    Reset
                  </button>
                </div>

                <fieldset className="p-3">
                  <legend className="sr-only">Checkboxes</legend>
                  <div className="flex flex-col items-start gap-3 max-h-24 overflow-y-auto pr-2">
                    <label
                      htmlFor="all"
                      className="inline-flex items-center gap-2 sm:gap-3"
                    >
                      <input
                        type="checkbox"
                        className="size-2 sm:size-5 rounded border-gray-300 shadow-sm"
                        checked={
                          selectedDistricts.length === districtOptions.length
                        }
                        onChange={() => {
                          if (
                            selectedDistricts.length === districtOptions.length
                          ) {
                            // Deselect all
                            setSelectedDistricts([]);
                          } else {
                            // Select all
                            setSelectedDistricts(
                              districtOptions.map((opt) => opt.value)
                            );
                          }
                        }}
                      />

                      <span className="font-medium text-gray-700"> All </span>
                    </label>

                    {districtOptions.map((opt) => (
                      <label
                        htmlFor="Option"
                        key={opt.value}
                        className="inline-flex items-center gap-2 sm:gap-3"
                      >
                        <input
                          type="checkbox"
                          className="size-2 sm:size-5 rounded border-gray-300 shadow-sm"
                          value={opt.value}
                          checked={selectedDistricts.includes(opt.value)}
                          onChange={(e) => {
                            const { value, checked } = e.target;
                            setSelectedDistricts((prevState) =>
                              checked
                                ? [...prevState, value]
                                : prevState.filter(
                                    (district) => district !== value
                                  )
                            );
                          }}
                        />

                        <span className="font-medium text-gray-700">
                          {" "}
                          {opt.label}{" "}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>
            </details>
          </div>
          <div className="basis-2/12 mt-2 sm:mt-6">
            <details className="group relative overflow-hidden rounded border border-gray-300 shadow-sm bg-indigo-50">
              <summary className="flex items-center justify-between gap-2 p-2 sm:p-3 text-gray-700 transition-colors hover:text-gray-900 [&::-webkit-details-marker]:hidden">
                <span className="font-medium"> Education </span>
                <span className="transition-transform group-open:-rotate-180">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-2 sm:size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </span>
              </summary>
              <div className="divide-y divide-gray-300 border-t border-gray-300 bg-white">
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-gray-700"> {coEdu ? 1 : 0} </span>
                  <button
                    type="button"
                    className="text-gray-700 underline transition-colors hover:text-gray-900"
                    onClick={() => {
                      setCoEdu(false);
                    }}
                  >
                    Reset
                  </button>
                </div>
                <fieldset className="p-3">
                  <legend className="sr-only">Checkboxes</legend>
                  <div className="flex flex-col items-start gap-3 max-h-24 overflow-y-auto pr-2">
                    <label
                      htmlFor="Option"
                      key="girls"
                      className="inline-flex items-center gap-2 sm:gap-3"
                    >
                      <input
                        type="checkbox"
                        className="size-2 sm:size-5 rounded border-gray-300 shadow-sm"
                        checked={coEdu}
                        onChange={(e) => setCoEdu(e.target.checked)}
                      />
                      <span className="font-medium text-gray-700"> Girls</span>
                    </label>
                  </div>
                </fieldset>
              </div>
            </details>
          </div>
          <button
            type="submit"
            className="justify-self-end basis-1/12 sm:ml-4 mt-2 sm:mt-6 bg-indigo-600 text-white font-semibold py-2 px-4 rounded hover:bg-indigo-700 transition"
          >
            search
          </button>
        </form>
      </article>
      <article className="w-full h-full mt-20">
        <div className="mt-8 flex gap-4 flex-wrap items-start">
          <span>
            <label className="block text-gray-700 font-medium mb-1">
              Student Name
            </label>
            <input
              type="text"
              className="px-1 sm:px-3 py-1 sm:py-2 border border-indigo-100 bg-indigo-50 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="student name"
              value={stdName}
              onChange={(e) => setStdName(e.target.value)}
              required
              min={0}
            />
          </span>
          <span>
            <label className="block text-gray-700 font-medium mb-1">
              Student Rank
            </label>
            <input
              type="number"
              className="px-1 sm:px-3 py-1 sm:py-2 border border-indigo-100 bg-indigo-50 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="rank"
              value={stdRank}
              onChange={(e) => setStdRank(e.target.value)}
              required
            />
          </span>
          <span>
            <label className="block text-gray-700 font-medium mb-1">
              Student Caste
            </label>
            <input
              type="text"
              className="px-1 sm:px-3 py-1 sm:py-2 border border-indigo-100 bg-indigo-50 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="caste"
              value={stdCaste}
              onChange={(e) => setStdCaste(e.target.value)}
              required
              min={0}
            />
          </span>
          <span>
            <button
              type="submit"
              className="justify-self-end basis-1/12 sm:ml-4 mt-2 sm:mt-6 bg-emerald-700 px-4 py-2 font-semibold text-white rounded hover:bg-indigo-700 transition"
              onClick={() => handlePDF()}
            >
              print
            </button>
          </span>
        </div>
        <div className="mt-8">
          {loading && (
            <div className="flex justify-center align-center gap-2 text-indigo-500 text-center">
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6 w-16 h-16 animate-spin"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
              </span>
              <span>
                <strong className="text-2xl font-sans">
                  {" "}
                  Loading............
                </strong>
              </span>
            </div>
          )}
          {error && (
            <div className="text-red-500 text-center">
              Error:{" "}
              {error.graphQLErrors.map(({ message }, i) => (
                <span key={i}>{message}</span>
              ))}
              {JSON.stringify(error)}
            </div>
          )}
          {/* {rowsLoading && (
            <div className="text-indigo-500 flex justify-center items-center">Loading Rows...</div>
          )} */}
          {/* {rowsError && (
            <div className="text-red-500 text-center">
              Error: {rowsError.message}
            </div>
          )} */}
          {data?.tsCutoff2024sByRank?.length === 0 && (
            <div className="text-red-500 text-center py-12 border-t text-sm">
              No rows found for the selected institute codes.
            </div>
          )}
          {result?.length > 0 ? (
            <div className="overflow-x-auto mt-6">
              <table className="min-w-full table-auto bg-white border border-collapse text-[4px] sm:text-[10px] font-sans">
                <thead className="bg-emerald-700 text-neutral-100 font-extrabold">
                  <tr className="">
                    <th className="border border-gray-300 text-center py-2 w-xs">
                      Sno
                    </th>
                    <th className="border border-gray-300 text-center py-2 w-xs">
                      College Code
                    </th>
                    <th className="border border-gray-300 pl-2 py-2 w-lg text-left">
                      College Name
                    </th>
                    <th className="border border-gray-300 text-center py-2 w-xs">
                      Branch Code
                    </th>
                    <th className="border border-gray-300 pl-2 py-2 w-lg text-left">
                      Branch Name
                    </th>
                    <th className="border border-gray-300 text-center py-2 w-xs">
                      District Code
                    </th>
                    <th className="border border-gray-300 pl-2 py-2 w-xs  text-left py-2 break-all">
                      Place
                    </th>
                    {selectedCastes.map((col) => (
                      <th
                        key={col}
                        className="border border-gray-300 text-center py-2 w-xs"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-neutral-900">
                  {result.map(
                    (row: CutoffRow, index: number) => (
                      <tr
                        key={row.sno}
                        className={`hover:bg-stone-50 ${
                          row.co_education == "GIRLS" && "text-red-400"
                        } hover:text-blue-500 h-4 ${
                          index % 2 != 0 ? "bg-gray-100" : ""
                        }`}
                      >
                         <td className="border border-gray-300 py-2 text-center max-w-min">
                          <button className="flex justify-center items-center gap-1 w-full h-full" onClick={()=>handleDelete(row.sno)}>
                            {index + 1}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="size-1 sm:size-3"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                              />
                            </svg>
                          </button>
                        </td>
                        <td className="border border-gray-300 py-2 text-center max-w-min">
                          {row.inst_code}
                        </td>
                        <td className="border border-gray-300 pl-2 py-2">
                          {row.institute_name}
                        </td>
                        <td className="border border-gray-300 py-2 text-center max-w-min">
                          {row.branch_code}
                        </td>
                        <td className="border border-gray-300 pl-2 py-2">
                          {row.branch_name}
                        </td>
                        <td className="border border-gray-300 py-2 text-center max-w-min">
                          {row.dist_code}
                        </td>
                        <td className="border border-gray-300 pl-2 py-2 break-all">
                          {row.place}
                        </td>
                        {selectedCastes.map((col) => (
                          <td
                            key={col}
                            className="border border-gray-300 py-2 text-center max-w-min"
                          >
                            {row.dynamicCastes?.[col] ?? "-"}
                          </td>
                        ))}
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-32 border-t-2 border-indigo-200-200 text-gray-500 text-center text-[24px]">
              Enter details
            </div>
          )}
        </div>
      </article>
    </section>
  );
};

export default Cutoff2024;
