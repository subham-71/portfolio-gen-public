import AuthProvider from "./contexts/AuthContext";
import Router from "./router/Router";

const App = () => {
  return (
    
      <div className="App">
        <AuthProvider>
            <Router />
        </AuthProvider>
      </div>
  );
}

export default App;
