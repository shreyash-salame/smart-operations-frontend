import { useEffect } from "react";

import {
  Grid2,
  Card,
  CardContent,
  Typography,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import {
  useAppDispatch,
  useAppSelector,
} from "../app/hooks";

import {
  getDashboard,
  getTeamInsights,
} from "../redux/dashboard/dashboardThunks";

const Dashboard = () => {
  const dispatch = useAppDispatch();

  const {
    data,
    teamInsights,
    loading,
  } = useAppSelector(
    (state) => state.dashboard
  );

  useEffect(() => {
    dispatch(getDashboard());
    dispatch(getTeamInsights());
  }, [dispatch]);

  if (loading) {
    return (
      <Typography>
        Loading Dashboard...
      </Typography>
    );
  }

  if (!data) {
    return (
      <Typography>
        No Dashboard Data
      </Typography>
    );
  }

  return (
    <Box>
      <Typography
        variant="h4"
        mb={3}
        fontWeight={700}
      >
        Dashboard
      </Typography>

      {/* OVERVIEW CARDS */}

      <Grid2
        container
        spacing={3}
      >
        <Grid2 size={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">
                Total Tasks
              </Typography>

              <Typography variant="h4">
                {data.overview.totalTasks}
              </Typography>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 size={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">
                Active Users
              </Typography>

              <Typography variant="h4">
                {data.overview.activeUsers}
              </Typography>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 size={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">
                Completion Rate
              </Typography>

              <Typography variant="h4">
                {data.overview.completionRate}%
              </Typography>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 size={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">
                At Risk Tasks
              </Typography>

              <Typography variant="h4">
                {data.overview.atRiskCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      {/* TASK STATUS */}

      <Paper
        sx={{
          mt: 4,
          p: 3,
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
        >
          Tasks By Status
        </Typography>

        <Grid2
          container
          spacing={2}
        >
          <Grid2 size={2}>
            <Typography>
              Todo:
              {" "}
              {data.tasksByStatus.todo}
            </Typography>
          </Grid2>

          <Grid2 size={2}>
            <Typography>
              In Progress:
              {" "}
              {data.tasksByStatus.in_progress}
            </Typography>
          </Grid2>

          <Grid2 size={2}>
            <Typography>
              Review:
              {" "}
              {data.tasksByStatus.in_review}
            </Typography>
          </Grid2>

          <Grid2 size={2}>
            <Typography>
              Done:
              {" "}
              {data.tasksByStatus.done}
            </Typography>
          </Grid2>

          <Grid2 size={2}>
            <Typography>
              Cancelled:
              {" "}
              {data.tasksByStatus.cancelled}
            </Typography>
          </Grid2>
        </Grid2>
      </Paper>

      {/* PRIORITY */}

      <Paper
        sx={{
          mt: 4,
          p: 3,
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
        >
          Tasks By Priority
        </Typography>

        <Grid2
          container
          spacing={2}
        >
          <Grid2 size={3}>
            <Typography>
              Low:
              {" "}
              {data.tasksByPriority.low}
            </Typography>
          </Grid2>

          <Grid2 size={3}>
            <Typography>
              Medium:
              {" "}
              {data.tasksByPriority.medium}
            </Typography>
          </Grid2>

          <Grid2 size={3}>
            <Typography>
              High:
              {" "}
              {data.tasksByPriority.high}
            </Typography>
          </Grid2>

          <Grid2 size={3}>
            <Typography>
              Critical:
              {" "}
              {data.tasksByPriority.critical}
            </Typography>
          </Grid2>
        </Grid2>
      </Paper>

      {/* TEAM PERFORMANCE */}

      <Paper
        sx={{
          mt: 4,
          p: 3,
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
        >
          Team Performance
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  User
                </TableCell>

                <TableCell>
                  Total Tasks
                </TableCell>

                <TableCell>
                  Done
                </TableCell>

                <TableCell>
                  In Progress
                </TableCell>

                <TableCell>
                  Completion %
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {teamInsights?.tasksByUser?.map(
                (user: any) => (
                  <TableRow
                    key={user.userId}
                  >
                    <TableCell>
                      {user.name}
                    </TableCell>

                    <TableCell>
                      {user.total}
                    </TableCell>

                    <TableCell>
                      {user.done}
                    </TableCell>

                    <TableCell>
                      {user.inProgress}
                    </TableCell>

                    <TableCell>
                      {
                        user.completionRate
                      }
                      %
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* DEPARTMENT SUMMARY */}

      <Paper
        sx={{
          mt: 4,
          p: 3,
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
        >
          Department Summary
        </Typography>

        {teamInsights?.tasksByDepartment?.map(
          (
            dept: any,
            index: number
          ) => (
            <Box
              key={index}
              mb={2}
            >
              <Typography>
                Department:
                {" "}
                {dept._id ||
                  "Unassigned"}
              </Typography>

              <Typography>
                Total Tasks:
                {" "}
                {dept.total}
              </Typography>

              <Typography>
                Completed:
                {" "}
                {dept.done}
              </Typography>
            </Box>
          )
        )}
      </Paper>

      {/* RECENT ACTIVITY */}

      <Paper
        sx={{
          mt: 4,
          p: 3,
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
        >
          Recent Activity
        </Typography>

        {data.recentActivity.map(
          (activity: any) => (
            <Box
              key={activity._id}
              sx={{
                py: 1,
                borderBottom:
                  "1px solid #eee",
              }}
            >
              <Typography>
                <strong>
                  {
                    activity.userId
                      ?.firstName
                  }
                </strong>
                {" "}
                {activity.action}
              </Typography>

              <Typography variant="caption">
                {new Date(
                  activity.createdAt
                ).toLocaleString()}
              </Typography>
            </Box>
          )
        )}
      </Paper>
    </Box>
  );
};

export default Dashboard;

// import {
//   useEffect,
// } from "react";

// import {
//   Grid2,
//   Card,
//   CardContent,
//   Typography,
//   Paper,
//   Box,
// } from "@mui/material";

// import {
//   useAppDispatch,
//   useAppSelector,
// } from "../app/hooks";

// import {
//   getDashboard,getTeamInsights
// } from "../redux/dashboard/dashboardThunks";

// const Dashboard = () => {
//   const dispatch =
//     useAppDispatch();

//   const {
//     data,
//     loading,
//   } = useAppSelector(
//     (state) =>
//       state.dashboard
//   );

//   useEffect(() => {
//     dispatch(
//       getDashboard()
//     ),
//     dispatch(getTeamInsights());
//   }, []);

//   if (loading)
//     return (
//       <Typography>
//         Loading...
//       </Typography>
//     );

//   if (!data)
//     return (
//       <Typography>
//         No Dashboard Data
//       </Typography>
//     );

//   return (
//     <Box>
//       <Typography
//         variant="h4"
//         mb={3}
//       >
//         Dashboard
//       </Typography>

//       <Grid2
//         container
//         spacing={3}
//       >
//         <Grid2 size={3}>
//           <Card>
//             <CardContent>
//               <Typography>
//                 Total Tasks
//               </Typography>

//               <Typography variant="h4">
//                 {
//                   data.overview
//                     .totalTasks
//                 }
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid2>

//         <Grid2 size={3}>
//           <Card>
//             <CardContent>
//               <Typography>
//                 Active Users
//               </Typography>

//               <Typography variant="h4">
//                 {
//                   data.overview
//                     .activeUsers
//                 }
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid2>

//         <Grid2 size={3}>
//           <Card>
//             <CardContent>
//               <Typography>
//                 Completion %
//               </Typography>

//               <Typography variant="h4">
//                 {
//                   data.overview
//                     .completionRate
//                 }
//                 %
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid2>

//         <Grid2 size={3}>
//           <Card>
//             <CardContent>
//               <Typography>
//                 At Risk
//               </Typography>

//               <Typography variant="h4">
//                 {
//                   data.overview
//                     .atRiskCount
//                 }
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid2>
//       </Grid2>

//       <Paper
//         sx={{
//           mt: 4,
//           p: 3,
//         }}
//       >
//         <Typography
//           variant="h6"
//           gutterBottom
//         >
//           Recent Activity
//         </Typography>

//         {data.recentActivity.map(
//           (activity:any) => (
//             <Box
//               key={
//                 activity._id
//               }
//               sx={{
//                 py: 1,
//                 borderBottom:
//                   "1px solid #eee",
//               }}
//             >
//               <Typography>
//                 <strong>
//                   {
//                     activity
//                       .userId
//                       .firstName
//                   }
//                 </strong>
//                 {" "}
//                 {activity.action}
//               </Typography>

//               <Typography
//                 variant="caption"
//               >
//                 {new Date(
//                   activity.createdAt
//                 ).toLocaleString()}
//               </Typography>
//             </Box>
//           )
//         )}
//       </Paper>
//     </Box>
//   );
// };

// export default Dashboard;



