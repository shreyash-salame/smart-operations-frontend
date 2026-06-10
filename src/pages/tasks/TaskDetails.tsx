// import {
//   useEffect,
// } from "react";

// import {
//   useParams,
// } from "react-router-dom";

// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   Chip,
//   Stack,
// } from "@mui/material";

// import {
//   useAppDispatch,
//   useAppSelector,
// } from "../../app/hooks";

// import {
//   getTaskById,
// } from "../../redux/task";

// const TaskDetails = () => {
//   const { id } = useParams();

//   const dispatch =
//     useAppDispatch();

//   const {
//     selectedTask,
//   } = useAppSelector(
//     (state) => state.task
//   );

//   useEffect(() => {
//     if (id) {
//       dispatch(
//         getTaskById(id)
//       );
//     }
//   }, [id]);

//   if (!selectedTask)
//     return (
//       <Typography>
//         Loading...
//       </Typography>
//     );

//   return (
//     <Box>
//       <Typography
//         variant="h4"
//         mb={3}
//       >
//         Task Details
//       </Typography>

//       <Card>
//         <CardContent>
//           <Stack spacing={2}>
//             <Typography
//               variant="h5"
//             >
//               {
//                 selectedTask.title
//               }
//             </Typography>

//             <Typography>
//               {
//                 selectedTask.description
//               }
//             </Typography>

//             <Chip
//               label={
//                 selectedTask.status
//               }
//             />

//             <Chip
//               color="warning"
//               label={
//                 selectedTask.priority
//               }
//             />

//             <Typography>
//               Assigned To:
//               {" "}
//               {selectedTask
//                 .assignedTo
//                 ?.firstName ||
//                 "Unassigned"}
//             </Typography>

//             <Typography>
//               Due Date:
//               {" "}
//               {selectedTask.dueDate
//                 ? new Date(
//                     selectedTask.dueDate
//                   ).toLocaleDateString()
//                 : "-"}
//             </Typography>

//             <Typography>
//               Estimated Hours:
//               {" "}
//               {
//                 selectedTask.estimatedHours
//               }
//             </Typography>

//             <Typography>
//               Actual Hours:
//               {" "}
//               {
//                 selectedTask.actualHours
//               }
//             </Typography>
//           </Stack>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default TaskDetails;