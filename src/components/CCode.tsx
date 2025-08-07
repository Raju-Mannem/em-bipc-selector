const CCode = () => {
    const cdata = [
      ["AGR", "AGRICULTURAL ENGINEERING"],
      ["AI", "ARTIFICIAL INTELLIGENCE"],
      ["AID", "ARTIFICIAL INTELLIGENCE AND DATA SCIENCE"],
      ["AIM", "ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING"],
      ["ASE", "AEROSPACE ENGINEERING"],
      ["AUT", "AUTOMOBILE ENGINEERING"],
      ["BDT", "DAIRY TECHNOLOGY"],
      ["BIO", "BIO-TECHNOLOGY"],
      ["CAD", "CSE (ARTIFICIAL INTELLIGENCE & DATA SCIENCE)"],
      ["CAI", "COMP. SCI. AND ENGG. (ARTIFICIAL INTELLIGENCE )"],
      ["CBA", "COMPUTER SCIENCE ENGINEERING (BIG DATA ANALYTICS)"],
      ["CBC", "CSE- BLOCK CHAIN"],
      ["CCC", "CSE WITH SPECIALISATION IN CLOUD COMPUTING"],
      ["CDA", "CSE- DATA ANALYTICS"],
      ["CHE", "CHEMICAL ENGINEERING"],
      ["CIA", "CSE WITH SPL IN IOT & AUTOMATION"],
      ["CIC", "CSE (IOT & CYBER SECURITY WITH BLOCK CHAIN TECH)"],
      ["CIT", "COMPUTER SCIENCE AND INFORMATION TECHNOLOGY"],
      ["CIV", "CIVIL ENGINEERING"],
      ["CN", "COMPUTER NETWORKING"],
      ["CS", "CYBER SECURITY"],
      ["CSB", "COMPUTER SCIENCE AND BUSINESS SYSTEMS"],
      ["CSBS", "COMPUTER SCIENCE AND BIOSCIENCES"],
      ["CSC", "COMPUTER SCIENCE AND ENGINEERING (CYBER SECURITY)"],
      ["CSD", "COMPUTER SCIENCE AND ENGINEERING (DATA SCIENCE)"],
      ["CSE", "COMPUTER SCIENCE AND ENGINEERING"],
      ["CSEB", "COMPUTER SCIENCE AND ENGG & BUSINESS SYSTEMS"],
      ["CSER", "CSE(REGIONAL COURSE-TELUGU)"],
      ["CSG", "COMPUTER SCIENCE AND DESIGN"],
      ["CSM", "CSE(ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING)"],
      ["CSO", "COMPUTER SCIENCE AND ENGINEERING (IOT)"],
      ["CSS", "COMPUTER SCIENCE AND SYSTEMS ENGINEERING"],
      ["CST", "COMPUTER SCIENCE AND TECHNOLOGY"],
      ["CSW", "COMPUTER ENGINEERING(SOFTWARE ENGINEERING)"],
      ["CTM", "CONSTRUCTION TECHNOLOGY AND MANAGEMENT"],
      ["DS", "DATA SCIENCE"],
      ["DTD", "DIGITAL TECHNIQUES FOR DESIGN AND PLANNING"],
      ["EBM", "ELECTRONICS AND COMMUNICATION ENGINEERING (BIO-MEDICAL ENGINEERING)"],
      ["ECA", "ELECTRONICS AND COMMUNICATION(ADVANCED COMMUNICATION TECHNOLOGY)"],
      ["ECE", "ELECTRONICS AND COMMUNICATION ENGINEERING"],
      ["ECES", "ELECTRONICS AND COMMUNICATION ENGINEERING -EMBEDDED SYSTEMS"],
      ["ECM", "ELECTRONICS AND COMPUTER ENGINEERING"],
      ["ECT", "ELECTRONICS AND COMMUNICATION TECHNOLOGY"],
      ["ECV", "ELECTRONICS AND COMMUNICATION ENGINEERING - VLSI DESIGN"],
      ["EEE", "ELECTRICAL AND ELECTRONICS ENGINEERING"],
      ["EIE", "ELECTRONICS AND INSTRUMENTATION ENGINEERING"],
      ["EII", "ELECTRONICS AND COMMUNICATION ENGINEERING ( INDUSTRY INTEGRATED )"],
      ["EVT", "ELECTRONICS ENGINEERING (VLSI DESIGN AND TECHNOLOGY)"],
      ["FDE", "FOOD ENGINEERING"],
      ["FDT", "FOOD TECHNOLOGY"],
      ["FSP", "FACILITIES AND SERVICES PLANNING"],
      ["GDT", "GAME DESIGN TECHNOLOGY"],
      ["GIN", "GEO-INFORMATICS"],
      ["INF", "INFORMATION TECHNOLOGY"],
      ["IOT", "INTERNET OF THINGS (IOT)"],
      ["IST", "INSTRUMENTATION ENGINEERING AND TECHNOLOGY"],
      ["MAD", "MECHANICAL AUTOMOTIVE DESIGN"],
      ["MAU", "MECHANICAL ENGINEERING(AUTOMOBILE)"],
      ["MEC", "MECHANICAL ENGINEERING"],
      ["MET", "METALLURGICAL ENGINEERING"],
      ["MII", "MECHANICAL ENGINEERING(INDUSTRY INTEGRATED)"],
      ["MIN", "MINING ENGINEERING"],
      ["MMM", "MECHANICAL AND MECHATRONICS ENGINEERING (ADDITIVE MANUFACTURING)"],
      ["MMT", "METALLURGY AND MATERIAL TECHNOLOGY"],
      ["MRB", "MECHANICAL ENGINEERING (ROBOTICS)"],
      ["NAM", "NAVAL ARCHITECTURE AND MARINE ENGINEERING"],
      ["PEE", "PETROLEUM ENGINEERING"],
      ["PET", "PETROLEUM TECHNOLOGY"],
      ["PHD", "DOCTOR OF PHARMACY (M.P.C)"],
      ["PHE", "PHARMACEUTICAL ENGINEERING"],
      ["PHM", "B.PHARMACY (M.P.C)"],
      ["RBT", "ROBOTICS"],
      ["SWE", "SOFTWARE ENGINEERING"],
      ["TPLG", "TOWN PLANNING"]
    ];
  
    return (
      <section className="flex justify-center items-center h-full w-full overflow-x-auto py-8 sm:py-12 sm:px-8">
        <table className="min-w-full table-auto bg-white border border-collapse text-[4px] sm:text-[10px] font-sans">
          <thead className="bg-emerald-700 text-neutral-100 font-extrabold">
            <tr>
            <th className="border border-gray-300 text-center p-2">S.NO</th>
              <th className="border border-gray-300 text-center p-2">Branch CODE</th>
              <th className="border border-gray-300 text-center p-2">Branch Name</th>
            </tr>
          </thead>
          <tbody className="text-neutral-900">
            {cdata.map((course, cnt) => (
              <tr key={course[0]} className={`hover:bg-stone-50 hover:text-blue-500 h-4 ${
                cnt % 2 === 0 ? "bg-gray-100" : "bg-stone-50"
              }`}>
                <td className="border border-gray-300 py-2 text-center">
                  {cnt + 1}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {course[0]}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {course[1]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    );
  };
  
  export default CCode;
  