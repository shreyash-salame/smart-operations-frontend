import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/store";
import theme from "@/theme";
import AppRoutes from "@/routes/AppRoutes";
import AppInit from "./components/common/Appinit";

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppInit />
          <AppRoutes />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  );
}