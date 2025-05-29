// import React, { useState } from "react";
// import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "@mui/joy";

// export const ProfileModal = () => {
//   const [showModal, setShowModal] = useState(false);

//   return (
//     <>
//       <Button onClick={() => setShowModal(true)}>Edit Profile</Button>
//       <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
//         <ModalHeader>Edit Profile</ModalHeader>
//         <ModalBody>
//           {/* <div>
//             <label htmlFor="username">Username:</label>
//             <input
//               type="text"
//               id="username"
//               // value={username}
//               // onChange={(e) => setUsername(e.target.value)}
//             />
//           </div>
//           <div>
//             <label htmlFor="mobile">Mobile:</label>
//             <input
//               type="text"
//               id="mobile"
//               // value={mobile}
//               // onChange={(e) => setMobile(e.target.value)}
//             />
//           </div>
//           <div>
//             <label htmlFor="email">Email:</label>
//             <input
//               type="email"
//               id="email"
//               // value={email}
//               // onChange={(e) => setEmail(e.target.value)}
//             />
//           </div> */}
//         </ModalBody>
//         <ModalFooter>
//           <Button >Cancel</Button>
//           <Button >Save</Button>
//         </ModalFooter>
//       </Modal>
//     </>
//   );
// };