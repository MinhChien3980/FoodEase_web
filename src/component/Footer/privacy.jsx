// "use client"
// import React, { useEffect, useState } from "react";
// import { Typography } from "@mui/joy";
// import Layout from "@/layouts/layout";
// import { useSelector } from "react-redux";

// const Privacy = () => {

//     const data = useSelector((state) => state.settings.value);
//   // const [isloading, setLoading] = useState(true);
//   useEffect(() => {
//     if (data) {
//       setLoading(false);
//     }
//   }, []);

//   return (
//     <Layout title={"privacy_policy"}>
//         <div className="title-wrapper">
//           <Typography variant="h4" component="h4" className="bold">
//             Privacy <span className="highlight">Policy</span>
//           </Typography>
//           <Typography weight="light">{"privacy_title"}</Typography>
//         </div>
//         <div className="privacy-content">

//               <Typography
//                 variant="h6"
//                 component="h5"
//               />
//         </div>

//     </Layout>
//   );
// };

// export default Privacy;
