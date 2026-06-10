import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// import React from "react";
// import ReactDOM from "react-dom/client";

// import { Provider } from "react-redux";

// import {
//   QueryClient,
//   QueryClientProvider,
// } from "@tanstack/react-query";

// import { CssBaseline } from "@mui/material";
// import { ThemeProvider } from "@mui/material/styles";

// import AppRoutes from "./routes/AppRoutes";

// import { store } from "./app/store";
// import  theme  from "./theme";

// import "./index.css";

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       retry: 1,
//       refetchOnWindowFocus: false,
//     },
//   },
// });

// ReactDOM.createRoot(
//   document.getElementById("root")!
// ).render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <QueryClientProvider client={queryClient}>
//         <ThemeProvider theme={theme}>
//           <CssBaseline />
//           <AppRoutes />
//         </ThemeProvider>
//       </QueryClientProvider>
//     </Provider>
//   </React.StrictMode>
// );




// import { RouterProvider } from 'react-router-dom';

// // project-imports
// import router from 'routes';
// import ThemeCustomization from 'themes';

// import Locales from 'components/Locales';
// import RTLLayout from 'components/RTLLayout';
// import ScrollTop from 'components/ScrollTop';
// import Snackbar from 'components/@extended/Snackbar';

// // auth-provider
// import { JWTProvider as AuthProvider } from 'contexts/JWTContext';
// import { Provider } from 'react-redux';
// import { store } from 'store/store';

// // ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

// export default function App() {
//   return (
//     <>
//       <Provider store={store}>

//         <ThemeCustomization>
//           <RTLLayout>
//             <Locales>
//               <ScrollTop>
//                 <AuthProvider>

//                   <>
//                     <RouterProvider router={router} />
//                     <Snackbar />
//                   </>
//                 </AuthProvider>
//               </ScrollTop>
//             </Locales>
//           </RTLLayout>
//         </ThemeCustomization>
//       </Provider>
//     </>
//   );
// }
